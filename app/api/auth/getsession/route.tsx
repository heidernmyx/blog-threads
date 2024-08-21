import { getSession } from "next-auth/react";

export const returnSession = async () => {
  const sessionData = await getSession();
  console.log(sessionData);
  return sessionData?.user;
}