'use client';

import { AlertTriangle } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface PageErrorProps {
  message?: string;
}

export const PageError = ({ message }: PageErrorProps) => {
  const t = useTranslations('Errors');

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <AlertTriangle className="mb-2 size-6 text-muted-foreground" />

      <p className="text-sm font-medium text-muted-foreground">{message ?? t('somethingWentWrong')}</p>
    </div>
  );
};
