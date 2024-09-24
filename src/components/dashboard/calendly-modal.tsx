"use client";

import { InlineWidget } from "react-calendly";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CalendlyModalProps {
  isOpen: boolean;
  onClose: () => void;
  calendlyLink: string;
  professorName: string;
}

export function CalendlyModal({
  isOpen,
  onClose,
  calendlyLink,
  professorName,
}: CalendlyModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Schedule a meeting with {professorName}</DialogTitle>
        </DialogHeader>
        <InlineWidget
          url={calendlyLink}
          styles={{
            height: "630px",
            minWidth: "320px",
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
