import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Flixify - Sign Up",
  description: "Create your Flixify account",
}

export default function SignUpLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 