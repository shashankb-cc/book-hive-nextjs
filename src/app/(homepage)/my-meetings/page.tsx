// app/dashboard/page.tsx (Server Component)

import MeetingClientPage from "@/components/dashboard/my-meetings";
import { fetchScheduledEvents } from "@/helpers/calendlyUserEvents";

export default async function DashboardPage() {
  try {
    const events = await fetchScheduledEvents(); // Fetch events from lib
    return <MeetingClientPage events={events || []} />;
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return <div>Failed to load events.</div>;
  }
}
