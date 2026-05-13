import React from 'react';
import { StoreContext, useStoreSetup } from './useStore';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const value = useStoreSetup();
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
