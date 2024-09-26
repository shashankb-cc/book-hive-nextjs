"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pageNumbers = [];

    if (totalPages <= 5) {
      // If 5 or fewer pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first two and last two pages
      pageNumbers.push(1, 2);

      if (currentPage > 3 && currentPage < totalPages - 2) {
        // If current page is not in the first 3 or last 3, add ellipsis and current page
        pageNumbers.push("...", currentPage);
      } else if (currentPage <= 3) {
        // If in first 3 pages, show 3 and 4
        pageNumbers.push(3);
        if (totalPages > 3) pageNumbers.push(4);
      } else {
        // If in last 3 pages, show third and second to last
        pageNumbers.push("...");
      }

      if (currentPage >= totalPages - 2) {
        // If in last 3 pages, show third and second to last
        pageNumbers.push(totalPages - 2, totalPages - 1);
      } else if (currentPage < totalPages - 2) {
        // If not in last 3 pages, add ellipsis
        pageNumbers.push("...");
      }

      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <nav
      className="flex items-center justify-center space-x-2 h-4"
      aria-label="Pagination"
    >
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <div className="flex items-center space-x-1">
        {getPageNumbers().map((pageNumber, index) => (
          <React.Fragment key={index}>
            {pageNumber === "..." ? (
              <span className="px-2">...</span>
            ) : (
              <Button
                variant={currentPage === pageNumber ? "default" : "outline"}
                size="default"
                onClick={() =>
                  typeof pageNumber === "number" && onPageChange(pageNumber)
                }
                disabled={currentPage === pageNumber}
                aria-label={`Go to page ${pageNumber}`}
                aria-current={currentPage === pageNumber ? "page" : undefined}
              >
                {pageNumber}
              </Button>
            )}
          </React.Fragment>
        ))}
      </div>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="Go to next page"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </nav>
  );
}