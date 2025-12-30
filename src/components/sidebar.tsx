'use client';

import { Suspense } from 'react';

import { Logo } from './logo';
import { Navigation } from './navigation';
import { Projects } from './projects';
import { Button } from './ui/button';
import { WorkspaceSwitcher } from './workspaces-switcher';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

export const Sidebar = ({ isCollapsed = false, onToggle }: SidebarProps) => {
  return (
    <aside className="size-full overflow-x-hidden bg-neutral-100 p-4">
      <div className="relative flex h-12 items-center">
        <div
          className={cn(
            'absolute left-0 top-1/2 -translate-y-1/2 transition-opacity duration-200 ease-out',
            isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100',
          )}
        >
          <Logo />
        </div>

        {onToggle ? (
          <Button
            type="button"
            variant="secondary"
            size="icon"
            onClick={onToggle}
            className="ml-auto h-10 w-10 rounded-md border-none bg-transparent text-neutral-500 shadow-none hover:bg-transparent [&_svg]:size-5"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
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
        ) : null}
      </div>

      <Navigation isCollapsed={isCollapsed} />

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
