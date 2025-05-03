"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Header } from "@/components/header"
import { useAuth } from "@/contexts/auth-context"
import { useCart } from "@/contexts/cart-context"

export default function Checkout() {
  const { isAuthenticated, user } = useAuth()
  const { cartItems, totalPrice, clearCart, isCartLoading } = useCart()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    comment: ""
  })

  // Предзаполнение данных из пользовательского профиля
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || "",
        email: user.email || ""
      }))
    }
  }, [isAuthenticated, user])

  // Перенаправление на страницу входа, если пользователь не авторизован
  useEffect(() => {
    if (typeof isAuthenticated === 'boolean' && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, router])

  // Редирект на каталог, если корзина пуста ПОСЛЕ загрузки
  useEffect(() => {
    if (!isCartLoading && cartItems.length === 0) {
      console.log("Cart is empty after loading, redirecting to catalog...")
      router.push("/catalog")
    }
  }, [cartItems, router, isCartLoading])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Подготовка данных для отправки
      const orderData = {
        userEmail: formData.email,
        userId: user?.id,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          size: item.size,
          color: item.color,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        total: totalPrice,
        customerInfo: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          comment: formData.comment
        }
      }

      // Отправка запроса на создание заказа
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      })

      if (!response.ok) {
        throw new Error("Не вдалося оформити замовлення")
      }

      // Успешное оформление заказа
      clearCart()
      router.push("/orders")
    } catch (error) {
      console.error("Помилка при оформленні замовлення:", error)
      alert("Не вдалося оформити замовлення. Спробуйте пізніше.")
    } finally {
      setLoading(false)
    }
  }

  if (typeof isAuthenticated !== 'boolean' || isCartLoading) {
    return (
      <main className="min-h-screen bg-white text-[#333] font-['Inter',sans-serif]">
        <Header />
        <div className="container mx-auto py-12 text-center">
          Завантаження...
        </div>
      </main>
    )
  }

  if (!isAuthenticated || cartItems.length === 0) {
    return null
  }

  return (
    <main className="min-h-screen bg-white text-[#333] font-['Inter',sans-serif]">
      <Header />

      <div className="container mx-auto py-12">
        <h1 className="text-2xl mb-8">Оформлення замовлення</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Форма заказа */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-gray-50 p-6">
                <h2 className="text-lg mb-4">Особисті дані</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-1">Ім'я та прізвище *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Телефон *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-200"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6">
                <h2 className="text-lg mb-4">Адреса доставки</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-1">Місто *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm mb-1">Адреса *</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full p-2 border border-gray-200"
                      placeholder="Вулиця, будинок, квартира"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-6">
                <h2 className="text-lg mb-4">Додаткова інформація</h2>
                <div>
                  <label className="block text-sm mb-1">Коментар до замовлення</label>
                  <textarea
                    name="comment"
                    value={formData.comment}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full p-2 border border-gray-200"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#c1b6ad] text-white disabled:bg-gray-300"
              >
                {loading ? "Оформлення..." : "Оформити замовлення"}
              </button>
            </form>
          </div>

          {/* Информация о заказе */}
          <div>
            <div className="bg-gray-50 p-6 sticky top-8">
              <h2 className="text-lg mb-4">Ваше замовлення</h2>
              
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center">
                    <div className="w-16 h-16 relative mr-3 bg-gray-100">
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
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between mb-2">
                  <span>Сума</span>
                  <span>{totalPrice} ₴</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Доставка</span>
                  <span>Безкоштовно</span>
                </div>
                <div className="flex justify-between text-lg font-medium mt-4 pt-4 border-t border-gray-200">
                  <span>Разом до сплати</span>
                  <span>{totalPrice} ₴</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
