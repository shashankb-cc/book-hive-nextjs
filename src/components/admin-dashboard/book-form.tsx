"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Book,
  User,
  Building2,
  BookOpen,
  Barcode,
  FileText,
  Copy,
} from "lucide-react";
import { IBook } from "@/lib/models";
import { bookSchema, type BookFormData } from "@/lib/zodSchema";

interface BookFormProps {
  onClose: () => void;
  book?: IBook;
  onSubmit: (formData: FormData) => Promise<void>;
}

export default function BookForm({ onClose, book, onSubmit }: BookFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      name: book?.title || "",
      author: book?.author || "",
      publisher: book?.publisher || "",
      genre: book?.genre || "",
      isbn: book?.isbnNo || "",
      pages: book?.numOfPages || 0,
      copies: book?.totalNumOfCopies || 0,
    },
  });

  const onSubmitForm = (data: BookFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value.toString());
    });
    if (book) {
      formData.append("id", book.id.toString());
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">
          {book ? "Update Book" : "Add New Book"}
        </h2>
        <form onSubmit={handleSubmit(onSubmitForm)}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <div className="relative">
                <Book className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Book Name"
                  className="pl-10"
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="author">Author</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="author"
                  {...register("author")}
                  placeholder="Author Name"
                  className="pl-10"
                />
              </div>
              {errors.author && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.author.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="publisher">Publisher</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="publisher"
                  {...register("publisher")}
                  placeholder="Publisher Name"
                  className="pl-10"
                />
              </div>
              {errors.publisher && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.publisher.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="genre">Genre</Label>
              <div className="relative">
                <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="genre"
                  {...register("genre")}
                  placeholder="Book Genre"
                  className="pl-10"
                />
              </div>
              {errors.genre && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.genre.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="isbn">ISBN</Label>
              <div className="relative">
                <Barcode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="isbn"
                  {...register("isbn")}
                  placeholder="ISBN Number"
                  className="pl-10"
                />
              </div>
              {errors.isbn && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.isbn.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="pages">Number of Pages</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="pages"
                  type="number"
                  {...register("pages", { valueAsNumber: true })}
                  placeholder="Number of Pages"
                  className="pl-10"
                />
              </div>
              {errors.pages && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.pages.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="copies">Total Number of Copies</Label>
              <div className="relative">
                <Copy className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  id="copies"
                  type="number"
                  {...register("copies", { valueAsNumber: true })}
                  placeholder="Total Copies"
                  className="pl-10"
                />
              </div>
              {errors.copies && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.copies.message}
                </p>
              )}
            </div>
          </div>

          <div
            className="mt-6 flex justify-en

d space-x-4"
          >
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{book ? "Update Book" : "Add Book"}</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
