"use client"

import { useEffect, useState } from "react"
import { LiveStream } from "./live-stream"
import { PastStreams } from "./past-streams"
import { Skeleton } from "@/components/ui/skeleton"

export interface StreamData {
  isLive: boolean
  title?: string
  thumbnail?: string
  url?: string
  platform: "twitch" | "youtube"
  date?: string
  views?: number
}

export function StreamsContent() {
  const [isLoading, setIsLoading] = useState(true)
  const [streams, setStreams] = useState<StreamData[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStreams = async () => {
      try {
        setIsLoading(true)
        // Fetch both Twitch and YouTube streams
        const [twitchResponse, youtubeResponse] = await Promise.all([
          fetch("/api/streams/twitch"),
          fetch("/api/streams/youtube")
        ])

        if (!twitchResponse.ok || !youtubeResponse.ok) {
          throw new Error("Failed to fetch streams")
        }

        const [twitchData, youtubeData] = await Promise.all([
          twitchResponse.json(),
          youtubeResponse.json()
        ])

        setStreams([...twitchData, ...youtubeData])
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setIsLoading(false)
      }
    }

    fetchStreams()
  }, [])

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-[400px] w-full" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-red-500">
        <p>Error: {error}</p>
      </div>
    )
  }

  const liveStreams = streams.filter(stream => stream.isLive)
  const pastStreams = streams
    .filter(stream => !stream.isLive)
    .sort((a, b) => {
      if (!a.date || !b.date) return 0
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })

  return (
    <div className="space-y-8">
      {liveStreams.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Live Now</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveStreams.map((stream, index) => (
              <LiveStream key={index} stream={stream} />
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-2xl font-bold mb-4">Past Streams</h2>
        <PastStreams streams={pastStreams} />
      </div>
    </div>
  )
} 