import Post from "@/components/post";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import Image from "next/image";

export default function Home() {
  return (
    <>
      <div className="min-h-screen flex flex-col items-center">
        <header className="w-full flex justify-start p-4">
          <h1 className="text-lg font-semibold">For you</h1>
        </header>
        <div className="flex flex-col justify-center">
          <Post/>
          
        </div>
      </div>
      <Button className="h-[10vh] w-[7vw] m-[1vw] fixed bottom-3 right-3">
        <span className="text-3xl">+</span>
      </Button>
      <div className="fixed top-3 right-3">
        <ModeToggle/>
      </div>
    </>
  );
}
