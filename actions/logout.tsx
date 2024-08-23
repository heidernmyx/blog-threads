"use server"

import { LoginFormFields } from "@/lib/utils"
import { signOut } from "next-auth/react";
import { NextRequest, NextResponse } from "next/server";

export const Logout = async (req: NextRequest) => {
  await signOut({ callbackUrl: "/" });
  alert('Logout Successful');
  // return NextResponse.redirect(new URL('/', req.nextUrl));
}