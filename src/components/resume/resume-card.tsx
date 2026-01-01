import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ResumeCardProps {
  item: {
    company: string;
    position: string;
    description: string;
    startDate: Date;
    endDate: Date | null;
  };
}

export function ResumeCard({ item }: ResumeCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  const startDateStr = formatDate(item.startDate);
  const endDateStr = item.endDate ? formatDate(item.endDate) : 'Present';
  const isCurrent = !item.endDate;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold mb-2">{item.position}</h3>
            <p className="text-xl font-medium text-muted-foreground mb-3">
              {item.company}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {isCurrent && (
              <Badge variant="default" className="shrink-0">Current</Badge>
            )}
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {startDateStr} - {endDateStr}
            </span>
          </div>
        </div>
        <p className="text-base leading-relaxed text-muted-foreground whitespace-pre-wrap">
          {item.description}
        </p>
      </CardContent>
    </Card>
  );
}
