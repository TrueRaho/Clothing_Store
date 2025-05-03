"use client"

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useCart } from '@/contexts/cart-context'
import { useEffect } from 'react'

export default function CartIndicator() {
  const { totalItems, refreshCart } = useCart()

  // Обновляем данные при монтировании компонента
  useEffect(() => {
    console.log('CartIndicator mounted, refreshing cart')
    refreshCart()
  }, [refreshCart])

  const handleMouseEnter = () => {
    console.log('Mouse entered CartIndicator, refreshing cart')
    refreshCart()
  }

  return (
    <Link 
      href="/cart" 
      className="relative text-gray-800 hover:text-[#c1b6ad] flex items-center"
      onMouseEnter={handleMouseEnter}
      onClick={refreshCart}
    >
      <ShoppingBag className="w-5 h-5" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-[#c1b6ad] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </Link>
  )
} 