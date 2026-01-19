'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Suspense } from 'react';

import { Button } from '@/components/ui/button';
import { DataSearch } from '@/features/tasks/components/data-search';
import { useCreateTaskModal } from '@/features/tasks/hooks/use-create-task-modal';

import { MobileSidebar } from './mobile-sidebar';
import { WorkspaceSwitcher } from './workspaces-switcher';

export const Navbar = () => {
  const tCommon = useTranslations('Common');
  const tTasks = useTranslations('Tasks');
  const { open } = useCreateTaskModal();

  return (
    <nav className="sticky top-0 z-40 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] lg:h-16">
      <div className="flex items-center gap-3 px-6 py-3 lg:grid lg:h-full lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-x-6 lg:py-0">
        <div className="flex items-center gap-x-3">
          <MobileSidebar />
          {/* WorkspaceSwitcher removed from here */}
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
            className="group relative h-10 w-10 shrink-0 rounded-none"
            aria-label={tTasks('createTask')}
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            <span
              className="pointer-events-none absolute right-0 top-full mt-2 whitespace-nowrap rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2 py-1 text-xs text-[var(--text-primary)] opacity-0 shadow-card transition-none group-hover:opacity-100"
              role="tooltip"
            >
              {tTasks('createTask')}
            </span>
          </Button>
        </div>

        <div className="flex items-center justify-end gap-x-2.5">
          <Suspense fallback={null}>
            <WorkspaceSwitcher />
          </Suspense>
        </div>
      </div>
    </nav>
  );
};
