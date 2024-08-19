import "next-auth";
import { DefaultUser } from "next-auth";
import { decl } from "postcss";
declare module "next-auth" {
  interface User {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: string;
    username?: string;
  }
  interface Session {
    user: {
      _id?: string;
      isVerified?: boolean;
      isAcceptingMessages?: boolean;
      username?: string;
    } & DefaultUser["user"];
  }
}
declare module "next-auth/jwt" {
  interface jwt {
    _id?: string;
    isVerified?: boolean;
    isAcceptingMessages?: string;
    username?: string;
  }
}
