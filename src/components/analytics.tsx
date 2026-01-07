'use client';

import { useTranslations } from 'next-intl';

import { ProjectAnalyticsResponseType } from '@/features/projects/api/use-get-project-analytics';

/* interface AnalyticsProps {
  data?: {
    taskCount: number;
    taskDifference: number;
    projectCount?: number;
    projectDifference?: number;
    assignedTaskCount: number;
    assignedTaskDifference: number;
    completedTaskCount: number;
    completedTaskDifference: number;
    incompletedTaskCount?: number;
    incompletedTaskDifference?: number;
    overdueTaskCount: number;
    overdueTaskDifference: number;
  }
} */

export const Analytics = ({ data }: ProjectAnalyticsResponseType) => {
  const t = useTranslations('Analytics');

  return (
    <div className="w-full rounded-none border border-[var(--border-strong)] bg-[var(--bg-surface)]">
      <div className="grid grid-cols-5 gap-x-6 px-4 pt-3 text-sm text-[var(--text-secondary)]">
        <span>{t('totalTasks')}</span>
        <span>{t('assignedTasks')}</span>
        <span>{t('completedTasks')}</span>
        <span>{t('overdueTasks')}</span>
        <span>{t('incompleteTasks')}</span>
      </div>
      <div className="grid grid-cols-5 gap-x-6 px-4 pb-3 text-lg text-[var(--text-primary)]">
        <span className="tabular-data">{data.taskCount}</span>
        <span className="tabular-data">{data.assignedTaskCount}</span>
        <span className="tabular-data">{data.completedTaskCount}</span>
        <span className="tabular-data">{data.overdueTaskCount}</span>
        <span className="tabular-data">{data.incompleteTaskCount}</span>
      </div>
    </div>
  );
};
