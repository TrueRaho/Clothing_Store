"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { useAuth } from "@/contexts/auth-context"
import { ChevronRight } from "lucide-react"

interface OrderItem {
  id: string
  name: string
  size: string
  color: string
  price: number
  quantity: number
  image: string
}

interface Order {
  id: string
  orderNumber: string
  createdAt: string
  status: string
  total: number
  items: OrderItem[]
}

export default function Orders() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  // Загрузка заказов из API
  useEffect(() => {
    if (isAuthenticated && user?.email) {
      fetchOrders(user.email)
    }
  }, [isAuthenticated, user])

  // Редирект на страницу входа, если пользователь не авторизован
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  // Функция загрузки заказов
  const fetchOrders = async (userEmail: string) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/orders?userEmail=${encodeURIComponent(userEmail)}`)
      
      if (!response.ok) {
        throw new Error("Не вдалося завантажити замовлення")
      }
      
      const data = await response.json()
      
      // Форматирование данных для отображения
      const formattedOrders = data.map((order: any) => ({
        id: order.id,
        orderNumber: order.orderNumber,
        createdAt: formatDate(new Date(order.createdAt)),
        status: order.status,
        total: order.total,
        items: order.items
      }))
      
      setOrders(formattedOrders)
    } catch (error) {
      console.error("Помилка при завантаженні замовлень:", error)
    } finally {
      setLoading(false)
    }
  }

  // Функция форматирования даты
  const formatDate = (date: Date) => {
    const day = date.getDate()
    const months = [
      "січня", "лютого", "березня", "квітня", "травня", "червня",
      "липня", "серпня", "вересня", "жовтня", "листопада", "грудня"
    ]
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    
    return `${day} ${month} ${year}`
  }

  if (!isAuthenticated) {
    return null // Не отображаем ничего во время редиректа
  }

  return (
    <main className="min-h-screen bg-white text-[#333] font-['Inter',sans-serif]">
      <Header />

      <div className="container mx-auto py-12">
        <h1 className="text-2xl mb-8">Мої замовлення</h1>

        {loading ? (
          <div className="text-center py-12">
            <p>Завантаження замовлень...</p>
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-8">
            {orders.map((order) => (
              <div key={order.id} className="border border-gray-100">
                <div className="grid grid-cols-4 p-6 border-b border-gray-100">
                  <div>
                    <p className="text-sm text-gray-500">Номер замовлення</p>
                    <p className="font-medium">{order.orderNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Дата</p>
                    <p>{order.createdAt}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Статус</p>
                    <p
                      className={
                        order.status === "Доставлено"
                          ? "text-green-600"
                          : order.status === "В дорозі"
                            ? "text-blue-600"
                            : "text-orange-500"
                      }
                    >
                      {order.status}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Сума</p>
                    <p className="font-medium">{order.total} ₴</p>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-lg mb-4">Товари у замовленні</h3>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center">
                        <div className="w-20 h-20 relative mr-4 bg-gray-50">
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            Розмір: {item.size}, Колір: {item.color}
                          </p>
                          <p className="text-sm">
                            {item.price} ₴ × {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 border-t border-gray-100 flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Разом</p>
                    <p className="text-lg font-medium">{order.total} ₴</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-gray-100">
            <p className="mb-6">У вас поки немає замовлень</p>
            <Link href="/catalog" className="px-8 py-3 bg-[#c1b6ad] text-white">
              Перейти до каталогу
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
