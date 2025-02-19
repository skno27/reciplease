import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import prisma from "../../services/prisma";
import { CredentialType, Provider } from "@prisma/client";

const authOptions: NextAuthOptions = {
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
  // debug: true,
  callbacks: {
    async signIn({ profile, account }) {
      if (!profile?.email) {
        throw new Error("No profile email available");
      }
      console.log("sign in callback triggered");

      // Extract provider data from account
      const email = profile.email;
      const provider = account?.provider;
      const providerAccountId = account?.providerAccountId;
      if (!provider || !providerAccountId) {
        throw new Error("Missing provider information");
      }

      // Check if the user exists
      let user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        // Create new user with OAuth credential
        user = await prisma.user.create({
          data: {
            email,
            name: profile.name ?? "unknown",
            credentials: {
              create: {
                type: CredentialType.OAUTH,
                value: providerAccountId,
                provider: provider.toUpperCase() as Provider,
              },
            },
          },
        });
      } else {
        // User exists: check for an existing OAuth credential for this provider
        const existingCredential = await prisma.credential.findFirst({
          where: {
            userId: user.id,
            type: CredentialType.OAUTH,
            provider: provider.toUpperCase() as Provider,
          },
        });

        if (existingCredential) {
          // Compare stored value with incoming OAuth unique ID
          if (existingCredential.value !== providerAccountId) {
            console.error("Credential mismatch: possible exploit attempt");
            return false;
          }
        } else {
          // No credential for this provider exists; create one.
          await prisma.credential.create({
            data: {
              type: CredentialType.OAUTH,
              value: providerAccountId,
              provider: provider.toUpperCase() as Provider,
              user: { connect: { id: user.id } },
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, profile }) {
      // If we get profile data from the provider, add its email to the token
      if (profile?.email) {
        token.email = profile.email;
      }
      // Lookup the user by email and set token.id and token.surveyed
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, surveyed: true },
        });
        token.id = dbUser?.id as string;
        token.surveyed = dbUser?.surveyed || false;
      }
      return token;
    },
    async session({ session, token }) {
      // Attach the token fields to the session
      session.user.id = token.id as string;
      session.user.email = token.email as string;
      session.user.surveyed = token.surveyed as boolean;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
