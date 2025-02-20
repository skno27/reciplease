import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import prisma from "../../services/prisma";
import { CredentialType, Provider } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma), // *
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "database", // Store sessions in the Prisma database
    maxAge: 30 * 24 * 60 * 60, // Optional: Set session expiration (30 days)
    updateAge: 24 * 60 * 60, // Update session data every 24 hours
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
  // debug: true,
  callbacks: {
    async session({ session, user }) {
      console.log("Session callback triggered");
      console.log("Session before update:", session);
    
      if (user) {
        session.user = {
          ...session.user,
          id: user.id, 
          surveyed: user.surveyed || false, 
        };
      }
    
      console.log("Updated Session:", session);
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

    async jwt({ token, user, account }) {
      console.log("JWT callback triggered");
      console.log("User:", user); // Should log the user object when a login happens
      console.log("Token:", token); // Check the token structure
      // Only add details if the user is logging in for the first time
      if (user) {
        token.id = user.id;
        token.surveyed = user.surveyed || false;
      }

      console.log("Updated Token:", token); // Log token after modification
      return token;
    }
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
