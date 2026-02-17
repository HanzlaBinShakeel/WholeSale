import React, { createContext, useContext, useState, useEffect } from 'react'

const WishlistContext = createContext()

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('wishlist')
    if (saved) {
      try {
        setWishlist(JSON.parse(saved))
      } catch (e) {}
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const addToWishlist = (product) => {
    if (!wishlist.find(p => p.id === product.id)) {
      setWishlist(prev => [...prev, { ...product }])
    }
  }

  const removeFromWishlist = (productId) => {
    setWishlist(prev => prev.filter(p => p.id !== productId))
  }

  const toggleWishlist = (product) => {
    if (wishlist.find(p => p.id === product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  const isInWishlist = (productId) => wishlist.some(p => p.id === productId)

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
