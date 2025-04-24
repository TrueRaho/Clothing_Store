'use client'

import Image from 'next/image'
import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { CartItem as CartItemType } from '@/lib/cart'

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (id: string, size: string, color: string, quantity: number) => void
  onRemove: (id: string, size: string, color: string) => void
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return
    setIsUpdating(true)
    try {
      await onUpdateQuantity(item.id, item.size, item.color, newQuantity)
    } catch (error) {
      console.error('Error updating quantity:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemove = async () => {
    try {
      await onRemove(item.id, item.size, item.color)
    } catch (error) {
      console.error('Error removing item:', error)
    }
  }

  return (
    <div className="flex items-center justify-between border-b pb-4">
      <div className="flex items-center space-x-4">
        <div className="w-20 h-20 relative">
          <Image
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="font-medium">{item.name}</h3>
          <p className="text-sm text-gray-500">
            {item.size}, {item.color}
          </p>
          <p className="text-sm">{item.price} ₴</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center border">
          <button
            className="w-8 h-8 flex items-center justify-center disabled:opacity-50"
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={isUpdating || item.quantity <= 1}
          >
            -
          </button>
          <span className="w-8 h-8 flex items-center justify-center">
            {item.quantity}
          </span>
          <button
            className="w-8 h-8 flex items-center justify-center disabled:opacity-50"
            onClick={() => handleQuantityChange(item.quantity + 1)}
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