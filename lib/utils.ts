import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import z from 'zod';
import { RegisterSchema, LoginSchema } from "./schema";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface PostProps {
  post_id: number;
  post_title: string;
  post_description: string;
  post_username: string;
  time_posted: string;
  post_comments: CommentProps[];
}
export interface PostDetails {
  post_title: string;
  post_description: string;
  postUser_id: string;
}

export interface CommentProps {
  comment_id: number,
  comment_text: string,
  comment_username: string,
  comment_time: string
}

export interface CommentDetails {
  post_id: number,
  userComment_id: string,
  comment_text: string
}


export type RegisterFormFields = z.infer<typeof RegisterSchema>

export type LoginFormFields = z.infer<typeof LoginSchema>

export type ResultProps = {
  message?: string;
  error?: string;
}

export interface SessionProps {
  user_id: string;
  username: string;
  email: string;
}


export type LikeDetails = {
  post_id: string;
  user_id: string;
}