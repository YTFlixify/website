'use client'

import Link from "next/link"
import { Search, Globe, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthButtonWrapper } from "@/app/components/auth-button-wrapper"
import { useState, useCallback } from "react"
import { debounce } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/lib/language-context"
import { i18n, type Locale } from "@/i18n.config"

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState("")
  const { locale, setLocale } = useLanguage()

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      // Handle search logic here
      console.log("Searching for:", query)
    }, 300),
    []
  )

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    debouncedSearch(query)
  }

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "fr", name: "Français" },
    { code: "de", name: "Deutsch" },
    { code: "it", name: "Italiano" },
    { code: "pt", name: "Português" },
    { code: "ru", name: "Русский" },
    { code: "ja", name: "日本語" },
    { code: "zh", name: "中文" },
    { code: "ko", name: "한국어" },
  ]

  return (
    <header className="border-b border-zinc-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="font-bold text-2xl tracking-tighter">
              <span className="text-[#00517c]">FLIXIFY</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/videos" className="text-sm font-medium hover:text-[#00517c]">
                Videos
              </Link>
              <Link href="/streams" className="text-sm font-medium hover:text-[#00517c]">
                Streams
              </Link>
              <Link href="/gameplay" className="text-sm font-medium hover:text-[#00517c]">
                Gameplay
              </Link>
              <Link href="/merch" className="text-sm font-medium hover:text-[#00517c] flex items-center">
                Merch <ChevronDown className="ml-1 h-4 w-4" />
              </Link>
              <Link href="/crew" className="text-sm font-medium hover:text-[#00517c]">
                Crew
              </Link>
              <Link href="/news" className="text-sm font-medium hover:text-[#00517c]">
                News
              </Link>
              <Link href="/tournaments" className="text-sm font-medium hover:text-[#00517c] flex items-center">
                Tournaments <ChevronDown className="ml-1 h-4 w-4" />
              </Link>
            </nav>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <div className="relative hidden md:block w-64">
              <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                type="search"
                placeholder="Search videos and content..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-8 bg-zinc-900 border-zinc-800 rounded-full text-sm h-9 focus-visible:ring-[#00517c]"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => setLocale(lang.code as Locale)}
                    className={locale === lang.code ? "bg-zinc-100 dark:bg-zinc-800" : ""}
                  >
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <AuthButtonWrapper />
            <Button className="rounded-full text-sm h-9 px-4 bg-[#00517c] hover:bg-[#00517c]/90 text-white font-medium">
              Subscribe
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
} 