import { professors } from "@/drizzle/schema";
import { eq } from "drizzle-orm";
import { VercelPgDatabase } from "drizzle-orm/vercel-postgres";
import * as schema from "@/drizzle/schema";
import { IProfessor, IProfessorBase } from "@/lib/models";

export class ProfessorRepository {
  constructor(private db: VercelPgDatabase<typeof schema>) {}

  async getAllProfessors(): Promise<IProfessor[]> {
    try {
      const allProfessors = await this.db
        .select()
        .from(professors)
        .orderBy(professors.name);
      return allProfessors;
    } catch (error) {
      console.error("Error fetching all professors:", error);
      throw error;
    }
  }

  async getProfessorById(id: number): Promise<IProfessor | null> {
    try {
      const professor = await this.db
        .select()
        .from(professors)
        .where(eq(professors.id, id))
        .limit(1);
      return professor[0] || null;
    } catch (error) {
      console.error("Error fetching professor by ID:", error);
      throw error;
    }
  }

  async createProfessor(professor: IProfessorBase): Promise<IProfessor> {
    try {
      const newProfessor = await this.db
        .insert(professors)
        .values(professor)
        .returning();
      return newProfessor[0];
    } catch (error) {
      console.error("Error creating professor:", error);
      throw error;
    }
  }

  async updateProfessor(
    id: number,
    professor: Partial<IProfessor>
  ): Promise<IProfessor | null> {
    try {
      const updatedProfessor = await this.db
        .update(professors)
        .set(professor)
        .where(eq(professors.id, id))
        .returning();
      return updatedProfessor[0] || null;
    } catch (error) {
      console.error("Error updating professor:", error);
      throw error;
    }
  }

  async deleteProfessor(
    id: number
  ): Promise<{ success: boolean; message: string }> {
    try {
      await this.db.delete(professors).where(eq(professors.id, id));
      return { success: true, message: "Professor deleted successfully" };
    } catch (error) {
      console.error("Error deleting professor:", error);
      throw error;
    }
  }
}
