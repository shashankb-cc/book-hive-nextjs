import { DefaultSession } from "next-auth";
import { Session } from "next-auth";
import "next-auth/jwt";
declare module "next-auth" {
  interface User {
    role: "librarian" | "member";
  } //id username email //role
  interface Session extends DefaultSession {
    user: {
      id: number;
      role: "librarian" | "member";
    } & DefaultSession["user"];
  }

  interface Session {
    role: "librarian" | "member";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: "librarian" | "member";
  }
}
