import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Flixify - Official Website",
  description: "Your Ultimate Gaming Video Platform",
}

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 