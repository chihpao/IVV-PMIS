import { addMonths, format, getDay, parse, startOfWeek, subMonths } from 'date-fns';
import { zhTW } from 'date-fns/locale';
import { CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { Button } from '@/components/ui/button';
import type { Task } from '@/features/tasks/types';

import './data-calendar.css';
import { EventCard } from './event-card';

const locales = {
  'zh-TW': zhTW,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface DataCalendarProps {
  data: Task[];
}

interface CustomToolbarProps {
  date: Date;
  onNavigate: (action: 'PREV' | 'NEXT' | 'TODAY') => void;
}

const CustomToolbar = ({ date, onNavigate }: CustomToolbarProps) => {
  const t = useTranslations('Calendar');

  return (
    <div className="mb-4 flex w-full items-center justify-center gap-x-2 lg:w-auto lg:justify-start">
      <Button title={t('previousMonth')} onClick={() => onNavigate('PREV')} variant="secondary" size="icon">
        <ChevronLeft className="size-4" />
      </Button>

      <div className="flex h-8 w-full items-center justify-center rounded-md border border-input px-3 py-2 lg:w-auto">
        <CalendarIcon className="mr-2 size-4" />
        <p className="text-sm">{format(date, 'yyyy MMMM', { locale: zhTW })}</p>
      </div>

      <Button title={t('nextMonth')} onClick={() => onNavigate('NEXT')} variant="secondary" size="icon">
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
};

export const DataCalendar = ({ data }: DataCalendarProps) => {
  const [value, setValue] = useState(data.length > 0 ? new Date(data[0].dueDate) : new Date());

  const events = useMemo(
    () =>
      data.map((task) => ({
        start: new Date(task.dueDate),
        end: new Date(task.dueDate),
        title: task.name,
        project: task.project,
        assignee: task.assignee,
        status: task.status,
        id: task.$id,
      })),
    [data],
  );
  const maxDate = useMemo(() => {
    const now = new Date();
    return new Date(now.setFullYear(now.getFullYear() + 1));
  }, []);

  const handleNavigate = (action: 'PREV' | 'NEXT' | 'TODAY') => {
    if (action === 'PREV') setValue(subMonths(value, 1));
    else if (action === 'NEXT') setValue(addMonths(value, 1));
    else if (action === 'TODAY') setValue(new Date());
  };

  return (
    <Calendar
      localizer={localizer}
      date={value}
      culture="zh-TW"
      events={events}
      views={['month']}
      defaultView="month"
      toolbar
      showAllEvents
      className="h-full"
      max={maxDate}
      formats={{
        weekdayFormat: (date, culture, localizer) => localizer?.format(date, 'EEE', culture) ?? '',
      }}
      components={{
        eventWrapper: ({ event }) => (
          <EventCard id={event.id} title={event.title} assignee={event.assignee} project={event.project} status={event.status} />
        ),
        toolbar: () => <CustomToolbar date={value} onNavigate={handleNavigate} />,
      }}
    />
  );
};
