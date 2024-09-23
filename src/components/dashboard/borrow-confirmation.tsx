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
import { useTranslations } from "next-intl";

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
  const t = useTranslations("BorrowConfirmation");

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>
            {t("description", { title: book.title, author: book.author })}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onCancel} variant="outline">
            {t("cancel")}
          </Button>
          <Button onClick={onConfirm}>{t("confirm")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
