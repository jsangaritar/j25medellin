import { useQuery } from '@tanstack/react-query';
import { collection, getCountFromServer } from 'firebase/firestore';
import { BookOpen, Calendar, Film, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCourses } from '@/hooks/useCourses';
import { useEvents } from '@/hooks/useEvents';
import { useMedia } from '@/hooks/useMedia';
import { db } from '@/lib/firebase';

function StatCard({
  icon: Icon,
  label,
  count,
  href,
}: {
  icon: React.ElementType;
  label: string;
  count: number;
  href: string;
}) {
  return (
    <Link to={href}>
      <Card className="border-border bg-bg-card transition-colors hover:border-text-dim">
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
    </Link>
  );
}

export function DashboardPage() {
  const { data: events = [] } = useEvents();
  const { data: courses = [] } = useCourses();
  const { data: media = [] } = useMedia();
  const { data: registrationCount = 0 } = useQuery({
    queryKey: ['registrations', 'count'],
    queryFn: async () => {
      const snapshot = await getCountFromServer(
        collection(db, 'registrations'),
      );
      return snapshot.data().count;
    },
  });

  return (
    <div>
      <h1 className="mb-8 font-display text-2xl font-bold text-text-primary">
        Dashboard
      </h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Calendar}
          label="Eventos"
          count={events.length}
          href="/admin/events"
        />
        <StatCard
          icon={BookOpen}
          label="Cursos"
          count={courses.length}
          href="/admin/courses"
        />
        <StatCard
          icon={Film}
          label="Media"
          count={media.length}
          href="/admin/media"
        />
        <StatCard
          icon={Users}
          label="Inscripciones"
          count={registrationCount}
          href="/admin/registrations"
        />
      </div>
    </div>
  );
}
