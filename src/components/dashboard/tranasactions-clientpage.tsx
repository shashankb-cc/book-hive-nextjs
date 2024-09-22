"use client";

import { useState } from "react";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, BookIcon, InboxIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Transaction History</h1>
      {transactions && transactions.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {transactions.map((transaction) => (
            <Card key={transaction.id} className="overflow-hidden">
              <CardHeader className="bg-primary text-primary-foreground">
                <CardTitle className="flex items-center justify-between">
                  <span>{transaction.bookTitle}</span>
                  <Badge
                    variant={
                      transaction.status === "returned"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {transaction.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span className="text-sm">
                      Issued: {formatDate(new Date(transaction.issueDate))}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    <span className="text-sm">
                      Due: {formatDate(new Date(transaction.dueDate))}
                    </span>
                  </div>
                  {transaction.returnDate && (
                    <div className="flex items-center">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <span className="text-sm">
                        Returned: {formatDate(new Date(transaction.returnDate))}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center">
                    <BookIcon className="mr-2 h-4 w-4" />
                    <span className="text-sm">
                      Book Title: {transaction.bookTitle}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="mt-6">
          <CardContent className="flex flex-col items-center justify-center py-10">
            <InboxIcon className="h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              No Transactions Yet
            </h2>
            <p className="text-gray-500 text-center mb-4">
              You haven&apos;t borrowed any books yet. Start exploring our
              collection and make your first borrow!
            </p>
            <Link href="/dashboard">
              <Button>Explore Books</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
