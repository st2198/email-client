import { nanoid } from "nanoid";
import { EmailDirection } from "@/lib/schema";

export interface NewEmailInput {
  to: string;
  cc?: string;
  bcc?: string;
  subject: string;
  content: string;
}

export async function sendEmail(input: NewEmailInput) {
  const payload = {
    threadId: nanoid(),
    subject: input.subject,
    from: "me@example.com", // replace with actual user
    to: input.to,
    cc: input.cc || "",
    bcc: input.bcc || "",
    content: input.content,
    isRead: false,
    isImportant: false,
    direction: EmailDirection.OUTGOING,
  };

  const res = await fetch("/api/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error("Failed to send email");
  }

  return res.json();
}

export async function markEmailAsRead(emailId: number) {
    const res = await fetch("/api/emails", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ emailId }),
  });

  if (!res.ok) {
    throw new Error("Failed to mark email as read");
  }

  return res.json();
}
