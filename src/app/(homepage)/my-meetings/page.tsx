import { Suspense } from "react";
import MeetingClientPage from "@/components/dashboard/my-meetings";
import { fetchScheduledEvents } from "@/helpers/calendlyUserEvents";
import MeetingSkeleton from "@/components/skeletons/meeting-skeleton";

export default function DashboardPage() {
  return (
    <Suspense fallback={<MeetingSkeleton />}>
      <MeetingContent />
    </Suspense>
  );
}

async function MeetingContent() {
  try {
    const events = await fetchScheduledEvents();
    return <MeetingClientPage events={events || []} />;
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return <div>Failed to load events.</div>;
  }
}
