"use server"
import { getSession } from "next-auth/react";
import { GET } from "../[...nextauth]/route";
import { getServerSession } from "next-auth";

export async function returnSession () {
  const sessionData = await getServerSession(GET);
  console.log(sessionData);
  return sessionData?.user;
}