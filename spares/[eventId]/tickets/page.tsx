import { EventTickets } from "@/../../components/events/event-tickets"

export async function generateStaticParams() {
  return [
    { organizationId: "134524011981", eventId: "1" },
    { organizationId: "220186080325", eventId: "2" },
    { organizationId: "134524011981", eventId: "3" },
    { organizationId: "220186080325", eventId: "1" },
    { organizationId: "220186080325", eventId: "2" },
  ]
}

export default function TicketsPage({ params }: { params: { organizationId: string, eventId: string } }) {
  return <EventTickets organizationId={params.organizationId} eventId={params.eventId} />
} 