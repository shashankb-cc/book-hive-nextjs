// lib/BookService.ts
import { books, favorites, members } from "@/drizzle/schema";
import { eq, or, like, sql, SQL, desc, and } from "drizzle-orm";
import { Session } from "next-auth";
import { MySql2Database } from "drizzle-orm/mysql2";
import { IBook } from "@/lib/models";
import { cloudinary } from "@/lib/cloudinary";
import { VercelPgDatabase } from "drizzle-orm/vercel-postgres";
import * as schema from "@/drizzle/schema";

export class BookRepository {
  constructor(private db: VercelPgDatabase<typeof schema>) {}

  private buildWhereConditions(
    search?: string,
    genre?: string
  ): SQL | undefined {
    const conditions: SQL[] = [];

    if (search) {
      conditions.push(
        or(like(books.title, `%${search}%`), like(books.isbnNo, `%${search}%`))!
      );
    }

    if (genre && genre !== "all") {
      conditions.push(eq(books.genre, genre));
    }

    return conditions.length > 0
      ? sql`${conditions.reduce(
          (acc, condition) => sql`${acc} AND ${condition}`
        )}`
      : undefined;
  }

  async getBookData(
    searchParams: { page?: string; search?: string; genre?: string },
    session: Session | null
  ) {
    const page = parseInt(searchParams.page || "1");
    const search = searchParams.search || "";
    const selectedGenre = searchParams.genre || "";
    const booksPerPage = 12;

    const whereConditions = this.buildWhereConditions(search, selectedGenre);

    return await this.db.transaction(async (tx) => {
      const [totalBooks, paginatedBooks, genres, recentBooks] =
        await Promise.all([
          tx
            .select({ count: sql`count(*)`.mapWith(Number) })
            .from(books)
            .where(whereConditions)
            .then((res) => res[0]),
          tx
            .select()
            .from(books)
            .where(whereConditions)
            .limit(booksPerPage)
            .offset((page - 1) * booksPerPage),
          tx.select({ genre: books.genre }).from(books).groupBy(books.genre),
          tx.select().from(books).orderBy(desc(books.id)).limit(4),
        ]);

      const totalPages = Math.ceil(totalBooks.count / booksPerPage);

      return {
        paginatedBooks,
        totalPages,
        genres: genres.map((g) => g.genre),
        recentBooks,
        selectedGenre,
      };
    });
  }

  async uploadImage(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "bookCover",
            resource_type: "auto",
          },
          (error, result) => {
            if (error) {
              reject(new Error("Failed to upload image"));
            } else {
              resolve(result?.secure_url || "");
            }
          }
        )
        .end(buffer);
    });
  }

  async createBook(bookData: Omit<IBook, "id">, imageFile?: File) {
    try {
      let imageUrl = "";
      if (imageFile) {
        imageUrl = await this.uploadImage(imageFile);
      }

      const newBook = await this.db.insert(books).values({
        ...bookData,
        imageUrl,
      });

      return newBook;
    } catch (error) {
      console.error("Error creating book:", error);
      throw error;
    }
  }

  async updateBook(id: number, bookData: Partial<IBook>, imageFile?: File) {
    try {
      let imageUrl = bookData.imageUrl;
      if (imageFile) {
        imageUrl = await this.uploadImage(imageFile);
      }

      const updatedBook = await this.db
        .update(books)
        .set({ ...bookData, imageUrl })
        .where(eq(books.id, id));

      return updatedBook;
    } catch (error) {
      console.error("Error updating book:", error);
      throw error;
    }
  }

  async deleteBook(id: number) {
    try {
      await this.db.delete(books).where(eq(books.id, id));
      return { success: true, message: "Book deleted successfully" };
    } catch (error) {
      console.error("Error deleting book:", error);
      throw error;
    }
  }

  async getBookById(id: number) {
    try {
      const book = await this.db
        .select()
        .from(books)
        .where(eq(books.id, id))
        .limit(1);
      return book[0] || null;
    } catch (error) {
      console.error("Error fetching book by ID:", error);
      throw error;
    }
  }
}
