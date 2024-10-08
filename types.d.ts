import NextAuth from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      name: string;
      email: string;
    };
  }

  interface User {
    // user: {
      id: number;
      username: string;
      email: string;
    // }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: number;
    username: string;
  }
}