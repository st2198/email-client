'use client';

import { Email } from '@/lib/schema';
import { Avatar, Box, Card, CardContent, Divider, Typography } from '@mui/material';
import { getInitials, formatDate } from './utils';

interface EmailContentProps {
  email: Email;
}

export default function EmailContent(props: EmailContentProps) {
  const { email } = props;

  return <Card sx={{ width: '100%', height: '100%' }}>
    <CardContent>
      <Box display='flex' justifyContent='space-between' >
        <Box display='flex' alignItems='center' gap='8px' mb={2}>
          <Avatar
            sx={{
              bgcolor: email.isImportant ? 'warning.main' : 'primary.main',
              width: 48,
              height: 48,
              fontSize: '1.2rem',
              fontWeight: 600,
            }}
          >
            {getInitials(email.from)}
          </Avatar>
          <Box>
            <Typography variant='h5'>{email.from}</Typography>
            <Box display='flex' alignItems='center' gap='4px'>
              <Typography variant='body1'>To:</Typography>
              <Typography variant='body2' color='textSecondary'>{email.to}</Typography>
            </Box>
          </Box>
        </Box>
        <Box>
          <Typography variant='body1' color='textSecondary'>{formatDate(email.createdAt)}</Typography>
        </Box>
      </Box>
      <Divider />
      <Box mt={3} display='flex' flexDirection='column' gap='8px'>
        <Typography variant='h4'>{email.subject}</Typography>
        <Typography variant='body1'>{email.content}</Typography>
      </Box>
    </CardContent>
  </Card>
}