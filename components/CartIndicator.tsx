"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { getCartItemsCount } from "@/lib/cart"

export default function CartIndicator() {
  const [itemsCount, setItemsCount] = useState(0)

  useEffect(() => {
    // Первоначальная загрузка количества товаров
    setItemsCount(getCartItemsCount())

    // Функция обновления счетчика товаров
    const updateCount = () => {
      setItemsCount(getCartItemsCount())
    }

    // Подписка на события хранилища для обновления счетчика
    window.addEventListener("storage", updateCount)

    // Интервал для регулярной проверки изменений (для того же окна браузера)
    const interval = setInterval(updateCount, 1000)

    return () => {
      window.removeEventListener("storage", updateCount)
      clearInterval(interval)
    }
  }, [])

  return (
    <Link href="/cart" className="relative inline-flex items-center">
      <ShoppingBag className="w-6 h-6" />
      {itemsCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-[#c1b6ad] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {itemsCount}
        </span>
      )}
    </Link>
  )
} 