import { BookOpen, Calendar, Film, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCourses } from '@/hooks/useCourses';
import { useEvents } from '@/hooks/useEvents';
import { useMedia } from '@/hooks/useMedia';

function StatCard({
  icon: Icon,
  label,
  count,
}: {
  icon: React.ElementType;
  label: string;
  count: number;
}) {
  return (
    <Card className="border-border bg-bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-text-muted">
          {label}
        </CardTitle>
        <Icon className="size-4 text-text-muted" />
      </CardHeader>
      <CardContent>
        <p className="font-display text-3xl font-bold text-text-primary">
          {count}
        </p>
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const { data: events = [] } = useEvents();
  const { data: courses = [] } = useCourses();
  const { data: media = [] } = useMedia();

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl font-bold text-text-primary">
        Dashboard
      </h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={Calendar} label="Eventos" count={events.length} />
        <StatCard icon={BookOpen} label="Cursos" count={courses.length} />
        <StatCard icon={Film} label="Media" count={media.length} />
        <StatCard icon={Users} label="Inscripciones" count={0} />
      </div>
    </div>
  );
}
