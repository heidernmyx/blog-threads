"use server"
import { getSession } from "next-auth/react";
import { authOptions } from "../[...nextauth]/route";
import { getServerSession } from "next-auth";

export const returnSession = async () => {
  const sessionData = await getServerSession(authOptions);
  console.log(sessionData);
  return sessionData;
}