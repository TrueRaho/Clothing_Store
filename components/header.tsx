"use client"

import Link from "next/link"
import { Search, User, LogOut, ChevronDown } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import CartIndicator from "../app/components/CartIndicator"

export function Header() {
  const { user, logout, isAuthenticated } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
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

    const debounceTimer = setTimeout(search, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/catalog?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="py-6 border-b border-gray-100">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-medium">
          Затишок & Стиль
        </Link>

        <nav className="hidden md:flex space-x-8">
          <Link href="/catalog" className="text-gray-800 hover:text-[#c1b6ad]">
            Каталог
          </Link>
          <Link href="/about" className="text-gray-800 hover:text-[#c1b6ad]">
            О нас
          </Link>
          <Link href="/contacts" className="text-gray-800 hover:text-[#c1b6ad]">
            Контакты
          </Link>
        </nav>

        <div className="flex items-center space-x-6">
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md mx-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Поиск"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-3 pr-8 py-1 border border-gray-200 focus:outline-none focus:border-[#c1b6ad]"
              />
              <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 mt-1 rounded shadow-lg z-50">
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
            </div>
          </form>

          {isAuthenticated ? (
            <div className="relative" ref={dropdownRef}>
              <button
                className="flex items-center text-gray-800 hover:text-[#c1b6ad]"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="w-8 h-8 bg-[#c1b6ad] rounded-full flex items-center justify-center text-white mr-2">
                  {user?.name.charAt(0)}
                </div>
                <span className="mr-1">{user?.name.split(" ")[0]}</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 shadow-sm z-10">
                  <div className="py-2 px-4 border-b border-gray-100">
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>
                  <button
                    className="w-full text-left px-4 py-2 flex items-center text-gray-800 hover:bg-gray-50"
                    onClick={logout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Выйти
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="text-gray-800 hover:text-[#c1b6ad] flex items-center">
              <User className="w-4 h-4 mr-1" />
              Войти
            </Link>
          )}

          <CartIndicator />
        </div>
      </div>
    </header>
  )
}
