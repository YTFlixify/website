'use client'

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, ChevronDown } from "lucide-react"
import { debounce } from "@/lib/utils"
import Link from "next/link"
import { YouTubeVideo } from "@/lib/youtube-service"

export default function VideosPage() {
  const searchParams = useSearchParams()
  const category = searchParams.get('category')
  const [searchQuery, setSearchQuery] = useState("")
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [filteredVideos, setFilteredVideos] = useState<YouTubeVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/youtube')
        if (!response.ok) {
          throw new Error('Failed to fetch videos')
        }
        const data = await response.json()
        setVideos(data)
        setFilteredVideos(data)
      } catch (err) {
        setError('Failed to load videos. Please try again later.')
        console.error('Error fetching videos:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  useEffect(() => {
    if (category) {
      const filtered = videos.filter(video => video.category === category)
      setFilteredVideos(filtered)
    } else {
      setFilteredVideos(videos)
    }
  }, [category, videos])

  const handleSearch = debounce((query: string) => {
    if (!query.trim()) {
      setFilteredVideos(videos)
      return
    }

    const filtered = videos.filter(video =>
      video.title.toLowerCase().includes(query.toLowerCase()) ||
      video.description.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredVideos(filtered)
  }, 300)

  const handleVideoClick = (url: string) => {
    window.open(url, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00517c] mx-auto"></div>
          <p className="mt-4 text-zinc-400">Loading videos...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <Button 
            className="mt-4 bg-[#00517c] hover:bg-[#00517c]/90"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    )
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
          <h1 className="text-3xl font-bold mb-4 md:mb-0">
            {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Videos` : 'All Videos'}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.length === 0 ? (
            <div className="col-span-full text-center py-8 text-zinc-500">
              {searchQuery ? "No videos match your search" : "No videos available"}
            </div>
          ) : (
            filteredVideos.map((video) => (
              <Card key={video.id} className="bg-zinc-900 border-zinc-800 hover:bg-zinc-800/80 transition-all duration-200 cursor-pointer group">
                <CardHeader className="p-0">
                  <div className="relative aspect-video overflow-hidden rounded-t-lg">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-200"
                    />
                    {video.category === 'shorts' && (
                      <div className="absolute top-2 right-2 bg-red-600 text-white px-2 py-1 rounded text-sm font-medium">
                        SHORTS
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm">
                      {video.duration}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2 line-clamp-2 group-hover:text-[#00517c] transition-colors">
                    {video.title}
                  </CardTitle>
                  <div className="flex justify-between items-center text-sm text-zinc-400 mb-4">
                    <span>{video.views} views</span>
                    <span>{video.publishedAt}</span>
                  </div>
                  <Button 
                    className="w-full bg-[#00517c] hover:bg-[#00517c]/90 transition-colors"
                    onClick={() => handleVideoClick(video.url)}
                  >
                    Watch Now
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