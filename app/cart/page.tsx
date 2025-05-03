"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { CartItem as CartItemType } from "@/lib/cart"
import { CartItem } from "@/components/cart-item"

export default function Cart() {
  // Состояние для элементов корзины
  const [cartItems, setCartItems] = useState<CartItemType[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Загрузка корзины из localStorage при монтировании компонента
  useEffect(() => {
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
    setIsLoading(false)
  }, [])

  // Сохранение корзины в localStorage при изменении
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem("cart", JSON.stringify(cartItems))
    }
  }, [cartItems, isLoading])

  // Функция изменения количества товара
  const updateQuantity = (id: string, size: string, color: string, newQuantity: number) => {
    setCartItems(prevItems => 
      prevItems.map(item => {
        if (item.id === id && item.size === size && item.color === color) {
          return { ...item, quantity: newQuantity }
        }
        return item
      })
    )
  }

  // Функция удаления товара
  const removeItem = (id: string, size: string, color: string) => {
    setCartItems(prevItems => prevItems.filter(item => 
      !(item.id === id && item.size === size && item.color === color)
    ))
  }

  // Расчет общей суммы
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Завантаження...</div>
  }

  return (
    <main className="min-h-screen bg-white text-[#333] font-['Inter',sans-serif]">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <h1 className="text-2xl mb-8">Корзина</h1>

        {cartItems.length > 0 ? (
          <div className="space-y-6">
            <div className="space-y-6">
              {cartItems.map(item => (
                <CartItem
                  key={`${item.id}-${item.size}-${item.color}`}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>

            <div className="flex justify-between items-center border-t border-gray-100 pt-6">
              <div>
                <p className="text-xl">Итого: {total} ₴</p>
              </div>
              <Link href="/checkout" className="px-8 py-3 bg-[#c1b6ad] text-white">
              Оформити замовлення
              </Link>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="mb-6">Ваш кошик порожній</p>
            <Link href="/catalog" className="px-8 py-3 bg-[#c1b6ad] text-white">
              Перейти в каталог
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
