import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const currentProductId = searchParams.get('currentProductId')
    
    const products = await prisma.product.findMany({
      where: {
        NOT: {
          id: currentProductId || undefined
        }
      },
      take: 3
    })

    return NextResponse.json(products)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get similar products' }, { status: 400 })
  }
} 