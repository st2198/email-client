'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import {
  debounce, InputAdornment, TextField,
} from "@mui/material";
import { Search as SearchIcon } from '@mui/icons-material';


export default function Search({ initialSearch }: { initialSearch: string }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  const debouncedUpdateURL = useMemo(
    () =>
      debounce((value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value) params.set('search', value);
        else params.delete('search');

        router.push(`/?${params.toString()}`);
      }, 300),
    [router, searchParams]
  );

  useEffect(() => {
    debouncedUpdateURL(searchTerm);

    return () => debouncedUpdateURL.clear();
  }, [searchTerm, debouncedUpdateURL]);

  return <TextField
    fullWidth
    placeholder="Search emails..."
    variant="outlined"
    size="small"
    value={searchTerm}
    onChange={e => setSearchTerm(e.target.value)}
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <SearchIcon color="action" />
        </InputAdornment>
      )
    }}
    sx={{
      '& .MuiOutlinedInput-root': {
        backgroundColor: 'background.default'
      }
    }}
  />
}