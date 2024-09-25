"use server";

import { ProfessorRepository } from "@/repositories/professorRepository";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/drizzle/db";
import { IProfessor, IProfessorBase } from "@/lib/models";

const professorRepository = new ProfessorRepository(db);

export interface ProfessorQueryParams {
  search?: string;
  department?: string;
}

// Fetch all professors based on search query or department
export async function getProfessors() {
  try {
    const session = await auth();
    if (!session) {
      return { error: "Not authenticated" };
    }

    const professors = await professorRepository.getAllProfessors();
    return professors;
  } catch (error) {
    console.error("Error fetching professors:", error);
    return { error: "Failed to fetch professors. Please try again." };
  }
}

// Create a new professor entry
export async function createProfessor(formData: FormData) {
  try {
    const session = await auth();
    if (!session) {
      return { error: "Not authenticated" };
    }

    const professorData: IProfessorBase = {
      name: formData.get("name") as string,
      department: formData.get("department") as string,
      bio: formData.get("bio") as string,
      calendly_link: formData.get("calendlyLink") as string,
    };

    const newProfessor = await professorRepository.createProfessor(
      professorData
    );

    revalidatePath("/admin-dashboard/professors");
    return { success: true, message: "Professor added successfully" };
  } catch (error) {
    console.error("Failed to add professor:", error);
    return { error: "Failed to add professor. Please try again." };
  }
}

// Update an existing professor entry
export async function updateProfessor(formData: FormData) {
  try {
    const session = await auth();
    if (!session) {
      return { error: "Not authenticated" };
    }

    const id = parseInt(formData.get("id") as string);
    const professorData: Partial<IProfessor> = {
      name: formData.get("name") as string,
      department: formData.get("department") as string,
      bio: formData.get("bio") as string,
      calendly_link: formData.get("calendlyLink") as string,
    };

    await professorRepository.updateProfessor(id, professorData);

    revalidatePath("/admin-dashboard/professors");
    return { success: true, message: "Professor updated successfully" };
  } catch (error) {
    console.error("Failed to update professor:", error);
    return { error: "Failed to update professor. Please try again." };
  }
}

// Delete a professor entry
export async function deleteProfessor(id: number) {
  try {
    const session = await auth();
    if (!session) {
      return { error: "Not authenticated" };
    }

    await professorRepository.deleteProfessor(id);

    revalidatePath("/admin-dashboard/professors");
    return { success: true, message: "Professor deleted successfully" };
  } catch (error) {
    console.error("Failed to delete professor:", error);
    return {
      error: "Failed to delete professor. Please try again.",
    };
  }
}

// Get a professor by ID
export async function getProfessorById(id: number): Promise<IProfessor | null> {
  try {
    const professor = await professorRepository.getProfessorById(id);
    return professor;
  } catch (error) {
    console.error("Error fetching professor by ID:", error);
    return null;
  }
}
