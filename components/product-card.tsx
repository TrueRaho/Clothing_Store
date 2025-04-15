'use client'

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
  sizes: string[]
  colors: string[]
}

export function ProductCard({ id, name, price, image, sizes, colors }: ProductCardProps) {
  const [selectedSize, setSelectedSize] = useState(sizes[0])
  const [selectedColor, setSelectedColor] = useState(colors[0])
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async () => {
    try {
      setIsAdding(true)
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: id, size: selectedSize, color: selectedColor, quantity: 1 }),
      })
      
      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = '/login'
          return
        }
        throw new Error('Failed to add to cart')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="group">
      <Link href={`/product/${id}`}>
        <div className="aspect-square overflow-hidden bg-gray-50 mb-3">
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            width={400}
            height={400}
            className="object-cover w-full h-full"
          />
        </div>
        <h3 className="text-[#333] mb-1">{name}</h3>
        <p className="text-[#333] mb-3">{price} ₴</p>
      </Link>
      <div className="mb-3">
        <select 
          value={selectedSize} 
          onChange={(e) => setSelectedSize(e.target.value)}
          className="w-full mb-2 p-2 border border-[#c1b6ad]"
        >
          {sizes.map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
        <select 
          value={selectedColor} 
          onChange={(e) => setSelectedColor(e.target.value)}
          className="w-full mb-2 p-2 border border-[#c1b6ad]"
        >
          {colors.map(color => (
            <option key={color} value={color}>{color}</option>
          ))}
        </select>
      </div>
      <button 
        onClick={handleAddToCart}
        disabled={isAdding}
        className="w-full py-2 border border-[#c1b6ad] text-[#333] hover:bg-[#c1b6ad] hover:text-white transition-colors disabled:opacity-50"
      >
        {isAdding ? 'Добавление...' : 'Добавить в корзину'}
      </button>
    </div>
  )
}
