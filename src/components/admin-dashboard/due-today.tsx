"use client";

import React, { useState } from "react";
import { Bell, Book } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DueTransactions } from "@/repositories/transactionRepository";

interface DueBooksDashboardProps {
  dueToday: DueTransactions[] | undefined;
  overdue: DueTransactions[] | undefined;
}

const formatDisplayDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

export default function DueBooksDashboard({
  dueToday,
  overdue,
}: DueBooksDashboardProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [showOverdue, setShowOverdue] = useState(false);

  const transactions = showOverdue ? overdue : dueToday;
  const totalCount = (dueToday?.length || 0) + (overdue?.length || 0);

  const renderContent = () => {
    if (!transactions) {
      return (
        <div className="text-center py-10">
          <Book className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No data available
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {showOverdue
              ? "Overdue book information is not available at the moment."
              : "Due today book information is not available at the moment."}
          </p>
        </div>
      );
    }

    if (transactions.length === 0) {
      return (
        <div className="text-center py-10">
          <Book className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No books {showOverdue ? "overdue" : "due today"}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {showOverdue
              ? "All books have been returned on time."
              : "All books are currently within their due dates."}
          </p>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Book Title</TableHead>
            <TableHead>Member Name</TableHead>
            <TableHead>Issue Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="font-medium">
                {transaction.bookTitle}
              </TableCell>
              <TableCell>{transaction.memberName}</TableCell>
              <TableCell>{formatDisplayDate(transaction.issueDate)}</TableCell>
              <TableCell>{formatDisplayDate(transaction.dueDate)}</TableCell>
              <TableCell>{transaction.status}</TableCell>
              <TableCell>
                <Dialog
                  open={isNotificationOpen}
                  onOpenChange={setIsNotificationOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" className="relative">
                      <Bell className="h-4 w-4" />
                      {totalCount > 0 && (
                        <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full" />
                      )}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Notify User</DialogTitle>
                      <DialogDescription>
                        {`There are ${
                          dueToday?.length || 0
                        } books due today and ${
                          overdue?.length || 0
                        } overdue books.`}
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <header className="bg-white dark:bg-gray-800 shadow mb-6 rounded-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {showOverdue ? "Overdue Books" : "Books Due Today"}
          </h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="show-overdue"
                checked={showOverdue}
                onCheckedChange={setShowOverdue}
              />
              <Label htmlFor="show-overdue">Show Overdue</Label>
            </div>
          </div>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>
            {showOverdue
              ? `Overdue (${overdue?.length || 0})`
              : `Due Today (${dueToday?.length || 0})`}
          </CardTitle>
        </CardHeader>
        <CardContent>{renderContent()}</CardContent>
      </Card>
    </div>
  );
}
