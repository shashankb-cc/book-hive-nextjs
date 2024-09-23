import { getMemberTransactions } from "@/actions/transactionActions";
import HistoryClient from "@/components/dashboard/tranasactions-clientpage";

export default async function HistoryPage() {
  const transactions = await getMemberTransactions();

  return <HistoryClient initialTransactions={transactions || []} />;
}
