import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials"; 
import bcrypt from "bcryptjs"; 
import { mongooseConnection } from "@/lib/mongoconnection";
import Users from "@/models/Users";

declare module "next-auth" {
  interface Session {
    user?: {
      username?: string | null;
      email?: string | null;
      id?: string;
      accessToken?: string;
      provider?: string;
      role?: string;
      error?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    accessToken?: string;
    provider?: string;
    role?: string;
    error?: string;
  }
}

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID || "",
      clientSecret: process.env.GITHUB_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials", 
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials || {};

        if (!email || !password) {
          throw new Error("Email and password are required.");
        }

        await mongooseConnection();

        const user = await Users.findOne({ email });

        if (!user) {
          throw new Error("User not found.");
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          throw new Error("Invalid password.");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          username: user.username,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;

        await mongooseConnection();

        // First, try to find an existing user by email
        let user = await Users.findOne({ email: profile?.email });

        if (!user) {
          user = await Users.create({
            username: profile?.name || "New User",
            email: profile?.email,
            role: "seller", 
            provider: account.provider,
          });
        }

        token.id = user._id.toString();
        token.role = user.role;
      }

      return token;
    },

    async session({ session, token }) {
      if (!token.id) {
        delete session.user; // If no token ID, remove the session user
      } else {
        session.user = {
          id: token.id,
          accessToken: token.accessToken,
          provider: token.provider,
          role: token.role,
          error: token.error,
        };
      }

      return session;
    },
  },

  pages: {
    signIn: "/authentication/signin", 
    error: "/authentication/signin", 
  },

  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt", 
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
