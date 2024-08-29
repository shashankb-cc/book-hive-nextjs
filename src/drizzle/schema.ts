import { relations } from "drizzle-orm";
import {
  bigint,
  int,
  mysqlEnum,
  mysqlTable,
  primaryKey,
  serial,
  varchar,
} from "drizzle-orm/mysql-core";

export const books = mysqlTable("books", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  author: varchar("author", { length: 100 }).notNull(),
  publisher: varchar("publisher", { length: 100 }).notNull(),
  genre: varchar("genre", { length: 100 }).notNull(),
  isbnNo: varchar("isbnNo", { length: 13 }),
  numOfPages: int("numOfPages").notNull(),
  totalNumOfCopies: int("totalNumOfCopies").notNull(),
  availableNumberOfCopies: int("availableNumberOfCopies").notNull(),
});

export const members = mysqlTable("members", {
  id: serial("id").primaryKey(),
  firstName: varchar("firstName", { length: 100 }).notNull(),
  lastName: varchar("lastName", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).unique().notNull(),
  phoneNumber: varchar("phoneNumber", { length: 10 }).notNull(),
  password: varchar("password", { length: 45 }).notNull(),
  role: mysqlEnum("role", ["librarian", "member"]),
});

export const transactions = mysqlTable("transactions", {
  id: serial("id").primaryKey(),
  bookId: int("bookId")
    .references(() => books.id)
    .notNull(),
  memberId: int("memberId")
    .references(() => members.id)
    .notNull(),
  issueDate: varchar("issueDate", { length: 100 }).notNull(),
  dueDate: varchar("dueDate", { length: 100 }).notNull(),
  returnDate: varchar("returnDate", { length: 100 }),
  status: mysqlEnum("status", [
    "pending",
    "issued",
    "rejected",
    "returned",
  ]).notNull(),
});

export const userRefreshTokens = mysqlTable("userRefreshTokens", {
  id: serial("id").primaryKey(),
  memberId: int("memberId")
    .references(() => members.id)
    .notNull(),
  refreshToken: varchar("refreshToken", { length: 255 }).notNull(),
});

export const favorites = mysqlTable(
  "favorites",
  {
    memberId: int("member_id").notNull(),
    bookId: int("book_id").notNull(),
  },
  (table) => ({
    primaryKey: primaryKey(table.memberId, table.bookId),
  })
);

export const favoritesRelations = relations(favorites, ({ one }) => ({
  member: one(members, {
    fields: [favorites.memberId],
    references: [members.id],
  }),
  book: one(books, {
    fields: [favorites.bookId],
    references: [books.id],
  }),
}));

export const membersRelations = relations(members, ({ many }) => ({
  favorites: many(favorites),
}));

export const booksRelations = relations(books, ({ many }) => ({
  favorites: many(favorites),
}));
