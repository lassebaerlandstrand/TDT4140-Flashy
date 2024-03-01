import "next-auth";
import { User as UserType } from "./user";

declare module "next-auth" {
  interface Session {
    user: UserType & Session["user"];
    expires: Session["expires"]
  }

  interface User extends DefaultUser {
    id: UserType["id"];
    name: UserType["name"];
    email: UserType["email"];
    image: UserType["image"];
    role: UserType["role"];
    username: UserType["username"];
    age: UserType["age"];
  }
}