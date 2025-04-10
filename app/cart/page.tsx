import Link from "next/link"
import Image from "next/image"
import { Trash2 } from "lucide-react"
import { Header } from "@/components/header"

// Mock data for cart items
const cartItems = [
  {
    id: "1",
    name: "Пижама из хлопка",
    size: "M",
    color: "Белый",
    price: 3990,
    quantity: 1,
    image: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "2",
    name: "Халат льняной",
    size: "L",
    color: "Бежевый",
    price: 4990,
    quantity: 1,
    image: "/placeholder.svg?height=100&width=100",
  },
]

export default function Cart() {
  // Calculate total
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

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
                          <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                        </div>
                        <span>{item.name}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      {item.size}, {item.color}
                    </td>
                    <td className="py-4">{item.price} ₴</td>
                    <td className="py-4">
                      <div className="flex items-center">
                        <button className="w-8 h-8 border border-gray-200 flex items-center justify-center">-</button>
                        <span className="w-8 h-8 flex items-center justify-center">{item.quantity}</span>
                        <button className="w-8 h-8 border border-gray-200 flex items-center justify-center">+</button>
                      </div>
                    </td>
                    <td className="py-4">{item.price * item.quantity} ₴</td>
                    <td className="py-4">
                      <button>
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
