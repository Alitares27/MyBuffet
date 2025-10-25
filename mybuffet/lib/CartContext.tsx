'use client'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface CartItem {
  id: number
  name: string
  price: number
  image: string
  quantity: number
}

interface CartContextType {
  cart: CartItem[]
  addItem: (item: CartItem) => void
  removeFromCart: (id: number) => void
  updateQuantity: (id: number, quantity: number) => void
  getTotal: () => number
  getItemCount: () => number
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isClient, setIsClient] = useState(false)

  // Marcar como montado en el cliente
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Cargar carrito desde localStorage solo en el cliente
  useEffect(() => {
    if (!isClient) return
    
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error('Error loading cart:', error)
      }
    }
  }, [isClient])

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (!isClient) return
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart, isClient])

  const addItem = (newItem: CartItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === newItem.id)
      
      if (existingItem) {
        return prevCart.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        )
      } else {
        return [...prevCart, newItem]
      }
    })
  }

  const removeFromCart = (id: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id))
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      )
    }
  }

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const getItemCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0)
  }

  const clearCart = () => {
    setCart([])
    if (isClient) {
      localStorage.removeItem('cart')
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addItem,
        removeFromCart,
        updateQuantity,
        getTotal,
        getItemCount,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
