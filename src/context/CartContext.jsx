import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (e) {
        console.error('Error loading cart:', e)
      }
    }
  }, [])

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (product, quantity, color = '') => {
    const moq = product.moq || 1
    const qty = Math.max(moq, Math.ceil(quantity / moq) * moq) // Ensure MOQ and bulk increments
    
    const existingIndex = cart.findIndex(
      item => item.id === product.id && item.color === color
    )

    if (existingIndex >= 0) {
      const newCart = [...cart]
      newCart[existingIndex].quantity += qty
      setCart(newCart)
    } else {
      setCart([...cart, {
        ...product,
        quantity: qty,
        color,
        cartId: Date.now().toString()
      }])
    }
  }

  const removeFromCart = (cartId) => {
    setCart(cart.filter(item => item.cartId !== cartId))
  }

  const updateQuantity = (cartId, newQuantity, moq) => {
    const qty = Math.max(moq, Math.ceil(newQuantity / moq) * moq) // Enforce MOQ
    setCart(cart.map(item => 
      item.cartId === cartId ? { ...item, quantity: qty } : item
    ))
  }

  const clearCart = () => {
    setCart([])
  }

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  const getItemCount = () => {
    return cart.reduce((sum, item) => sum + item.quantity, 0)
  }

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
