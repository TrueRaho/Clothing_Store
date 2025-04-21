// Тип для элемента корзины
export type CartItem = {
  id: string
  name: string
  size: string
  color: string
  price: number
  quantity: number
  image: string
}

// Функция добавления товара в корзину
export function addToCart(product: {
  id: string
  name: string
  price: number
  image: string
}, size: string, color: string): void {
  // Получаем текущую корзину из localStorage
  let cart: CartItem[] = []
  const savedCart = localStorage.getItem("cart")
  
  if (savedCart) {
    cart = JSON.parse(savedCart)
  }
  
  // Проверяем, есть ли уже такой товар с такими же параметрами
  const existingItemIndex = cart.findIndex(
    item => item.id === product.id && item.size === size && item.color === color
  )
  
  if (existingItemIndex > -1) {
    // Если товар уже есть, увеличиваем количество
    cart[existingItemIndex].quantity += 1
  } else {
    // Если товара нет, добавляем новый
    cart.push({
      id: product.id,
      name: product.name,
      size: size,
      color: color,
      price: product.price,
      quantity: 1,
      image: product.image
    })
  }
  
  // Сохраняем обновленную корзину
  localStorage.setItem("cart", JSON.stringify(cart))
}

// Функция получения количества товаров в корзине
export function getCartItemsCount(): number {
  const savedCart = localStorage.getItem("cart")
  if (!savedCart) return 0
  
  const cart: CartItem[] = JSON.parse(savedCart)
  return cart.reduce((count, item) => count + item.quantity, 0)
}

// Функция очистки корзины
export function clearCart(): void {
  localStorage.removeItem("cart")
} 