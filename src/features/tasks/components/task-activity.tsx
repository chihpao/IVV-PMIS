'use client';

import { ActivityIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DottedSeparator } from '@/components/dotted-separator';
import { ActivityList } from '@/features/audit-logs/components/activity-list';
import { AuditEntityType } from '@/features/audit-logs/types';
import { Task } from '@/features/tasks/types';

interface TaskActivityProps {
  task: Task;
}

export const TaskActivity = ({ task }: TaskActivityProps) => {
  const tTasks = useTranslations('Tasks');

  return (
    <div className="rounded-none border p-4">
      <div className="flex items-center gap-x-2">
        <ActivityIcon className="size-5 text-neutral-500" />
        <p className="text-lg font-semibold">{tTasks('activity')}</p>
      </div>

      <DottedSeparator className="my-4" />

      <ActivityList entityId={task.$id} entityType={AuditEntityType.TASK} />
    </div>
  );
};
