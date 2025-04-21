import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const currentProductId = searchParams.get('currentProductId')
    
    if (!currentProductId) {
      return NextResponse.json(
        { error: 'Current product ID is required' },
        { status: 400 }
      )
    }

    const similarProducts = await prisma.product.findMany({
      where: {
        NOT: {
          id: currentProductId
        }
      },
      take: 4,
      orderBy: {
        id: 'asc'
      }
    })

    return NextResponse.json(similarProducts)
  } catch (error) {
    console.error('Error fetching similar products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch similar products' },
      { status: 500 }
    )
  }
} 