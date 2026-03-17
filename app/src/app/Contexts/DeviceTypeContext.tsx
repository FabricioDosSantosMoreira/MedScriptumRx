'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

import { theme } from '@/styles/Theme/CustomTheme';
import { Breakpoint } from '@/types/!Index'; 


function parseBreakpoint(value: string): number {
  return Number(value.replace('px', ''));
}


function getActualBreakpoint(): Breakpoint {
  const width = window.innerWidth;
  const sm = parseBreakpoint(theme.breakpoints.sm);
  const md = parseBreakpoint(theme.breakpoints.md);
  const lg = parseBreakpoint(theme.breakpoints.lg);

  if (width <= sm) return 'sm';
  if (width <= md) return 'md';
  if (width <= lg) return 'lg';
  return 'xl';
}


const DeviceTypeContext = createContext<Breakpoint | undefined>(undefined);
export function DeviceTypeProvider({ children }: { children: ReactNode }) {
  const [deviceType, setDeviceType] = useState<Breakpoint>('xl');

  useEffect(() => {
    const handleResize = () => {
      setDeviceType(getActualBreakpoint());
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <DeviceTypeContext.Provider value={deviceType}>
      {children}
    </DeviceTypeContext.Provider>
  );
}


export function useDeviceType() {
  const context = useContext(DeviceTypeContext);
  if (context === undefined) {
    throw new Error('useDeviceType must be used within a DeviceTypeProvider');
  }
  return context;
}
