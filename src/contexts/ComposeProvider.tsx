"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ComposeContext {
  isComposeOpen: boolean;
  setIsComposeOpen: (value: boolean) => void;
}

const ComposeContext = createContext<ComposeContext | undefined>(undefined);

export const ComposeProvider = ({ children }: { children: ReactNode }) => {
  const [isComposeOpen, setIsComposeOpen] = useState<boolean>(false);

  return (
    <ComposeContext.Provider value={{ isComposeOpen, setIsComposeOpen }}>
      {children}
    </ComposeContext.Provider>
  );
};

export const useComposeOpen = (): ComposeContext => {
  const context = useContext(ComposeContext);
  if (!context) {
    throw new Error('useComposeOpen must be used within a ComposeProvider');
  }
  return context;
};
