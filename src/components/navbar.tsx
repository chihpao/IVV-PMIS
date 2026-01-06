'use client';

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
  const tTasks = useTranslations('Tasks');
  const { open } = useCreateTaskModal();

  return (
    <nav className="sticky top-0 z-40 border-b border-[var(--border-strong)] bg-[var(--bg-surface)]/95 backdrop-blur lg:h-16">
      <div className="flex items-center gap-3 px-6 py-3 lg:grid lg:h-full lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-x-6 lg:py-0">
        <div className="flex items-center gap-x-3">
          <div className="flex items-center gap-x-3">
            <MobileSidebar />
            <Link href="/" className="hidden text-lg font-semibold text-[var(--text-primary)] lg:inline">
              {tCommon('logoText')}
            </Link>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 items-center gap-x-2 lg:justify-center">
          <div className="w-full min-w-0 max-w-[360px]">
            <Suspense fallback={null}>
              <DataSearch />
            </Suspense>
          </div>

          <Button
            onClick={() => open()}
            variant="primary"
            size="icon"
            className="group relative shrink-0 rounded-[var(--radius-button)]"
            aria-label={tTasks('createTask')}
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v8" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h8" />
            </svg>
            <span
              className="
                pointer-events-none absolute right-0 top-full mt-2
                whitespace-nowrap rounded-md border border-[var(--border-strong)]
                bg-[var(--bg-surface)] px-2 py-1 text-xs text-[var(--text-primary)]
                opacity-0 shadow-card transition-none group-hover:opacity-100
              "
              role="tooltip"
            >
              {tTasks('createTask')}
            </span>
          </Button>
        </div>

        <div className="flex items-center justify-end gap-x-2.5">
          <UserButton />
        </div>
      </div>
    </nav>
  );
};
