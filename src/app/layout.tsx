import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Noto_Sans_TC, Space_Grotesk } from 'next/font/google';
import type { PropsWithChildren } from 'react';

import ExternalBrowserGate from '@/components/ExternalBrowserGate';
import { QueryProvider } from '@/components/query-provider';
import { Toaster } from '@/components/ui/sonner';
import { siteConfig } from '@/config';
import { cn } from '@/lib/utils';

import './globals.css';

const notoSans = Noto_Sans_TC({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  weight: ['500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = siteConfig;

const RootLayout = async ({ children }: Readonly<PropsWithChildren>) => {
  const messages = await getMessages();

  return (
    <html lang="zh-TW">
      <body className={cn('min-h-screen font-sans antialiased', notoSans.variable, spaceGrotesk.variable)}>
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <ExternalBrowserGate />
            <Toaster theme="light" richColors closeButton />
            {children}
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
