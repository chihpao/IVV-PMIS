'use client';

import { useTranslations } from 'next-intl';

import { DottedSeparator } from '@/components/dotted-separator';
import { PageError } from '@/components/page-error';
import { PageLoader } from '@/components/page-loader';
import { CommentList } from '@/features/comments/components/comment-list';
import { useGetTask } from '@/features/tasks/api/use-get-task';
import { TaskActivity } from '@/features/tasks/components/task-activity';
import { TaskBreadcrumbs } from '@/features/tasks/components/task-breadcrumbs';
import { TaskDescription } from '@/features/tasks/components/task-description';
import { TaskOverview } from '@/features/tasks/components/task-overview';
import { useTaskId } from '@/features/tasks/hooks/use-task-id';

export const TaskIdClient = () => {
  const taskId = useTaskId();
  const tErrors = useTranslations('Errors');

  const { data: task, isLoading } = useGetTask({ taskId });

  if (isLoading) return <PageLoader />;

  if (!task) return <PageError message={tErrors('taskNotFound')} />;
  if (!task.project) return <PageError message={tErrors('projectNotFound')} />;

  return (
    <div className="flex flex-col">
      <TaskBreadcrumbs project={task.project} task={task} />

      <DottedSeparator className="my-6" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <TaskOverview task={task} />
        <div className="flex flex-col gap-4">
          <TaskDescription task={task} />
          <TaskActivity task={task} />
          <CommentList taskId={taskId} workspaceId={task.workspaceId} />
        </div>
      </div>
    </div>
  );
};
