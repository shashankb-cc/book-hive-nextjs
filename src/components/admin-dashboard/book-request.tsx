"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SearchInput from "@/components/dashboard/search-form";
import Pagination from "@/components/dashboard/pagination";
import { useToast } from "@/hooks/use-toast";
import { Check, X } from "lucide-react";
import { auth } from "@/auth";
import { updateTransactionStatus } from "@/actions/transactionActions";

interface Transaction {
  id: number;
  bookTitle: string;
  memberName: string;
  status: "pending" | "issued" | "rejected" | "returned";
}

interface TransactionsProps {
  transactions: Transaction[];
  currentPage: number;
  totalPages: number;
}

export default function Transactions({
  transactions,
  currentPage,
  totalPages,
}: TransactionsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    const params = new URLSearchParams(searchParams);
    if (status !== "all") {
      params.set("status", status);
    } else {
      params.delete("status");
    }
    params.set("page", "1");
    router.push(`/admin-dashboard/book-requests?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/admin-dashboard/book-requests?${params.toString()}`);
  };

  const handleTransactionAction = async (
    id: number,
    action: "issued" | "rejected"
  ) => {
    try {
      const result = await updateTransactionStatus(id, action);

      if (result.success) {
        toast({
          title: "Success",
          description: result.message,
          className: "bg-green-400 text-white",
        });
        router.refresh();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      toast({
        title: "Caution",
        description:
          error instanceof Error
            ? error.message
            : "Failed to update transaction",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <header className="bg-white dark:bg-gray-800 shadow mb-6 rounded-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">
            Transactions
          </h1>
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Select onValueChange={handleStatusChange} value={statusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="issued">Issued</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
              </SelectContent>
            </Select>
            <SearchInput placeholder="Search requests" />
          </div>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>S.No</TableHead>
                <TableHead>Book Title</TableHead>
                <TableHead>Member Name</TableHead>
                <TableHead className="pl-6">Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction, index) => (
                <TableRow key={transaction.id}>
                  <TableCell>{(currentPage - 1) * 10 + index + 1}</TableCell>
                  <TableCell>{transaction.bookTitle}</TableCell>
                  <TableCell>{transaction.memberName}</TableCell>
                  <TableCell className="pl-0">
                    <div className="w-24 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          transaction.status === "pending"
                            ? "bg-yellow-200 text-yellow-800"
                            : transaction.status === "issued"
                            ? "bg-green-200 text-green-800"
                            : transaction.status === "rejected"
                            ? "bg-red-200 text-red-800"
                            : "bg-blue-200 text-blue-800"
                        }`}
                      >
                        {transaction.status.charAt(0).toUpperCase() +
                          transaction.status.slice(1)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {transaction.status === "pending" && (
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-green-500 hover:bg-green-600 text-white"
                          onClick={() =>
                            handleTransactionAction(transaction.id, "issued")
                          }
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="bg-red-500 hover:bg-red-600 text-white"
                          onClick={() =>
                            handleTransactionAction(transaction.id, "rejected")
                          }
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-6 flex justify-center items-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
