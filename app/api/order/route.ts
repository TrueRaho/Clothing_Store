import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { userEmail, items, total } = body

    if (!userEmail || !items || !total) {
      return NextResponse.json(
        { error: "Відсутні обов'язкові поля" },
        { status: 400 }
      )
    }

    // Генерация номера заказа в формате ORD-YYYY-XXX
    const currentYear = new Date().getFullYear()
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    const orderNumber = `ORD-${currentYear}-${randomNum}`

    // Создание заказа и связанных товаров
    const order = await prisma.$transaction(async (tx) => {
      return await tx.order.create({
        data: {
          orderNumber,
          userEmail,
          userId: body.userId,
          total,
          items: {
            create: items.map((item: any) => ({
              productId: item.id,
              name: item.name,
              size: item.size || '',
              color: item.color || '',
              price: item.price,
              quantity: item.quantity,
              image: item.image || '/placeholder.svg',
            })),
          },
        },
        include: {
          items: true,
        },
      });
    });

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error("Помилка створення замовлення:", error)
    return NextResponse.json(
      { error: "Не вдалося створити замовлення" },
      { status: 500 }
    )
  }
} 