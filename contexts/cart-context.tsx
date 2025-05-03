"use client"

import React, { createContext, useContext, useState, useEffect, useMemo } from "react"
import { useAuth } from "./auth-context"
import { usePathname } from "next/navigation"

interface CartItem {
  id: string
  name: string
  price: number
  image: string
  size: string
  color: string
  quantity: number
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: number
  isCartLoading: boolean
  refreshCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Время последнего обновления корзины
let lastCartUpdate = 0

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartLoading, setIsCartLoading] = useState(true)
  const { isAuthenticated } = useAuth()
  const pathname = usePathname() // Отслеживаем изменение пути маршрута

  // Функция для загрузки корзины из localStorage с публичным интерфейсом
  const loadCart = React.useCallback(() => {
    const now = Date.now()
    // Если прошло менее 100 мс с последнего обновления, пропускаем
    if (now - lastCartUpdate < 100) return

    lastCartUpdate = now
    setIsCartLoading(true)
    const savedCart = localStorage.getItem("cart")
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        console.log('Обновление корзины:', parsedCart.length, 'товаров')
        setCartItems(parsedCart)
      } catch (error) {
        console.error("Помилка при зчитуванні кошика:", error)
        setCartItems([])
      }
    } else {
      // Если корзина в локальном хранилище не найдена, устанавливаем пустую
      setCartItems([])
    }
    setIsCartLoading(false)
  }, [])

  // Публичный метод для обновления корзины
  const refreshCart = React.useCallback(() => {
    console.log('Принудительное обновление корзины')
    loadCart()
  }, [loadCart])

  // 1. Загрузка корзины при инициализации и изменении маршрута
  useEffect(() => {
    console.log('Маршрут изменился на:', pathname, 'обновляем корзину')
    loadCart() 
  }, [pathname, loadCart])

  // 2. Обновление каждые 2 секунды
  useEffect(() => {
    const interval = setInterval(() => {
      console.log('Интервал обновления корзины')
      loadCart()
    }, 2000)
    
    return () => clearInterval(interval)
  }, [loadCart])

  // 3. Обновление при клике пользователя
  useEffect(() => {
    const handleUserInteraction = () => {
      console.log('Пользователь взаимодействует с сайтом, обновляем корзину')
      loadCart()
    }
    
    // Набор событий для перехвата
    const events = ['click', 'touchstart', 'keydown', 'mousemove', 'scroll']
    
    // Добавляем обработчики с debounce через замыкание
    let timerId: any = null
    const handleEvent = () => {
      if (timerId) clearTimeout(timerId)
      timerId = setTimeout(handleUserInteraction, 300) // Debounce 300ms
    }
    
    events.forEach(event => {
      window.addEventListener(event, handleEvent, { passive: true })
    })
    
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleEvent)
      })
    }
  }, [loadCart])

  // 4. Слушатель события storage для обновления между вкладками
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "cart") {
        console.log('Storage event detected for cart. Reloading cart...')
        loadCart()
      }
    }
    
    window.addEventListener("storage", handleStorageChange)
    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [loadCart])

  // Сохранение корзины в localStorage при изменении
  useEffect(() => {
    if (!isCartLoading) {
      localStorage.setItem("cart", JSON.stringify(cartItems))
    }
  }, [cartItems, isCartLoading])

  // Функции взаимодействия с корзиной
  const addToCart = React.useCallback((item: CartItem) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (cartItem) => cartItem.id === item.id && cartItem.size === item.size && cartItem.color === item.color
      )

      if (existingItemIndex >= 0) {
        const newItems = [...prevItems]
        newItems[existingItemIndex].quantity += item.quantity
        return newItems
      } else {
        return [...prevItems, item]
      }
    })
  }, [])

  const removeFromCart = React.useCallback((id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }, [])

  const updateQuantity = React.useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    )
  }, [removeFromCart])

  const clearCart = React.useCallback(() => {
    setCartItems([])
  }, [])

  // Расчет общего количества товаров
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)

  // Расчет общей стоимости
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  // Мемоизируем объект значения контекста
  const contextValue = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalItems,
    totalPrice,
    isCartLoading,
    refreshCart,
  }), [
    cartItems, 
    totalItems, 
    totalPrice, 
    isCartLoading, 
    addToCart, 
    removeFromCart, 
    updateQuantity, 
    clearCart,
    refreshCart
  ])

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
} 