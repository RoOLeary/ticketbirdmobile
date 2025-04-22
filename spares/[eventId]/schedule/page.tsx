import { Schedule } from '@/components/events/schedule';

export default function SchedulePage({ params }: { params: { eventId: string } }) {
  return (
    <div className="container mx-auto py-8">
      <Schedule eventId={params.eventId} />
    </div>
  );
}

export function generateStaticParams() {
  return [
    {
      organizationId: '134524011981',
      eventId: '1'
    }
  ];
} 