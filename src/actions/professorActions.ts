"use server";

import { ProfessorRepository } from "@/repositories/professorRepository";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/drizzle/db";
import { IProfessor, IProfessorBase } from "@/lib/models";
import { checkInvitationStatus, fetchUserDetails, sendInvitation, updateProfessorCalendlyInfo } from "@/helpers/calendlyUserEvents";

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
      calendly_link: formData.get("calendly_link") as string,
      email: formData.get("email") as string,
    };

    const newProfessor = await professorRepository.createProfessor(
      professorData
    );
    // After successfully creating the professor, send the invitation
    const email = formData.get("email") as string;
    if (email) {
      await sendInvitation(email);
    }

    revalidatePath("/admin-dashboard/professors");
    return {
      success: true,
      message: "Professor added successfully and Invitation has been sent",
    };
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
      calendly_link: formData.get("calendly_link") as string,
      email: formData.get("email") as string,
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
export async function handleCalendlyStatus(professorId: number, email: string) {
  try {
    const status = await checkInvitationStatus(email);
    if (status.accepted) {
      const userDetails = await fetchUserDetails(status.userUri);
      await updateProfessorCalendlyInfo(
        professorId,
        userDetails.scheduling_url
      );
      return { success: true, calendlyLink: userDetails.scheduling_url };
    } else {
      return { success: false, message: "Invitation not accepted yet" };
    }
  } catch (error) {
    console.error("Error checking invitation status:", error);
    return { success: false, message: "Failed to check invitation status" };
  }
}
