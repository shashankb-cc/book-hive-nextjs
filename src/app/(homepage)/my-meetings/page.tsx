import { Suspense } from "react";
import MeetingClientPage from "@/components/dashboard/my-meetings";
import { fetchScheduledEvents } from "@/helpers/calendlyUserEvents";
import MeetingSkeleton from "@/components/skeletons/meeting-skeleton";
import { auth } from "@/auth";
import { getUserDetails } from "@/actions/memberActions";
import { TopNavbar } from "@/components/dashboard/top-navbar";

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
    const session = await auth();
    const user = await getUserDetails(session);
    if ("error" in user) {
      return;
    }
    return (
      <>
        <TopNavbar userCredits={user.credits} />
        <MeetingClientPage events={events || []} />
      </>
    );
  } catch (error) {
    console.error("Failed to fetch events:", error);
    return <div>Failed to load events.</div>;
  }
}
