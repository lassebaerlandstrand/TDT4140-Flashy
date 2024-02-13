import { FirestoreAdapter } from "@auth/firebase-adapter";
import GoogleProvider from "next-auth/providers/google";
import { cert } from "firebase-admin/app";
import { Adapter } from "next-auth/adapters";
import { Session, User,  } from "next-auth";

type AuthOptionsLogin = {user: User & {role: string, username: string, age: number | null}};
type AuthOptionsSession = {session: Session, user: User & {role: string, username: string, age: number | null}};

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
    async signIn({ user}: AuthOptionsLogin) {
      // Add a default role to the user if it doesn't exist
      if (!user.role!) {
        user.role = 'user';
        user.username = ''
        user.age = null
      }
      return true;
    },
      async session({ session, user }: AuthOptionsSession) {
        const modifiedUser = user
        
        // Add role to the session object
        if (modifiedUser.role && session.user) {
          session.user.role = modifiedUser.role;
        }

        return session;
    }
  }
};