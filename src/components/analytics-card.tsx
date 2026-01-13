import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

interface AnalyticsCardProps {
  title: string;
  value: number;
}

export const AnalyticsCard = ({ title, value }: AnalyticsCardProps) => {
  return (
    <Card className="w-full border-none shadow-none bg-transparent">
      <CardHeader className="flex flex-col items-center overflow-hidden">
        <CardDescription className="flex items-center gap-x-2 overflow-hidden font-medium">
          <span className="truncate text-base">{title}</span>
        </CardDescription>
        <div className="py-2 w-full px-5">
          <Separator orientation="horizontal" />
        </div>
        <CardTitle className="text-4xl font-semibold">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
};
