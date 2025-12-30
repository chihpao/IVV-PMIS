import { SearchIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

import { Input } from '@/components/ui/input';
import { useTaskFilters } from '@/features/tasks/hooks/use-task-filters';
import { useWorkspaceId } from '@/features/workspaces/hooks/use-workspace-id';
import { useDebounce } from '@/hooks/use-debounce';

export const DataSearch = () => {
  const [value, setValue] = useState('');
  const tTasks = useTranslations('Tasks');
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const workspaceId = useWorkspaceId();
  const lastAppliedSearchRef = useRef<string | null>(null);

  const debouncedValue = useDebounce(value);
  const [_filters, setFilters] = useTaskFilters();
  const projectIdParam = params.projectId;
  const projectId = Array.isArray(projectIdParam) ? projectIdParam[0] ?? '' : projectIdParam ?? '';
  const isTasksListPage = pathname.endsWith('/tasks');
  const isProjectOverviewPage = !!projectId && pathname.endsWith(`/projects/${projectId}`);
  const isSearchTargetPage = isTasksListPage || isProjectOverviewPage;

  useEffect(() => {
    if (!isSearchTargetPage) return;
    const trimmed = debouncedValue.trim();
    const nextSearch = trimmed.length > 0 ? trimmed : null;
    if (lastAppliedSearchRef.current === nextSearch) return;
    lastAppliedSearchRef.current = nextSearch;
    setFilters({ search: nextSearch });
  }, [debouncedValue, isSearchTargetPage, setFilters]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    const trimmed = value.trim();
    if (isSearchTargetPage) {
      setFilters({ search: trimmed.length > 0 ? trimmed : null });
      return;
    }
    if (!workspaceId) return;
    const targetPath = projectId ? `/workspaces/${workspaceId}/projects/${projectId}` : `/workspaces/${workspaceId}/tasks`;
    const searchParam = trimmed.length > 0 ? `?search=${encodeURIComponent(trimmed)}` : '';
    router.push(`${targetPath}${searchParam}`);
  };

  return (
    <div className="relative">
      <SearchIcon className="absolute left-2.5 top-[20%] size-4 text-muted-foreground" />

      <Input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tTasks('searchPlaceholder')}
        className="h-8 w-full px-8 lg:w-[320px]"
      />
    </div>
  );
};
