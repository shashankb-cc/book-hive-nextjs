// components/dashboard/RecentlyAdded.tsx
import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { IBook } from "@/lib/models";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface RecentlyAddedProps {
  books: IBook[];
}

export function RecentlyAddedBooks({ books }: RecentlyAddedProps) {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = direction === "left" ? -200 : 200;
      current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="mb-8 relative">
      <h2 className="text-2xl font-semibold mb-4">Recently Added</h2>
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scroll("left")}
          className="mr-2 hidden sm:flex"
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <div
          ref={scrollRef}
          className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide"
        >
          {books.map((book) => (
            <Card key={book.id} className="flex-shrink-0 w-64 sm:w-72">
              <CardContent className="p-4">
                <div className="w-full h-32 bg-primary rounded-md mb-4 flex items-center justify-center">
                  <div className="text-xl font-bold text-white">
                    {book.genre}
                  </div>
                </div>
                <CardTitle className="text-lg font-semibold mb-2">
                  {book.title}
                </CardTitle>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {book.author}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => scroll("right")}
          className="ml-2 hidden sm:flex"
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
