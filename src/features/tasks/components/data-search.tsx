import { SearchIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';

import { Input } from '@/components/ui/input';
import { useTaskFilters } from '@/features/tasks/hooks/use-task-filters';
import { useDebounce } from '@/hooks/use-debounce';

export const DataSearch = () => {
  const [value, setValue] = useState('');
  const tTasks = useTranslations('Tasks');

  const debouncedValue = useDebounce(value);
  const [_filters, setFilters] = useTaskFilters();

  useEffect(() => {
    setFilters({ search: debouncedValue.trim().length > 0 ? debouncedValue : null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedValue]);

  return (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

      <Input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={tTasks('searchPlaceholder')}
        className="h-10 w-full rounded-full px-9 lg:w-[360px]"
      />
    </div>
  );
};
