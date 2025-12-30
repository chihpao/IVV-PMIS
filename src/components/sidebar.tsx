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
    <aside className="size-full bg-white p-4">
      <div className="flex h-12 items-center justify-between">
        {isCollapsed ? null : (
          <Link href="/" className="flex items-center">
            <Image src="/icon.svg" alt={tCommon('logoAlt')} height={40} width={40} />
            <span className="sr-only">{tCommon('logoText')}</span>
          </Link>
        )}

        {onToggle ? (
          <div className="group relative ml-auto flex items-center">
            <Button
              type="button"
              variant="secondary"
              size="icon"
              onClick={onToggle}
              className="h-10 w-10 rounded-md border-none bg-transparent text-neutral-500 shadow-none hover:bg-transparent [&_svg]:size-5"
            >
              {isCollapsed ? (
                <svg
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="14" height="14" rx="2.5" />
                  <line x1="12.5" y1="5.5" x2="12.5" y2="14.5" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="14" height="14" rx="2.5" />
                  <line x1="7.5" y1="5.5" x2="7.5" y2="14.5" />
                </svg>
              )}
            </Button>
            {isCollapsed ? (
              <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-md bg-neutral-900 px-2 py-1 text-xs text-white opacity-0 transition-none group-hover:opacity-100">
                展開選單
              </span>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="mt-6">
        <Navigation isCollapsed={isCollapsed} />
      </div>

      {isCollapsed ? null : (
        <div className="mt-6">
          <Suspense>
            <WorkspaceSwitcher />
          </Suspense>
        </div>
      )}

      {isCollapsed ? null : (
        <div className="mt-6">
          <Suspense>
            <Projects />
          </Suspense>
        </div>
      )}
    </aside>
  );
};
