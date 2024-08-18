import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ModeToggle } from '@/components/ui/mode-toggle'
import Link from 'next/link'
import { useForm } from 'react-hook-form' 
import { RegisterFormFields } from '@/lib/utils'

const Register = () => {
  
  const { register, handleSubmit, setValue} = useForm<RegisterFormFields>();
  // cost [ username, ]


  return (
    <>
      <div className='min-h-screen flex justify-center items-center'>
        <Card className="w-full max-w-sm ">
          <CardHeader>
            <CardTitle className="text-2xl">Register</CardTitle>
            <CardDescription>
              Enter your details below to create an account.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <form>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input {...register('username', {required: true})} id="username" type="text" placeholder="Vic Dawn" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input {...register('password', {required: true})} id="password" type="password"/>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="fname">First Name</Label>
                <Input {...register('fname', {required: true})} id="fname" type="text" placeholder="" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lname">Last Name</Label>
                <Input {...register('lname', {required: true})} id="lname" type="text" placeholder="" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="emj@email.com" />
              </div>
              <div className="flex my-[0.6vh] flex-grow">
        <div className="w-[100%]">
          <Label htmlFor="">Birthdate</Label>
          <div className="w-[100%]">
            <input
              {...register("birthdate", { required: "Select Birthdate!" })}
              className="flex h-10 w-full my-[0.6vh] items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1"
                      // flex h-10 w-full my-[0.6vh] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50
                      type="date"
            />
            {/* Error message */}
      
            
          </div>
        </div>
        <div className="w-[1.5vw]"></div>
        <div className="w-[100%]">
          <Label htmlFor="">Gender</Label>
          <div className="w-[100%]">
            <Select onValueChange={(event) => setValue('gender', event)}>
              <SelectTrigger className="w-[100%] my-[0.6vh]">
                <SelectValue {...register("gender", {required: "Required"})} placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
            {/* Error message */}
          </div>
        </div>
      </div>
            </form>
          </CardContent>

          <CardFooter className='flex flex-col space-y-4'>
            <Button className="w-full">Register</Button>
            <span>Already have an account? Sign in <Link className='underline' href={'/'}>here!</Link></span>
          </CardFooter>
        </Card>
      </div>
      <div className="fixed top-3 right-3">
        <ModeToggle/>
      </div>
    </>
  )
}

export default Register