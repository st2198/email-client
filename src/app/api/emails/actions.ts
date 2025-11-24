"use server";
import { eq, not } from "drizzle-orm";
import { db } from '@/lib/database';
import { EmailDirection, emails } from '@/lib/schema';

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
}: AddEmail) => {
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

export async function markEmailAsRead(id: number) {
  await db.update(emails)
    .set({ isRead: true })
    .where(eq(emails.id, id));

  return true;
}