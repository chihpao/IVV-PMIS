import { Pencil } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DottedSeparator } from '@/components/dotted-separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MemberAvatar } from '@/features/members/components/member-avatar';
import { useEditTaskModal } from '@/features/tasks/hooks/use-edit-task-modal';
import type { Task } from '@/features/tasks/types';
import { TaskStatus } from '@/features/tasks/types';

import { OverviewProperty } from './overview-property';
import { TaskDate } from './task-date';

interface TaskOverviewProps {
  task: Task;
}

export const TaskOverview = ({ task }: TaskOverviewProps) => {
  const { open } = useEditTaskModal();
  const tCommon = useTranslations('Common');
  const tTasks = useTranslations('Tasks');
  const assigneeName = task.assignee?.name ?? tCommon('unassigned');
  const statusLabels: Record<TaskStatus, string> = {
    [TaskStatus.BACKLOG]: tTasks('statusBacklog'),
    [TaskStatus.TODO]: tTasks('statusTodo'),
    [TaskStatus.IN_PROGRESS]: tTasks('statusInProgress'),
    [TaskStatus.IN_REVIEW]: tTasks('statusInReview'),
    [TaskStatus.DONE]: tTasks('statusDone'),
  };

  return (
    <div className="col-span-1 flex flex-col gap-y-4">
      <div className="rounded-lg bg-muted p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">{tTasks('overview')}</p>

          <Button onClick={() => open(task.$id)} size="sm" variant="secondary">
            <Pencil className="mr-2 size-4" />
            {tCommon('edit')}
          </Button>
        </div>

        <DottedSeparator className="my-4" />

        <div className="flex flex-col gap-y-4">
          <OverviewProperty label={tTasks('assignee')}>
            <MemberAvatar name={assigneeName} className="size-6" />

            <p className="text-sm font-medium">{assigneeName}</p>
          </OverviewProperty>

          <OverviewProperty label={tTasks('dueDate')}>
            <TaskDate value={task.dueDate} className="text-sm font-medium" />
          </OverviewProperty>

          <OverviewProperty label={tTasks('status')}>
            <Badge variant={task.status}>{statusLabels[task.status]}</Badge>
          </OverviewProperty>
        </div>
      </div>
    </div>
  );
};
