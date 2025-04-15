import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const where: any = {}

    const category = searchParams.get('category')
    const size = searchParams.get('size')
    const color = searchParams.get('color')
    const composition = searchParams.get('composition')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')

    if (category) {
      where.category = category
    }

    if (size) {
      where.sizes = {
        has: size
      }
    }

    if (color) {
      where.colors = {
        has: color
      }
    }

    if (composition) {
      where.composition = composition
    }

    if (minPrice || maxPrice) {
      where.price = {}
      if (minPrice) {
        where.price.gte = parseInt(minPrice)
      }
      if (maxPrice) {
        where.price.lte = parseInt(maxPrice)
      }
    }

    const products = await prisma.product.findMany({
      where,
      select: {
        id: true,
        name: true,
        price: true,
        image: true,
        category: true,
        sizes: true,
        colors: true,
        composition: true
      }
    })

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
} 