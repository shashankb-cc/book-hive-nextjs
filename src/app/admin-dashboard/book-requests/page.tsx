// app/admin/transactions/page.tsx
import React from "react";
import { TransactionRepository } from "@/repositories/transactionRepository";
import Transactions from "@/components/admin-dashboard/book-request";
import { db } from "@/drizzle/db";

interface TransactionsPageProps {
  searchParams: { page?: string; status?: string; search?: string };
}

export default async function TransactionsPage({
  searchParams,
}: TransactionsPageProps) {
  const page = parseInt(searchParams.page || "1");
  const status = searchParams.status || "";
  const search = searchParams.search || "";
  const transactionsPerPage = 10;

  const transactionRepo = new TransactionRepository(db);

  const { transactions, totalPages } = await transactionRepo.getTransactions(
    page,
    transactionsPerPage,
    status,
    search
  );

  return (
    <Transactions
      transactions={transactions}
      currentPage={page}
      totalPages={totalPages}
    />
  );
}
