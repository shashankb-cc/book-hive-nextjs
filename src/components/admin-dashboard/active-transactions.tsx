// components/admin-dashboard/active-transactions.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
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
import { useToast } from "@/hooks/use-toast";
import { markBookAsReturned } from "@/actions/transactionActions";

interface Transaction {
  id: number;
  bookTitle: string;
  memberName: string;
  issueDate: string | null;
  dueDate: string | null;
}

interface ActiveTransactionsProps {
  transactions: Transaction[];
}

export default function ActiveTransactions({
  transactions,
}: ActiveTransactionsProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleMarkAsReturned = async (id: number) => {
    try {
      const result = await markBookAsReturned(id);

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
            : "Failed to mark book as returned",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="">
        <CardTitle>Active Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Book Title</TableHead>
              <TableHead>Member Name</TableHead>
              <TableHead>Issue Date</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>{transaction.bookTitle}</TableCell>
                <TableCell>{transaction.memberName}</TableCell>
                <TableCell>{transaction.issueDate}</TableCell>
                <TableCell>{transaction.dueDate}</TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    variant="outline"
                    className="bg-green-500 hover:bg-green-600 text-white"
                    onClick={() => handleMarkAsReturned(transaction.id)}
                  >
                    Mark as Returned
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
