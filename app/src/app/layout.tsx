import { Providers } from '@/providers/AppProviders';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='pt-BR'>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
