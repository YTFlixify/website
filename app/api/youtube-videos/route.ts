import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
    const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID

    if (!YOUTUBE_API_KEY || !CHANNEL_ID) {
      return NextResponse.json(
        { error: "YouTube API configuration missing" },
        { status: 500 }
      )
    }

    // First, get the uploads playlist ID
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${YOUTUBE_API_KEY}`
    )
    const channelData = await channelResponse.json()
    
    if (!channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads) {
      throw new Error('Could not find uploads playlist')
    }

    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads

    // Get the latest videos from the uploads playlist
    const playlistResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=4&key=${YOUTUBE_API_KEY}`
    )
    const playlistData = await playlistResponse.json()

    // Extract video IDs for statistics
    const videoIds = playlistData.items.map((item: any) => item.snippet.resourceId.videoId).join(',')

    // Get video statistics
    const statsResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${YOUTUBE_API_KEY}`
    )
    const statsData = await statsResponse.json()

    // Create a map of video ID to view count
    const viewCounts = statsData.items.reduce((acc: any, item: any) => {
      acc[item.id] = parseInt(item.statistics.viewCount)
      return acc
    }, {})

    const videos = playlistData.items.map((item: any) => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.high.url,
      publishedAt: item.snippet.publishedAt,
      url: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
      viewCount: viewCounts[item.snippet.resourceId.videoId] || 0
    }))

    return NextResponse.json({ videos })
  } catch (error) {
    console.error('Error fetching YouTube videos:', error)
    return NextResponse.json(
      { error: 'Failed to fetch YouTube videos' },
      { status: 500 }
    )
  }
} 