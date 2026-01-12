import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import dynamic from 'next/dynamic';
import type { PropsWithChildren } from 'react';
import 'sonner/dist/styles.css';

import ExternalBrowserGate from '@/components/ExternalBrowserGate';
import { QueryProvider } from '@/components/query-provider';
import { SonnerToaster } from '@/components/sonner-toaster';
import { siteConfig } from '@/config';
import { cn } from '@/lib/utils';

import './globals.css';

const CommandPalette = dynamic(() => import('@/components/command-palette').then((mod) => mod.CommandPalette), {
  ssr: false,
});

export const metadata: Metadata = siteConfig;

const RootLayout = async ({ children }: Readonly<PropsWithChildren>) => {
  const messages = await getMessages();

  return (
    <html lang="zh-TW">
      <body className={cn('min-h-screen antialiased')}>
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <ExternalBrowserGate />
            <SonnerToaster />
            <CommandPalette />
            {children}
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
