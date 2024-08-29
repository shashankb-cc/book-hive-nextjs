import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { IBook } from "@/lib/models";

interface BorrowConfirmationDialogProps {
  book: IBook;
  onConfirm: () => void;
  onCancel: () => void;
}

export function BorrowConfirmationDialog({
  book,
  onConfirm,
  onCancel,
}: BorrowConfirmationDialogProps) {
  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Borrowing</DialogTitle>
          <DialogDescription>
            Are you sure you want to borrow &quot;{book.title}&quot; by{" "}
            {book.author}?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onCancel} variant="outline">
            Cancel
          </Button>
          <Button onClick={onConfirm}>Confirm Borrow</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
