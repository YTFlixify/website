'use client'

import Image from "next/image"
import Link from "next/link"
import { Search, ChevronDown } from "lucide-react"
import { FaDiscord } from "react-icons/fa"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthButtonWrapper } from "@/app/components/auth-button-wrapper"
import { LatestVideos } from "@/components/latest-videos"
import { useState, useCallback, useEffect } from "react"
import { debounce } from "@/lib/utils"
import { useRouter } from "next/navigation"
import type { Metadata } from "next"

export default function Home() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredVideos, setFilteredVideos] = useState<any[]>([])
  const [filteredCategories, setFilteredCategories] = useState<any[]>([])
  const [currentSection, setCurrentSection] = useState(0)

  const categories = [
    { 
      id: "live-streams",
      title: "Live Streams", 
      desc: "Watch me play live and interact with the community",
      path: "/streams",
      icon: "🔴"
    },
    { 
      id: "challenges",
      title: "Challenges", 
      desc: "Epic gaming challenges and competitions",
      path: "/videos?category=challenges",
      icon: "🎯"
    },
    { 
      id: "shorts",
      title: "YouTube Shorts", 
      desc: "Quick, entertaining gaming moments",
      path: "/videos?category=shorts",
      icon: "🎬"
    },
    { 
      id: "gameplay",
      title: "Gameplay Videos", 
      desc: "Full gameplay sessions and walkthroughs",
      path: "/videos?category=gameplay",
      icon: "🎮"
    }
  ]

  const heroSections = [
    {
      title: "FLIXIFY",
      subtitle: "Epic Victory Royales and Insane Gameplay Every Day!",
      buttonText: "WATCH LATEST VIDEO",
      buttonLink: "https://www.youtube.com/@YTFlixify",
      image: "https://i.ibb.co/cSVMqk9V/Flixify-PFP.png"
    },
    {
      title: "JOIN OUR DISCORD",
      subtitle: "Be Part of an Amazing Gaming Community!",
      buttonText: "JOIN NOW",
      buttonLink: "https://discord.gg/4xxFUTyMWt",
      image: "https://i.ibb.co/qMRp6m0j/Discord-Hero.png"
    }
  ]

  // Filter content based on search query
  const filterContent = useCallback((query: string) => {
    if (!query.trim()) {
      setFilteredVideos([])
      setFilteredCategories(categories)
      return
    }

    const lowerQuery = query.toLowerCase()
    
    // Filter categories
    const filteredCats = categories.filter(category => 
      category.title.toLowerCase().includes(lowerQuery) ||
      category.desc.toLowerCase().includes(lowerQuery)
    )
    setFilteredCategories(filteredCats)

    // Filter videos (this will be handled by the LatestVideos component)
    setFilteredVideos([]) // Reset filtered videos
  }, [])

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      filterContent(query)
    }, 300),
    [filterContent]
  )

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    debouncedSearch(query)
  }

  // Handle category click
  const handleCategoryClick = (path: string) => {
    router.push(path)
  }

  // Initialize filtered categories
  useEffect(() => {
    setFilteredCategories(categories)
  }, [])

  const handleDotClick = (index: number) => {
    setCurrentSection(index)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation Bar */}
      <header className="border-b border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16">
            <div className="flex items-center gap-8">
              <Link href="/" className="font-bold text-2xl tracking-tighter">
                <span className="text-[#00517c]">FLIXIFY</span>
              </Link>
              <nav className="hidden md:flex items-center gap-6">
                <Link href="/videos" className="text-sm font-medium hover:text-[#00517c]">
                  Videos
                </Link>
                <Link href="/streams" className="text-sm font-medium hover:text-[#00517c]">
                  Streams
                </Link>
              </nav>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <AuthButtonWrapper />
              <Button className="rounded-full text-sm h-9 px-4 bg-[#00517c] hover:bg-[#00517c]/90 text-white font-medium">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Sections Carousel */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-12 md:py-24 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 z-10">
            <div className="flex items-center mb-6">
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
                <span className="text-[#00517c]">{heroSections[currentSection].title}</span>
              </h1>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">{heroSections[currentSection].subtitle}</h2>
            <Link href={heroSections[currentSection].buttonLink} target={heroSections[currentSection].buttonLink.startsWith('http') ? "_blank" : "_self"} rel={heroSections[currentSection].buttonLink.startsWith('http') ? "noopener noreferrer" : ""}>
              <Button className="rounded-md text-lg font-bold py-6 px-8 bg-[#00517c] hover:bg-[#00517c]/90 text-white">
                {heroSections[currentSection].buttonText}
                {heroSections[currentSection].buttonLink.includes('discord') && (
                  <FaDiscord className="ml-2 h-12 w-12" />
                )}
              </Button>
            </Link>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <Image
              src={heroSections[currentSection].image}
              alt="Hero Image"
              width={800}
              height={600}
              className="object-cover rounded-lg transition-opacity duration-300"
              priority
            />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 pb-4">
          {heroSections.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`h-2 transition-all duration-300 rounded-full ${
                index === currentSection 
                  ? "w-12 bg-white" 
                  : "w-6 bg-zinc-600 hover:bg-zinc-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Featured Videos */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Latest Videos</h2>
          <LatestVideos searchQuery={searchQuery} />
        </div>
      </section>

      {/* Content Collections */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Content Collections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredCategories.length === 0 ? (
              <div className="col-span-full text-center py-8 text-zinc-500">
                {searchQuery ? "No categories match your search" : "No categories available"}
              </div>
            ) : (
              filteredCategories.map((category) => (
                <div 
                  key={category.id}
                  className="bg-zinc-900 p-6 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer group"
                  onClick={() => handleCategoryClick(category.path)}
                >
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="font-bold text-xl mb-2 group-hover:text-[#00517c] transition-colors">
                    {category.title}
                  </h3>
                  <p className="text-zinc-400 mb-4">{category.desc}</p>
                  <Button variant="link" className="text-[#00517c] p-0 h-auto font-medium group-hover:translate-x-1 transition-transform">
                    View Collection →
                  </Button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-900 py-8 border-t border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <Link href="/" className="font-bold text-2xl tracking-tighter">
                <span className="text-[#00517c]">FLIXIFY</span>
              </Link>
              <p className="text-zinc-400 mt-2">© 2025 Flixify. All rights reserved.</p>
            </div>
            <div className="flex gap-6">
              <Link href="/privacy-policy" className="text-zinc-400 hover:text-white">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-zinc-400 hover:text-white">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-zinc-400 hover:text-white">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
