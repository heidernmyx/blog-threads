
import { cn } from "@/lib/utils"
import ProfileDropDown from "@/components/profile-drop-down";
import { ModeToggle } from "@/components/ui/mode-toggle";
// import Header from "@/components/header";
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import Link from "next/link";



export default function RootLayout({
  children,
}: Readonly<{ 
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
          "min-h-screen font-sans antialiased",
        )}
      // className={inter.className}
      >
        <div className="flex min-h-screen w-full flex-col">
        <header className="w-full flex justify-between items-center py-2 px-4 bg-background fixed top-0 left-0 z-50 border-b-2">
          <h1 className="text-lg font-semibold">For you</h1>
          <div className="absolute left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-2">
              <Button variant={"link"} >
                <Link href={'/dashboard'}>
                  <span className="text-lg font-semibold">Home</span>
                </Link>
              </Button>
              <Separator orientation="vertical"/>
              <Button variant={"link"}>
                <Link href={'/dashboard/profile'}>
                  <span className="text-lg font-semibold">Profile</span>
                </Link>
              </Button>
              <Separator orientation="vertical"/>
              <Button variant={"link"}>
                <Link href={'/dashboard/liked-posts'}>
                  <span className="text-lg font-semibold">Likes</span>
                </Link>
              </Button>
            </div>
          </div>
          <div>
            <div className="flex justify-center items-center space-x-4">
              <ProfileDropDown/>
              <ModeToggle />
            </div>
          </div>
        </header>
        <main className="pt-20">
          {children}
        </main>
        </div>
      </body>
    </html>
  );
}
