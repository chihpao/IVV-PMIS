import { parseAsArrayOf, parseAsString, parseAsStringEnum, useQueryStates } from 'nuqs';

import { TaskStatus } from '@/features/tasks/types';

export const useTaskFilters = () => {
  return useQueryStates({
    projectId: parseAsArrayOf(parseAsString),
    status: parseAsArrayOf(parseAsStringEnum(Object.values(TaskStatus))),
    assigneeId: parseAsArrayOf(parseAsString),
    search: parseAsString,
    dueDate: parseAsString,
  });
};
