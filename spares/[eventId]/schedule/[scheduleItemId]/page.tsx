import { Schedule } from '@/components/events/schedule';

export default function ScheduleItemPage({ params }: { params: { eventId: string, scheduleItemId: string } }) {
  return (
    <div className="container mx-auto py-8">
      <Schedule eventId={params.eventId} scheduleItemId={params.scheduleItemId} />
    </div>
  );
}

export function generateStaticParams() {
  return [
    {
      organizationId: '134524011981',
      eventId: '1',
      scheduleItemId: '1'
    }
  ];
} 