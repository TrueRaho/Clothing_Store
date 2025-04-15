import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { CartItem } from '@/components/cart-item'

export default async function CartPage() {
  const userId = cookies().get('userId')?.value

  if (!userId) {
    return (
      <div className="min-h-screen bg-white text-[#333] font-['Inter',sans-serif]">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl mb-8">Корзина</h1>
          <p>Пожалуйста, войдите в систему, чтобы просмотреть корзину</p>
        </div>
      </div>
    )
  }

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: true
        }
      }
    }
  })

  if (!cart) {
    return (
      <div className="min-h-screen bg-white text-[#333] font-['Inter',sans-serif]">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl mb-8">Корзина</h1>
          <p>Ваша корзина пуста</p>
        </div>
      </div>
    )
  }

  const total = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

  return (
    <div className="min-h-screen bg-white text-[#333] font-['Inter',sans-serif]">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl mb-8">Корзина</h1>
        
        {cart.items.length === 0 ? (
          <p>Ваша корзина пуста</p>
        ) : (
          <div className="space-y-4">
            {cart.items.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
            <div className="border-t pt-4">
              <p className="text-xl font-semibold">Итого: {total} ₴</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
