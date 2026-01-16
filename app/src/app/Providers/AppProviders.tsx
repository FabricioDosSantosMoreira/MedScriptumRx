'use client';

import { PageWrapperProvider } from '@/contexts/PageWrapperContext';
import { DeviceTypeProvider } from '@/contexts/DeviceTypeContext';

import { GlobalStyles } from '@/styles/globalStyles';
import { ThemeProvider } from 'styled-components';

import { theme } from '@/app/Styles/Theme/CustomTheme';


export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />

      <DeviceTypeProvider>
        <PageWrapperProvider>
          {children}
        </PageWrapperProvider>
      </DeviceTypeProvider>

    </ThemeProvider>
  );
}
