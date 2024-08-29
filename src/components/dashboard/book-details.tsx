// import React from "react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { IBook } from "@/lib/models";

// interface BookDetailsProps {
//   book: IBook;
//   onClose: () => void;
//   onBorrow: () => void;
// }

// export function BookDetails({ book, onClose, onBorrow }: BookDetailsProps) {
//   return (
//     <Dialog open={true} onOpenChange={onClose}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle className="text-xl">{book.title}</DialogTitle>
//           <DialogDescription>by {book.author}</DialogDescription>
//         </DialogHeader>
//         <div className="py-4">
//           <p>
//             <strong>Genre:</strong> {book.genre}
//           </p>
//           <p>
//             <strong>ISBN:</strong> {book.isbnNo}
//           </p>
//           <p>
//             <strong>Number of Pages:</strong> {book.numOfPages}
//           </p>
//           <p>
//             <strong>Publisher:</strong> {book.publisher}
//           </p>
//           <p>
//             <strong>Available Copies:</strong> {book.availableNumberOfCopies}
//           </p>
//         </div>
//         <DialogFooter>
//           <Button onClick={onClose}>Close</Button>
//           <Button
//             onClick={onBorrow}
//             disabled={book.availableNumberOfCopies === 0}
//           >
//             {book.availableNumberOfCopies > 0 ? "Borrow Book" : "Unavailable"}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

// components/dashboard/book-details.tsx
import { IBook } from "@/lib/models";
import { Heart } from "lucide-react";
import { Button } from "../ui/button";
// ... other imports

interface BookDetailsProps {
  book: IBook;
  onClose: () => void;
  onBorrow: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export function BookDetails({ book, onClose, onBorrow, isFavorite, onToggleFavorite }: BookDetailsProps) {
  // ... existing code

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4">{book.title}</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-2">Author: {book.author}</p>
        <p className="text-gray-600 dark:text-gray-300 mb-2">Genre: {book.genre}</p>
        <p className="text-gray-600 dark:text-gray-300 mb-2">ISBN: {book.isbnNo}</p>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Available Copies: {book.availableNumberOfCopies}
        </p>
        <div className="flex justify-between">
          <Button onClick={onToggleFavorite} variant="outline">
            <Heart className={`w-5 h-5 mr-2 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </Button>
          <Button onClick={onBorrow} disabled={book.availableNumberOfCopies === 0}>
            {book.availableNumberOfCopies > 0 ? "Borrow Book" : "Unavailable"}
          </Button>
        </div>
        <Button onClick={onClose} className="mt-4 w-full">
          Close
        </Button>
      </div>
    </div>
  );
}