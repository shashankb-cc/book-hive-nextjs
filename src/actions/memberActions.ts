"use server";

import { MemberRepository } from "@/repositories/memberRepository";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { getFavorites } from "./favoriteActions";
import { db } from "@/drizzle/db";
import { IMember } from "@/lib/models";

const memberRepository = new MemberRepository(db);

export async function getMemberData(searchParams: {
  [key: string]: string | string[] | undefined;
}) {
  try {
    const result = await memberRepository.getMemberData(
      searchParams as { page?: string; search?: string }
    );
    return {
      members: result.members,
      currentPage: result.currentPage,
      totalPages: result.totalPages,
    };
  } catch (error) {
    console.error("Error fetching member data:", error);
    return { error: "Failed to fetch member data" };
  }
}

export async function createMember(prevState: any, formData: FormData) {
  try {
    const result = await memberRepository.createMember(formData);
    if (result === null) {
      revalidatePath("/admin-dashboard/members");
      return { message: "Member created successfully" };
    } else {
      return { error: result };
    }
  } catch (error) {
    console.error("Error creating member:", error);
    return { error: "Failed to create member" };
  }
}

export async function updateMember(prevState: any, formData: FormData) {
  try {
    const id = parseInt(formData.get("id") as string);
    const result = await memberRepository.updateMember(id, formData);
    if (result === null) {
      revalidatePath("/admin-dashboard/members");
      return { message: "Member updated successfully" };
    } else {
      return { error: result };
    }
  } catch (error) {
    console.error("Error updating member:", error);
    return { error: "Failed to update member" };
  }
}

export async function deleteMember(id: number) {
  try {
    const result = await memberRepository.deleteMember(id);
    if (result === null) {
      revalidatePath("/admin-dashboard/members");
      return { message: "Member deleted successfully" };
    } else {
      return { error: result };
    }
  } catch (error) {
    console.error("Error deleting member:", error);
    return { error: "Failed to delete member" };
  }
}

export async function getUserDetails(session: any) {
  try {
    const userDetails = await memberRepository.getUserDetails(session);
    return userDetails;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return { error: "Failed to fetch user details" };
  }
}
export async function findUserByEmail(
  email: string
): Promise<IMember | undefined> {
  try {
    const userDetails = await memberRepository.getMemberByEmail(email);
    return userDetails as IMember;
  } catch (error) {
    console.error("Error fetching user details:", error);
    return undefined;
  }
}

export async function updateProfile(data: any) {
  try {
    await memberRepository.updateProfile(data);
    revalidatePath("/profile");
    return { message: "Profile updated successfully" };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { error: "Failed to update profile" };
  }
}

export async function getProfileData() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: "Not authenticated" };
    }

    const userDetails = await memberRepository.getUserDetails(session);
    const favoritesResult = await getFavorites();

    return {
      success: true,
      data: {
        ...userDetails,
        favorites: favoritesResult.favorites || [],
      },
    };
  } catch (error) {
    console.error("Error fetching profile data:", error);
    return { success: false, error: "Failed to fetch profile data" };
  }
}

export async function updateUserProfile(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { error: "Not authenticated" };
    }

    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      phoneNumber: formData.get("phoneNumber") as string,
      email: session.user.email,
    };
    const result = await updateProfile(data);
    return result;
  } catch (error) {
    console.error("Error updating profile:", error);
    return { error: "Failed to update profile" };
  }
}

export async function changePassword(
  currentPassword: string,
  newPassword: string
) {
  try {
    await memberRepository.changePassword(currentPassword, newPassword);
    return { message: "Password changed successfully" };
  } catch (error) {
    console.error("Error changing password:", error);
    return { error: "Failed to change password" };
  }
}
