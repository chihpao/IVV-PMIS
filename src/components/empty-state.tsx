import { LucideIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Button } from './ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState = ({ icon: Icon, title, description, actionLabel, onAction }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-[var(--bg-surface)] border border-dashed border-[var(--border-subtle)] rounded-none min-h-[200px]">
      <div className="flex h-12 w-12 items-center justify-center rounded-none bg-[var(--bg-muted)] border border-[var(--border-subtle)]">
        <Icon className="h-6 w-6 text-[var(--text-secondary)]" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-[var(--text-primary)]">{title}</h3>
      <p className="mt-2 text-sm text-[var(--text-tertiary)] max-w-xs">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="secondary" className="mt-6 h-9 rounded-none border border-[var(--border-strong)]">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
