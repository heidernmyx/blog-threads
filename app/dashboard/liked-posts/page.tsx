"use client"
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import Post from '@/components/post';


const LikedPost = () => {
  return (
    <div className="min-h-screen flex flex-col items-center">
        
        <div className="flex flex-col justify-center">
          <div className="post-container flex flex-col items-center p-4 border border-solid border-gray-300 rounded-xl bg-opacity-50">
            {/* <div className="w-full flex justify-star?t px-[1vw] py-[1vw]"> */}
              {/* <Avatar>
                <AvatarImage src="/assets/gif/pikachu-pixel.gif" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar> */}
              {/* <Input
                className="w-full ml-[1vw] border-none"
                onClick={() => newPostModal.current?.click()}
                placeholder="What's on your mind?"
              /> */}
            {/* </div> */}
            <Post />
          </div>
        </div>
      </div>
  )
}

export default LikedPost