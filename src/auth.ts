import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import bcrypt from "bcrypt";
import { User } from "next-auth";
import Google from "next-auth/providers/google";
import { findUserByEmail } from "./actions/memberActions";
import { MemberRepository } from "./repositories/memberRepository";
import { db } from "./drizzle/db";
import { members } from "./drizzle/schema";

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
          role: "member",
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
          try {
            const member = await findUserByEmail(email);
            if (!member) {
              console.log("User not found");
              return null;
            }
            const passwordsMatch = await bcrypt.compare(
              password,
              member.password
            );
            if (passwordsMatch) {
              const user = mapMemberToUser(member);
              return user;
            } else {
              console.log("Password does not match");
              return null;
            }
          } catch (error) {
            console.error("Error during authorization:", error);
            throw new Error("An error occurred during authorization");
          }
        }
        console.log("Invalid credentials format");
        return null;
      },
    }),
  ],
  callbacks: {
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
    async signIn({ user }) {
      if (!user) return false;
      const foundUser = await findUserByEmail(user.email!);
      if (foundUser) {
        user.role = foundUser.role;
        return true;
      }

      const newUser = await db.insert(members).values({
        firstName: user.name!,
        lastName: "",
        email: user.email!,
        phoneNumber: "",
        password: "",
        role: "member",
        credits: 20,
      });
      user.role = (newUser as any)?.role!;
      return true;
    },
  },
});
