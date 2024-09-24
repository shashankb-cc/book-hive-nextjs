import { getMemberTransactions } from "@/actions/transactionActions";
import HistoryClient from "@/components/dashboard/tranasactions-clientpage";
import { TopNavbar } from "@/components/dashboard/top-navbar";

export default async function HistoryPage() {
  const transactions = await getMemberTransactions();

  return (
    <>
      <TopNavbar />
      <HistoryClient initialTransactions={transactions || []} />
    </>
  );
}
