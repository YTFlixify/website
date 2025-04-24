import Image from "next/image"
import Link from "next/link"
import { Search, Globe, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthButton } from "@/components/auth-button"

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Bar */}
      <header className="border-b border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="font-bold text-2xl tracking-tighter">
                FORTCREATOR
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/videos" className="text-sm font-medium hover:text-yellow-400">
                  Videos
                </Link>
                <Link href="/streams" className="text-sm font-medium hover:text-yellow-400">
                  Streams
                </Link>
                <Link href="/gameplay" className="text-sm font-medium hover:text-yellow-400">
                  Gameplay
                </Link>
                <Link href="/merch" className="text-sm font-medium hover:text-yellow-400 flex items-center">
                  Merch <ChevronDown className="ml-1 h-4 w-4" />
                </Link>
                <Link href="/crew" className="text-sm font-medium hover:text-yellow-400">
                  Crew
                </Link>
                <Link href="/news" className="text-sm font-medium hover:text-yellow-400">
                  News
                </Link>
                <Link href="/tournaments" className="text-sm font-medium hover:text-yellow-400 flex items-center">
                  Tournaments <ChevronDown className="ml-1 h-4 w-4" />
                </Link>
                <Link href="/more" className="text-sm font-medium hover:text-yellow-400 flex items-center">
                  More <ChevronDown className="ml-1 h-4 w-4" />
                </Link>
              </nav>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <div className="relative hidden md:block w-64">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                <Input
                  type="search"
                  placeholder="Search"
                  className="pl-8 bg-zinc-900 border-zinc-800 rounded-full text-sm h-9 focus-visible:ring-yellow-400"
                />
              </div>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Globe className="h-5 w-5" />
              </Button>
              <AuthButton />
              <Button className="rounded-full text-sm h-9 px-4 bg-yellow-400 hover:bg-yellow-500 text-black font-medium">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-12 md:py-24 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 z-10">
            <div className="flex items-center mb-6">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
                FORT<span className="text-yellow-400">CREATOR</span>
              </h1>
              <span className="text-xl md:text-3xl font-bold ml-4 text-yellow-400">×</span>
              <span className="text-xl md:text-3xl font-bold ml-4 text-green-400">SEASON 5</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Epic Victory Royales and Insane Gameplay Every Day!</h2>
            <Button className="rounded-md text-lg font-bold py-6 px-8 bg-yellow-400 hover:bg-yellow-500 text-black">
              WATCH LATEST VIDEO
            </Button>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <Image
              src="https://i.ibb.co/cSVMqk9V/Flixify-PFP.png"
              alt="Fortnite Character"
              width={800}
              height={600}
              className="object-cover rounded-lg"
              priority
            />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 pb-4">
          <span className="h-2 w-12 bg-white rounded-full"></span>
          <span className="h-2 w-6 bg-zinc-600 rounded-full"></span>
          <span className="h-2 w-6 bg-zinc-600 rounded-full"></span>
        </div>
      </section>

      {/* Featured Videos */}
      <section className="py-12 bg-zinc-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Latest Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { title: "INSANE 20 KILL VICTORY ROYALE", views: "247K", time: "2 days ago" },
              { title: "NEW META LOADOUT GUIDE", views: "118.5K", time: "5 days ago" },
              { title: "SEASON 5 BATTLE PASS REVIEW", views: "326K", time: "1 week ago" },
              { title: "TOURNAMENT HIGHLIGHTS", views: "164K", time: "2 weeks ago" },
            ].map((video, index) => (
              <div key={index} className="group relative">
                <div className="relative aspect-video overflow-hidden rounded-lg mb-2">
                  <Image
                    src={`/placeholder.svg?height=200&width=350&text=Video${index + 1}`}
                    alt={video.title}
                    width={350}
                    height={200}
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-black"
                      >
                        <polygon points="5 3 19 12 5 21 5 3"></polygon>
                      </svg>
                    </div>
                  </div>
                </div>
                <h3 className="font-bold text-lg">{video.title}</h3>
                <div className="text-sm text-zinc-400">
                  {video.views} views • {video.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Content Categories */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Content Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Gameplay Highlights", desc: "Best moments and epic plays" },
              { title: "Tips & Tricks", desc: "Improve your Fortnite skills" },
              { title: "Update Reviews", desc: "Stay informed on latest changes" },
              { title: "Challenges", desc: "Watch me complete crazy challenges" },
              { title: "Collaborations", desc: "Videos with other creators" },
              { title: "Live Streams", desc: "Catch my live gameplay sessions" },
            ].map((category, index) => (
              <div key={index} className="bg-zinc-900 p-6 rounded-lg hover:bg-zinc-800 transition-colors">
                <h3 className="font-bold text-xl mb-2">{category.title}</h3>
                <p className="text-zinc-400 mb-4">{category.desc}</p>
                <Button variant="link" className="text-yellow-400 p-0 h-auto font-medium">
                  View Collection →
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Community */}
      <section className="py-12 bg-yellow-400 text-black">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">JOIN MY CREATOR CREW</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Subscribe to get exclusive content, early access to videos, and special perks!
          </p>
          <Button className="rounded-md text-lg font-bold py-6 px-8 bg-black hover:bg-zinc-800 text-white">
            BECOME A MEMBER
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900 py-8 border-t border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Link href="/" className="font-bold text-2xl tracking-tighter">
                FORTCREATOR
              </Link>
              <p className="text-zinc-400 mt-2">© 2025 FortCreator. All rights reserved.</p>
            </div>
            <div className="flex gap-6">
              <Link href="#" className="text-zinc-400 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-white">
                Terms of Service
              </Link>
              <Link href="#" className="text-zinc-400 hover:text-white">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
