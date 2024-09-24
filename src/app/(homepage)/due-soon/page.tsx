import { getMemberDueSoonAndOverdueTransactions } from "@/actions/transactionActions";
import DueSoonClient from "@/components/dashboard/due-soon-clientpage";
import { TopNavbar } from "@/components/dashboard/top-navbar";

export default async function DueSoonPage() {
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