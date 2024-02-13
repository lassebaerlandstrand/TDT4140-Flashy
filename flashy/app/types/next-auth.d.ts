import { Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      role: string;
      username: string;
      age: number | null;
    } & Session["user"];
    expires: Session["expires"]
  }
}