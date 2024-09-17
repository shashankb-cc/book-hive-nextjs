// "use server";
// import bcrypt from "bcryptjs";
// import { drizzle } from "drizzle-orm/mysql2";
// import mysql from "mysql2/promise";
// import { books, members } from "@/drizzle/schema"; // Import your members schema
// import { AppEnvs } from "../../read-env";
// import { auth, signIn, signOut } from "@/auth";
// import { AuthError } from "next-auth";
// import { redirect } from "next/navigation";
// import { IBook, IMember, IMemberBase } from "./models";
// import { eq, like, or, sql, SQL, desc } from "drizzle-orm";
// import { BookRepository } from "@/repositories/bookRepository";
// import { revalidatePath } from "next/cache";
// import { getDrizzleDB } from "@/drizzle/drizzleDB";
// import { MemberRepository } from "@/repositories/memberRepository";
// import {
//   DueTransactions,
//   TransactionRepository,
// } from "@/repositories/transactionRepository";
// import { Session } from "inspector";
// import { findUserByEmail } from "./data";
// // Create MySQL pool and connect to the database
// const db = getDrizzleDB();
// const session = await auth();
// const bookRepository = new BookRepository(db);
// // const bookRequestsRepo = new BookRequestsRepository(db);
// const memberRepository = new MemberRepository(db);
// const transactionRepository = new TransactionRepository(db);
// export async function createUser(formData: FormData) {
//   try {
//     const firstName = formData.get("firstName") as string;
//     const lastName = formData.get("lastName") as string;
//     const email = formData.get("email") as string;
//     const phone = formData.get("phone") as string;
//     const password = formData.get("password") as string;

//     const hashedPassword = await bcrypt.hash(password, 12);

//     await db.insert(members).values({
//       firstName,
//       lastName,
//       email,
//       phoneNumber: phone,
//       password: hashedPassword,
//       role: "member",
//     });

//     return { success: true };
//   } catch (error) {
//     console.error(error);
//     return { success: false, error: "Failed to register user" };
//   }
// }
// export async function authenticate(
//   prevState: string | undefined,
//   formData: FormData
// ) {
//   try {
//     await signIn("credentials", {
//       redirectTo: "/dashboard",
//       email: formData.get("email"),
//       password: formData.get("password"),
//     });
//   } catch (error) {
//     if (error instanceof AuthError) {
//       switch (error.type) {
//         case "CredentialsSignin":
//           return "Invalid credentials.";
//         default:
//           return "Server Error, Try again later";
//       }
//     }
//     throw error;
//   }
// }
// export async function handleSignOut() {
//   await signOut({ redirectTo: "/login", redirect: true });
// }

// //Books repository actions
// export interface BookQueryParams {
//   page: number;
//   search?: string;
//   genre?: string;
//   booksPerPage: number;
// }

// function buildWhereConditions(
//   search?: string,
//   genre?: string
// ): SQL | undefined {
//   const conditions: SQL[] = [];

//   if (search) {
//     conditions.push(
//       or(like(books.title, `%${search}%`), like(books.isbnNo, `%${search}%`))!
//     );
//   }

//   if (genre) {
//     conditions.push(eq(books.genre, genre));
//   }

//   return conditions.length > 0
//     ? sql`${conditions.reduce(
//         (acc, condition) => sql`${acc} AND ${condition}`
//       )}`
//     : undefined;
// }

// export async function getBooks({
//   page,
//   search,
//   genre,
//   booksPerPage,
// }: BookQueryParams) {
//   const offset = (page - 1) * booksPerPage;

//   const whereConditions = buildWhereConditions(search, genre);

//   const [{ count }, paginatedBooks, genres, recentlyAddedBooks] =
//     await Promise.all([
//       db
//         .select({ count: sql`count(*)`.mapWith(Number) })
//         .from(books)
//         .where(whereConditions)
//         .execute()
//         .then((res) => res[0]),
//       db
//         .select()
//         .from(books)
//         .where(whereConditions)
//         .limit(booksPerPage)
//         .offset(offset)
//         .execute(),
//       db
//         .select({ genre: books.genre })
//         .from(books)
//         .groupBy(books.genre)
//         .execute(),
//       db.select().from(books).orderBy(desc(books.id)).limit(3).execute(),
//     ]);

//   const totalPages = Math.ceil(count / booksPerPage);

//   return {
//     books: paginatedBooks,
//     totalPages,
//     genres: genres.map((g) => g.genre),
//     recentlyAddedBooks,
//   };
// }

// export async function createBook(prevState: any, formData: FormData) {
//   try {
//     const session = await auth();
//     if (!session) {
//       return { error: "Not authenticated" };
//     }

//     const bookData: Omit<IBook, "id"> = {
//       title: formData.get("name") as string,
//       author: formData.get("author") as string,
//       publisher: formData.get("publisher") as string,
//       genre: formData.get("genre") as string,
//       isbnNo: formData.get("isbn") as string,
//       numOfPages: parseInt(formData.get("pages") as string),
//       totalNumOfCopies: parseInt(formData.get("copies") as string),
//       availableNumberOfCopies: parseInt(formData.get("copies") as string),
//     };

//     const newBook = await bookRepository.createBook(bookData);

//     revalidatePath("/admin-dashboard/dashboard");
//     return { success: true, message: "Book added successfully" };
//   } catch (error) {
//     console.error("Failed to add book:", error);
//     return { error: "Failed to add book. Please try again." };
//   }
// }

// export async function updateBook(prevState: any, formData: FormData) {
//   try {
//     const session = await auth();
//     if (!session) {
//       return { error: "Not authenticated" };
//     }

//     const id = parseInt(formData.get("id") as string);
//     const bookData: Partial<IBook> = {
//       title: formData.get("name") as string,
//       author: formData.get("author") as string,
//       publisher: formData.get("publisher") as string,
//       genre: formData.get("genre") as string,
//       isbnNo: formData.get("isbn") as string,
//       numOfPages: parseInt(formData.get("pages") as string),
//       totalNumOfCopies: parseInt(formData.get("copies") as string),
//     };

//     await bookRepository.updateBook(id, bookData);

//     revalidatePath("/admin-dashboard/dashboard");
//     return { success: true, message: "Book updated successfully" };
//   } catch (error) {
//     console.error("Failed to update book:", error);
//     return { error: "Failed to update book. Please try again." };
//   }
// }

// export async function deleteBook(id: number) {
//   try {
//     const session = await auth();
//     if (!session) {
//       return { error: "Not authenticated" };
//     }

//     await bookRepository.deleteBook(id);

//     revalidatePath("/admin-dashboard/dashboard");
//     return { success: true, message: "Book deleted successfully" };
//   } catch (error) {
//     console.error("Failed to delete book:", error);
//     return { error: "Failed to delete book. Please try again." };
//   }
// }

// //member repository actions
// export async function getMemberData(searchParams: {
//   [key: string]: string | string[] | undefined;
// }) {
//   try {
//     const result = await memberRepository.getMemberData(
//       searchParams as { page?: string; search?: string }
//     );
//     return {
//       members: result.members,
//       currentPage: result.currentPage,
//       totalPages: result.totalPages,
//     };
//   } catch (error) {
//     console.error("Error fetching member data:", error);
//     return { error: "Failed to fetch member data" };
//   }
// }

// export async function createMember(prevState: any, formData: FormData) {
//   try {
//     const result = await memberRepository.createMember(formData);
//     if (result === null) {
//       revalidatePath("/admin-dashboard/members");
//       return { message: "Member created successfully" };
//     } else {
//       return { error: result };
//     }
//   } catch (error) {
//     console.error("Error creating member:", error);
//     return { error: "Failed to create member" };
//   }
// }

// export async function updateMember(prevState: any, formData: FormData) {
//   try {
//     const id = parseInt(formData.get("id") as string);
//     const result = await memberRepository.updateMember(id, formData);
//     if (result === null) {
//       revalidatePath("/admin-dashboard/members");
//       return { message: "Member updated successfully" };
//     } else {
//       return { error: result };
//     }
//   } catch (error) {
//     console.error("Error updating member:", error);
//     return { error: "Failed to update member" };
//   }
// }

// export async function deleteMember(id: number) {
//   try {
//     const result = await memberRepository.deleteMember(id);
//     if (result === null) {
//       revalidatePath("/admin-dashboard/members");
//       return { message: "Member deleted successfully" };
//     } else {
//       return { error: result };
//     }
//   } catch (error) {
//     console.error("Error deleting member:", error);
//     return { error: "Failed to delete member" };
//   }
// }

// export async function getUserDetails(session: any) {
//   try {
//     const userDetails = await memberRepository.getUserDetails(session);
//     return userDetails;
//   } catch (error) {
//     console.error("Error fetching user details:", error);
//     return { error: "Failed to fetch user details" };
//   }
// }

// export async function updateProfile(data: any) {
//   try {
//     await memberRepository.updateProfile(data);
//     revalidatePath("/profile");
//     return { message: "Profile updated successfully" };
//   } catch (error) {
//     console.error("Error updating profile:", error);
//     return { error: "Failed to update profile" };
//   }
// }
// export async function getProfileData() {
//   try {
//     const session = await auth();
//     if (!session?.user?.email) {
//       return { success: false, error: "Not authenticated" };
//     }

//     const userDetails = await memberRepository.getUserDetails(session);
//     const favoritesResult = await getFavorites();

//     return {
//       success: true,
//       data: {
//         ...userDetails,
//         favorites: favoritesResult.favorites || [],
//       },
//     };
//   } catch (error) {
//     console.error("Error fetching profile data:", error);
//     return { success: false, error: "Failed to fetch profile data" };
//   }
// }

// export async function updateUserProfile(formData: FormData) {
//   try {
//     const session = await auth();
//     if (!session?.user?.email) {
//       return { error: "Not authenticated" };
//     }

//     const data = {
//       firstName: formData.get("firstName") as string,
//       lastName: formData.get("lastName") as string,
//       phoneNumber: formData.get("phoneNumber") as string,
//       email: session.user.email,
//     };
//     const result = await updateProfile(data);
//     return result;
//   } catch (error) {
//     console.error("Error updating profile:", error);
//     return { error: "Failed to update profile" };
//   }
// }

// export async function changePassword(
//   currentPassword: string,
//   newPassword: string
// ) {
//   try {
//     await memberRepository.changePassword(currentPassword, newPassword);
//     return { message: "Password changed successfully" };
//   } catch (error) {
//     console.error("Error changing password:", error);
//     return { error: "Failed to change password" };
//   }
// }

// //bookrequests actions
// // export async function updateBookRequestStatus(
// //   id: number,
// //   status: "approved" | "rejected"
// // ) {
// //   const result = await bookRequestsRepo.updateBookRequestStatus(id, status);
// //   return result;
// // }
// //replaced mathod for above
// export async function updateTransactionStatus(
//   id: number,
//   status: "issued" | "rejected"
// ) {
//   const result = await transactionRepository.updateTransactionStatus(
//     id,
//     status
//   );
//   return result;
// }

// // export async function borrowBook(bookId: number) {
// //   const session = await auth();
// //   if (!session?.user?.email) {
// //     return { success: false, message: "User not authenticated" };
// //   }

// //   return await bookRequestsRepo.borrowBook(bookId, session.user.email);
// // }
// //replaced method for above
// export async function borrowBook(bookId: number) {
//   const session = await auth();
//   if (!session?.user?.email) {
//     return { success: false, message: "User not authenticated" };
//   }

//   const member = await memberRepository.getMemberByEmail(session.user.email);
//   if (!member) {
//     return { success: false, message: "Member not found" };
//   }

//   try {
//     const result = await transactionRepository.create({
//       memberId: member.id,
//       bookId: bookId,
//     });

//     if (result) {
//       return {
//         success: true,
//         message: "Book borrow request created successfully",
//       };
//     } else {
//       return { success: false, message: "Failed to create borrow request" };
//     }
//   } catch (error) {
//     console.error("Error borrowing book:", error);
//     return { success: false, message: "Failed to borrow book" };
//   }
// }
// // export async function getBookRequests() {
// //   const session = await auth();
// //   if (!session?.user?.email) {
// //     return null;
// //   }
// //   const authenticatedUser = await memberRepository.getMemberByEmail(
// //     session?.user?.email
// //   );
// //   return await bookRequestsRepo.getUserBookRequests(authenticatedUser?.id!);
// // }
// //replaced method for above
// export async function getUserTransactions() {
//   const session = await auth();
//   if (!session?.user?.email) {
//     return null;
//   }
//   const authenticatedUser = await memberRepository.getMemberByEmail(
//     session?.user?.email
//   );
//   return await transactionRepository.getUserTransactions(
//     authenticatedUser?.id!
//   );
// }

// //transaction reposiroty actions
// export async function getTransactionsDueToday(): Promise<{
//   dueToday: DueTransactions[];
//   overdueTransactions: DueTransactions[];
// } | void> {
//   try {
//     const dueTransactions =
//       await transactionRepository.getTransactionsDueTodayAndOverdue();
//     return dueTransactions;
//   } catch (error) {
//     console.error("Error fetching transactions due today:", error);
//   }
// }
// export async function getMemberTransactions(): Promise<
//   DueTransactions[] | undefined
// > {
//   try {
//     const member = await memberRepository.getMemberByEmail(
//       session?.user?.email!
//     );
//     const memberTransactions =
//       await transactionRepository.getMemberTransactions(member?.id!);
//     return memberTransactions;
//   } catch (error) {
//     console.log("Error fetching a individual transactions");
//   }
// }
// export async function getMemberDueSoonAndOverdueTransactions() {
//   const member = await memberRepository.getMemberByEmail(session?.user?.email!);
//   if (!member) {
//     return null;
//   }

//   return await transactionRepository.getMemberDueSoonAndOverdueTransactions(
//     member.id
//   );
// }
// export async function markBookAsReturned(transactionId: number) {
//   return await transactionRepository.markBookAsReturned(transactionId);
// }
// export async function getActiveTransactions() {
//   return await transactionRepository.getActiveTransactions();
// }

// //favorites actions
// export async function addFavorite(bookId: number) {
//   const member = await memberRepository.getMemberByEmail(session?.user?.email!);
//   if (!member) {
//     return { error: "Member not found" };
//   }

//   await memberRepository.addFavorite(member.id, bookId);
//   return { success: true };
// }

// export async function removeFavorite(bookId: number) {
//   const member = await memberRepository.getMemberByEmail(session?.user?.email!);
//   if (!member) {
//     return { error: "Member not found" };
//   }

//   await memberRepository.removeFavorite(member.id, bookId);
//   return { success: true };
// }

// export async function getFavorites() {
//   const member = await memberRepository.getMemberByEmail(session?.user?.email!);
//   if (!member) {
//     return { error: "Member not found" };
//   }

//   const favorites = await memberRepository.getFavorites(member.id);
//   return { favorites };
// }
