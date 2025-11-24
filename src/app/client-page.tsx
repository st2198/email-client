'use client';

import { useEffect, useMemo, useState } from 'react';
import { Box, Button, Chip, InputAdornment, TextField, Typography, Tabs, Tab } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import EmailCard from '@/components/EmailCard';
import EmailContentPlaceholder from '@/components/EmailContentPlaceholder';
import EmailContent from '@/components/EmailContent';
import ComposeEmail from '@/components/ComposeEmail';
import { Email } from '@/lib/schema';
import { markEmailAsRead } from './api/emails/actions';
import { debounce } from '@mui/material/utils';
import { useFilter } from '@/contexts/FilterContext';

interface ClientPageProps {
  emails: Email[];
}

export default function ClientPage(props: ClientPageProps) {
  const { emails: emailList } = props;
  const { filter, setFilter } = useFilter();
  const [searchTerm, setSearchTerm] = useState('');

  const unreadCount = emailList.filter(email => !email.isRead).length;
  const importantCount = emailList.filter(email => email.isImportant).length;
  const [selectedEmail, setSelectedEmail] = useState<Email | undefined>(undefined);
  const [isComposeOpen, setIsComposeOpen] = useState(false);

  const filteredEmails = useMemo(() => {
    let filtered = emailList;

    switch (filter) {
      case 'inbox':
        filtered = emailList;
        break;
      case 'important':
        filtered = emailList.filter(email => email.isImportant);
        break;
      case 'sent':
        filtered = emailList.filter(email => email.direction === 'outgoing');
        break;
      default:
        filtered = emailList;
    }

    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(email =>
        email.subject.toLowerCase().includes(lower) ||
        email.to?.toLowerCase().includes(lower) ||
        email.cc?.toLowerCase().includes(lower) ||
        email.bcc?.toLowerCase().includes(lower) ||
        email.content?.toLowerCase().includes(lower)
      );
    }

    return filtered;
  }, [emailList, filter, searchTerm]);

  const [emails, setEmails] = useState<Email[]>(filteredEmails);
  useEffect(() => {
    setEmails(filteredEmails);
  }, [filteredEmails]);

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
    let selected: Email | undefined;
    await markEmailAsRead(emailId);

    const updated = emails.map(e => {
      if (e.id === emailId) {
        selected = { ...e, isRead: true };
        return selected;
      }
      return e;
    });

    setEmails(updated);

    setSelectedEmail(selected);
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
          <Button variant="contained" fullWidth onClick={() => setIsComposeOpen(true)} sx={{ mb: 2 }}>
            Compose
          </Button>
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
            value={searchTerm}
            onChange={onSearchChange}
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
        <Box sx={{ flex: 1, overflow: 'auto', p: 1 }} data-testid="email-list">
          {emails.length === 0 ? (
            <Typography variant="body2" color="text.secondary" sx={{ p: 3, textAlign: 'center' }}>
              No emails found in {filter}.
            </Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {emails.map((email) => (
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
