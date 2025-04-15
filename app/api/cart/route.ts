import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    // Проверяем существование пользователя
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    let cart = await prisma.cart.findUnique({
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
      cart = await prisma.cart.create({
        data: {
          userId,
          items: {
            create: []
          }
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      })
    }

    return NextResponse.json(cart.items)
  } catch (error) {
    console.error('Error in cart API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cart', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    // Проверяем существование пользователя
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 })
    }

    const { productId, size, color, quantity } = await request.json()

    let cart = await prisma.cart.findUnique({
      where: { userId }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
          items: {
            create: []
          }
        }
      })
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: {
        cartId: cart.id,
        productId,
        size,
        color
      }
    })

    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      })
      return NextResponse.json(updatedItem)
    }

    const newItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        size,
        color,
        quantity
      }
    })

    return NextResponse.json(newItem)
  } catch (error) {
    console.error('Error in cart API:', error)
    return NextResponse.json(
      { error: 'Failed to add item to cart', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: Request) {
  try {
    const userId = (await cookies()).get("userId")?.value
    const { itemId, quantity } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 401 })
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true }
    })

    if (!cart) {
      return NextResponse.json({ error: "Корзина не найдена" }, { status: 404 })
    }

    const item = cart.items.find(item => item.id === itemId)
    if (!item) {
      return NextResponse.json({ error: "Товар не найден" }, { status: 404 })
    }

    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity }
    })

    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    return NextResponse.json(updatedCart?.items || [])
  } catch (error) {
    console.error("Ошибка при обновлении количества:", error)
    return NextResponse.json(
      { error: "Ошибка при обновлении количества" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const userId = (await cookies()).get("userId")?.value
    const { itemId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 401 })
    }

    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true }
    })

    if (!cart) {
      return NextResponse.json({ error: "Корзина не найдена" }, { status: 404 })
    }

    const item = cart.items.find(item => item.id === itemId)
    if (!item) {
      return NextResponse.json({ error: "Товар не найден" }, { status: 404 })
    }

    await prisma.cartItem.delete({
      where: { id: itemId }
    })

    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    })

    return NextResponse.json(updatedCart?.items || [])
  } catch (error) {
    console.error("Ошибка при удалении товара:", error)
    return NextResponse.json(
      { error: "Ошибка при удалении товара" },
      { status: 500 }
    )
  }
} 