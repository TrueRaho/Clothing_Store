"use client"

import Image from "next/image"
import { useEffect, useState, use } from "react"
import { Header } from "@/components/header"
import { ProductCard } from "@/components/product-card"
import AddToCartButton from "@/components/AddToCartButton"

type Product = {
  id: string
  name: string
  price: number
  description: string
  composition: string
  care: string
  image: string
  colors: string[]
  sizes: string[]
}

type SimilarProduct = {
  id: string
  name: string
  price: number
  image: string
}

export default function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const [product, setProduct] = useState<Product | null>(null)
  const [similarProducts, setSimilarProducts] = useState<SimilarProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [selectedColor, setSelectedColor] = useState<string>("")

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product data
        const productResponse = await fetch(`/api/products/${resolvedParams.id}`)
        if (!productResponse.ok) throw new Error('Не вдалося отримати товар')
        const productData = await productResponse.json()
        setProduct(productData)

        // Fetch similar products
        const similarResponse = await fetch(`/api/products/similar?currentProductId=${resolvedParams.id}`)
        if (!similarResponse.ok) throw new Error('Не вдалося знайти схожі товари')
        const similarData = await similarResponse.json()
        setSimilarProducts(similarData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Виникла помилка')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [resolvedParams.id])

  if (loading) return <div>Завантаження...</div>
  if (error) return <div>Помилка: {error}</div>
  if (!product) return <div>Товар не знайдено</div>

  return (
    <div className="min-h-screen bg-white text-[#333] font-['Inter',sans-serif]">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square overflow-hidden bg-gray-50">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              width={800}
              height={800}
              className="object-cover w-full h-full"
            />
          </div>
          <div>
            <h1 className="text-3xl mb-4">{product.name}</h1>
            <p className="text-2xl mb-6">{product.price} ₴</p>
            
            <div className="mb-6">
              <h2 className="text-xl mb-4">Розмір</h2>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <label key={size} className="relative">
                    <input
                      type="radio"
                      name="size"
                      value={size}
                      checked={selectedSize === size}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="sr-only"
                    />
                    <span className={`px-4 py-2 border cursor-pointer ${
                      selectedSize === size 
                        ? 'border-[#c1b6ad] bg-[#c1b6ad] text-white' 
                        : 'border-[#c1b6ad] hover:bg-gray-50'
                    }`}>
                      {size}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl mb-4">Колір</h2>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <label key={color} className="relative">
                    <input
                      type="radio"
                      name="color"
                      value={color}
                      checked={selectedColor === color}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="sr-only"
                    />
                    <span className={`px-4 py-2 border cursor-pointer ${
                      selectedColor === color 
                        ? 'border-[#c1b6ad] bg-[#c1b6ad] text-white' 
                        : 'border-[#c1b6ad] hover:bg-gray-50'
                    }`}>
                      {color}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <AddToCartButton 
              product={{
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image
              }}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              className="w-full"
            />

            <div className="mt-8">
              <h2 className="text-xl mb-2">Опис</h2>
              <p>{product.description}</p>
            </div>
            <div className="mt-6">
              <h2 className="text-xl mb-2">Склад</h2>
              <p>{product.composition}</p>
            </div>
            <div className="mt-6">
              <h2 className="text-xl mb-2">Догляд</h2>
              <p>{product.care}</p>
            </div>
          </div>
        </div>
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl mb-8">Схожі товари</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {similarProducts.map(product => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}