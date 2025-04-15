"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { ProductCard } from "@/components/product-card"
import { use } from "react"
import Cookies from 'js-cookie'

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
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  useEffect(() => {
    // Устанавливаем ID пользователя в cookie, если его нет
    if (!Cookies.get('userId')) {
      const userId = 'user-' + Math.random().toString(36).substr(2, 9)
      Cookies.set('userId', userId, { expires: 365 })
    }

    const fetchData = async () => {
      try {
        // Fetch product data
        const productResponse = await fetch(`/api/products/${resolvedParams.id}`)
        if (!productResponse.ok) throw new Error('Failed to fetch product')
        const productData = await productResponse.json()
        setProduct(productData)

        // Fetch similar products
        const similarResponse = await fetch(`/api/products/similar?currentProductId=${resolvedParams.id}`)
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
  }, [resolvedParams.id])

  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      alert('Пожалуйста, выберите размер и цвет')
      return
    }

    setIsAddingToCart(true)
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product?.id,
          size: selectedSize,
          color: selectedColor,
          quantity: 1
        })
      })

      if (!response.ok) throw new Error('Failed to add to cart')
      alert('Товар добавлен в корзину')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsAddingToCart(false)
    }
  }

  if (loading) return <div>Загрузка...</div>
  if (error) return <div>Ошибка: {error}</div>
  if (!product) return <div>Товар не найден</div>

  return (
    <main className="min-h-screen bg-white text-[#333] font-['Inter',sans-serif]">
      <Header />

      <div className="container mx-auto py-12">
        <div className="grid grid-cols-2 gap-12">
          <div>
            <div className="aspect-square relative bg-gray-50">
              <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
            </div>
          </div>

          <div>
            <h1 className="text-2xl mb-2">{product.name}</h1>
            <p className="text-2xl mb-6">{product.price} ₴</p>

            <div className="mb-6">
              <p className="mb-2">Размер</p>
              <div className="flex space-x-2 mb-6">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    className={`w-10 h-10 border flex items-center justify-center ${
                      selectedSize === size ? 'border-[#c1b6ad]' : 'border-gray-200 hover:border-[#c1b6ad]'
                    }`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <p className="mb-2">Цвет</p>
              <div className="flex space-x-2 mb-6">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    className={`px-3 py-1 border ${
                      selectedColor === color ? 'border-[#c1b6ad]' : 'border-gray-200 hover:border-[#c1b6ad]'
                    }`}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color}
                  </button>
                ))}
              </div>

              <button
                className="w-full py-3 bg-[#c1b6ad] text-white mb-8 disabled:opacity-50"
                onClick={handleAddToCart}
                disabled={isAddingToCart || !selectedSize || !selectedColor}
              >
                {isAddingToCart ? 'Добавление...' : 'Добавить в корзину'}
              </button>

              <div className="border-t border-gray-100 pt-6">
                <p className="mb-4">{product.description}</p>
                <p className="mb-2">
                  <strong>Состав:</strong> {product.composition}
                </p>
                <p>
                  <strong>Уход:</strong> {product.care}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-xl mb-6">Похожие товары</h2>
          <div className="grid grid-cols-3 gap-6">
            {similarProducts.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
