import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        cart: {
          include: {
            items: {
              include: {
                product: true
              }
            }
          }
        }
      }
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    if (!user.cart) {
      // Создаем корзину, если она не существует
      const newCart = await prisma.cart.create({
        data: {
          userId: user.id
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      })
      return NextResponse.json(newCart.items)
    }

    return NextResponse.json(user.cart.items)
  } catch (error) {
    console.error('Error fetching cart:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { productId, size, color, quantity } = await request.json()

    if (!productId || !size || !color || !quantity) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { cart: true }
    })

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    let cart = user.cart
    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          userId: user.id
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
        data: { quantity: existingItem.quantity + quantity },
        include: { product: true }
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
      },
      include: { product: true }
    })

    return NextResponse.json(newItem)
  } catch (error) {
    console.error('Error adding to cart:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 