'use client';

import { useTranslations } from 'next-intl';
import { Ubuntu } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';

const font = Ubuntu({
  weight: ['700'],
  subsets: ['latin'],
});

export const Logo = () => {
  const t = useTranslations('Common');

  return (
    <Link href="/" className="flex items-center gap-x-1.5">
      <Image src="/icon.svg" alt={t('logoAlt')} height={40} width={40} />
      <p className={cn('text-2xl font-bold text-[var(--text-primary)] tracking-tight', font.className)}>{t('logoText')}</p>
    </Link>
  );
};
