import { EventManagement } from "@/components/events/event-management"

export async function generateStaticParams() {
  // These are the combinations of organizationId and eventId that will be pre-rendered
  return [
    { organizationId: "134524011981", eventId: "1" },
    { organizationId: "220186080325", eventId: "2" },
    { organizationId: "1", eventId: "3" },
    { organizationId: "2", eventId: "1" },
    { organizationId: "2", eventId: "2" },
    { organizationId: "1", eventId: "new" },
    { organizationId: "2", eventId: "new" },
  ]
}

export default function EventPage({ params }: { params: { organizationId: string, eventId: string } }) {
  return <EventManagement organizationId={params.organizationId} eventId={params.eventId} />
} 