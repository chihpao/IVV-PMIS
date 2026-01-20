import { Skeleton } from '@/components/ui/skeleton';

const DashboardLoadingPage = () => {
  return (
    <div className="flex w-full flex-col h-full space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
        <Skeleton className="h-32" />
      </div>
      <div className="h-96 w-full">
        <Skeleton className="h-full w-full" />
      </div>
    </div>
  );
};
export default DashboardLoadingPage;
