"use client"
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
import Link from 'next/link'
import { useForm, SubmitHandler } from 'react-hook-form'
// import { login } from "@/actions/login"
import { LoginFormFields } from '@/lib/utils'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation';

const Login = () => {

  const { register, handleSubmit, formState: { errors, isSubmitting} } = useForm<LoginFormFields>();
  const router = useRouter();

  
  const submitData = async (data: LoginFormFields) => {
    const response = await signIn('credentials', {
      redirect: false,
      username: data.username,
      password: data.password,
    });
  
    console.log(response);
  
    if (response?.error) {
      // Handle the error without redirecting
      console.error('Login failed:', response.error);
      alert('Login failed: ' + response.error);
    } else if (response?.ok) {
      // Handle successful login
      console.log('Login successful');
      // Redirect to a different page after a successful login
      // You can use router.push('/dashboard') or similar
    }
  }
  
  

  return (
    <>
      <Card className="w-full max-w-sm ">
        <form onSubmit={handleSubmit(submitData)}>
          <CardHeader>
            <CardTitle className="text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your email below to login to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="text">Username</Label>
              <Input {...register('username')} id="text" type="text" placeholder="Vic Dawn" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input {...register('password')} id="password" type="password" required />
            </div>
          </CardContent>
          <CardFooter className='flex flex-col space-y-4'>
            <Button className="w-full">Sign in</Button>
            <span>Dont have an account yet? Register <Link className='underline' href={'/auth/register'}>here!</Link></span>
          </CardFooter>
        </form>
      </Card>
    </>
  )
}

export default Login