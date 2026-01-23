'use client';

import { formatDistanceToNow } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { CalendarIcon, Loader2, MoreVertical, PlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MemberAvatar } from '@/features/members/components/member-avatar';
import { useGetTasks } from '@/features/tasks/api/use-get-tasks';
import { useUpdateTask } from '@/features/tasks/api/use-update-task';
import { useCreateTaskModal } from '@/features/tasks/hooks/use-create-task-modal';
import { Task, TaskStatus } from '@/features/tasks/types';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { cn } from '@/lib/utils';

export const ActionQueuePanel = () => {
  const t = useTranslations('Dashboard');
  const tTasks = useTranslations('Tasks');
  const workspaceId = useWorkspaceId();
  const { open: createTask } = useCreateTaskModal();
  const { mutate: updateTask, isPending: isUpdating } = useUpdateTask();

  const now = new Date();
  const threeDaysFromNow = new Date();
  threeDaysFromNow.setDate(now.getDate() + 4); // Include 3 days ahead

  const { data: overdueTasks, isLoading: isLoadingOverdue } = useGetTasks({
    workspaceId,
    status: [TaskStatus.BACKLOG, TaskStatus.IN_PROGRESS, TaskStatus.IN_REVIEW],
    dueBefore: now.toISOString(),
    limit: 10,
  });

  const { data: dueSoonTasks, isLoading: isLoadingSoon } = useGetTasks({
    workspaceId,
    status: [TaskStatus.BACKLOG, TaskStatus.IN_PROGRESS, TaskStatus.IN_REVIEW],
    dueAfter: now.toISOString(),
    dueBefore: threeDaysFromNow.toISOString(),
    limit: 10,
  });

  const isLoading = isLoadingOverdue || isLoadingSoon;

  const handleReschedule = (taskId: string, days: number) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + days);
    updateTask({ param: { taskId }, json: { dueDate: newDate } });
  };

  const handleComplete = (taskId: string) => {
    updateTask({ param: { taskId }, json: { status: TaskStatus.DONE } });
  };

  const renderTaskRow = (task: Task, isOverdue: boolean) => (
    <div
      key={task.$id}
      className="group flex items-center justify-between gap-x-4 border-b border-[var(--border-subtle)] py-3 last:border-0"
    >
      <div className="flex min-w-0 flex-1 items-start gap-x-3">
        <div className={cn('mt-1 size-2 shrink-0 rounded-none', isOverdue ? 'bg-red-500' : 'bg-orange-400')} />
        <div className="min-w-0 flex-1">
          <Link
            href={`/workspaces/${workspaceId}/tasks/${task.$id}`}
            className="block truncate text-sm font-medium transition hover:text-[var(--text-primary)] hover:underline"
          >
            {task.name}
          </Link>
          <div className="mt-1 flex items-center gap-x-2 text-xs text-[var(--text-secondary)]">
            <span className="truncate">{task.project?.name}</span>
            <span className="shrink-0">•</span>
            <span className={cn(isOverdue && 'text-red-500 font-medium')}>
              {isOverdue
                ? t('overdueBy', { days: Math.floor((now.getTime() - new Date(task.dueDate).getTime()) / (1000 * 60 * 60 * 24)) })
                : t('daysRemaining', { days: Math.ceil((new Date(task.dueDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) })}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-x-2">
        {task.assignee && <MemberAvatar name={task.assignee.name} className="size-6 shrink-0" fallbackClassName="text-[10px]" />}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 rounded-none">
            <DropdownMenuItem onClick={() => handleComplete(task.$id)} className="rounded-none">
              {t('markComplete')}
            </DropdownMenuItem>
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">{t('reschedule')}</div>
            <DropdownMenuItem onClick={() => handleReschedule(task.$id, 1)} className="rounded-none pl-4">
              {t('plus1day')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleReschedule(task.$id, 3)} className="rounded-none pl-4">
              {t('plus3days')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleReschedule(task.$id, 7)} className="rounded-none pl-4">
              {t('plus7days')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  return (
    <Card className="h-full rounded-none border-[var(--border-strong)] shadow-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-xl font-bold">{t('actionQueue')}</CardTitle>
          <p className="text-sm text-muted-foreground">{t('actionQueueDescription')}</p>
        </div>
        <Button size="icon" variant="outline" onClick={() => createTask()} className="rounded-none">
          <PlusIcon className="size-4" />
        </Button>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <DottedSeparator className="mb-4" />

        {isLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Overdue Section */}
            {(overdueTasks?.documents?.length ?? 0) > 0 && (
              <div>
                <h3 className="mb-2 flex items-center gap-x-2 text-xs font-bold uppercase tracking-wider text-red-500">
                  {t('overdue')}
                  <span className="rounded-none bg-red-100 px-1.5 py-0.5 text-[10px] text-red-600">{overdueTasks?.total}</span>
                </h3>
                <div className="flex flex-col">{overdueTasks?.documents.map((task) => renderTaskRow(task, true))}</div>
              </div>
            )}

            {/* Due Soon Section */}
            {(dueSoonTasks?.documents?.length ?? 0) > 0 && (
              <div>
                <h3 className="mb-2 flex items-center gap-x-2 text-xs font-bold uppercase tracking-wider text-orange-500">
                  {t('dueSoon')}
                  <span className="rounded-none bg-orange-100 px-1.5 py-0.5 text-[10px] text-orange-600">{dueSoonTasks?.total}</span>
                </h3>
                <div className="flex flex-col">{dueSoonTasks?.documents.map((task) => renderTaskRow(task, false))}</div>
              </div>
            )}

            {overdueTasks?.total === 0 && dueSoonTasks?.total === 0 && (
              <div className="flex h-40 flex-col items-center justify-center text-center">
                <div className="mb-2 rounded-none bg-muted p-3">
                  <CalendarIcon className="size-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">{t('noActions')}</p>
              </div>
            )}

            {(overdueTasks?.total ?? 0) > 0 || (dueSoonTasks?.total ?? 0) > 0 ? (
              <Button variant="link" className="h-auto p-0 text-xs" asChild>
                <Link href={`/workspaces/${workspaceId}/tasks`}>{t('viewAll')}</Link>
              </Button>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
