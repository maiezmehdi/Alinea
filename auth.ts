import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";

// Auth.js v5 (next-auth@beta) — universal edge-ready config
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    // Google OAuth — set GOOGLE_CLIENT_ID + GOOGLE_CLIENT_SECRET in env.
    // Redirect URI to configure in Google Cloud Console:
    //   http://localhost:3000/api/auth/callback/google  (dev)
    //   https://<your-domain>/api/auth/callback/google  (prod)
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Guest mode — lets someone try the editor without an account.
    // The "identity" is the pseudonym they enter. No password.
    // Removed in a later iteration once real DB + magic links are wired.
    Credentials({
      id: "guest",
      name: "Guest",
      credentials: {
        pseudonym: { label: "Pseudonym", type: "text" },
      },
      async authorize(credentials) {
        const raw = (credentials?.pseudonym ?? "").toString().trim();
        const name = raw.length > 0 ? raw.slice(0, 40) : "Invité";
        return {
          id: `guest:${crypto.randomUUID()}`,
          name,
          email: null,
          image: null,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.isGuest = String(user.id ?? "").startsWith("guest:");
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
        (session.user as { isGuest?: boolean }).isGuest = Boolean(token.isGuest);
      }
      return session;
    },
    authorized({ auth: session, request }) {
      const { pathname } = request.nextUrl;
      if (pathname.startsWith("/app")) return !!session;
      return true;
    },
  },
});
