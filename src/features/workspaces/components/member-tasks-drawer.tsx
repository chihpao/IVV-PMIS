'use client';

import { format } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { CalendarIcon, Loader2, MoreVertical, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useGetTasks } from '@/features/tasks/api/use-get-tasks';
import { useUpdateTask } from '@/features/tasks/api/use-update-task';
import { Task, TaskStatus } from '@/features/tasks/types';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { cn } from '@/lib/utils';

interface MemberTasksDrawerProps {
  memberId: string | null;
  isOpen: boolean;
  onClose: () => void;
  memberName?: string;
}

export const MemberTasksDrawer = ({ memberId, isOpen, onClose, memberName }: MemberTasksDrawerProps) => {
  const t = useTranslations('Dashboard');
  const tTasks = useTranslations('Tasks');
  const workspaceId = useWorkspaceId();
  const { mutate: updateTask } = useUpdateTask();

  const isUnassigned = memberId === 'unassigned';
  const { data: tasks, isLoading } = useGetTasks({
    workspaceId,
    assigneeId: isUnassigned ? null : memberId ? [memberId] : null,
    status: [TaskStatus.BACKLOG, TaskStatus.IN_PROGRESS, TaskStatus.IN_REVIEW],
  });

  // Filter for unassigned tasks if needed because useGetTasks with null assigneeId might mean "all" or "unassigned" depending on implementation.
  // In our route, if assigneeId is null it doesn't add the filter, so it shows all.
  // Let's refine the local filter if it's unassigned mode.
  const filteredTasks = isUnassigned ? tasks?.documents.filter((t) => !t.assigneeId) : tasks?.documents;

  const handleReschedule = (taskId: string, days: number) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + days);
    updateTask({ param: { taskId }, json: { dueDate: newDate } });
  };

  const handleComplete = (taskId: string) => {
    updateTask({ param: { taskId }, json: { status: TaskStatus.DONE } });
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md rounded-none border-l-[var(--border-strong)] p-0">
        <SheetHeader className="p-6 pb-0">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-bold">{isUnassigned ? t('unassigned') : memberName}</SheetTitle>
          </div>
          <p className="text-sm text-muted-foreground">{tTasks('overview')}</p>
        </SheetHeader>

        <div className="px-6 py-4">
          <DottedSeparator />
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks?.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">{t('noActions')}</p>}
              {filteredTasks?.map((task) => (
                <div
                  key={task.$id}
                  className="group flex items-center justify-between gap-x-4 border-b border-[var(--border-subtle)] py-4 last:border-0"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">{task.name}</p>
                    <div className="mt-1 flex items-center gap-x-2 text-xs text-[var(--text-secondary)]">
                      <span className="truncate">{task.project?.name}</span>
                      {task.dueDate && (
                        <>
                          <span>•</span>
                          <span className="flex items-center gap-x-1">
                            <CalendarIcon className="size-3" />
                            {format(new Date(task.dueDate), 'PPP', { locale: zhTW })}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

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
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
