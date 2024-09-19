// app/admin/active-transactions/page.tsx
import React from "react";
import ActiveTransactions from "@/components/admin-dashboard/active-transactions";
import { getActiveTransactions } from "@/actions/transactionActions";

export default async function ActiveTransactionsPage() {
  const activeTransactions = await getActiveTransactions();

  return (
    <div className="container mx-auto p-6">
      <header className="bg-white dark:bg-gray-800 shadow mb-6 rounded-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Active Transactions
          </h1>
        </div>
      </header>
      <ActiveTransactions transactions={activeTransactions} />
    </div>
  );
}
