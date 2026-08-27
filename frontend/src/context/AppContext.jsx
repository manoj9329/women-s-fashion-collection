import { createContext, useContext, useState } from 'react'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('wfc_user')
      if (!stored) return null
      const parsed = JSON.parse(stored)
      if (!parsed || !parsed.email || !parsed.role) return null
      return parsed
    } catch { return null }
  })

  const [cart, setCart] = useState([])

  const [wishlist, setWishlist] = useState(() => {
    try {
      const stored = localStorage.getItem('wfc_wishlist')
      return stored ? JSON.parse(stored) : []
    } catch { return [] }
  })

  const login = (userData, token) => {
    localStorage.setItem('wfc_token', token)
    localStorage.setItem('wfc_user', JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('wfc_token')
    localStorage.removeItem('wfc_user')
    setUser(null)
  }

  const addToCart = (product, size, color, qty = 1) => {
    setCart(prev => {
      const key = `${product.id}-${size}-${color}`
      const existing = prev.find(i => i.key === key)
      if (existing) return prev.map(i => i.key === key ? { ...i, qty: i.qty + qty } : i)
      return [...prev, { key, product, size, color, qty }]
    })
  }

  const removeFromCart = (key) => setCart(prev => prev.filter(i => i.key !== key))

  const updateQty = (key, qty) => {
    if (qty <= 0) return removeFromCart(key)
    setCart(prev => prev.map(i => i.key === key ? { ...i, qty } : i))
  }

  const clearCart = () => setCart([])

  const toggleWishlist = (product) => {
    setWishlist(prev => {
      const exists = prev.find(p => p.id === product.id)
      const updated = exists ? prev.filter(p => p.id !== product.id) : [...prev, product]
      localStorage.setItem('wfc_wishlist', JSON.stringify(updated))
      return updated
    })
  }

  const isWishlisted = (productId) => wishlist.some(p => p.id === productId)

  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0)
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <AppContext.Provider value={{
      user, login, logout,
      cart, addToCart, removeFromCart, updateQty, clearCart, cartTotal, cartCount,
      wishlist, toggleWishlist, isWishlisted
    }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)