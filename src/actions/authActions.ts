"use server";

import {  signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";


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
