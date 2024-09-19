"use client";

import React, { useState, useEffect } from "react";
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
  Image as ImageIcon,
} from "lucide-react";
import { IBook } from "@/lib/models";
import { bookSchema, type BookFormData } from "@/lib/zodSchema";
import Image from "next/image";

interface BookFormProps {
  onClose: () => void;
  book?: IBook;
  onSubmit: (formData: FormData) => Promise<void>;
}

export default function BookForm({ onClose, book, onSubmit }: BookFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
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

  const watchImage = watch("image");

  useEffect(() => {
    if (book?.imageUrl) {
      setImagePreview(book.imageUrl);
    }
  }, [book]);

  useEffect(() => {
    if (watchImage && watchImage.length > 0) {
      const file = watchImage[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [watchImage]);

  const onSubmitForm = (data: BookFormData) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "image" && value instanceof FileList && value.length > 0) {
        formData.append(key, value[0]);
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });
    if (book) {
      formData.append("id", book.id.toString());
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">
          {book ? "Update Book" : "Add New Book"}
        </h2>
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
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
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
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
              <p className="text-sm text-red-500 mt-1">{errors.isbn.message}</p>
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

          <div>
            <Label htmlFor="image">Book Cover Image</Label>
            <div className="relative">
              <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                id="image"
                type="file"
                accept="image/*"
                {...register("image")}
                className="pl-10"
              />
            </div>
            {imagePreview && (
              <div className="mt-2">
                <Image
                  src={imagePreview}
                  alt="Book cover preview"
                  width={200}
                  height={300}
                  className="w-full max-w-[200px] h-auto rounded-md object-cover"
                />
              </div>
            )}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              {book ? "Update Book" : "Add Book"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
