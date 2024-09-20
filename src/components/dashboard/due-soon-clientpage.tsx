"use client";

import { useState } from "react";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, BookIcon, AlertTriangleIcon } from "lucide-react";
import { DueTransactions } from "@/repositories/transactionRepository";

interface DueSoonClientProps {
  initialTransactions: {
    dueSoon: DueTransactions[];
    overdue: DueTransactions[];
  };
}

export default function DueSoonClient({
  initialTransactions,
}: DueSoonClientProps) {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [showOverdue, setShowOverdue] = useState(false);

  const displayTransactions = showOverdue
    ? transactions.overdue
    : transactions.dueSoon;

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          {showOverdue ? "Overdue Books" : "Books Due Soon"}
        </h1>
        <Button onClick={() => setShowOverdue(!showOverdue)}>
          {showOverdue ? "Show Due Soon" : "Show Overdue"}
        </Button>
      </div>
      {displayTransactions.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayTransactions.map((transaction) => (
            <Card key={transaction.id} className="overflow-hidden">
              <CardHeader
                className={`${
                  showOverdue ? "bg-red-500" : "bg-primary"
                } text-primary-foreground`}
              >
                <CardTitle className="flex items-center justify-between">
                  <span className="text-xl">{transaction.bookTitle}</span>
                  <Badge
                    variant={showOverdue ? "destructive" : "secondary"}
                    className="bg-white text-red-500 text-center"
                  >
                    {showOverdue ? "Overdue" : "Due Soon"}
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
                  <div className="flex items-center">
                    <BookIcon className="mr-2 h-4 w-4" />
                    <span className="text-sm">
                      Book Name: {transaction.bookTitle}
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
            <AlertTriangleIcon className="h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-700 mb-2">
              {showOverdue ? "No Overdue Books" : "No Books Due Soon"}
            </h2>
            <p className="text-gray-500 text-center">
              {showOverdue
                ? "Great job! You don't have any overdue books."
                : "You don't have any books due in the next 7 days."}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
