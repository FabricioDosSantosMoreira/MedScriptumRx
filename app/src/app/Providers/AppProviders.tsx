'use client';

import { PageWrapperProvider } from '@/contexts/PageWrapperContext';
import { DeviceTypeProvider } from '@/contexts/DeviceTypeContext';

import { theme } from '@/app/Styles/Theme/CustomTheme';
import { GlobalStyles } from '@/styles/globalStyles';
import { ThemeProvider } from 'styled-components';


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
