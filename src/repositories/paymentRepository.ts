import { and, eq } from "drizzle-orm";
import { IPayment } from "@/lib/models";
import { payments } from "@/drizzle/schema";
import { VercelPgDatabase } from "drizzle-orm/vercel-postgres";
import * as schema from "@/drizzle/schema";
import { db } from "@/drizzle/db";

export class PaymentRepository {
  constructor(private db: VercelPgDatabase<typeof schema>) {}
  async createPayment(payment: Omit<IPayment, "id">) {
    const [createdPayment] = await db
      .insert(payments)
      .values(payment)
      .returning();
    return createdPayment;
  }

  //   async updatePayment(orderId: string, updateData: Partial<IPayment>){
  //     const [updatedPayment] = await db
  //       .update(payments)
  //       .set({ ...updateData, updatedAt: new Date() })
  //       .where(eq(payments.orderId, orderId))
  //       .returning();
  //     return updatedPayment;
  //   }

  async getPaymentByUserAndProfessor(userId: number, professorId: number) {
    const payment = await db
      .select()
      .from(payments)
      .where(
        and(
          eq(payments.userId, userId),
          eq(payments.professorId, professorId),
          eq(payments.status, "paid")
        )
      )
      .limit(1);
    return payment[0];
  }
}
