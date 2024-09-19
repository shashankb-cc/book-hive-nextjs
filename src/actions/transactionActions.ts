"use server";

import { TransactionRepository } from "@/repositories/transactionRepository";
import { auth } from "@/auth";
import { MemberRepository } from "@/repositories/memberRepository";
import { db } from "@/drizzle/db";
import { revalidatePath } from "next/cache";

const memberRepository = new MemberRepository(db);
const transactionRepository = new TransactionRepository(db);

export async function updateTransactionStatus(
  id: number,
  status: "issued" | "rejected"
) {
  const result = await transactionRepository.updateTransactionStatus(
    id,
    status
  );
  return result;
}

export async function borrowBook(bookId: number) {
  const session = await auth();
  if (!session?.user?.email) {
    return { success: false, message: "User not authenticated" };
  }

  const member = await memberRepository.getMemberByEmail(session.user.email);
  if (!member) {
    return { success: false, message: "Member not found" };
  }

  try {
    const result = await transactionRepository.create({
      memberId: member.id,
      bookId: bookId,
    });

    if (result) {
      return {
        success: true,
        message: "Book borrow request created successfully",
      };
    } else {
      return { success: false, message: "Failed to create borrow request" };
    }
  } catch (error) {
    console.error("Error borrowing book:", error);
    return { success: false, message: "Failed to borrow book" };
  }
}

export async function getUserTransactions() {
  const session = await auth();
  if (!session?.user?.email) {
    return null;
  }
  const authenticatedUser = await memberRepository.getMemberByEmail(
    session?.user?.email
  );
  return await transactionRepository.getUserTransactions(
    authenticatedUser?.id!
  );
}

export async function getTransactionsDueToday() {
  try {
    const dueTransactions =
      await transactionRepository.getTransactionsDueTodayAndOverdue();
    return dueTransactions;
  } catch (error) {
    console.error("Error fetching transactions due today:", error);
  }
}

export async function getMemberTransactions() {
  try {
    const session = await auth();
    const member = await memberRepository.getMemberByEmail(
      session?.user?.email!
    );
    const memberTransactions =
      await transactionRepository.getMemberTransactions(member?.id!);
    return memberTransactions;
  } catch (error) {
    console.log("Error fetching individual transactions");
  }
}

export async function getMemberDueSoonAndOverdueTransactions() {
  const session = await auth();
  const member = await memberRepository.getMemberByEmail(session?.user?.email!);
  if (!member) {
    return null;
  }

  return await transactionRepository.getMemberDueSoonAndOverdueTransactions(
    member.id
  );
}
export async function cancelBookRequest(id: number) {
  try {
    const session = await auth();
    if (!session) {
      return { success: false, message: "Not authenticated" };
    }

    const result = await transactionRepository.cancelTransaction(id);

    if (result.success) {
      revalidatePath("/dashboard/my-collection");
    }

    return result;
  } catch (error) {
    console.error("Failed to cancel book request:", error);
    return {
      success: false,
      message: "Failed to cancel book request. Please try again.",
    };
  }
}

export async function markBookAsReturned(transactionId: number) {
  return await transactionRepository.markBookAsReturned(transactionId);
}

export async function getActiveTransactions() {
  return await transactionRepository.getActiveTransactions();
}
