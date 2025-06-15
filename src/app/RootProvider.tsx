'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../store';
import { ThemeProvider } from '@/providers/ThemeProvider';

export function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ThemeProvider>{children}</ThemeProvider>
    </Provider>
  );
}
