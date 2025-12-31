'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { ChevronDown, ChevronUp, MoreVertical } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import type { _Translator as Translator } from 'use-intl/core';

import { DatePicker } from '@/components/date-picker';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { MemberAvatar } from '@/features/members/components/member-avatar';
import { ProjectAvatar } from '@/features/projects/components/project-avatar';
import { useUpdateTask } from '@/features/tasks/api/use-update-task';
import type { Task } from '@/features/tasks/types';
import { TaskStatus } from '@/features/tasks/types';

import { TaskActions } from './task-actions';

const SortIcon = ({ direction }: { direction: false | 'asc' | 'desc' }) => {
  if (direction === 'asc') return <ChevronUp className="ml-2 h-4 w-4" />;
  if (direction === 'desc') return <ChevronDown className="ml-2 h-4 w-4" />;

  return (
    <span className="ml-2 flex h-4 w-4 flex-col items-center justify-center text-muted-foreground">
      <ChevronUp className="h-3 w-3" />
      <ChevronDown className="-mt-1 h-3 w-3" />
    </span>
  );
};

type ProjectOption = {
  id: string;
  name: string;
  imageUrl?: string;
};

type MemberOption = {
  id: string;
  name: string;
};

interface ColumnOptions {
  projectOptions: ProjectOption[];
  memberOptions: MemberOption[];
}

const selectTriggerClassName =
  'h-8 w-full border-none bg-transparent px-0 py-0 text-sm font-medium shadow-none focus:ring-0 focus-visible:ring-0 [&>svg]:hidden';

const InlineTaskNameCell = ({ task }: { task: Task }) => {
  const { mutate: updateTask, isPending } = useUpdateTask();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(task.name);

  useEffect(() => {
    setValue(task.name);
  }, [task.name]);

  const commit = () => {
    const trimmed = value.trim();

    if (!trimmed || trimmed === task.name) {
      setValue(task.name);
      setIsEditing(false);
      return;
    }

    updateTask(
      {
        param: { taskId: task.$id },
        json: { name: trimmed },
      },
      {
        onSuccess: () => setIsEditing(false),
      },
    );
  };

  if (isEditing) {
    return (
      <Input
        autoFocus
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            commit();
          }

          if (event.key === 'Escape') {
            event.preventDefault();
            setValue(task.name);
            setIsEditing(false);
          }
        }}
        onClick={(event) => event.stopPropagation()}
        disabled={isPending}
        className="h-8 border-none bg-transparent p-0 text-sm font-medium shadow-none focus-visible:ring-0"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        setIsEditing(true);
      }}
      className="w-full truncate text-left text-sm font-medium text-[var(--text-primary)] hover:text-[var(--text-primary)]"
    >
      {task.name}
    </button>
  );
};

const InlineProjectCell = ({ task, projectOptions, tCommon }: { task: Task; projectOptions: ProjectOption[]; tCommon: Translator }) => {
  const { mutate: updateTask, isPending } = useUpdateTask();
  const selectedProject = useMemo(
    () => projectOptions.find((project) => project.id === task.projectId) ?? task.project,
    [projectOptions, task.project, task.projectId],
  );

  return (
    <Select
      value={task.projectId}
      onValueChange={(value) => {
        if (value === task.projectId) return;

        updateTask({
          param: { taskId: task.$id },
          json: { projectId: value },
        });
      }}
      disabled={isPending || projectOptions.length === 0}
    >
      <SelectTrigger onClick={(event) => event.stopPropagation()} className={selectTriggerClassName}>
        {selectedProject ? (
          <div className="flex items-center gap-x-2">
            <ProjectAvatar className="size-6" name={selectedProject.name} image={selectedProject.imageUrl} />
            <span className="line-clamp-1">{selectedProject.name}</span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">{tCommon('noProject')}</span>
        )}
      </SelectTrigger>
      <SelectContent>
        {projectOptions.map((project) => (
          <SelectItem key={project.id} value={project.id}>
            <div className="flex items-center gap-x-2">
              <ProjectAvatar className="size-6" name={project.name} image={project.imageUrl} />
              {project.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const InlineAssigneeCell = ({ task, memberOptions, tCommon }: { task: Task; memberOptions: MemberOption[]; tCommon: Translator }) => {
  const { mutate: updateTask, isPending } = useUpdateTask();
  const selectedMember = useMemo(
    () => memberOptions.find((member) => member.id === task.assigneeId) ?? task.assignee,
    [memberOptions, task.assignee, task.assigneeId],
  );

  return (
    <Select
      value={task.assigneeId}
      onValueChange={(value) => {
        if (value === task.assigneeId) return;

        updateTask({
          param: { taskId: task.$id },
          json: { assigneeId: value },
        });
      }}
      disabled={isPending || memberOptions.length === 0}
    >
      <SelectTrigger onClick={(event) => event.stopPropagation()} className={selectTriggerClassName}>
        {selectedMember ? (
          <div className="flex items-center gap-x-2">
            <MemberAvatar fallbackClassName="text-xs" className="size-6" name={selectedMember.name} />
            <span className="line-clamp-1">{selectedMember.name}</span>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">{tCommon('unassigned')}</span>
        )}
      </SelectTrigger>
      <SelectContent>
        {memberOptions.map((member) => (
          <SelectItem key={member.id} value={member.id}>
            <div className="flex items-center gap-x-2">
              <MemberAvatar className="size-6" name={member.name} />
              {member.name}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

const InlineDueDateCell = ({ task, tTasks }: { task: Task; tTasks: Translator }) => {
  const { mutate: updateTask, isPending } = useUpdateTask();
  const dueDateValue = task.dueDate ? new Date(task.dueDate) : undefined;

  return (
    <div onClick={(event) => event.stopPropagation()}>
      <DatePicker
        value={dueDateValue}
        onChange={(date) => {
          if (!date) return;
          if (dueDateValue && date.toDateString() === dueDateValue.toDateString()) return;

          updateTask({
            param: { taskId: task.$id },
            json: { dueDate: date },
          });
        }}
        disabled={isPending}
        placeholder={tTasks('selectDueDate')}
        className="h-8 border-none bg-transparent px-0 py-0 text-sm shadow-none hover:bg-transparent focus:ring-0 focus-visible:ring-0 [&>svg]:hidden"
      />
    </div>
  );
};

const InlineStatusCell = ({ task, statusLabels, tTasks }: { task: Task; statusLabels: Record<TaskStatus, string>; tTasks: Translator }) => {
  const { mutate: updateTask, isPending } = useUpdateTask();

  return (
    <Select
      value={task.status}
      onValueChange={(value) => {
        if (value === task.status) return;

        updateTask({
          param: { taskId: task.$id },
          json: { status: value as TaskStatus },
        });
      }}
      disabled={isPending}
    >
      <SelectTrigger onClick={(event) => event.stopPropagation()} className={selectTriggerClassName}>
        <Badge variant={task.status}>{statusLabels[task.status]}</Badge>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={TaskStatus.BACKLOG}>{tTasks('statusBacklog')}</SelectItem>
        <SelectItem value={TaskStatus.TODO}>{tTasks('statusTodo')}</SelectItem>
        <SelectItem value={TaskStatus.IN_PROGRESS}>{tTasks('statusInProgress')}</SelectItem>
        <SelectItem value={TaskStatus.IN_REVIEW}>{tTasks('statusInReview')}</SelectItem>
        <SelectItem value={TaskStatus.DONE}>{tTasks('statusDone')}</SelectItem>
      </SelectContent>
    </Select>
  );
};

export const createColumns = (tTasks: Translator, tCommon: Translator, options: ColumnOptions): ColumnDef<Task>[] => {
  const statusLabels: Record<TaskStatus, string> = {
    [TaskStatus.BACKLOG]: tTasks('statusBacklog'),
    [TaskStatus.TODO]: tTasks('statusTodo'),
    [TaskStatus.IN_PROGRESS]: tTasks('statusInProgress'),
    [TaskStatus.IN_REVIEW]: tTasks('statusInReview'),
    [TaskStatus.DONE]: tTasks('statusDone'),
  };

  return [
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            {tTasks('taskName')}
            <SortIcon direction={column.getIsSorted()} />
          </Button>
        );
      },
      cell: ({ row }) => <InlineTaskNameCell task={row.original} />,
    },
    {
      accessorKey: 'project',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            {tTasks('project')}
            <SortIcon direction={column.getIsSorted()} />
          </Button>
        );
      },
      cell: ({ row }) => <InlineProjectCell task={row.original} projectOptions={options.projectOptions} tCommon={tCommon} />,
    },
    {
      id: 'assignee',
      accessorFn: (row) => row.assignee?.name ?? '',
      sortingFn: 'alphanumeric',
      sortUndefined: 'last',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            {tTasks('assignee')}
            <SortIcon direction={column.getIsSorted()} />
          </Button>
        );
      },
      cell: ({ row }) => <InlineAssigneeCell task={row.original} memberOptions={options.memberOptions} tCommon={tCommon} />,
    },
    {
      accessorKey: 'dueDate',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            {tTasks('dueDate')}
            <SortIcon direction={column.getIsSorted()} />
          </Button>
        );
      },
      cell: ({ row }) => <InlineDueDateCell task={row.original} tTasks={tTasks} />,
    },
    {
      accessorKey: 'status',
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
            {tTasks('status')}
            <SortIcon direction={column.getIsSorted()} />
          </Button>
        );
      },
      cell: ({ row }) => <InlineStatusCell task={row.original} statusLabels={statusLabels} tTasks={tTasks} />,
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const id = row.original.$id;
        const projectId = row.original.projectId;

        return (
          <div className="flex justify-center">
            <TaskActions id={id} projectId={projectId}>
              <Button
                variant="ghost"
                className="size-8 p-0"
                onClick={(event) => {
                  event.stopPropagation();
                }}
              >
                <MoreVertical className="size-4" />
              </Button>
            </TaskActions>
          </div>
        );
      },
    },
  ];
};
