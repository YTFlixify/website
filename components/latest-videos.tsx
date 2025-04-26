"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Eye } from "lucide-react"
import Image from 'next/image'

interface Video {
  id: string
  title: string
  thumbnail: string
  publishedAt: string
  url: string
  viewCount: number
}

interface LatestVideosProps {
  searchQuery?: string
}

function formatViewCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M views`
  } else if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K views`
  }
  return `${count} views`
}

export function LatestVideos({ searchQuery = "" }: LatestVideosProps) {
  const [videos, setVideos] = useState<Video[]>([])
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const response = await fetch('/api/youtube-videos')
        if (!response.ok) {
          throw new Error('Failed to fetch videos')
        }
        const data = await response.json()
        setVideos(data.videos)
        setFilteredVideos(data.videos)
      } catch (err) {
        setError('Failed to load videos')
        console.error('Error fetching videos:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  // Filter videos when search query changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredVideos(videos)
      return
    }

    const lowerQuery = searchQuery.toLowerCase()
    const filtered = videos.filter(video => 
      video.title.toLowerCase().includes(lowerQuery)
    )
    setFilteredVideos(filtered)
  }, [searchQuery, videos])

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        {error}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <Skeleton className="w-full h-48" />
            <CardContent className="p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {filteredVideos.length === 0 ? (
        <div className="col-span-full text-center py-8 text-zinc-500">
          {searchQuery ? "No videos match your search" : "No videos available"}
        </div>
      ) : (
        filteredVideos.map((video) => (
          <a
            key={video.id}
            href={video.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative aspect-video overflow-hidden">
                <Image
                  src={video.thumbnail}
                  alt={video.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold line-clamp-2 mb-2 group-hover:text-[#00517c] transition-colors">{video.title}</h3>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {formatViewCount(video.viewCount)}
                  </span>
                  <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </a>
        ))
      )}
    </div>
  )
} 