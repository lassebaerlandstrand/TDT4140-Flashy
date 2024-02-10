import { Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role: string;
    } & Session["user"];
  }
}