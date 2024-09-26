import { Suspense } from "react";
import { getMemberDueSoonAndOverdueTransactions } from "@/actions/transactionActions";
import DueSoonClient from "@/components/dashboard/due-soon-clientpage";
import { TopNavbar } from "@/components/dashboard/top-navbar";
import DueSoonSkeleton from "@/components/skeletons/due-soon-skeleton";

export default function DueSoonPage() {
  return (
    <Suspense fallback={<DueSoonSkeleton />}>
      <DueSoonContent />
    </Suspense>
  );
}

async function DueSoonContent() {
  const transactions = await getMemberDueSoonAndOverdueTransactions();

  return (
    <>
      <TopNavbar />
      <DueSoonClient
        initialTransactions={transactions || { dueSoon: [], overdue: [] }}
      />
    </>
  );
}
