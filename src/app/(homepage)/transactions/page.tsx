import { Suspense } from "react";
import { getMemberTransactions } from "@/actions/transactionActions";
import HistoryClient from "@/components/dashboard/tranasactions-clientpage";
import { TopNavbar } from "@/components/dashboard/top-navbar";
import HistorySkeleton from "@/components/skeletons/transaction-skeleton";
import { auth } from "@/auth";
import { getUserDetails } from "@/actions/memberActions";

export default function HistoryPage() {
  return (
    <>
      <Suspense fallback={<HistorySkeleton />}>
        <HistoryContent />
      </Suspense>
    </>
  );
}

async function HistoryContent() {
  const transactions = await getMemberTransactions();
  const session = await auth();
  const user = await getUserDetails(session);
  if ("error" in user) {
    return;
  }
  return (
    <>
      <TopNavbar userCredits={user.credits} />
      <HistoryClient initialTransactions={transactions || []} />
    </>
  );
}
