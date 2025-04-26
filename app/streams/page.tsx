'use client'

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ChevronDown } from "lucide-react"
import { debounce } from "@/lib/utils"
import Link from "next/link"

// Mock stream data - replace with your actual data source
const mockStreams = [
  {
    id: 1,
    title: "LIVE: Fortnite Battle Royale - Victory Royale Challenge!",
    description: "Join me for some intense Fortnite gameplay and try to get a Victory Royale!",
    thumbnail: "https://i.ibb.co/cSVMqk9V/Flixify-PFP.png",
    viewers: "2.5K",
    status: "live"
  },
  {
    id: 2,
    title: "LIVE: Building Practice & Tips",
    description: "Practicing advanced building techniques and sharing tips",
    thumbnail: "https://i.ibb.co/cSVMqk9V/Flixify-PFP.png",
    viewers: "1.8K",
    status: "live"
  },
  // Add more streams...
]

export default function StreamsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredStreams, setFilteredStreams] = useState(mockStreams)

  const handleSearch = debounce((query: string) => {
    if (!query.trim()) {
      setFilteredStreams(mockStreams)
      return
    }

    const filtered = mockStreams.filter(stream =>
      stream.title.toLowerCase().includes(query.toLowerCase()) ||
      stream.description.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredStreams(filtered)
  }, 300)

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
            <div className="ml-auto">
              <Button className="rounded-full text-sm h-9 px-4 bg-[#00517c] hover:bg-[#00517c]/90 text-white font-medium">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Live Streams</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStreams.length === 0 ? (
            <div className="col-span-full text-center py-8 text-zinc-500">
              {searchQuery ? "No streams match your search" : "No live streams available"}
            </div>
          ) : (
            filteredStreams.map((stream) => (
              <Card key={stream.id} className="bg-zinc-900 border-zinc-800">
                <CardHeader>
                  <div className="relative aspect-video mb-4">
                    <img
                      src={stream.thumbnail}
                      alt={stream.title}
                      className="object-cover rounded-lg"
                    />
                    <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm font-medium">
                      LIVE
                    </div>
                  </div>
                  <CardTitle className="text-xl">{stream.title}</CardTitle>
                  <CardDescription className="text-zinc-400">
                    {stream.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center text-sm text-zinc-400">
                    <span>{stream.viewers} viewers</span>
                    <span className="text-red-500">● Live Now</span>
                  </div>
                  <Button className="w-full mt-4 bg-[#00517c] hover:bg-[#00517c]/90">
                    Watch Stream
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
} 