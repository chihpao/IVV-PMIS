import { ChevronDown, Folder, ListChecks, UserIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { DatePicker } from '@/components/date-picker';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { useGetProjects } from '@/features/projects/api/use-get-projects';
import { useTaskFilters } from '@/features/tasks/hooks/use-task-filters';
import { TaskStatus } from '@/features/tasks/types';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';

interface DataFiltersProps {
  hideProjectFilter?: boolean;
}

export const DataFilters = ({ hideProjectFilter }: DataFiltersProps) => {
  const workspaceId = useWorkspaceId();
  const tFilters = useTranslations('Filters');
  const tTasks = useTranslations('Tasks');

  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({ workspaceId });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({ workspaceId });

  const isLoading = isLoadingProjects || isLoadingMembers;

  const projectOptions = projects?.documents.map((project) => ({
    value: project.$id,
    label: project.name,
  }));

  const memberOptions = members?.documents.map((member) => ({
    value: member.$id,
    label: member.name,
  }));

  const [{ status, assigneeId, projectId, dueDate }, setFilters] = useTaskFilters();
  const selectedStatuses = status ?? [];
  const selectedAssignees = assigneeId ?? [];
  const selectedProjects = projectId ?? [];
  const isAllStatuses = selectedStatuses.length === 0;
  const isAllAssignees = selectedAssignees.length === 0;
  const isAllProjects = selectedProjects.length === 0;

  const statusLabelMap: Record<TaskStatus, string> = {
    [TaskStatus.BACKLOG]: tTasks('statusBacklog'),
    [TaskStatus.TODO]: tTasks('statusTodo'),
    [TaskStatus.IN_PROGRESS]: tTasks('statusInProgress'),
    [TaskStatus.IN_REVIEW]: tTasks('statusInReview'),
    [TaskStatus.DONE]: tTasks('statusDone'),
  };

  const statusLabelText = isAllStatuses ? tFilters('allStatuses') : selectedStatuses.map((value) => statusLabelMap[value]).join(', ');
  const statusOptions: TaskStatus[] = [TaskStatus.BACKLOG, TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.IN_REVIEW, TaskStatus.DONE];
  const assigneeLabelMap = new Map(memberOptions?.map((member) => [member.value, member.label]) ?? []);
  const projectLabelMap = new Map(projectOptions?.map((project) => [project.value, project.label]) ?? []);
  const assigneeLabelText = isAllAssignees
    ? tFilters('allAssignees')
    : selectedAssignees
        .map((value) => assigneeLabelMap.get(value))
        .filter((label): label is string => !!label)
        .join(', ');
  const projectLabelText = isAllProjects
    ? tFilters('allProjects')
    : selectedProjects
        .map((value) => projectLabelMap.get(value))
        .filter((label): label is string => !!label)
        .join(', ');

  const onStatusToggle = (value: TaskStatus, checked: boolean) => {
    const nextStatuses = checked
      ? selectedStatuses.includes(value)
        ? selectedStatuses
        : [...selectedStatuses, value]
      : selectedStatuses.filter((statusValue) => statusValue !== value);

    setFilters({ status: nextStatuses.length > 0 ? nextStatuses : null });
  };

  const onAssigneeToggle = (value: string, checked: boolean) => {
    const nextAssignees = checked
      ? selectedAssignees.includes(value)
        ? selectedAssignees
        : [...selectedAssignees, value]
      : selectedAssignees.filter((assigneeValue) => assigneeValue !== value);

    setFilters({ assigneeId: nextAssignees.length > 0 ? nextAssignees : null });
  };

  const onProjectToggle = (value: string, checked: boolean) => {
    const nextProjects = checked
      ? selectedProjects.includes(value)
        ? selectedProjects
        : [...selectedProjects, value]
      : selectedProjects.filter((projectValue) => projectValue !== value);

    setFilters({ projectId: nextProjects.length > 0 ? nextProjects : null });
  };

  if (isLoading) return null;

  return (
    <div className="flex flex-col gap-2 lg:flex-row">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-10 w-full justify-between lg:w-auto">
            <span className="flex min-w-0 items-center">
              <ListChecks className="mr-2 size-4 shrink-0" />
              <span className="truncate">{statusLabelText}</span>
            </span>
            <ChevronDown className="ml-2 size-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel className="px-2 py-1 text-xs text-muted-foreground">
            {tFilters('selectedCount', { count: selectedStatuses.length })}
          </DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={isAllStatuses}
            onCheckedChange={(checked) => {
              if (checked) setFilters({ status: null });
            }}
            onSelect={(event) => event.preventDefault()}
          >
            {tFilters('allStatuses')}
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />
          {statusOptions.map((statusValue) => (
            <DropdownMenuCheckboxItem
              key={statusValue}
              checked={selectedStatuses.includes(statusValue)}
              onCheckedChange={(checked) => onStatusToggle(statusValue, checked === true)}
              onSelect={(event) => event.preventDefault()}
            >
              {statusLabelMap[statusValue]}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-10 w-full justify-between lg:w-auto">
            <span className="flex min-w-0 items-center">
              <UserIcon className="mr-2 size-4 shrink-0" />
              <span className="truncate">{assigneeLabelText}</span>
            </span>
            <ChevronDown className="ml-2 size-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel className="px-2 py-1 text-xs text-muted-foreground">
            {tFilters('selectedCount', { count: selectedAssignees.length })}
          </DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={isAllAssignees}
            onCheckedChange={(checked) => {
              if (checked) setFilters({ assigneeId: null });
            }}
            onSelect={(event) => event.preventDefault()}
          >
            {tFilters('allAssignees')}
          </DropdownMenuCheckboxItem>
          <DropdownMenuSeparator />

          {memberOptions?.map((member) => (
            <DropdownMenuCheckboxItem
              key={member.value}
              checked={selectedAssignees.includes(member.value)}
              onCheckedChange={(checked) => onAssigneeToggle(member.value, checked === true)}
              onSelect={(event) => event.preventDefault()}
            >
              {member.label}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {!hideProjectFilter && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="h-10 w-full justify-between lg:w-auto">
              <span className="flex min-w-0 items-center">
                <Folder className="mr-2 size-4 shrink-0" />
                <span className="truncate">{projectLabelText}</span>
              </span>
              <ChevronDown className="ml-2 size-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel className="px-2 py-1 text-xs text-muted-foreground">
              {tFilters('selectedCount', { count: selectedProjects.length })}
            </DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={isAllProjects}
              onCheckedChange={(checked) => {
                if (checked) setFilters({ projectId: null });
              }}
              onSelect={(event) => event.preventDefault()}
            >
              {tFilters('allProjects')}
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator />

            {projectOptions?.map((project) => (
              <DropdownMenuCheckboxItem
                key={project.value}
                checked={selectedProjects.includes(project.value)}
                onCheckedChange={(checked) => onProjectToggle(project.value, checked === true)}
                onSelect={(event) => event.preventDefault()}
              >
                {project.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <DatePicker
        placeholder={tFilters('dueDate')}
        className="h-10 w-full lg:w-auto"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={(date) => {
          setFilters({
            dueDate: date ? date.toISOString() : null,
          });
        }}
        showReset
      />
    </div>
  );
};
