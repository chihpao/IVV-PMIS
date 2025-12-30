'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

export const Logo = () => {
  const t = useTranslations('Common');

  return (
    <Link href="/" className="flex items-center gap-x-1.5">
      <Image src="/icon.svg" alt={t('logoAlt')} height={40} width={40} />
      <p className="text-2xl font-semibold text-neutral-900 font-display tracking-tight">{t('logoText')}</p>
    </Link>
  );
};
