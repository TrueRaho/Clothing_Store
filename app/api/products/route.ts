import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    console.log('Fetching products with params:', request.url)
    
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

    console.log('Prisma query:', JSON.stringify(where, null, 2))

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

    console.log('Found products:', products.length)

    if (!Array.isArray(products)) {
      console.error('Products is not an array:', products)
      throw new Error('Products is not an array')
    }

    return NextResponse.json(products)
  } catch (error) {
    console.error('Error in products API:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch products', 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      }, 
      { status: 500 }
    )
  }
} 