"use client"

import { useState } from "react"
import { addToCart } from "../lib/cart"

type AddToCartButtonProps = {
  product: {
    id: string
    name: string
    price: number
    image: string
  }
  selectedSize: string
  selectedColor: string
  className?: string
}

export default function AddToCartButton({ product, selectedSize, selectedColor, className = "" }: AddToCartButtonProps) {
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert("Пожалуйста, выберите размер и цвет")
      return
    }

    addToCart(product, selectedSize, selectedColor)
    setIsAdded(true)

    // Сбрасываем состояние успешного добавления через 2 секунды
    setTimeout(() => {
      setIsAdded(false)
    }, 2000)
  }

  return (
    <button
      onClick={handleAddToCart}
      className={`px-8 py-3 bg-[#c1b6ad] text-white transition-all ${isAdded ? "bg-green-600" : ""} ${className}`}
      disabled={isAdded}
    >
      {isAdded ? "Добавлено ✓" : "Добавить в корзину"}
    </button>
  )
} 