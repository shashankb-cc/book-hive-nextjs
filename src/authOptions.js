import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

import { getDrizzleDB } from "./drizzle/drizzleDB";
import { MemberRepository } from "./repositories/memberRepository";

const db = getDrizzleDB();
const memberRepository = new MemberRepository(db);

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const { email, password } = credentials;

        try {
          const user = await memberRepository.getMemberByEmail(email);
          if (!user) {
            console.error("User not found");
            return null;
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);
          if (!isPasswordValid) {
            console.error("Invalid password");
            return null;
          }

          return { id: user.id, email: user.email };
        } catch (error) {
          console.error("Error during authorization:", error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.AUTH_SECRET,

  callbacks: {
    async jwt({ token, user, profile }) {
      if (user) {
        const userInDb = await memberRepository.getMemberByEmail(user.email);
        if (userInDb) {
          token.role = userInDb.role;
        }
        if (profile && profile.picture) {
          token.image = profile.picture;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token.role) {
        session.user.role = token.role;
        session.user.image = token.image;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
