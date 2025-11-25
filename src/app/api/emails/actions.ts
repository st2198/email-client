"use server";
import { eq, or, like, desc, sql } from "drizzle-orm";
import { db } from '@/lib/database';
import { EmailDirection, emails, Email } from '@/lib/schema';

interface AddEmail {
  threadId: string;
  subject: string;
  from: string;
  to: string;
  content: string;
  isRead: boolean;
  isImportant: boolean
  direction: EmailDirection;
  cc?: string;
  bcc?: string;
}

export const addEmail = async ({
  threadId,
  subject,
  from,
  to,
  content,
  isRead,
  isImportant,
  direction,
  cc,
  bcc
}: AddEmail): Promise<Email[]> => {
  return await db.insert(emails).values({
    threadId,
    subject,
    from,
    to,
    content,
    isRead,
    isImportant,
    direction,
    cc,
    bcc
  }).returning();
};

export const markEmailAsRead = async (id: number) => {
  await db.update(emails)
    .set({ isRead: true })
    .where(eq(emails.id, id));

  return true;
}

export const getAllEmails = async (search: string | null): Promise<Email[]> => {
  const latestEmailPerThread = db
    .select({
      id: emails.id,
      threadId: emails.threadId,
      subject: emails.subject,
      from: emails.from,
      to: emails.to,
      content: emails.content,
      isRead: emails.isRead,
      isImportant: emails.isImportant,
      direction: emails.direction,
      createdAt: emails.createdAt,
      updatedAt: emails.updatedAt,
      cc: emails.cc,
      bcc: emails.bcc,
      // We need the max createdAt per thread to identify the latest email
      maxCreatedAt: sql<number>`max(${emails.createdAt})`.as('max_created_at'),
    })
    .from(emails)
    .groupBy(emails.threadId)
    .as('latest_per_thread');

  const query = db
    .select({
      id: emails.id,
      threadId: emails.threadId,
      subject: emails.subject,
      from: emails.from,
      to: emails.to,
      content: emails.content,
      isRead: emails.isRead,
      isImportant: emails.isImportant,
      direction: emails.direction,
      createdAt: emails.createdAt,
      updatedAt: emails.updatedAt,
      cc: emails.cc,
      bcc: emails.bcc,
    })
    .from(emails)
    .innerJoin(
      latestEmailPerThread,
      sql`${emails.threadId} = ${latestEmailPerThread.threadId} AND ${emails.createdAt} = ${latestEmailPerThread.maxCreatedAt}`
    );

  if (search) {
    const lowerSearch = `%${search.toLowerCase()}%`;
    return await query
      .where(
        or(
          like(sql`lower(${emails.subject})`, lowerSearch),
          like(sql`lower(${emails.to})`, lowerSearch),
          like(sql`lower(${emails.cc})`, lowerSearch),
          like(sql`lower(${emails.bcc})`, lowerSearch),
          like(sql`lower(${emails.content})`, lowerSearch),
          like(sql`lower(${emails.from})`, lowerSearch) // optional: include sender in search
        )
      )
      .orderBy(desc(emails.createdAt));
  }

  return await query.orderBy(desc(emails.createdAt));
};