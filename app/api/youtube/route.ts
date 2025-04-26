import { NextResponse } from 'next/server'
import { YouTubeService } from '@/lib/youtube-service'

const youtubeService = new YouTubeService(process.env.YOUTUBE_API_KEY || '')

export async function GET() {
  try {
    const channelId = process.env.YOUTUBE_CHANNEL_ID
    if (!channelId) {
      return NextResponse.json({ error: 'YouTube channel ID not configured' }, { status: 500 })
    }

    const videos = await youtubeService.getChannelVideos(channelId)
    return NextResponse.json(videos)
  } catch (error) {
    console.error('Error fetching YouTube videos:', error)
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 })
  }
} 