"use server";

import { auth, signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import bcrypt from "bcryptjs";
import { db } from "@/actions/db";
import { members } from "@/drizzle/schema";

export async function createUser(formData: FormData) {
  try {
    const firstName = formData.get("firstName") as string;
    const lastName = formData.get("lastName") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;

    const hashedPassword = await bcrypt.hash(password, 12);

    await db.insert(members).values({
      firstName,
      lastName,
      email,
      phoneNumber: phone,
      password: hashedPassword,
      role: "member",
    });

    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Failed to register user" };
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", {
      redirectTo: "/dashboard",
      email: formData.get("email"),
      password: formData.get("password"),
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Server Error, Try again later";
      }
    }
    throw error;
  }
}

export async function handleSignOut() {
  await signOut({ redirectTo: "/login", redirect: true });
}
