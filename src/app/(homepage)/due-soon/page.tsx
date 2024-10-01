import { Suspense } from "react";
import { getMemberDueSoonAndOverdueTransactions } from "@/actions/transactionActions";
import DueSoonClient from "@/components/dashboard/due-soon-clientpage";
import { TopNavbar } from "@/components/dashboard/top-navbar";
import DueSoonSkeleton from "@/components/skeletons/due-soon-skeleton";
import { auth } from "@/auth";
import { getUserDetails } from "@/actions/memberActions";

export default function DueSoonPage() {
  return (
    <Suspense fallback={<DueSoonSkeleton />}>
      <DueSoonContent />
    </Suspense>
  );
}

async function DueSoonContent() {
  const transactions = await getMemberDueSoonAndOverdueTransactions();
  const session = await auth();
  const user = await getUserDetails(session);
  if ("error" in user) {
    return;
  }
  return (
    <>
      <TopNavbar userCredits={user.credits} />
      <DueSoonClient
        initialTransactions={transactions || { dueSoon: [], overdue: [] }}
      />
    </>
  );
}
