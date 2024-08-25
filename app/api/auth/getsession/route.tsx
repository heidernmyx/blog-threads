import { getSession } from "next-auth/react";

export async function returnSession () {
  const sessionData = await getSession();
  console.log(sessionData);
  return sessionData?.user;
}