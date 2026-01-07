'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

import { cn } from '@/lib/utils';

import { Navigation } from './navigation';
import { Projects } from './projects';
import { Button } from './ui/button';
import { WorkspaceSwitcher } from './workspaces-switcher';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export const Sidebar = ({ isCollapsed = false, onToggle }: SidebarProps) => {
  const tCommon = useTranslations('Common');

  return (
    <aside className="size-full bg-transparent p-4 flex flex-col">
      <div className={cn('flex h-12 items-center flex-shrink-0', isCollapsed ? 'justify-center' : 'justify-between')}>
        {isCollapsed ? null : (
          <Link href="/" aria-label={tCommon('logoText')} className="flex items-center gap-2">
            <Image src="/icon.svg" alt={tCommon('logoAlt')} height={32} width={32} />
          </Link>
        )}

        {onToggle ? (
          <div className="group relative flex items-center">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="h-10 w-10 rounded-none text-[var(--text-tertiary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] transition-colors"
            >
              {isCollapsed ? (
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5v14" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12H7" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="m15 18 6-6-6-6" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m9 6-6 6 6 6" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h14" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 19V5" />
                </svg>
              )}
            </Button>
          </div>
        ) : null}
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar mt-6 space-y-6">
        <Navigation isCollapsed={isCollapsed} />

        {!isCollapsed && (
          <div className="space-y-6">
            <div className="h-[1px] bg-[var(--border-subtle)] mx-2" />
            <Suspense>
              <WorkspaceSwitcher />
            </Suspense>
            <Suspense>
              <Projects />
            </Suspense>
          </div>
        )}
      </div>
    </aside>
  );
};
