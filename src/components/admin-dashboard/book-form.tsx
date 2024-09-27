"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
  AlertCircle,
} from "lucide-react";
import { IBook } from "@/lib/models";
import { bookSchema, type BookFormData } from "@/lib/zodSchema";
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { createBook, updateBook } from "@/actions/bookActions";

interface BookFormProps {
  book?: IBook;
}

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png"];

export default function BookForm({ book }: BookFormProps) {
  const router = useRouter();
  const { id } = useParams();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
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
      price: book?.price || 200,
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
      if (file.size > MAX_FILE_SIZE) {
        setFileError("File size must be less than 2MB");
        return;
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setFileError("Only .jpg and .png files are allowed");
        return;
      }
      setFileError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [watchImage]);

  const onSubmit = async (data: BookFormData) => {
    if (fileError) {
      return;
    }
    const formData = new FormData();
    if (book) formData.append("id", id as string);
    Object.entries(data).forEach(([key, value]) => {
      if (key === "image" && value instanceof FileList && value.length > 0) {
        formData.append(key, value[0]);
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    try {
      const action = book ? updateBook : createBook;
      const result = await action(null, formData);
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description:
            result.message ||
            (book ? "Book updated successfully" : "Book created successfully"),
          className: "bg-green-400 text-white",
        });
        router.push("/admin-dashboard");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setFileError("File size must be less than 2MB");
      } else if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
        setFileError("Only .jpg and .png files are allowed");
      } else {
        setFileError(null);
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setImagePreview(null);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {book ? "Edit Book" : "Add New Book"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Book Title</Label>
                <div className="relative">
                  <Book className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="name"
                    {...register("name")}
                    placeholder="Book Title"
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
            </div>

            <div className="space-y-4">
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
              <div>
                <Label htmlFor="price">Price</Label>
                <div className="relative">
                  <Copy className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    id="price"
                    type="number"
                    {...register("price", { valueAsNumber: true })}
                    placeholder="Price of th book"
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
                    accept=".jpg,.jpeg,.png"
                    {...register("image")}
                    className="pl-10"
                    onChange={handleImageChange}
                  />
                </div>
                {fileError && (
                  <Alert variant="destructive" className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{fileError}</AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          </div>

          {imagePreview && !fileError && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Image Preview</h3>
              <Image
                src={imagePreview}
                alt="Book cover preview"
                width={200}
                height={300}
                className="w-full max-w-[200px] h-auto rounded-md object-cover"
              />
            </div>
          )}

          <div className="flex justify-end space-x-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!!fileError}>
              {book ? "Update Book" : "Add Book"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
