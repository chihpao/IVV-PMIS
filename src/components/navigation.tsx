'use client';

import { Settings, UsersIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GoCheckCircle, GoCheckCircleFill, GoHome, GoHomeFill } from 'react-icons/go';

import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { cn } from '@/lib/utils';

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
    <ul className={cn('flex flex-col gap-1 stagger-fade', isCollapsed ? 'items-center px-0' : 'px-2')}>
      {routes.map((route) => {
        const fullHref = `/workspaces/${workspaceId}${route.href}`;
        const isActive = pathname === fullHref;
        const Icon = isActive ? route.activeIcon : route.icon;

        return (
          <li key={fullHref}>
            <Link
              href={fullHref}
              aria-label={t(route.labelKey)}
              className={cn(
                'group relative flex h-10 items-center rounded-none font-medium transition-colors duration-200',
                isActive
                  ? 'bg-[var(--accent-subtle)] text-[var(--text-primary)] shadow-sm'
                  : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]',
                isCollapsed ? 'w-10 justify-center gap-0 p-0' : 'gap-2.5 px-2.5',
              )}
            >
              <Icon
                className={cn(
                  'size-5 min-h-5 min-w-5 shrink-0',
                  isActive ? 'text-[var(--accent-primary)]' : 'text-[var(--text-tertiary)] group-hover:text-[var(--text-primary)]',
                )}
              />
              {isCollapsed ? null : <span className="whitespace-nowrap">{t(route.labelKey)}</span>}
              {isCollapsed ? (
                <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-2 -translate-y-1/2 whitespace-nowrap rounded-none border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-2 py-1 text-xs text-[var(--text-primary)] opacity-0 shadow-card transition-opacity group-hover:opacity-100">
                  {t(route.labelKey)}
                </span>
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
