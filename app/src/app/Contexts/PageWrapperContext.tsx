'use client';

import { createContext, useContext, useRef, ReactNode } from 'react';


type PageWrapperRefType = React.RefObject<HTMLDivElement>;
const PageWrapperRefContext = createContext<PageWrapperRefType | undefined>(undefined);


export function PageWrapperProvider({ children }: { children: ReactNode }) {
  const pageWrapperRef = useRef<HTMLDivElement>(null);

  return (
    // @ts-expect-error Type 'HTMLDivElement | null' is not assignable to type 'HTMLDivElement'.
    <PageWrapperRefContext.Provider value={pageWrapperRef}>
      {children}
    </PageWrapperRefContext.Provider>
  );
}


export function usePageWrapperRef() {
  const context = useContext(PageWrapperRefContext);
  if (!context) {
    throw new Error('usePageWrapperRef must be used within a PageWrapperProvider');
  }
  return context;
}
