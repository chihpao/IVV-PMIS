'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';

import { UserButton } from '@/features/auth/components/user-button';

import { MobileSidebar } from './mobile-sidebar';

const pathnameMap = {
  tasks: {
  },
  projects: {
    titleKey: 'projectTitle',
    descriptionKey: 'projectDescription',
  },
  settings: {
  },
  members: {
  },
};

const defaultMap = {
};

export const Navbar = () => {
  const pathname = usePathname();
  const t = useTranslations('Nav');
  const pathnameParts = pathname.split('/');
  const pathnameKey = pathnameParts[3] as keyof typeof pathnameMap;

  const { titleKey, descriptionKey } = pathnameMap[pathnameKey] || defaultMap;

  return (
    <nav className="flex items-center justify-between px-6 pt-4">
      <div className="hidden flex-col lg:flex">
        {titleKey ? <h1 className="text-2xl font-semibold">{t(titleKey)}</h1> : null}

        {descriptionKey ? (
          <p className="text-muted-foreground">{t(descriptionKey)}</p>
        ) : null}
      </div>

      <MobileSidebar />

      <div className="flex items-center gap-x-2.5">
        <UserButton />
      </div>
    </nav>
  );
};
