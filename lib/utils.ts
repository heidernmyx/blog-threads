import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

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
  post_username: string;
}

export interface CommentProps {
  comment_id: number,
  comment_text: string,
  comment_username: string,
  comment_time: string
}

export interface CommentDetails {
  post_id: number,
  comment_text: string,
  comment_username: string
}

export type RegisterFormFields = {
  username: string,
  password: string,
  fname: string,
  lname: string,
  email: string
}