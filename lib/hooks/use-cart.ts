import { useEffect, useState } from 'react'

export function useCart() {
  const [cartItems, setCartItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('/api/cart', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })
        
        if (!response.ok) {
          if (response.status === 401) {
            // Пользователь не авторизован
            setCartItems([])
            setLoading(false)
            return
          }
          throw new Error('Failed to fetch cart')
        }
        
        const data = await response.json()
        setCartItems(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Error fetching cart:', error)
        setCartItems([])
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [])

  const addToCart = async (productId: string, size: string, color: string, quantity: number = 1) => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId, size, color, quantity }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('User not authenticated')
        }
        throw new Error('Failed to add to cart')
      }

      const newItem = await response.json()
      setCartItems(prevItems => [...prevItems, newItem])
    } catch (error) {
      console.error('Error adding to cart:', error)
      throw error
    }
  }

  const totalItems = cartItems.reduce((sum, item) => sum + (item?.quantity || 0), 0)

  return { cartItems, loading, totalItems, addToCart }
} 