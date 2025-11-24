'use client';

import { useEffect, useMemo, useState } from 'react';
import { Box, Chip, InputAdornment, TextField, Typography } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import EmailCard from '@/components/EmailCard';
import EmailContentPlaceholder from '@/components/EmailContentPlaceholder';
import EmailContent from '@/components/EmailContent';
import ComposeEmail from '@/components/ComposeEmail';
import { Email } from '@/lib/schema';
import { debounce } from '@mui/material/utils';
import { useFilter } from '@/contexts/FilterProvider';
import { useComposeOpen } from '@/contexts/ComposeProvider';
import { markEmailAsRead } from '@/services/emailService';

interface ClientPageProps {
  emails: Email[];
}

export default function ClientPage({ emails: emailList }: ClientPageProps) {
  const { filter } = useFilter();
  const { isComposeOpen, setIsComposeOpen } = useComposeOpen();
  const [emails, setEmails] = useState<Email[]>(emailList);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);

  useEffect(() => {
    setEmails(emailList);
  }, [emailList]);

  const unreadCount = useMemo(() => emails.filter(e => !e.isRead).length, [emails]);
  const importantCount = useMemo(() => emails.filter(e => e.isImportant).length, [emails]);

  const filteredEmails = useMemo(() => {
    let filtered = emails;

    switch (filter) {
      case 'important':
        filtered = filtered.filter(e => e.isImportant);
        break;
      case 'sent':
        filtered = filtered.filter(e => e.direction === 'outgoing');
        break;
      case 'inbox':
      default:
        filtered = filtered.filter(e => e.direction === 'incoming');
        break;
    }

    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        e =>
          e.subject.toLowerCase().includes(lower) ||
          e.to?.toLowerCase().includes(lower) ||
          e.cc?.toLowerCase().includes(lower) ||
          e.bcc?.toLowerCase().includes(lower) ||
          e.content?.toLowerCase().includes(lower)
      );
    }

    return filtered;
  }, [emails, filter, searchTerm]);

  const debouncedSearch = useMemo(
    () =>
      debounce((term: string) => {
        setSearchTerm(term);
      }, 300),
    []
  );

  const onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const onEmailClickHandler = async (emailId: number) => {
    const updatedEmails = emails.map(e =>
      e.id === emailId ? { ...e, isRead: true } : e
    );

    setEmails(updatedEmails);

    const clickedEmail = updatedEmails.find(e => e.id === emailId) ?? null;
    setSelectedEmail(clickedEmail);
    await markEmailAsRead(emailId);
  };

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
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Chip label={`${emails.length} Total`} size="small" color="primary" variant="outlined" />
            <Chip label={`${unreadCount} Unread`} size="small" color="warning" variant="outlined" />
            <Chip label={`${importantCount} Important`} size="small" color="secondary" variant="outlined" />
          </Box>
        </Box>

        {/* Search Bar */}
        <Box sx={{ p: 2, borderBottom: '1px solid', borderBottomColor: 'divider' }}>
          <TextField
            fullWidth
            placeholder="Search emails..."
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={onSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{ '& .MuiOutlinedInput-root': { backgroundColor: 'background.default' } }}
          />
        </Box>

        {/* Email List - Scrollable */}
        <Box sx={{ flex: 1, overflow: 'auto', p: 1 }} data-testid="email-list">
          {filteredEmails.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ p: 3, textAlign: 'center' }}>
              No emails found in {filter}.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {filteredEmails.map(email => (
                <EmailCard
                  key={email.id}
                  email={email}
                  onClick={() => onEmailClickHandler(email.id)}
                />
              ))}
            </Box>
          )}
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

      <ComposeEmail open={isComposeOpen} onClose={() => setIsComposeOpen(false)} />
    </Box>
  );
}
