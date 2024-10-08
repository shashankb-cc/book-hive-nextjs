"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2, ArrowUpDown } from "lucide-react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import SearchInput from "@/components/dashboard/search-form";
import Pagination from "../dashboard/pagination";
import { IBook } from "@/lib/models";
import { useToast } from "@/hooks/use-toast";
import { deleteBook } from "@/actions/bookActions";

interface AdminDashboardProps {
  books: IBook[];
  currentPage: number;
  totalPages: number;
  genres: string[];
  selectedGenre: string;
}

type SortField =
  | "title"
  | "author"
  | "genre"
  | "isbnNo"
  | "availableNumberOfCopies"
  | "totalNumOfCopies";

export default function AdminDashboard({
  books,
  currentPage,
  totalPages,
  genres,
  selectedGenre,
}: AdminDashboardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [sortField, setSortField] = useState<SortField>("title");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleGenreChange = (genre: string) => {
    const params = new URLSearchParams(searchParams);
    if (genre && genre !== "all") {
      params.set("genre", genre);
    } else {
      params.delete("genre");
    }
    params.set("page", "1");
    router.push(`/admin-dashboard?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`/admin-dashboard?${params.toString()}`);
  };

  const handleDelete = async (id: number) => {
    const result = await deleteBook(id);
    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: result.message || "Book deleted successfully",
        className: "bg-green-800",
      });
    }
    router.refresh();
  };

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedBooks = [...books].sort((a, b) => {
    if (a[sortField]! < b[sortField]!) return sortOrder === "asc" ? -1 : 1;
    if (a[sortField]! > b[sortField]!) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="container mx-auto p-2 sm:p-4 md:p-6">
      <header className="bg-white dark:bg-gray-800 shadow mb-4 sm:mb-6 rounded-lg">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">
            Book Management
          </h1>
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Select
              onValueChange={handleGenreChange}
              value={selectedGenre || "all"}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select Genre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genres</SelectItem>
                {genres.map((genre) => (
                  <SelectItem key={genre} value={genre}>
                    {genre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <SearchInput placeholder="Search books..." />
            <Link href="/admin-dashboard/books/create">
              <Button className="w-full sm:w-auto">Add New Book</Button>
            </Link>
          </div>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Books</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {[
                  "Title",
                  "Author",
                  "Genre",
                  "Isbn No",
                  "Available copies",
                  "Total Copies",
                ].map((header, index) => (
                  <TableHead
                    key={index}
                    className="cursor-pointer"
                    onClick={() =>
                      handleSort(
                        header.toLowerCase().replace(" ", "") as SortField
                      )
                    }
                  >
                    <div className="flex items-center">
                      {header}
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                ))}
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell className="font-medium">{book.title}</TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.genre}</TableCell>
                  <TableCell>{book.isbnNo}</TableCell>
                  <TableCell>{book.availableNumberOfCopies}</TableCell>
                  <TableCell>{book.totalNumOfCopies}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link href={`/admin-dashboard/books/${book.id}/update`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-green-400"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the book &quot;{book.title}
                              &quot; from the database.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(book.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
