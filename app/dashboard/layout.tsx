
import { cn } from "@/lib/utils"
import ProfileDropDown from "@/components/profile-drop-down";
import { ModeToggle } from "@/components/ui/mode-toggle";
// import Header from "@/components/header";


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
        <header className="w-full flex justify-start p-4">
          <h1 className="text-lg font-semibold">For you</h1>
          <div className="fixed top-3 right-3 ">
            <div className="flex justify-center items-center space-x-4">
              <ProfileDropDown/>
              <ModeToggle />
            </div>
          </div>
        </header>
          {children}
        </div>
      </body>
    </html>
  );
}
