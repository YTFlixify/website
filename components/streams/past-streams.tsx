import { StreamData } from "./streams-content"
import { Button } from "@/components/ui/button"
import { Play, Eye } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface PastStreamsProps {
  streams: StreamData[]
}

export function PastStreams({ streams }: PastStreamsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {streams.map((stream, index) => (
        <div key={`${stream.platform}-${stream.url}-${index}`} className="relative group">
          <div className="aspect-video relative overflow-hidden rounded-lg">
            {stream.thumbnail && (
              <Image
                src={stream.thumbnail}
                alt={stream.title || "Past stream"}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <h3 className="text-lg font-bold mb-2">{stream.title}</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-300">
                    {stream.platform === "twitch" ? "Twitch" : "YouTube"}
                  </span>
                  {stream.date && (
                    <span className="text-sm text-gray-300">
                      {new Date(stream.date).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-sm text-gray-300">
                  <Eye className="h-4 w-4" />
                  <span>{stream.views?.toLocaleString() || "0"}</span>
                </div>
              </div>
            </div>
          </div>
          {stream.url && (
            <Link href={stream.url} target="_blank" rel="noopener noreferrer">
              <Button
                className="absolute top-4 right-4 rounded-full text-sm h-9 px-4 bg-[#00517c] hover:bg-[#00517c]/90 text-white font-medium"
                size="sm"
              >
                <Play className="w-4 h-4 mr-2" />
                Watch
              </Button>
            </Link>
          )}
        </div>
      ))}
    </div>
  )
} 