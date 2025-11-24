"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type FilterType = 'inbox' | 'important' | 'sent';

interface FilterContextType {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filter, setFilter] = useState<FilterType>('inbox');

  return (
    <FilterContext.Provider value={{ filter, setFilter }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilter = (): FilterContextType => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error('useFilter must be used within a FilterProvider');
  }
  return context;
};
