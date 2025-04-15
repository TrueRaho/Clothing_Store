'use client'

import Image from "next/image"
import Link from "next/link"

interface ProductCardProps {
  id: string
  name: string
  price: number
  image: string
  sizes: string[]
  colors: string[]
}

export function ProductCard({ id, name, price, image, sizes, colors }: ProductCardProps) {
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
          className="w-full mb-2 p-2 border border-[#c1b6ad]"
          disabled
        >
          {sizes.map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
        <select 
          className="w-full mb-2 p-2 border border-[#c1b6ad]"
          disabled
        >
          {colors.map(color => (
            <option key={color} value={color}>{color}</option>
          ))}
        </select>
      </div>
      <Link 
        href={`/product/${id}`}
        className="block w-full py-2 border border-[#c1b6ad] text-[#333] hover:bg-[#c1b6ad] hover:text-white transition-colors text-center"
      >
        Подробнее
      </Link>
    </div>
  )
}