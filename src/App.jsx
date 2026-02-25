import React, { useState, useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { WishlistProvider } from './context/WishlistContext'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'

// Pages
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Login from './pages/Login'
import Orders from './pages/Orders'
import Ledger from './pages/Ledger'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/Dashboard'
import AdminProducts from './pages/admin/Products'
import AdminOrders from './pages/admin/Orders'
import AdminUsers from './pages/admin/Users'
import AdminPayments from './pages/admin/Payments'
import AdminBanners from './pages/admin/Banners'
import AdminSections from './pages/admin/Sections'
import AdminSettings from './pages/admin/Settings'
import AdminCollections from './pages/admin/Collections'
import Wishlist from './pages/Wishlist'
import UserLayout from './pages/user/UserLayout'
import UserDashboard from './pages/user/UserDashboard'

// Components
import TopBanner from './components/TopBanner'
import Header from './components/Header'
import Footer from './components/Footer'
import BottomNav from './components/BottomNav'
import ProtectedRoute from './components/ProtectedRoute'
import AdminRoute from './components/AdminRoute'
import SplashScreen from './components/SplashScreen'
import './App.css'

function App() {
  const [showSplash, setShowSplash] = useState(true)
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith('/admin')

  useEffect(() => {
    // Check if splash was already shown in this session
    const splashShown = sessionStorage.getItem('splashShown')
    if (splashShown) {
      setShowSplash(false)
    }
  }, [])

  const handleSplashComplete = () => {
    setShowSplash(false)
    sessionStorage.setItem('splashShown', 'true')
  }

  if (showSplash) {
    return <SplashScreen onComplete={handleSplashComplete} />
  }

  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
        <NotificationProvider>
          <div className="app">
            {!isAdminRoute && <TopBanner />}
            {!isAdminRoute && <Header />}
            <main className={`main-content ${!isAdminRoute ? 'main-overlap-header' : ''}`}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/login" element={<Login />} />
                <Route path="/orders" element={<Navigate to="/account/orders" replace />} />
                <Route path="/ledger" element={<Navigate to="/account/ledger" replace />} />
                <Route path="/account" element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
                  <Route index element={<UserDashboard />} />
                  <Route path="orders" element={<Orders />} />
                  <Route path="ledger" element={<Ledger />} />
                </Route>
                <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="payments" element={<AdminPayments />} />
                  <Route path="banners" element={<AdminBanners />} />
                  <Route path="collections" element={<AdminCollections />} />
                  <Route path="sections" element={<AdminSections />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Routes>
            </main>
            {!isAdminRoute && <Footer />}
            {!isAdminRoute && <BottomNav />}
          </div>
        </NotificationProvider>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  )
}

export default App
