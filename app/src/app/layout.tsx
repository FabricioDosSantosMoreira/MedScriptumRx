import { Providers } from '@/providers/AppProviders';


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en-US'>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
