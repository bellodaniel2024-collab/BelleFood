/**
 * NextAuth configuration for Belle Food.
 * Supports credential-based login for staff/admins and guest order tracking.
 */
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        });

        if (!user || !user.passwordHash) {
          throw new Error("Invalid email or password");
        }

        if (user.role === UserRole.CUSTOMER) {
          throw new Error(
            "Customer accounts cannot log in here. Please use the order tracking page."
          );
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { id: string; role: UserRole }).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id: string; role: UserRole }).id = token.id as string;
        (session.user as { id: string; role: UserRole }).role = token.role as UserRole;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 8 * 60 * 60, // 8 hours — one shift
  },

  secret: process.env.NEXTAUTH_SECRET,
};
