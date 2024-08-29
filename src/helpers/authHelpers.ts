import { auth } from "@/auth";

export async function getAuthenticatedUser() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Not authenticated");
  }
  return session.user;
}
