'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { PropsWithChildren } from 'react';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';

const AuthLayout = ({ children }: PropsWithChildren) => {
  const pathname = usePathname();
  const isSignIn = pathname === '/sign-in';
  const t = useTranslations('Auth');

  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-screen-2xl p-6">
        <nav className="flex items-center justify-between rounded-2xl bg-white/80 px-4 py-3 shadow-sm ring-1 ring-border/60 backdrop-blur">
          <Logo />

          <div className="flex items-center gap-x-2.5">
            <Button variant="secondary" asChild>
              <Link href={isSignIn ? '/sign-up' : 'sign-in'}>{isSignIn ? t('register') : t('login')}</Link>
            </Button>
          </div>
        </nav>

        <div className="flex flex-col items-center justify-center p-4 md:pt-14">{children}</div>
      </div>
    </main>
  );
};

export default AuthLayout;
