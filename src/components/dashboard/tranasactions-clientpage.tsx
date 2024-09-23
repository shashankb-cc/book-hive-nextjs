"use client";

import { useState } from "react";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InboxIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Pagination from "@/components/dashboard/pagination"; // Using the new Pagination component

interface Transaction {
  id: number;
  bookTitle: string;
  status: string;
  issueDate: string;
  dueDate: string;
  returnDate?: string | null;
}

interface HistoryClientProps {
  initialTransactions: Transaction[];
}

export default function HistoryClient({
  initialTransactions,
}: HistoryClientProps) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [currentPage, setCurrentPage] = useState(1);
  const t = useTranslations("Transactions");
  const itemsPerPage = 10;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTransactions = transactions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(transactions.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold text-center mb-6">{t("title")}</h1>
      {transactions && transactions.length > 0 ? (
        <Card>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("bookTitle")}</TableHead>
                    <TableHead>{t("status.name")}</TableHead>
                    <TableHead>{t("issued")}</TableHead>
                    <TableHead>{t("due")}</TableHead>
                    <TableHead>{t("returned")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.bookTitle}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            transaction.status === "returned"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {t(`status.${transaction.status}`)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {formatDate(new Date(transaction.issueDate))}
                      </TableCell>
                      <TableCell>
                        {formatDate(new Date(transaction.dueDate))}
                      </TableCell>
                      <TableCell>
                        {transaction.returnDate
                          ? formatDate(new Date(transaction.returnDate))
                          : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="mt-6">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <InboxIcon
              className="h-16 w-16 text-gray-400 mb-4"
              aria-hidden="true"
            />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              {t("noTransactions")}
            </h2>
            <p className="text-gray-500 text-center mb-4">
              {t("noTransactionsMessage")}
            </p>
            <Link href="/dashboard">
              <Button>{t("exploreBooks")}</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
