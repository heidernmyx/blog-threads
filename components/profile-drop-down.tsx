"use client"
import React from 'react'
import { CircleUser } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { returnSession } from '../app/api/auth/getsession/route';
import type { User } from 'next-auth';
import { Logout } from '@/actions/logout';
import { signOut } from "next-auth/react";

const ProfileDropDown = () => {

  const [ session, setSession ] = React.useState<User>();

  React.useEffect(() => {
    const fetchSession = async () => {
      const sessionData = await returnSession();
      const user = sessionData;
      setSession(sessionData)
      console.log(user);
      console.log(sessionData)
    }
    fetchSession();
  }, [])


  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" className="rounded-xl py-[3.5vh] outline-none">
            <div className='flex justify-center items-center space-x-2'>
              <Avatar>
                <AvatarImage src="/assets/gif/pikachu-pixel.gif" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <span>{session?.username}</span>
              {/* <span className="sr-only">Toggle user menu</span> */}
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default ProfileDropDown