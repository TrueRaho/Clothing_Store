"use client"

import Link from "next/link"
import { Search, ShoppingBag, User, LogOut, ChevronDown } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useState, useRef, useEffect } from "react"
import { useCart } from "@/lib/hooks/use-cart"
import { useRouter } from "next/navigation"
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'

async function getCartItemsCount() {
  const userId = cookies().get('userId')?.value
  if (!userId) return 0

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true }
  })

  return cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0
}

export async function Header() {
  const totalItems = await getCartItemsCount()

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
            <Link href="/cart" className="relative text-[#333] hover:text-[#c1b6ad]">
              Корзина
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[#c1b6ad] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
