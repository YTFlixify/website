import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-2xl font-bold mb-6">Page Not Found</h2>
      <p className="text-zinc-400 mb-8 text-center max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link href="/">
        <Button className="bg-[#00517c] hover:bg-[#00517c]/90 text-white font-bold">Return to Home</Button>
      </Link>
    </div>
  )
}
