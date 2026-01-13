'use client';

import { useTranslations } from 'next-intl';

import { ProjectAnalyticsResponseType } from '@/features/projects/api/use-get-project-analytics';

import { AnalyticsCard } from './analytics-card';
import { ScrollArea, ScrollBar } from './ui/scroll-area';

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
    <ScrollArea className="w-full shrink-0 whitespace-nowrap rounded-lg border-none bg-white">
      <div className="flex w-full flex-row gap-x-4 p-4">
        <div className="flex flex-1 items-center">
          <AnalyticsCard
            title={t('totalTasks')}
            value={data.taskCount}
          />
        </div>
        <div className="flex flex-1 items-center">
          <AnalyticsCard
            title={t('assignedTasks')}
            value={data.assignedTaskCount}
          />
        </div>
        <div className="flex flex-1 items-center">
          <AnalyticsCard
            title={t('completedTasks')}
            value={data.completedTaskCount}
          />
        </div>
        <div className="flex flex-1 items-center">
          <AnalyticsCard
            title={t('overdueTasks')}
            value={data.overdueTaskCount}
          />
        </div>
        <div className="flex flex-1 items-center">
          <AnalyticsCard
            title={t('incompleteTasks')}
            value={data.incompleteTaskCount}
          />
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
