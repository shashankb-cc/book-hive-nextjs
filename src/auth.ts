  
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { findUserByEmail } from "@/lib/data";
import { User } from "next-auth";
import Google from "next-auth/providers/google";

function mapMemberToUser(member: {
  id: any;
  firstName: any;
  email: any;
  role: "librarian" | "member";
}): User & { role: string } {
  return {
    id: String(member.id),
    name: member.firstName,
    email: member.email,
    role: member.role,
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      profile(profile) {
        return {
          ...profile,
          role: "librarian",
        };
      },
    }),
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const member = await findUserByEmail(email);
          if (!member) return null;
          const passwordsMatch = await bcrypt.compare(
            password,
            member.password
          );
          if (passwordsMatch) {
            return mapMemberToUser(member);
          }
        }
        console.log("Invalid Credentials Please Recheck ");
        return null;
      },
    }),
  ],
  callbacks: {
    async authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const user = auth?.user.email;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");
      const isOnAdminDashboard =
        nextUrl.pathname.startsWith("/admin-dashboard");
      const isOnLoginPage = nextUrl.pathname === "/login";
      const userRole = auth?.user.role;
      console.log("user role is", userRole);

      if (isOnAdminDashboard) {
        if (isLoggedIn && userRole === "librarian") return true;
        return Response.redirect(new URL("/dashboard", nextUrl));
      } else if (isOnLoginPage) {
        if (isLoggedIn) {
          return Response.redirect(new URL("/dashboard", nextUrl));
        }
        return true;
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
});
