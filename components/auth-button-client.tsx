"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { signOut } from "@/app/actions/auth"
import { User } from "@supabase/supabase-js"
import { LogOut, User as UserIcon, Settings, Mail } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"

interface AuthButtonClientProps {
  user: User | null
  unreadCount: number
}

export function AuthButtonClient({ user, unreadCount }: AuthButtonClientProps) {
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [profile, setProfile] = useState<any>(null)
  const router = useRouter()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    async function fetchProfile() {
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('avatar_url, username, display_name')
          .eq('id', user.id)
          .single()
        
        if (!error && data) {
          setProfile(data)
        }
      }
    }
    fetchProfile()
  }, [user, supabase])

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      await signOut()
      // Force a hard refresh of the page to ensure all auth state is cleared
      window.location.href = "/"
    } catch (error) {
      console.error('Error signing out:', error)
      setIsSigningOut(false)
    }
  }

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsOpen(true)
    if (dropdownRef.current) {
      const rect = e.currentTarget.getBoundingClientRect()
      dropdownRef.current.style.position = 'fixed'
      dropdownRef.current.style.left = `${e.clientX}px`
      dropdownRef.current.style.top = `${e.clientY}px`
    }
  }

  if (!user) {
    return (
      <Button asChild className="rounded-full text-sm h-9 px-4 bg-[#00517c] hover:bg-[#00517c]/90 text-white font-medium">
        <Link href="/auth/sign-in">
          <UserIcon className="mr-2 h-4 w-4" />
          Sign In
        </Link>
      </Button>
    )
  }

  return (
    <div className="flex items-center gap-4">
      <Button variant="ghost" asChild>
        <Link href="/messages" className="relative">
          <Mail className="mr-2 h-4 w-4" />
          Messages
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount}
            </span>
          )}
        </Link>
      </Button>
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="relative h-9 w-9 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center overflow-hidden border-2 border-white"
            onContextMenu={handleContextMenu}
          >
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt="Profile"
                fill
                className="object-cover"
              />
            ) : (
              <UserIcon className="transform scale-[1.8]" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          ref={dropdownRef}
          align="end" 
          className="w-56"
          onContextMenu={(e) => e.preventDefault()}
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex items-center gap-3">
              <div className="relative aspect-square w-10 rounded-[50%] overflow-hidden bg-zinc-800 flex items-center justify-center">
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt="Profile"
                    fill
                    className="object-cover rounded-[50%]"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xl">
                    {profile?.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{profile?.display_name || profile?.username || user.email}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/profile" className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer text-red-600 focus:text-red-600"
            onClick={handleSignOut}
            disabled={isSigningOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            {isSigningOut ? "Signing out..." : "Sign Out"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
} 