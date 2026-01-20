import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import dynamic from 'next/dynamic';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { PropsWithChildren } from 'react';
import 'sonner/dist/styles.css';

import ExternalBrowserGate from '@/components/ExternalBrowserGate';
import { QueryProvider } from '@/components/query-provider';
import { SonnerToaster } from '@/components/sonner-toaster';
import { siteConfig } from '@/config';
import { fontBody, fontDisplay, fontMono, fontSans } from '@/lib/fonts';
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
      <body className={cn('min-h-screen antialiased', fontBody.variable, fontDisplay.variable, fontMono.variable, fontSans.variable)}>
        <NextIntlClientProvider messages={messages}>
          <QueryProvider>
            <NuqsAdapter>
              <ExternalBrowserGate />
              <SonnerToaster />
              {children}
            </NuqsAdapter>
          </QueryProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;
