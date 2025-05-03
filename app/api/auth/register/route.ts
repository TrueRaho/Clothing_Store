import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json()
    
    const hashedPassword = await hashPassword(password)
    
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })

    return NextResponse.json({ 
      id: user.id,
      name: user.name,
      email: user.email
    })
  } catch (error) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 400 })
  }
} 