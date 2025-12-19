import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter } from 'next/font/google';
import type { PropsWithChildren } from 'react';

import ExternalBrowserGate from '@/components/ExternalBrowserGate';
import { QueryProvider } from '@/components/query-provider';
import { Toaster } from '@/components/ui/sonner';
import { siteConfig } from '@/config';
import { cn } from '@/lib/utils';

import './globals.css';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = siteConfig;

const RootLayout = async ({ children }: Readonly<PropsWithChildren>) => {
  const messages = await getMessages();

  return (
    <html lang="zh-TW">
      <body className={cn(inter.className, 'min-h-screen antialiased')}>
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
