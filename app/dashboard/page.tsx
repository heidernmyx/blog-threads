"use client";
import Post from "@/components/post";
import { PostDetails } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { User } from "next-auth";
import { returnSession } from "../api/auth/getsession/route";

const Dashboard = () => {
  const [session, setSession] = useState<User | null>();

  useEffect(() => {
    async function _fetch() {
      const sessionData = await returnSession();
      console.log(sessionData)
      setSession(sessionData.user);
    }
    _fetch();
  }, []);

  console.log(session);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [username, setUsername] = useState("");

  const newPostModal = useRef<HTMLButtonElement>(null);
  const upload = async () => {
    const url = `${process.env.NEXT_PUBLIC_URL}php/posts.php`;
    const formData = new FormData();

    const postDetails: PostDetails = {
      post_title: title,
      postUser_id: session!.id,
      post_description: description,
    };
    formData.append("operation", "upload");
    formData.append("json", JSON.stringify(postDetails));
    const response = await axios({
      url: url,
      method: "POST",
      data: formData,
    });

    const result = response.status;
    console.log(result);

    if (result == 200) {
      alert("Post uploaded successfully");
      window.location.reload();
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center">
        <div className="flex flex-col justify-center">
          <div className="post-container flex flex-col items-center p-4 border border-solid border-gray-300 rounded-xl bg-opacity-50">
            <div className="w-full flex justify-start px-[1vw] py-[1vw]">
              <Avatar>
                <AvatarImage src="/assets/gif/pikachu-pixel.gif" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <Input
                className="w-full ml-[1vw] border-none"
                onClick={() => newPostModal.current?.click()}
                placeholder="What's on your mind?"
              />
            </div>
            <Post />
          </div>
        </div>
      </div>
      
      <AlertDialog>
        <AlertDialogTrigger ref={newPostModal} asChild>
          <Button className="h-[10vh] w-[7vw] m-[1vw] fixed bottom-3 right-3">
            <span className="text-3xl">+</span>
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>What&apos;s on your mind?</AlertDialogTitle>
            <AlertDialogDescription>
              <Label htmlFor="title">Title</Label>
              <Input
                className="mb-[1vh]"
                onChange={(e) => setTitle(e.target.value)}
                id="title"
                type="text"
              />
              {/* { !session && 
                <>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    className="mb-[1vh]"
                    onChange={(e) => setUsername(e.target.value)}
                    id="username"
                    type="text"
                  />
                </> 
              } */}
              <Label>Description</Label>
              <textarea
                onChange={(e) => setDescription(e.target.value)}
                title="post"
                className="w-full mb-[0.5vh] h-40 px-[1vw] py-[1vh]"
              ></textarea>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={upload}>Post</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Dashboard;