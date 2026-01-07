'use client';

import { Loader2, PlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';
import { useQueryState } from 'nuqs';
import { useCallback, useMemo } from 'react';

import { DottedSeparator } from '@/components/dotted-separator';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { useGetProjects } from '@/features/projects/api/use-get-projects';
import { useBulkUpdateTasks } from '@/features/tasks/api/use-bulk-update-tasks';
import { useGetTasks } from '@/features/tasks/api/use-get-tasks';
import { useCreateTaskModal } from '@/features/tasks/hooks/use-create-task-modal';
import { useTaskFilters } from '@/features/tasks/hooks/use-task-filters';
import type { TaskStatus } from '@/features/tasks/types';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';

import { createColumns } from './columns';
import { DataFilters } from './data-filters';
import { DataKanban } from './data-kanban';
import { DataTable } from './data-table';

const DataCalendar = dynamic(() => import('./data-calendar').then((m) => m.DataCalendar), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <Loader2 className="size-5 animate-spin text-muted-foreground" />
    </div>
  ),
});

interface TaskViewSwitcherProps {
  projectId?: string;
  hideProjectFilter?: boolean;
}

export const TaskViewSwitcher = ({ projectId, hideProjectFilter }: TaskViewSwitcherProps) => {
  const [view, setView] = useQueryState('task-view', {
    defaultValue: 'table',
  });
  const tTasks = useTranslations('Tasks');
  const tCommon = useTranslations('Common');
  const [{ status, assigneeId, projectId: filteredProjectId, dueDate, search }] = useTaskFilters();

  const workspaceId = useWorkspaceId();

  const { open } = useCreateTaskModal();
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
    status,
    assigneeId,
    projectId: projectId ? [projectId] : filteredProjectId,
    dueDate,
  });
  const { data: projects } = useGetProjects({ workspaceId });
  const { data: members } = useGetMembers({ workspaceId });

  const projectOptions = useMemo(
    () =>
      projects?.documents.map((project) => ({
        id: project.$id,
        name: project.name,
        imageUrl: project.imageUrl,
      })) ?? [],
    [projects?.documents],
  );
  const memberOptions = useMemo(
    () =>
      members?.documents.map((member) => ({
        id: member.$id,
        name: member.name,
      })) ?? [],
    [members?.documents],
  );

  const filteredTasks = useMemo(() => {
    const documents = tasks?.documents ?? [];
    const trimmedSearch = search?.trim();

    if (!trimmedSearch) return documents;

    const normalizedSearch = trimmedSearch.toLowerCase();

    return documents.filter((task) => task.name.toLowerCase().includes(normalizedSearch));
  }, [tasks?.documents, search]);

  const { mutate: bulkUpdateTasks } = useBulkUpdateTasks();

  const onKanbanChange = useCallback(
    (tasks: { $id: string; status: TaskStatus; position: number }[]) => {
      bulkUpdateTasks({
        json: { tasks },
      });
    },
    [bulkUpdateTasks],
  );

  const columns = useMemo(
    () =>
      createColumns(tTasks, tCommon, {
        projectOptions,
        memberOptions,
      }),
    [tTasks, tCommon, projectOptions, memberOptions],
  );

  return (
    <Tabs defaultValue={view} onValueChange={setView} className="w-full flex-1 rounded-none">
      <div className="flex flex-col p-4">
        <div className="flex flex-col items-center justify-between gap-y-2 lg:flex-row">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              {tTasks('table')}
            </TabsTrigger>

            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              {tTasks('kanban')}
            </TabsTrigger>

            <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
              {tTasks('calendar')}
            </TabsTrigger>
          </TabsList>

          <Button onClick={() => open()} size="sm" className="w-full lg:w-auto">
            <PlusIcon className="size-4" />
            {tCommon('new')}
          </Button>
        </div>
        <DottedSeparator className="my-4" />

        <div className="flex flex-col justify-between gap-2 xl:flex-row xl:items-center">
          <DataFilters hideProjectFilter={hideProjectFilter} />
        </div>

        <DottedSeparator className="my-4" />
        {isLoadingTasks ? (
          <div className="flex h-[200px] w-full flex-col items-center justify-center rounded-none">
            <Loader2 className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable columns={columns} data={filteredTasks} />
            </TabsContent>

            <TabsContent value="kanban" className="mt-0">
              <DataKanban data={filteredTasks} onChange={onKanbanChange} />
            </TabsContent>

            <TabsContent value="calendar" className="mt-0 h-full pb-4">
              <DataCalendar data={filteredTasks} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};
