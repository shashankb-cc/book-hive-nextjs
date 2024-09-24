"use server";

import { BookRepository } from "@/repositories/bookRepository";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { buildWhereConditions } from "./db";
import { books } from "@/drizzle/schema";
import { desc, sql } from "drizzle-orm";
import { IBook } from "@/lib/models";
import { db } from "@/drizzle/db";

const bookRepository = new BookRepository(db);

export interface BookQueryParams {
  page: number;
  search?: string;
  genre?: string;
  booksPerPage: number;
}

export async function getBooks({
  page,
  search,
  genre,
  booksPerPage,
}: BookQueryParams) {
  const offset = (page - 1) * booksPerPage;

  const whereConditions = buildWhereConditions(search, genre);

  const [{ count }, paginatedBooks, genres, recentlyAddedBooks] =
    await Promise.all([
      db
        .select({ count: sql`count(*)`.mapWith(Number) })
        .from(books)
        .where(whereConditions)
        .execute()
        .then((res) => res[0]),
      db
        .select()
        .from(books)
        .where(whereConditions)
        .limit(booksPerPage)
        .offset(offset)
        .execute(),
      db
        .select({ genre: books.genre })
        .from(books)
        .groupBy(books.genre)
        .execute(),
      db.select().from(books).orderBy(desc(books.id)).limit(3).execute(),
    ]);

  const totalPages = Math.ceil(count / booksPerPage);

  return {
    books: paginatedBooks,
    totalPages,
    genres: genres.map((g) => g.genre),
    recentlyAddedBooks,
  };
}

export async function createBook(prevState: any, formData: FormData) {
  try {
    const session = await auth();
    if (!session) {
      return { error: "Not authenticated" };
    }

    const bookData: Omit<IBook, "id"> = {
      title: formData.get("name") as string,
      author: formData.get("author") as string,
      publisher: formData.get("publisher") as string,
      genre: formData.get("genre") as string,
      isbnNo: formData.get("isbn") as string,
      numOfPages: parseInt(formData.get("pages") as string),
      totalNumOfCopies: parseInt(formData.get("copies") as string),
      availableNumberOfCopies: parseInt(formData.get("copies") as string),
      price: parseInt(formData.get("price") as string),
    };
    const imageFile = formData.get("image") as File;

    const newBook = await bookRepository.createBook(bookData, imageFile);

    revalidatePath("/admin-dashboard/dashboard");
    return { success: true, message: "Book added successfully" };
  } catch (error) {
    console.error("Failed to add book:", error);
    return { error: "Failed to add book. Please try again." };
  }
}

export async function updateBook(prevState: any, formData: FormData) {
  try {
    const session = await auth();
    if (!session) {
      return { error: "Not authenticated" };
    }

    const id = parseInt(formData.get("id") as string);
    const bookData: Partial<IBook> = {
      title: formData.get("name") as string,
      author: formData.get("author") as string,
      publisher: formData.get("publisher") as string,
      genre: formData.get("genre") as string,
      isbnNo: formData.get("isbn") as string,
      numOfPages: parseInt(formData.get("pages") as string),
      totalNumOfCopies: parseInt(formData.get("copies") as string),
    };
    const imageFile = formData.get("image") as File;

    await bookRepository.updateBook(id, bookData, imageFile);

    revalidatePath("/admin-dashboard/dashboard");
    return { success: true, message: "Book updated successfully" };
  } catch (error) {
    console.error("Failed to update book:", error);
    return { error: "Failed to update book. Please try again." };
  }
}

export async function deleteBook(id: number) {
  try {
    const session = await auth();
    if (!session) {
      return { error: "Not authenticated" };
    }

    await bookRepository.deleteBook(id);

    revalidatePath("/admin-dashboard/dashboard");
    return { success: true, message: "Book deleted successfully" };
  } catch (error) {
    console.error("Failed to delete book:", error);
    return {
      error: "Books has been issued to the User, Can't delete the book",
    };
  }
}
export async function getBookById(id: number): Promise<IBook | null> {
  try {
    const bookRepository = new BookRepository(db);
    const book = await bookRepository.getBookById(id);
    return book;
  } catch (error) {
    console.error("Error fetching book by ID:", error);
    return null;
  }
}
