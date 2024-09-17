import { getTransactionsDueToday } from "@/actions/transactionActions";
import DueTodayDashboard from "@/components/admin-dashboard/due-today";

export default async function DueTodayPage() {
  const dueTransactions = await getTransactionsDueToday();

  return (
    <DueTodayDashboard
      dueToday={dueTransactions?.dueToday}
      overdue={dueTransactions?.overdueTransactions}
    />
  );
}
