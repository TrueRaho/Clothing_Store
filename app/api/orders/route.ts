import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userEmail = searchParams.get('userEmail')
    
    if (!userEmail) {
      return NextResponse.json(
        { error: "Відсутній параметр userEmail" },
        { status: 400 }
      )
    }

    const orders = await prisma.order.findMany({
      where: {
        userEmail: userEmail
      },
      include: {
        items: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(orders)
  } catch (error) {
    console.error("Помилка отримання замовлень:", error)
    return NextResponse.json(
      { error: "Не вдалося отримати замовлення" },
      { status: 500 }
    )
  }
} 