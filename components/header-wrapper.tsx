import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { Header } from './header'

async function getCartItemsCount() {
  const cookieStore = await cookies()
  const userId = cookieStore.get('userId')?.value
  if (!userId) return 0

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true }
  })

  return cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0
}

export async function HeaderWrapper() {
  const cartItemsCount = await getCartItemsCount()
  return <Header cartItemsCount={cartItemsCount} />
} 