
import { books } from "@/drizzle/schema";
import { eq, like, or, sql, SQL } from "drizzle-orm";
import { getDrizzleDB } from "@/drizzle/drizzleDB";

export const db = getDrizzleDB();

export function buildWhereConditions(
  search?: string,
  genre?: string
): SQL | undefined {
  const conditions: SQL[] = [];

  if (search) {
    conditions.push(
      or(like(books.title, `%${search}%`), like(books.isbnNo, `%${search}%`))!
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
