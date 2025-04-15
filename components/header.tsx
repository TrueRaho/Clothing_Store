"use client"

import Link from "next/link"
import { Search, ShoppingBag, User, LogOut, ChevronDown } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useState, useRef, useEffect } from "react"
import { useCart } from "@/lib/hooks/use-cart"
import { useRouter } from "next/navigation"

export function Header() {
  const { user, logout, isAuthenticated } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { totalItems, loading } = useCart()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const router = useRouter()

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const search = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([])
        return
      }

      setIsSearching(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
        const data = await response.json()
        setSearchResults(data.products || [])
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsSearching(false)
      }
    }

    search()
  }, [searchQuery])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-[#333]">
            Home Clothing
          </Link>

          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-[#c1b6ad] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#c1b6ad]"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#c1b6ad]"
              >
                <Search size={20} />
              </button>
            </div>
            {isSearching && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-[#c1b6ad] rounded-lg shadow-lg">
                <div className="p-2">Поиск...</div>
              </div>
            )}
            {searchResults.length > 0 && !isSearching && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-[#c1b6ad] rounded-lg shadow-lg">
                {searchResults.map((product: any) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="block p-2 hover:bg-gray-50"
                  >
                    {product.name}
                  </Link>
                ))}
              </div>
            )}
          </form>

          <div className="flex items-center space-x-4">
            <Link href="/cart" className="relative">
              <ShoppingBag size={24} className="text-[#333]" />
              {!loading && totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#c1b6ad] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-1"
                >
                  <User size={24} className="text-[#333]" />
                  <ChevronDown size={16} className="text-[#333]" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-[#c1b6ad] rounded-lg shadow-lg">
                    <div className="p-4">
                      <p className="text-sm text-[#333] mb-2">{user?.email}</p>
                      <button
                        onClick={logout}
                        className="flex items-center space-x-2 text-sm text-[#333] hover:text-[#c1b6ad]"
                      >
                        <LogOut size={16} />
                        <span>Выйти</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="text-[#333] hover:text-[#c1b6ad]">
                Войти
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
