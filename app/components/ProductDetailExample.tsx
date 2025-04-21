"use client"

import { useState } from "react"
import Image from "next/image"
import AddToCartButton from "./AddToCartButton"

// Пример данных о товаре
const productExample = {
  id: "1",
  name: "Пижама из хлопка",
  price: 3990,
  description: "Комфортная пижама из 100% хлопка для домашнего отдыха.",
  composition: "100% хлопок",
  care: "Машинная стирка при 30°C, не отбеливать, не сушить в машине",
  image: "/placeholder.svg",
  colors: ["Белый", "Бежевый", "Синий"],
  sizes: ["XS", "S", "M", "L", "XL"],
  category: "sleepwear"
}

export default function ProductDetailExample() {
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")

  return (
    <div className="container mx-auto py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square">
          <Image src={productExample.image} alt={productExample.name} fill className="object-cover" />
        </div>
        
        <div>
          <h1 className="text-2xl mb-2">{productExample.name}</h1>
          <p className="text-xl mb-4">{productExample.price} ₽</p>
          
          <div className="mb-6">
            <h3 className="text-sm mb-2">Размер</h3>
            <div className="flex gap-2">
              {productExample.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`w-10 h-10 border flex items-center justify-center ${
                    selectedSize === size ? "border-black bg-gray-100" : "border-gray-200"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mb-8">
            <h3 className="text-sm mb-2">Цвет</h3>
            <div className="flex gap-2">
              {productExample.colors.map(color => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 border ${
                    selectedColor === color ? "border-black bg-gray-100" : "border-gray-200"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
          
          <AddToCartButton 
            product={{
              id: productExample.id,
              name: productExample.name,
              price: productExample.price,
              image: productExample.image
            }}
            selectedSize={selectedSize}
            selectedColor={selectedColor}
            className="w-full"
          />
          
          <div className="mt-8">
            <h3 className="text-lg mb-2">Описание</h3>
            <p className="mb-4">{productExample.description}</p>
            
            <h3 className="text-lg mb-2">Состав</h3>
            <p className="mb-4">{productExample.composition}</p>
            
            <h3 className="text-lg mb-2">Уход</h3>
            <p>{productExample.care}</p>
          </div>
        </div>
      </div>
    </div>
  )
} 