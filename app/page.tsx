import Login from "@/components/login";
import { ModeToggle } from "@/components/ui/mode-toggle";


export default function Home() {
  return (
    <>
      <div className="flex align-middle items-center justify-center min-h-screen">
        <Login/>
      </div>
      <div className="fixed top-3 right-3">
        <ModeToggle/>
      </div>
    </>
  )
}
