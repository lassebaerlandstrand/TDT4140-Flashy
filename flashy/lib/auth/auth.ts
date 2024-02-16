import { FirestoreAdapter } from "@auth/firebase-adapter";
import { cert } from "firebase-admin/app";
import { User as NextUser, Session } from "next-auth";
import { Adapter } from "next-auth/adapters";
import GoogleProvider from "next-auth/providers/google";

type AuthOptionsLogin = { user: NextUser & User };
type AuthOptionsSession = { session: Session, user: NextUser & User };

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_ID!,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_AUTH_CLIENT_SECRET!,
    }),
  ],
  adapter: FirestoreAdapter({
    credential: cert({
      privateKey: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY
        ? process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY.replace(/\\n/gm, "\n")
        : undefined,
      clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID,
    }),
  }) as Adapter,
  callbacks: {
    async signIn({ user }: AuthOptionsLogin) {
      // Add a default role to the user if it doesn't exist
      if (!user.role!) {
        user.role = 'user';
        user.username = user.name;
        user.age = null;
      }
      return true;
    },
    async session({ session, user }: AuthOptionsSession) {
      const modifiedUser = user

      // Add id field to the session object
      session.user.id = modifiedUser.id;

      // Add role to the session object
      if (modifiedUser.role && session.user) {
        session.user.role = modifiedUser.role;
      }

      return session;
    }
  }
};