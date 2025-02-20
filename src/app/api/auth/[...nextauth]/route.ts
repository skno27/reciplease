import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter"; // not sure why these were commented out
import prisma from "../../services/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma), // *
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      id: "google",
      name: "Google",
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GithubProvider({
      id: "github",
      name: "GitHub",
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  debug: true,
  callbacks: {
    async session({ session, user, token }) {
      if (token) {
        session.user = {
          ...session.user,
          id: token.id,
          surveyed: token.surveyed || false,
        }
      }
      if (token?.surveyed !== undefined) {
        session.user.surveyed = token.surveyed;
      }

      return session;
    },

    async signIn({ user, account, profile }: { user: any; account?: any; profile?: any }) {
    
      if (!profile?.email) {
        throw new Error("No email found in profile");
      }
    
      // Find existing user by email
      const existingUser = await prisma.user.findUnique({
        where: { email: profile.email },
        include: { accounts: true }, 
      });
    
      if (existingUser) {
        // If an account exists, ensure it's linked
        if (account && existingUser.accounts) {
          const hasLinkedAccount = existingUser.accounts.some(
            (acc) => acc.provider === account.provider
          );
    
          if (!hasLinkedAccount) {
            // Link new provider to existing user
            await prisma.account.create({
              data: {
                userId: existingUser.id,
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            });
          }
        }
    
        return true;
      }
    
      // If no existing user and account is present, create new user
      if (account) {
        await prisma.user.create({
          data: {
            email: profile.email,
            name: profile.name ?? "Unknown",
            accounts: {
              create: {
                type: account.type,
                provider: account.provider,
                providerAccountId: account.providerAccountId,
              },
            },
          },
        });
      }
    
      return true;
    },

    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) return url;
      return `${baseUrl}/profile`; 
    },

    async jwt({ token }) {

      if (!token.email) return token;
      try {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email! },
          select: { id: true, surveyed: true },
        });
  
        token.surveyed = dbUser?.surveyed || false;
  
        if (dbUser) {
          token.id = dbUser.id; // Assign MongoDB _id to token.id
          token.surveyed = dbUser.surveyed || false;
        }
      }
      catch (error) {
        console.error("JWT Callback Error:", error);
      }
      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
