"use client"

import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"

export function Header({ cartItemsCount = 0 }: { cartItemsCount?: number }) {
  const { user, logout, isAuthenticated } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  return (
    <header className="bg-white border-b border-[#c1b6ad]">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-[#333]">
            Home Clothing
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link href="/catalog" className="text-[#333] hover:text-[#c1b6ad]">
              Каталог
            </Link>
          </nav>

          <Link href="/cart" className="relative">
            <ShoppingBag className="w-5 h-5 text-gray-800" />
            <span className="absolute -top-1 -right-1 bg-[#c1b6ad] text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
              0
            </span>
          </Link>
        </div>
      </div>
    </header>
  )
}
