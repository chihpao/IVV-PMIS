'use client';

import type { QueryClient, QueryKey } from '@tanstack/react-query';

import type { Member } from '@/features/members/types';
import type { Project } from '@/features/projects/types';
import type { Task } from '@/features/tasks/types';

type TaskList = {
  documents: Task[];
  total: number;
  limit: number;
  offset: number;
} & Record<string, unknown>;

type ProjectList = {
  documents: Project[];
} & Record<string, unknown>;

type MemberList = {
  documents: Member[];
} & Record<string, unknown>;

type TaskQueryFilters = {
  workspaceId: string;
  projectKey: string | null;
  statusKey: string | null;
  assigneeKey: string | null;
  dueDate: string | null;
  limit: number | null;
};

type TaskListUpdater = (data: TaskList, filters: TaskQueryFilters) => TaskList;

const isTaskList = (data: unknown): data is TaskList => {
  if (!data || typeof data !== 'object') return false;
  const record = data as Record<string, unknown>;
  return Array.isArray(record.documents);
};

const isProjectList = (data: unknown): data is ProjectList => {
  if (!data || typeof data !== 'object') return false;
  const record = data as Record<string, unknown>;
  return Array.isArray(record.documents);
};

const isMemberList = (data: unknown): data is MemberList => {
  if (!data || typeof data !== 'object') return false;
  const record = data as Record<string, unknown>;
  return Array.isArray(record.documents);
};

const parseTaskQueryKey = (queryKey: QueryKey): TaskQueryFilters | null => {
  if (!Array.isArray(queryKey)) return null;
  if (queryKey[0] !== 'tasks') return null;
  if (typeof queryKey[1] !== 'string') return null;

  return {
    workspaceId: queryKey[1],
    projectKey: typeof queryKey[2] === 'string' ? queryKey[2] : null,
    statusKey: typeof queryKey[3] === 'string' ? queryKey[3] : null,
    assigneeKey: typeof queryKey[4] === 'string' ? queryKey[4] : null,
    dueDate: typeof queryKey[5] === 'string' ? queryKey[5] : null,
    limit: typeof queryKey[6] === 'number' ? queryKey[6] : null,
  };
};

const matchesKey = (key: string | null, value: string | undefined) => {
  if (!key) return true;
  if (!value) return false;
  return key.split(',').includes(value);
};

export const taskMatchesFilters = (task: Task, filters: TaskQueryFilters) => {
  return (
    task.workspaceId === filters.workspaceId &&
    matchesKey(filters.projectKey, task.projectId) &&
    matchesKey(filters.statusKey, task.status) &&
    matchesKey(filters.assigneeKey, task.assigneeId) &&
    (!filters.dueDate || task.dueDate === filters.dueDate)
  );
};

export const updateTaskLists = (queryClient: QueryClient, updater: TaskListUpdater) => {
  const queries = queryClient.getQueriesData({ queryKey: ['tasks'] });

  queries.forEach(([queryKey, data]) => {
    if (!isTaskList(data)) return;
    const filters = parseTaskQueryKey(queryKey);
    if (!filters) return;

    const next = updater(data, filters);
    queryClient.setQueryData(queryKey, next);
  });
};

export const getProjectFromCache = (queryClient: QueryClient, workspaceId: string, projectId: string) => {
  const queries = queryClient.getQueriesData({ queryKey: ['projects', workspaceId] });

  for (const [, data] of queries) {
    if (!isProjectList(data)) continue;
    const project = data.documents.find((item) => item.$id === projectId);
    if (project) return project;
  }

  return undefined;
};

export const getMemberFromCache = (queryClient: QueryClient, workspaceId: string, memberId: string) => {
  const queries = queryClient.getQueriesData({ queryKey: ['members', workspaceId] });

  for (const [, data] of queries) {
    if (!isMemberList(data)) continue;
    const member = data.documents.find((item) => item.$id === memberId);
    if (member) return member;
  }

  return undefined;
};

export const getNextPositionFromCache = (queryClient: QueryClient, workspaceId: string, status: Task['status']) => {
  const queries = queryClient.getQueriesData({ queryKey: ['tasks', workspaceId] });
  let maxPosition = 0;

  for (const [, data] of queries) {
    if (!isTaskList(data)) continue;
    for (const task of data.documents) {
      if (task.status === status) {
        maxPosition = Math.max(maxPosition, task.position);
      }
    }
  }

  return maxPosition > 0 ? maxPosition + 1000 : 1000;
};
