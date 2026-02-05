import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

// Demo Credentials - For Testing
export const DEMO_CREDENTIALS = {
  buyer: {
    mobile: '9876543210',
    otp: '123456',
    name: 'Rajesh Kumar',
    shopName: 'Rajput Traders',
    city: 'Jaipur',
    businessType: 'Dealer',
    role: 'buyer'
  },
  buyer2: {
    mobile: '9876543211',
    otp: '123456',
    name: 'Priya Sharma',
    shopName: 'Shree Fashion',
    city: 'Udaipur',
    businessType: 'Shop',
    role: 'buyer'
  },
  buyer3: {
    mobile: '9876543213',
    otp: '123456',
    name: 'Sneha Mehta',
    shopName: 'Royal Garments',
    city: 'Surat',
    businessType: 'Agent',
    role: 'buyer'
  },
  admin: {
    mobile: '9999999999',
    otp: '999999',
    name: 'Admin User',
    role: 'admin'
  }
}

const DEMO_OTP = '123456'
const ADMIN_OTP = '999999'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = (mobile, otp) => {
    // Admin: 9999999999 / 999999
    if (mobile === DEMO_CREDENTIALS.admin.mobile && otp === ADMIN_OTP) {
      const userData = { ...DEMO_CREDENTIALS.admin, id: 'admin' }
      setUser(userData)
      localStorage.setItem('user', JSON.stringify(userData))
      return { success: true, user: userData }
    }
    // Buyers: 9876543210, 9876543211, 9876543213 / 123456
    const buyers = ['buyer', 'buyer2', 'buyer3']
    for (const key of buyers) {
      const b = DEMO_CREDENTIALS[key]
      if (mobile === b.mobile && otp === DEMO_OTP) {
        const userData = { ...b, id: b.mobile }
        setUser(userData)
        localStorage.setItem('user', JSON.stringify(userData))
        return { success: true, user: userData }
      }
    }
    return { success: false, error: 'Invalid credentials. Use demo: Admin 9999999999/999999, Buyer 9876543210/123456' }
  }

  const register = (userData) => {
    // Demo registration - auto approve for demo
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      role: 'buyer',
      status: 'approved' // Auto-approved for demo
    }
    setUser(newUser)
    localStorage.setItem('user', JSON.stringify(newUser))
    return { success: true, user: newUser }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('cart')
  }

  const sendOTP = (mobile) => {
    // Demo OTP - always returns success
    return { success: true, message: 'OTP sent successfully' }
  }

  const value = {
    user,
    login,
    register,
    logout,
    sendOTP,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
