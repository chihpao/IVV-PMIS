'use client';

import { PlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Suspense } from 'react';

import { Button } from '@/components/ui/button';
import { UserButton } from '@/features/auth/components/user-button';
import { DataSearch } from '@/features/tasks/components/data-search';
import { useCreateTaskModal } from '@/features/tasks/hooks/use-create-task-modal';

import { MobileSidebar } from './mobile-sidebar';

export const Navbar = () => {
  const tCommon = useTranslations('Common');
  const { open } = useCreateTaskModal();

  return (
    <nav className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 backdrop-blur lg:h-16">
      <div className="flex flex-col gap-3 px-6 pb-4 pt-3 lg:grid lg:h-full lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-x-6 lg:py-0">
        <div className="flex items-center justify-between gap-x-3">
          <div className="flex items-center gap-x-3">
            <MobileSidebar />
            <Link href="/" className="hidden text-lg font-semibold text-[var(--text-primary)] lg:inline">
              {tCommon('logoText')}
            </Link>
          </div>

          <div className="flex items-center gap-x-2.5 lg:hidden">
            <UserButton />
          </div>
        </div>

        <div className="flex w-full items-center gap-x-2 lg:justify-center">
          <div className="w-full max-w-[360px]">
            <Suspense fallback={null}>
              <DataSearch />
            </Suspense>
          </div>

          <Button onClick={() => open()} variant="primary" size="sm" className="shrink-0 rounded-[var(--radius-button)]">
            <PlusIcon className="size-4" />
            {tCommon('create')}
          </Button>
        </div>

        <div className="hidden items-center justify-end gap-x-2.5 lg:flex">
          <UserButton />
        </div>
      </div>
    </nav>
  );
};
