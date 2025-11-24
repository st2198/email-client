import React from 'react';
import ClientPage from '@/app/client-page';
import { getEmails } from '@/services/emailService';

export default async function Home() {
  const emailListDef = await getEmails();

  return (
    <ClientPage emails={emailListDef} />
  );
}

