import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Flixify - Sign In",
  description: "Sign in to your Flixify account",
}

export default function SignInLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
} 