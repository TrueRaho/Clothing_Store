"use client"

import Link from "next/link"
import Image from "next/image"
import { Trash2 } from "lucide-react"
import { Header } from "@/components/header"
import { useEffect, useState } from "react"
import { use } from "react"

type CartItem = {
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

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('/api/cart')
        if (!response.ok) throw new Error('Failed to fetch cart')
        const data = await response.json()
        setCartItems(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [])

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity }),
      })
      if (!response.ok) throw new Error('Failed to update quantity')
      const updatedItem = await response.json()
      setCartItems(items => items.map(item => 
        item.id === itemId ? updatedItem : item
      ))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'DELETE',
      })
      if (!response.ok) throw new Error('Failed to remove item')
      setCartItems(items => items.filter(item => item.id !== itemId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    }
  }

  if (loading) return <div>Загрузка...</div>
  if (error) return <div>Ошибка: {error}</div>

  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <main className="min-h-screen bg-white text-[#333] font-['Inter',sans-serif]">
      <Header />

      <div className="container mx-auto py-12">
        <h1 className="text-2xl mb-8">Корзина</h1>

        {cartItems.length > 0 ? (
          <>
            <table className="w-full mb-8">
              <thead className="border-b border-gray-100">
                <tr>
                  <th className="text-left py-4">Товар</th>
                  <th className="text-left py-4">Размер</th>
                  <th className="text-left py-4">Цена</th>
                  <th className="text-left py-4">Количество</th>
                  <th className="text-left py-4">Сумма</th>
                  <th className="text-left py-4"></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="py-4">
                      <div className="flex items-center">
                        <div className="w-16 h-16 relative mr-4">
                          <Image src={item.product.image || "/placeholder.svg"} alt={item.product.name} fill className="object-cover" />
                        </div>
                        <span>{item.product.name}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      {item.size}, {item.color}
                    </td>
                    <td className="py-4">{item.product.price} ₴</td>
                    <td className="py-4">
                      <div className="flex items-center">
                        <button 
                          className="w-8 h-8 border border-gray-200 flex items-center justify-center"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="w-8 h-8 flex items-center justify-center">{item.quantity}</span>
                        <button 
                          className="w-8 h-8 border border-gray-200 flex items-center justify-center"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-4">{item.product.price * item.quantity} ₴</td>
                    <td className="py-4">
                      <button onClick={() => handleRemoveItem(item.id)}>
                        <Trash2 className="w-5 h-5 text-gray-400 hover:text-[#333]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-between items-center border-t border-gray-100 pt-6">
              <div>
                <p className="text-xl">Итого: {total} ₴</p>
              </div>
              <Link href="/checkout" className="px-8 py-3 bg-[#c1b6ad] text-white">
                Оформить заказ
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="mb-6">Ваша корзина пуста</p>
            <Link href="/catalog" className="px-8 py-3 bg-[#c1b6ad] text-white">
              Перейти в каталог
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
