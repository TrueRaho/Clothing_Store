'use client'

import { Header } from "@/components/header"
import { ProductCard } from "@/components/product-card"
import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Product {
  id: string
  name: string
  price: number
  image: string
  category: string
  sizes: string[]
  colors: string[]
  composition: string
}

export default function Catalog() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [allSizes, setAllSizes] = useState<string[]>([])
  const [allColors, setAllColors] = useState<string[]>([])
  const [allCompositions, setAllCompositions] = useState<string[]>([])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams(searchParams.toString())
        const response = await fetch(`/api/products?${params.toString()}`)
        const data = await response.json() as Product[]
        setProducts(data)
        
        // Получаем уникальные значения для фильтров
        const sizes = Array.from(new Set(data.flatMap((p: Product) => p.sizes)))
        const colors = Array.from(new Set(data.flatMap((p: Product) => p.colors)))
        const compositions = Array.from(new Set(data.map((p: Product) => p.composition)))
        
        setAllSizes(sizes)
        setAllColors(colors)
        setAllCompositions(compositions)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [searchParams])

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/catalog?${params.toString()}`)
  }

  if (loading) {
    return <div>Загрузка...</div>
  }

  return (
    <main className="min-h-screen bg-white text-[#333] font-['Inter',sans-serif]">
      <Header />

      <div className="container mx-auto py-8">
        <h1 className="text-2xl mb-8">Каталог</h1>

        <div className="border-y border-gray-100 py-4 mb-8">
          <div className="flex items-center space-x-8">
            <div>
              <label className="block mb-1 text-sm">Категория</label>
              <select 
                className="border border-gray-200 p-1 w-32"
                value={searchParams.get('category') || ''}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">Все категории</option>
                <option value="pajamas">Пижамы</option>
                <option value="robes">Халаты</option>
                <option value="suits">Костюмы</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm">Размер</label>
              <select 
                className="border border-gray-200 p-1 w-32"
                value={searchParams.get('size') || ''}
                onChange={(e) => handleFilterChange('size', e.target.value)}
              >
                <option value="">Все размеры</option>
                {allSizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm">Цвет</label>
              <select 
                className="border border-gray-200 p-1 w-32"
                value={searchParams.get('color') || ''}
                onChange={(e) => handleFilterChange('color', e.target.value)}
              >
                <option value="">Все цвета</option>
                {allColors.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm">Состав</label>
              <select 
                className="border border-gray-200 p-1 w-32"
                value={searchParams.get('composition') || ''}
                onChange={(e) => handleFilterChange('composition', e.target.value)}
              >
                <option value="">Любой состав</option>
                {allCompositions.map(composition => (
                  <option key={composition} value={composition}>{composition}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 text-sm">Цена</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="number" 
                  placeholder="от" 
                  className="border border-gray-200 p-1 w-20"
                  value={searchParams.get('minPrice') || ''}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                />
                <span>—</span>
                <input 
                  type="number" 
                  placeholder="до" 
                  className="border border-gray-200 p-1 w-20"
                  value={searchParams.get('maxPrice') || ''}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-6">
          {products.map((product) => (
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
    </main>
  )
}
