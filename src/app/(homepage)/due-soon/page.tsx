import { getMemberDueSoonAndOverdueTransactions } from "@/actions/transactionActions";
import DueSoonClient from "@/components/dashboard/due-soon-clientpage";

export default async function DueSoonPage() {
  const transactions = await getMemberDueSoonAndOverdueTransactions();

  return (
    <DueSoonClient
      initialTransactions={transactions || { dueSoon: [], overdue: [] }}
    />
  );
}
