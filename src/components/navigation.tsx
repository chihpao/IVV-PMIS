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
    <ul className="flex flex-col">
      {routes.map((route) => {
        const fullHref = `/workspaces/${workspaceId}${route.href}`;
        const isActive = pathname === fullHref;
        const Icon = isActive ? route.activeIcon : route.icon;

        return (
          <li key={fullHref}>
            <Link
              href={fullHref}
              title={isCollapsed ? t(route.labelKey) : undefined}
              className={cn(
                'flex items-center gap-2.5 rounded-md p-2.5 font-medium text-neutral-500 transition hover:text-primary',
                isCollapsed && 'justify-center gap-0',
                isActive && 'bg-white text-primary shadow-sm hover:opacity-100',
              )}
            >
              <Icon className="size-5 text-neutral-500" />
              <span
                className={cn(
                  'whitespace-nowrap transition-[max-width,opacity] duration-200 ease-out',
                  isCollapsed ? 'max-w-0 overflow-hidden opacity-0' : 'max-w-[160px] opacity-100',
                )}
              >
                {t(route.labelKey)}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};
