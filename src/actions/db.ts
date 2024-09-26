import { books } from "@/drizzle/schema";
import { eq, ilike, or, sql, SQL } from "drizzle-orm";

export function buildWhereConditions(
  search?: string,
  genre?: string
): SQL | undefined {
  const conditions: SQL[] = [];

  if (search) {
    conditions.push(
      or(ilike(books.title, `%${search}%`), ilike(books.isbnNo, `%${search}%`))!
    );
  }

  if (genre) {
    conditions.push(eq(books.genre, genre));
  }

  return conditions.length > 0
    ? sql`${conditions.reduce(
        (acc, condition) => sql`${acc} AND ${condition}`
      )}`
    : undefined;
}
