'use client'

import Image from 'next/image'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'

interface CartItemProps {
  item: {
    id: string
    product: {
      id: string
      name: string
      price: number
      image: string
    }
    size: string
    color: string
    quantity: number
  }
}

export function CartItem({ item }: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity)
  const [isUpdating, setIsUpdating] = useState(false)

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return
    setIsUpdating(true)
    try {
      const response = await fetch('/api/cart', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id, quantity: newQuantity }),
      })
      if (!response.ok) throw new Error('Failed to update quantity')
      setQuantity(newQuantity)
    } catch (error) {
      console.error('Error updating quantity:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemove = async () => {
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId: item.id }),
      })
      if (!response.ok) throw new Error('Failed to remove item')
      window.location.reload()
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  return (
    <div className="flex items-center justify-between border-b pb-4">
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 relative">
          <Image
            src={item.product.image || "/placeholder.svg"}
            alt={item.product.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="font-medium">{item.product.name}</h3>
          <p className="text-sm text-gray-500">
            {item.size}, {item.color}
          </p>
          <p className="text-sm">{item.product.price} ₴</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center border">
          <button
            className="w-8 h-8 flex items-center justify-center disabled:opacity-50"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={isUpdating || quantity <= 1}
          >
            -
          </button>
          <span className="w-8 h-8 flex items-center justify-center">
            {quantity}
          </span>
          <button
            className="w-8 h-8 flex items-center justify-center disabled:opacity-50"
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={isUpdating}
          >
            +
          </button>
        </div>
        <button onClick={handleRemove} className="text-gray-400 hover:text-[#333]">
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  )
} 