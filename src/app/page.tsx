// app/page.tsx (or wherever your Home is)

import { desc, like, or, sql } from 'drizzle-orm';
import { db } from '@/lib/database';
import { emails } from '@/lib/schema';
import ClientPage from '@/app/client-page';

export const dynamic = 'force-dynamic';

export default async function Home({
  searchParams,
}: {
  // searchParams is now a promise
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  // Await the promise
  const params = await searchParams;
  const raw = params.search;
  const searchString = Array.isArray(raw) ? raw[0] : raw ?? '';
  const search = searchString.toLowerCase();

  const emailList = search
    ? await db
      .select()
      .from(emails)
      .where(
        or(
          like(sql`lower(${emails.subject})`, `%${search}%`),
          like(sql`lower(${emails.to})`, `%${search}%`),
          like(sql`lower(${emails.cc})`, `%${search}%`),
          like(sql`lower(${emails.bcc})`, `%${search}%`),
          like(sql`lower(${emails.content})`, `%${search}%`),
        )
      )
      .orderBy(desc(emails.createdAt))
    : await db.select().from(emails).orderBy(desc(emails.createdAt));

  return <ClientPage emails={emailList} initialSearch={search} />;
}
