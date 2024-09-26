import { Suspense } from "react";
import { getMemberTransactions } from "@/actions/transactionActions";
import HistoryClient from "@/components/dashboard/tranasactions-clientpage";
import { TopNavbar } from "@/components/dashboard/top-navbar";
import HistorySkeleton from "@/components/skeletons/transaction-skeleton";

export default function HistoryPage() {
  return (
    <>
      <TopNavbar />
      <Suspense fallback={<HistorySkeleton />}>
        <HistoryContent />
      </Suspense>
    </>
  );
}

async function HistoryContent() {
  const transactions = await getMemberTransactions();

  return <HistoryClient initialTransactions={transactions || []} />;
}
