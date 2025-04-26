import { NextResponse } from "next/server"

export async function GET() {
  try {
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
    const CHANNEL_ID = "UCPcm4BLqjuaYQpjw1f2J0UQ" // @YTFlixify channel ID

    if (!YOUTUBE_API_KEY || !CHANNEL_ID) {
      return NextResponse.json(
        { error: "YouTube API configuration missing" },
        { status: 500 }
      )
    }

    // First, get the live streams
    const liveResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&key=${YOUTUBE_API_KEY}`
    )

    if (!liveResponse.ok) {
      throw new Error("Failed to fetch YouTube live streams")
    }

    const liveData = await liveResponse.json()

    // Then get recent past streams
    const pastResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&type=video&eventType=completed&key=${YOUTUBE_API_KEY}&maxResults=10`
    )

    if (!pastResponse.ok) {
      throw new Error("Failed to fetch YouTube past streams")
    }

    const pastData = await pastResponse.json()

    // Get video statistics for both live and past streams
    const videoIds = [
      ...liveData.items.map((item: any) => item.id.videoId),
      ...pastData.items.map((item: any) => item.id.videoId)
    ].join(',')

    const statsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`
    )

    if (!statsResponse.ok) {
      throw new Error("Failed to fetch YouTube video statistics")
    }

    const statsData = await statsResponse.json()
    const viewCounts = statsData.items.reduce((acc: any, item: any) => {
      acc[item.id] = parseInt(item.statistics.viewCount)
      return acc
    }, {})

    // Combine and transform the data
    const streams = [
      // Live streams
      ...liveData.items.map((item: any) => ({
        isLive: true,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high?.url,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        platform: "youtube" as const,
        date: item.snippet.publishedAt,
        views: viewCounts[item.id.videoId] || 0
      })),
      // Past streams
      ...pastData.items.map((item: any) => ({
        isLive: false,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.high?.url,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
        platform: "youtube" as const,
        date: item.snippet.publishedAt,
        views: viewCounts[item.id.videoId] || 0
      }))
    ]

    return NextResponse.json(streams)
  } catch (error) {
    console.error("Error fetching YouTube streams:", error)
    return NextResponse.json(
      { error: "Failed to fetch YouTube streams" },
      { status: 500 }
    )
  }
} 