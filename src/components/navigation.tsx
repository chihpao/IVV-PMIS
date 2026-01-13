'use client';

import { Settings, UsersIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GoCheckCircle, GoCheckCircleFill, GoHome, GoHomeFill } from 'react-icons/go';

import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { cn } from '@/lib/utils';

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const routes = [
  {
    labelKey: 'home',
    href: '',
    icon: GoHome,
    activeIcon: GoHomeFill,
  },
  {
    labelKey: 'myTasks',
    href: '/tasks',
    icon: GoCheckCircle,
    activeIcon: GoCheckCircleFill,
  },
  {
    labelKey: 'settings',
    href: '/settings',
    icon: Settings,
    activeIcon: Settings,
  },
  {
    labelKey: 'members',
    href: '/members',
    icon: UsersIcon,
    activeIcon: UsersIcon,
  },
];

interface NavigationProps {
  isCollapsed?: boolean;
}

export const Navigation = ({ isCollapsed = false }: NavigationProps) => {
  const pathname = usePathname();
  const workspaceId = useWorkspaceId();
  const t = useTranslations('Nav');

  return (
    <TooltipProvider delayDuration={0}>
      <ul className={cn('stagger-fade flex flex-col gap-1', isCollapsed ? 'items-center px-0' : 'px-2')}>
        {routes.map((route) => {
          const fullHref = `/workspaces/${workspaceId}${route.href}`;
          const isActive = pathname === fullHref;
          const Icon = isActive ? route.activeIcon : route.icon;

          return (
            <li key={fullHref}>
              {isCollapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={fullHref}
                      aria-label={t(route.labelKey)}
                      className={cn(
                        'group relative flex h-10 items-center justify-center rounded-none font-medium transition-colors duration-200 hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] w-10 gap-0 p-0',
                        isActive
                          ? 'bg-[var(--accent-subtle)] text-[var(--accent-primary)] shadow-sm'
                          : 'text-[var(--text-secondary)]',
                      )}
                    >
                      <Icon className="size-5 min-h-5 min-w-5 shrink-0" />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    {t(route.labelKey)}
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Link
                  href={fullHref}
                  aria-label={t(route.labelKey)}
                  className={cn(
                    'group relative flex h-10 items-center rounded-none font-medium transition-colors duration-200 gap-2.5 px-2.5',
                    isActive
                      ? 'bg-[var(--accent-subtle)] text-[var(--text-primary)] shadow-sm'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]',
                  )}
                >
                  <Icon
                    className={cn(
                      'size-5 min-h-5 min-w-5 shrink-0',
                      isActive ? 'text-[var(--accent-primary)]' : 'text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]',
                    )}
                  />
                  <span className="whitespace-nowrap">{t(route.labelKey)}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </TooltipProvider>
  );
};
