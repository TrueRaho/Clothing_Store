import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
      return NextResponse.json([])
    }

    let user = await prisma.user.findUnique({
      where: { id: userId },
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
      // Создаем нового пользователя, если его нет
      user = await prisma.user.create({
        data: {
          id: userId,
          name: 'Гость',
          email: `${userId}@example.com`,
          password: 'guest'
        },
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
    }

    if (!user.cart) {
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
    return NextResponse.json([])
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
      return new NextResponse('User not found', { status: 404 })
    }

    const { productId, size, color, quantity } = await request.json()

    if (!productId || !size || !color || !quantity) {
      return new NextResponse('Missing required fields', { status: 400 })
    }

    let user = await prisma.user.findUnique({
      where: { id: userId },
      include: { cart: true }
    })

    if (!user) {
      // Создаем нового пользователя, если его нет
      user = await prisma.user.create({
        data: {
          id: userId,
          name: 'Гость',
          email: `${userId}@example.com`,
          password: 'guest'
        },
        include: { cart: true }
      })
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