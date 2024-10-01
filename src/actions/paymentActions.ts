"use server";
import { db } from "@/drizzle/db";
import { IPayment } from "@/lib/models";
import { PaymentRepository } from "@/repositories/paymentRepository";

const paymentRepository = new PaymentRepository(db);
export const createPayment = async (payment: Omit<IPayment, "id">) => {
  try {
    return await paymentRepository.createPayment(payment);
  } catch (error) {
    console.error("Error creating payment:", error);
    throw new Error("Failed to create payment");
  }
};

// export const updatePayment = async (
//   orderId: string,
//   updateData: Partial<IPayment>
// ) => {
//   try {
//     return await paymentRepository.updatePayment(orderId, updateData);
//   } catch (error) {
//     console.error("Error updating payment:", error);
//     throw new Error("Failed to update payment");
//   }
// };

export const checkPaymentStatus = async (
  userId: number,
  professorId: number
) => {
  try {
    const payment = await paymentRepository.getPaymentByUserAndProfessor(
      userId,
      professorId
    );
    return payment;
  } catch (error) {
    console.error("Error checking payment status:", error);
    throw new Error("Failed to check payment status");
  }
};
