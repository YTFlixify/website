import { google } from 'googleapis'

const youtube = google.youtube('v3')

export interface YouTubeVideo {
  id: string
  title: string
  description: string
  thumbnail: string
  views: string
  publishedAt: string
  url: string
  duration: string
  category: string
}

export class YouTubeService {
  private apiKey: string

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async getChannelVideos(channelId: string, maxResults: number = 50): Promise<YouTubeVideo[]> {
    try {
      // First, get the uploads playlist ID
      const channelResponse = await youtube.channels.list({
        key: this.apiKey,
        id: [channelId],
        part: ['contentDetails'],
      })

      const uploadsPlaylistId = channelResponse.data.items?.[0]?.contentDetails?.relatedPlaylists?.uploads

      if (!uploadsPlaylistId) {
        throw new Error('Could not find uploads playlist')
      }

      // Then, get the videos from the uploads playlist
      const playlistResponse = await youtube.playlistItems.list({
        key: this.apiKey,
        playlistId: uploadsPlaylistId,
        part: ['snippet', 'contentDetails'],
        maxResults,
      })

      const videoIds = playlistResponse.data.items?.map(item => item.contentDetails?.videoId).filter(Boolean) as string[]

      // Get detailed video information
      const videosResponse = await youtube.videos.list({
        key: this.apiKey,
        id: videoIds,
        part: ['snippet', 'statistics', 'contentDetails'],
      })

      return videosResponse.data.items?.map(video => ({
        id: video.id!,
        title: video.snippet?.title || '',
        description: video.snippet?.description || '',
        thumbnail: video.snippet?.thumbnails?.high?.url || '',
        views: this.formatNumber(parseInt(video.statistics?.viewCount || '0')),
        publishedAt: this.formatDate(video.snippet?.publishedAt || ''),
        url: `https://youtu.be/${video.id}`,
        duration: this.formatDuration(video.contentDetails?.duration || ''),
        category: this.determineCategory(video.snippet?.title || '', video.snippet?.description || '')
      })) || []
    } catch (error) {
      console.error('Error fetching YouTube videos:', error)
      return []
    }
  }

  private formatNumber(num: number): string {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
  }

  private formatDuration(duration: string): string {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
    if (!match) return ''

    const hours = (match[1] || '').replace('H', '')
    const minutes = (match[2] || '').replace('M', '')
    const seconds = (match[3] || '').replace('S', '')

    if (hours) return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`
    return `${minutes}:${seconds.padStart(2, '0')}`
  }

  private determineCategory(title: string, description: string): string {
    const lowerTitle = title.toLowerCase()
    const lowerDesc = description.toLowerCase()

    if (lowerTitle.includes('challenge') || lowerDesc.includes('challenge')) {
      return 'challenges'
    }
    if (lowerTitle.includes('shorts') || lowerDesc.includes('shorts')) {
      return 'shorts'
    }
    if (lowerTitle.includes('gameplay') || lowerDesc.includes('gameplay')) {
      return 'gameplay'
    }
    return 'other'
  }
} 