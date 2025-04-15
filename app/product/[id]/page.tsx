"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { ProductCard } from "@/components/product-card"

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

export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [similarProducts, setSimilarProducts] = useState<SimilarProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product data
        const productResponse = await fetch(`/api/products/${params.id}`)
        if (!productResponse.ok) throw new Error('Failed to fetch product')
        const productData = await productResponse.json()
        setProduct(productData)

        // Fetch similar products
        const similarResponse = await fetch(`/api/products/similar?currentProductId=${params.id}`)
        if (!similarResponse.ok) throw new Error('Failed to fetch similar products')
        const similarData = await similarResponse.json()
        setSimilarProducts(similarData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  if (loading) return <div>Загрузка...</div>
  if (error) return <div>Ошибка: {error}</div>
  if (!product) return <div>Товар не найден</div>

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
              <h2 className="text-xl mb-2">Описание</h2>
              <p>{product.description}</p>
            </div>
            <div className="mb-6">
              <h2 className="text-xl mb-2">Состав</h2>
              <p>{product.composition}</p>
            </div>
            <div className="mb-6">
              <h2 className="text-xl mb-2">Уход</h2>
              <p>{product.care}</p>
            </div>
            <div className="mb-6">
              <h2 className="text-xl mb-2">Размеры</h2>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <span key={size} className="px-4 py-2 border border-[#c1b6ad]">
                    {size}
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <h2 className="text-xl mb-2">Цвета</h2>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(color => (
                  <span key={color} className="px-4 py-2 border border-[#c1b6ad]">
                    {color}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl mb-8">Похожие товары</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {similarProducts.map(product => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                  sizes={[]}
                  colors={[]}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}