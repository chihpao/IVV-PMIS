import { MoreHorizontal } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DottedSeparator } from '@/components/dotted-separator';
import { MemberAvatar } from '@/features/members/components/member-avatar';
import { ProjectAvatar } from '@/features/projects/components/project-avatar';
import type { Task } from '@/features/tasks/types';
import { cn } from '@/lib/utils';

import { TaskActions } from './task-actions';
import { TaskDate } from './task-date';

interface KanbanCardProps {
  task: Task;
  isDragging?: boolean;
}

export const KanbanCard = ({ task, isDragging }: KanbanCardProps) => {
  const tCommon = useTranslations('Common');
  const assigneeName = task.assignee?.name ?? tCommon('unassigned');
  const projectName = task.project?.name ?? tCommon('noProject');

  return (
    <div
      className={cn(
        'space-y-3 rounded-none border border-neutral-300/70 bg-white p-3 shadow-sm hover:shadow-md',
        !isDragging && 'transition-shadow',
      )}
    >
      <div className="flex items-start justify-between gap-x-2">
        <p className="line-clamp-2 text-sm">{task.name}</p>

        <TaskActions id={task.$id} projectId={task.projectId}>
          <MoreHorizontal className="size-[18px] shrink-0 cursor-pointer stroke-1 text-neutral-700 transition hover:opacity-75" />
        </TaskActions>
      </div>

      <DottedSeparator />

      <div className="flex items-center gap-x-1.5">
        <MemberAvatar name={assigneeName} fallbackClassName="text-[10px]" />
        <div aria-hidden className="size-1 rounded-none bg-neutral-300" />
        <TaskDate value={task.dueDate} className="text-xs" />
      </div>

      <div className="flex items-center gap-x-1.5">
        <ProjectAvatar name={projectName} image={task.project?.imageUrl} fallbackClassName="text-[10px]" />
        <span className="text-xs font-medium">{projectName}</span>
      </div>
    </div>
  );
};
