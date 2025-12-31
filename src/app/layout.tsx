import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import type { PropsWithChildren } from 'react';

import ExternalBrowserGate from '@/components/ExternalBrowserGate';
import { CommandPalette } from '@/components/command-palette';
import { QueryProvider } from '@/components/query-provider';
import { Toaster } from '@/components/ui/sonner';
import { siteConfig } from '@/config';
import { cn } from '@/lib/utils';

import './globals.css';

export const metadata: Metadata = siteConfig;

const RootLayout = async ({ children }: Readonly<PropsWithChildren>) => {
  const messages = await getMessages();

  return (
    <html lang="zh-TW">
      <body className={cn('min-h-screen antialiased')}>
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <ExternalBrowserGate />
            <Toaster theme="light" richColors closeButton />
            <CommandPalette />
            {children}
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
