import { StreamData } from "./streams-content"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface LiveStreamProps {
  stream: StreamData
}

export function LiveStream({ stream }: LiveStreamProps) {
  return (
    <div className="relative rounded-lg overflow-hidden bg-card">
      <div className="aspect-video relative">
        {stream.thumbnail && (
          <Image
            src={stream.thumbnail}
            alt={stream.title || "Stream thumbnail"}
            fill
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-white">{stream.title}</h3>
              <p className="text-sm text-gray-300">
                {stream.platform === "twitch" ? "Twitch" : "YouTube"}
              </p>
            </div>
            {stream.url && (
              <Link href={stream.url} target="_blank" rel="noopener noreferrer">
                <Button size="sm" className="bg-red-600 hover:bg-red-700">
                  <Play className="w-4 h-4 mr-2" />
                  Watch Live
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
} 