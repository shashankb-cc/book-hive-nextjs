import { relations } from "drizzle-orm";
import { primaryKey } from "drizzle-orm/pg-core";
import {
  integer,
  pgEnum,
  pgTable,
  serial,
  text,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

// Define custom enum types
export const roleEnum = pgEnum("role", ["librarian", "member"]);
export const statusEnum = pgEnum("status", [
  "pending",
  "issued",
  "rejected",
  "returned",
]);

export const books = pgTable("books", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 100 }).notNull(),
  author: varchar("author", { length: 100 }).notNull(),
  publisher: varchar("publisher", { length: 100 }).notNull(),
  genre: varchar("genre", { length: 100 }).notNull(),
  isbnNo: varchar("isbnNo", { length: 13 }),
  numOfPages: integer("numOfPages").notNull(),
  totalNumOfCopies: integer("totalNumOfCopies").notNull(),
  availableNumberOfCopies: integer("availableNumberOfCopies").notNull(),
  imageUrl: varchar("imageUrl", { length: 255 }),
  price: integer("price").notNull(),
});

export const members = pgTable(
  "members",
  {
    id: serial("id").primaryKey(),
    firstName: varchar("firstName", { length: 100 }).notNull(),
    lastName: varchar("lastName", { length: 100 }).notNull(),
    email: varchar("email", { length: 100 }).notNull(),
    phoneNumber: varchar("phoneNumber", { length: 10 }).notNull(),
    password: varchar("password", { length: 45 }).notNull(),
    role: roleEnum("role"),
  },
  (table) => ({
    emailIdx: uniqueIndex("email_idx").on(table.email),
  })
);

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  bookId: integer("bookId")
    .references(() => books.id)
    .notNull(),
  memberId: integer("memberId")
    .references(() => members.id)
    .notNull(),
  issueDate: varchar("issueDate", { length: 100 }).notNull(),
  dueDate: varchar("dueDate", { length: 100 }).notNull(),
  returnDate: varchar("returnDate", { length: 100 }),
  status: statusEnum("status").notNull(),
});

export const favorites = pgTable(
  "favorites",
  {
    memberId: integer("member_id")
      .references(() => members.id)
      .notNull(),
    bookId: integer("book_id")
      .references(() => books.id)
      .notNull(),
  },
  (table) => ({
    pk: primaryKey(table.memberId, table.bookId),
  })
);

// export const favoritesRelations = relations(favorites, ({ one }) => ({
//   member: one(members, {
//     fields: [favorites.memberId],
//     references: [members.id],
//   }),
//   book: one(books, {
//     fields: [favorites.bookId],
//     references: [books.id],
//   }),
// }));

// export const membersRelations = relations(members, ({ many }) => ({
//   favorites: many(favorites),
// }));

// export const booksRelations = relations(books, ({ many }) => ({
//   favorites: many(favorites),
// }));
