'use client';

import { useState } from 'react';
import { Box, Chip, InputAdornment, TextField, Typography } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import EmailCard from '@/components/EmailCard';
import EmailContentPlaceholder from '@/components/EmailContentPlaceholder';
import EmailContent from '@/components/EmailContent';
import { Email } from '@/lib/schema';

interface ClientPageProps {
  emails: Email[];
}

export default function ClientPage(props: ClientPageProps) {
  const { emails: emailList } = props;
  console.log('emailList', emailList);
  const unreadCount = emailList.filter(email => !email.isRead).length;
  const importantCount = emailList.filter(email => email.isImportant).length;
  const [selectedEmail, setSelectedEmail] = useState<Email | undefined>(undefined);

  const onEmailClickHandler = (emailId: number) => {
    setSelectedEmail(emailList.find(e => e.id === emailId))
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Left Panel - Email List */}
      <Box sx={{
        width: '400px',
        borderRight: '1px solid',
        borderRightColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.paper',
      }}>
        {/* Header */}
        <Box sx={{ p: 2, borderBottom: '1px solid', borderBottomColor: 'divider' }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: 'text.primary' }}>
            Inbox
          </Typography>

          {/* Stats */}
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Chip
              label={`${emailList.length} Total`}
              size="small"
              color="primary"
              variant="outlined"
            />
            <Chip
              label={`${unreadCount} Unread`}
              size="small"
              color="warning"
              variant="outlined"
            />
            <Chip
              label={`${importantCount} Important`}
              size="small"
              color="secondary"
              variant="outlined"
            />
          </Box>
        </Box>

        {/* Search Bar */}
        <Box sx={{ p: 2, borderBottom: '1px solid', borderBottomColor: 'divider' }}>
          <TextField
            fullWidth
            placeholder="Search emails..."
            variant="outlined"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'background.default',
              },
            }}
          />
        </Box>

        {/* Email List - Scrollable */}
        <Box sx={{
          flex: 1,
          overflow: 'auto',
          p: 1,
        }} data-testid="email-list">
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {emailList.map((email) => (
              <EmailCard key={email.id} email={email} onClick={() => onEmailClickHandler(email.id)} />
            ))}
          </Box>
        </Box>
      </Box>

      {/* Right Panel - Email Content (Placeholder) */}
      <Box sx={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
        p: 4,
      }} data-testid="email-content-panel">
        {selectedEmail ? <EmailContent email={selectedEmail} /> : <EmailContentPlaceholder />}
      </Box>
    </Box>
  );
}
