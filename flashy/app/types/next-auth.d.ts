import "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      username: string;
      age: number | null;
    } & Session["user"];
    expires: Session["expires"]
  }
}