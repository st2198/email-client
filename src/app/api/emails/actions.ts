"use server";
import { eq, or, like, desc } from "drizzle-orm";
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
  if (!search) {
    return await db.select().from(emails).orderBy(desc(emails.createdAt));
  }

  const lowerSearch = `%${search.toLowerCase()}%`;

  return await db
    .select()
    .from(emails)
    .where(
      or(
        like(emails.subject, lowerSearch),
        like(emails.to, lowerSearch),
        like(emails.cc, lowerSearch),
        like(emails.bcc, lowerSearch),
        like(emails.content, lowerSearch)
      )
    ).orderBy(desc(emails.createdAt))
};

