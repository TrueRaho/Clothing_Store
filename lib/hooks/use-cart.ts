import { useEffect, useState } from 'react'

export function useCart() {
  const [cartItems, setCartItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('/api/cart')
        if (!response.ok) throw new Error('Failed to fetch cart')
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

  const totalItems = cartItems.reduce((sum, item) => sum + (item?.quantity || 0), 0)

  return { cartItems, loading, totalItems }
} 