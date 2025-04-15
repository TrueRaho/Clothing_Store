import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const userId = (await cookies()).get("userId")?.value

    if (!userId) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 401 })
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
      return NextResponse.json({ items: [] })
    }

    return NextResponse.json(cart.items)
  } catch (error) {
    console.error("Ошибка при получении корзины:", error)
    return NextResponse.json(
      { error: "Ошибка при получении корзины" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const userId = (await cookies()).get("userId")?.value
    const { productId, quantity = 1, size, color } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 401 })
    }

    let cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true }
    })

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId,
          items: {
            create: {
              productId,
              quantity,
              size,
              color
            }
          }
        },
        include: { items: true }
      })
    } else {
      const existingItem = cart.items.find(item => 
        item.productId === productId && 
        item.size === size && 
        item.color === color
      )

      if (existingItem) {
        await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: existingItem.quantity + quantity }
        })
      } else {
        await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            quantity,
            size,
            color
          }
        })
      }
    }

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
    console.error("Ошибка при добавлении в корзину:", error)
    return NextResponse.json(
      { error: "Ошибка при добавлении в корзину" },
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