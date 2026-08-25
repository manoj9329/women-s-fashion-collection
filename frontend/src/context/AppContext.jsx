import { createContext, useContext, useState, useEffect } from 'react'

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

  const cartTotal = cart.reduce((s, i) => s + i.product.price * i.qty, 0)
  const cartCount = cart.reduce((s, i) => s + i.qty, 0)

  return (
    <AppContext.Provider value={{ user, login, logout, cart, addToCart, removeFromCart, updateQty, clearCart, cartTotal, cartCount }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
