"use client"

import Link from "next/link"
import { Search, ShoppingBag, User, LogOut, ChevronDown } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useState, useRef, useEffect } from "react"

export function Header() {
  const { user, logout, isAuthenticated } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

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
          <div className="relative">
            <input
              type="text"
              placeholder="Поиск"
              className="pl-3 pr-8 py-1 border border-gray-200 focus:outline-none focus:border-[#c1b6ad]"
            />
            <Search className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

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

          <Link href="/cart" className="relative">
            <ShoppingBag className="w-5 h-5 text-gray-800" />
            <span className="absolute -top-1 -right-1 bg-[#c1b6ad] text-white text-xs w-4 h-4 flex items-center justify-center">
              0
            </span>
          </Link>
        </div>
      </div>
    </header>
  )
}
