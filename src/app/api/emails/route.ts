import { NextRequest } from 'next/server';
import { addEmail, markEmailAsRead } from './actions'

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
  return Response.json({ status: 'error' }, { status: 400 });
}

export async function PUT(req: NextRequest): Promise<Response> {
  const body = await req.json();
  const { emailId } = body;

 await markEmailAsRead(emailId);

 return Response.json({ status: 'success'}, { status: 200 });
}
