import { MySql2Database } from "drizzle-orm/mysql2";
import { books, members, transactions } from "../drizzle/schema";
import { eq, sql, and, desc, or, like, SQL, ilike } from "drizzle-orm";
import { ITransaction, ITransactionBase } from "@/lib/models";
import { formatDate } from "@/lib/utils";
import { MemberRepository } from "./memberRepository";
import { BookRepository } from "./bookRepository";
import { VercelPgDatabase } from "drizzle-orm/vercel-postgres";
import * as schema from "@/drizzle/schema";

export interface DueTransactions {
  id: number;
  memberId: number;
  bookId: number;
  issueDate: string;
  dueDate: string;
  returnDate: string | null;
  status: string;
  bookTitle: string;
  memberName: string;
}

export class TransactionRepository {
  constructor(private db: VercelPgDatabase<typeof schema>) {}

  bookRepo = new BookRepository(this.db);
  memberRepo = new MemberRepository(this.db);

  async create(data: ITransactionBase) {
    try {
      const currentDate = new Date();
      const dueDays = 14;
      const dueDate = new Date(currentDate);
      dueDate.setDate(currentDate.getDate() + dueDays);

      const transaction: Omit<ITransaction, "id"> = {
        ...data,
        issueDate: formatDate(currentDate),
        dueDate: formatDate(dueDate),
        returnDate: null,
        status: "pending",
      };
      const transactionRecord = await this.db.transaction(async (txn) => {
        const [result] = await txn
          .insert(transactions)
          .values(transaction)
          .returning(); //check here for create transaction error

        if (result) {
          const [insertedTransaction] = await txn
            .select()
            .from(transactions)
            .where(eq(transactions.id, result.id));
          return insertedTransaction;
        }
      });
      return transactionRecord;
    } catch (error) {
      throw error;
    }
  }
  async getTransactions(
    page: number,
    transactionsPerPage: number,
    status: string,
    search: string
  ): Promise<{
    transactions: {
      id: number;
      bookTitle: string;
      memberName: string;
      status: "pending" | "issued" | "rejected" | "returned";
    }[];
    totalPages: number;
  }> {
    try {
      const baseQuery = this.db
        .select({
          id: transactions.id,
          bookTitle: books.title,
          memberName: sql<string>`CONCAT(${members.firstName}, ' ', ${members.lastName})`,
          status: transactions.status,
        })
        .from(transactions)
        .innerJoin(books, eq(transactions.bookId, books.id))
        .innerJoin(members, eq(transactions.memberId, members.id));

      const whereCondition = this.buildWhereConditions(status, search);

      const query = whereCondition
        ? baseQuery.where(whereCondition)
        : baseQuery;

      const countQuery = this.db
        .select({ count: sql<number>`count(*)` })
        .from(query.as("subquery"));

      const [{ count }] = await countQuery.execute();

      const totalPages = Math.ceil(count / transactionsPerPage);

      const transactionsResult = await query
        .limit(transactionsPerPage)
        .offset((page - 1) * transactionsPerPage)
        .orderBy(desc(transactions.id))
        .execute();

      return {
        transactions: transactionsResult,
        totalPages,
      };
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  }

  private buildWhereConditions(
    status: string,
    search: string
  ): SQL | undefined {
    const conditions: SQL[] = [];

    if (status && status !== "all") {
      conditions.push(
        eq(
          transactions.status,
          status as "pending" | "issued" | "rejected" | "returned"
        )
      );
    }

    if (search) {
      conditions.push(
        or(
          ilike(books.title, `%${search}%`),
          ilike(members.firstName, `%${search}%`),
          ilike(members.lastName, `%${search}%`)
        )!
      );
    }

    return conditions.length > 0 ? and(...conditions) : undefined;
  }

  async getTransactionsDueTodayAndOverdue(): Promise<{
    dueToday: DueTransactions[];
    overdueTransactions: DueTransactions[];
  }> {
    const today = formatDate(new Date());
    const todaysDate = today.split(",");
    const trimmedDate = todaysDate[1].trim();

    try {
      const allIssuedTransactions = await this.db
        .select({
          id: transactions.id,
          memberId: transactions.memberId,
          bookId: transactions.bookId,
          issueDate: transactions.issueDate,
          dueDate: transactions.dueDate,
          returnDate: transactions.returnDate,
          status: transactions.status,
          bookTitle: books.title,
          memberName: sql<string>`CONCAT(${members.firstName}, ' ', ${members.lastName})`,
        })
        .from(transactions)
        .innerJoin(books, eq(transactions.bookId, books.id))
        .innerJoin(members, eq(transactions.memberId, members.id))
        .where(eq(transactions.status, "issued"));

      const dueToday = allIssuedTransactions.filter((transaction) => {
        const transactionDueDate = transaction.dueDate.split(",")[1].trim();
        return transactionDueDate === trimmedDate;
      });

      const overdueTransactions = allIssuedTransactions.filter(
        (transaction) => {
          const transactionDueDate = transaction.dueDate.split(",")[1].trim();
          return transactionDueDate < trimmedDate;
        }
      );

      return { dueToday, overdueTransactions };
    } catch (error) {
      console.error(
        "Error fetching transactions due today and overdue:",
        error
      );
      throw error;
    }
  }

  async getMemberTransactions(memberId: number): Promise<DueTransactions[]> {
    try {
      const memberTransactions = await this.db
        .select({
          id: transactions.id,
          memberId: transactions.memberId,
          bookId: transactions.bookId,
          issueDate: transactions.issueDate,
          dueDate: transactions.dueDate,
          returnDate: transactions.returnDate,
          status: transactions.status,
          bookTitle: books.title,
          memberName: sql<string>`CONCAT(${members.firstName}, ' ', ${members.lastName})`,
        })
        .from(transactions)
        .innerJoin(books, eq(transactions.bookId, books.id))
        .innerJoin(members, eq(transactions.memberId, members.id))
        .where(eq(transactions.memberId, memberId))
        .orderBy(desc(transactions.issueDate));

      return memberTransactions;
    } catch (error) {
      console.error("Error fetching member transactions:", error);
      throw error;
    }
  }

  async getMemberDueSoonAndOverdueTransactions(memberId: number): Promise<{
    dueSoon: DueTransactions[];
    overdue: DueTransactions[];
  }> {
    const today = new Date();
    const sevenDaysFromNow = new Date(today);
    sevenDaysFromNow.setDate(today.getDate() + 7);

    try {
      const allTransactions = await this.db
        .select({
          id: transactions.id,
          memberId: transactions.memberId,
          bookId: transactions.bookId,
          issueDate: transactions.issueDate,
          dueDate: transactions.dueDate,
          returnDate: transactions.returnDate,
          status: transactions.status,
          bookTitle: books.title,
          memberName: sql<string>`CONCAT(${members.firstName}, ' ', ${members.lastName})`,
        })
        .from(transactions)
        .innerJoin(books, eq(transactions.bookId, books.id))
        .innerJoin(members, eq(transactions.memberId, members.id))
        .where(
          and(
            eq(transactions.memberId, memberId),
            eq(transactions.status, "issued")
          )
        )
        .orderBy(transactions.dueDate);

      const dueSoon = allTransactions.filter((transaction) => {
        const dueDate = new Date(transaction.dueDate);
        return dueDate >= today && dueDate <= sevenDaysFromNow;
      });

      const overdue = allTransactions.filter((transaction) => {
        const dueDate = new Date(transaction.dueDate);
        return dueDate < today;
      });

      return { dueSoon, overdue };
    } catch (error) {
      console.error("Error fetching due soon and overdue transactions:", error);
      throw error;
    }
  }

  async markBookAsReturned(
    transactionId: number
  ): Promise<{ success: boolean; message: string }> {
    try {
      const currentDate = new Date();
      const returnDate = formatDate(currentDate);

      return await this.db.transaction(async (tx) => {
        const [transaction] = await tx
          .select()
          .from(transactions)
          .where(eq(transactions.id, transactionId))
          .limit(1);

        if (!transaction) {
          return { success: false, message: "Transaction not found" };
        }

        if (transaction.status === "returned") {
          return { success: false, message: "Book has already been returned" };
        }

        await tx
          .update(transactions)
          .set({ returnDate, status: "returned" })
          .where(eq(transactions.id, transactionId));

        const [book] = await tx
          .select()
          .from(books)
          .where(eq(books.id, transaction.bookId))
          .limit(1);

        await tx
          .update(books)
          .set({ availableNumberOfCopies: book.availableNumberOfCopies + 1 })
          .where(eq(books.id, transaction.bookId));

        return {
          success: true,
          message: "Book marked as returned successfully",
        };
      });
    } catch (error) {
      console.error("Error marking book as returned:", error);
      return { success: false, message: "Failed to mark book as returned" };
    }
  }

  async getActiveTransactions(): Promise<
    {
      id: number;
      bookTitle: string;
      memberName: string;
      issueDate: string;
      dueDate: string;
      status: string;
    }[]
  > {
    try {
      const activeTransactions = await this.db
        .select({
          id: transactions.id,
          bookTitle: books.title,
          memberName: sql<string>`CONCAT(${members.firstName}, ' ', ${members.lastName})`,
          issueDate: transactions.issueDate,
          dueDate: transactions.dueDate,
          status: transactions.status,
        })
        .from(transactions)
        .innerJoin(books, eq(transactions.bookId, books.id))
        .innerJoin(members, eq(transactions.memberId, members.id))
        .where(
          or(
            eq(transactions.status, "pending"),
            eq(transactions.status, "issued")
          )
        )
        .orderBy(desc(transactions.issueDate));

      return activeTransactions;
    } catch (error) {
      console.error("Error fetching active transactions:", error);
      throw error;
    }
  }

  async updateTransactionStatus(
    id: number,
    status: "issued" | "rejected"
  ): Promise<{ success: boolean; message: string }> {
    try {
      return await this.db.transaction(async (tx) => {
        const [transaction] = await tx
          .select()
          .from(transactions)
          .where(eq(transactions.id, id))
          .limit(1);

        if (!transaction) {
          return { success: false, message: "Transaction not found" };
        }

        if (status === "issued") {
          const [book] = await tx
            .select()
            .from(books)
            .where(eq(books.id, transaction.bookId))
            .limit(1);

          if (book.availableNumberOfCopies < 1) {
            return { success: false, message: "Book is out of stock" };
          }

          await tx
            .update(transactions)
            .set({ status })
            .where(eq(transactions.id, id));

          await tx
            .update(books)
            .set({ availableNumberOfCopies: book.availableNumberOfCopies - 1 })
            .where(eq(books.id, book.id));
        } else if (status === "rejected") {
          await tx
            .update(transactions)
            .set({ status })
            .where(eq(transactions.id, id));
        }

        return { success: true, message: `Transaction ${status} successfully` };
      });
    } catch (error) {
      console.error("Error updating transaction status:", error);
      return { success: false, message: "Failed to update transaction status" };
    }
  }

  async getUserTransactions(userId: number): Promise<
    {
      id: number;
      bookTitle: string;
      author: string;
      status: "pending" | "issued" | "rejected" | "returned";
    }[]
  > {
    try {
      const requests = await this.db
        .select({
          id: transactions.id,
          bookTitle: books.title,
          author: books.author,
          status: transactions.status,
        })
        .from(transactions)
        .innerJoin(books, eq(transactions.bookId, books.id))
        .where(eq(transactions.memberId, userId));

      return requests;
    } catch (error) {
      console.error("Error fetching user transactions:", error);
      throw error;
    }
  }
}
