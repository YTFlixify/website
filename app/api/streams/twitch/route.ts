import { NextResponse } from "next/server"

export async function GET() {
  try {
    const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID
    const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET
    const TWITCH_USER_ID = process.env.TWITCH_USER_ID

    if (!TWITCH_CLIENT_ID || !TWITCH_CLIENT_SECRET || !TWITCH_USER_ID) {
      console.error("Missing Twitch API configuration:", {
        hasClientId: !!TWITCH_CLIENT_ID,
        hasClientSecret: !!TWITCH_CLIENT_SECRET,
        hasUserId: !!TWITCH_USER_ID
      })
      return NextResponse.json(
        { error: "Twitch API configuration missing" },
        { status: 500 }
      )
    }

    // First, get an access token
    console.log("Requesting Twitch access token...")
    const tokenResponse = await fetch(
      `https://id.twitch.tv/oauth2/token?client_id=${TWITCH_CLIENT_ID}&client_secret=${TWITCH_CLIENT_SECRET}&grant_type=client_credentials`,
      { method: "POST" }
    )

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json()
      console.error("Failed to get Twitch access token:", {
        status: tokenResponse.status,
        statusText: tokenResponse.statusText,
        error: errorData
      })
      throw new Error("Failed to get Twitch access token")
    }

    const { access_token } = await tokenResponse.json()
    console.log("Successfully obtained Twitch access token")

    // Fetch videos from the channel
    console.log("Fetching Twitch videos...")
    const response = await fetch(
      `https://api.twitch.tv/helix/videos?user_id=${TWITCH_USER_ID}&type=archive&first=10`,
      {
        headers: {
          "Client-ID": TWITCH_CLIENT_ID,
          Authorization: `Bearer ${access_token}`,
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Failed to fetch Twitch videos:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData
      })
      throw new Error("Failed to fetch Twitch videos")
    }

    const data = await response.json()
    console.log(`Successfully fetched ${data.data?.length || 0} Twitch videos`)

    // Transform Twitch data to match our StreamData interface
    const streams = data.data.map((item: any) => ({
      isLive: false, // These are past broadcasts
      title: item.title,
      thumbnail: item.thumbnail_url.replace("%{width}", "1280").replace("%{height}", "720"),
      url: `https://www.twitch.tv/videos/${item.id}`,
      platform: "twitch" as const,
      date: item.created_at,
      views: item.view_count
    }))

    return NextResponse.json(streams)
  } catch (error) {
    console.error("Error in Twitch API route:", error)
    return NextResponse.json(
      { error: "Failed to fetch Twitch streams" },
      { status: 500 }
    )
  }
} 