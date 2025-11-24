import { NextRequest } from 'next/server';
import { addEmail, getAllEmails, markEmailAsRead } from './actions'

export async function POST(req: NextRequest): Promise<Response> {
  const body = await req.json();

  const {  threadId,
  subject,
  from,
  to,
  content,
  isRead,
  isImportant,
  direction } = body;

  const [email] = await addEmail({
    threadId,
    subject,
    from,
    to,
    content,
    isRead,
    isImportant,
    direction
  });

  return Response.json(email, { status: 200 });
}

export async function GET(req: NextRequest): Promise<Response> {
  const search = req.nextUrl.searchParams.get('search');

  const emails = await getAllEmails(search);
  
  return Response.json(emails, { status: 200 });
}

export async function PUT(req: NextRequest): Promise<Response> {
  const body = await req.json();
  const { emailId } = body;

 await markEmailAsRead(emailId);

 return Response.json({ status: 'success'}, { status: 200 });
}
