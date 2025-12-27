import React from 'react'
import { usePath, Link, navigate } from './router'
import Login from './pages/Login'
import Customer from './pages/Customer'
import Driver from './pages/Driver'
import Admin from './pages/Admin'
import ShopsHome from './pages/shops/ShopsHome'
import ShopDetail from './pages/shops/ShopDetail'
import ShopsCart from './pages/shops/ShopsCart'
import { ShopsProvider } from './pages/shops/ShopsContext'
import { ProfileProvider, useProfile } from './contexts/ProfileContext'
import { AdminAuthProvider } from './contexts/AdminAuthContext'
import './App.css'

function AppContent() {
  const path = usePath()
  const { profile } = useProfile()

  function render() {
    // Shop routes - only for customers
    if (path === '/customer/shops') {
      if (!profile || profile.userType !== 'customer') {
        return <Login />
      }
      return (
        <ShopsProvider>
          <ShopsHome />
        </ShopsProvider>
      )
    }
    
    if (path.startsWith('/customer/shops/')) {
      if (!profile || profile.userType !== 'customer') {
        return <Login />
      }
      const shopId = path.split('/')[3]
      if (shopId === 'cart') {
        return (
          <ShopsProvider>
            <ShopsCart />
          </ShopsProvider>
        )
      }
      return (
        <ShopsProvider>
          <ShopDetail shopId={shopId} />
        </ShopsProvider>
      )
    }

    // Main routes
    switch (path) {
      case '/':
      case '/login':
        return <Login />
      case '/customer':
        if (!profile || profile.userType !== 'customer') {
          return <Login />
        }
        return <Customer />
      case '/driver':
        if (!profile || profile.userType !== 'driver') {
          return <Login />
        }
        return <Driver />
      case '/admin':
        return <Admin />
      default:
        return (
          <div className="not-found">
            <h1>404 Not Found</h1>
            <button onClick={() => navigate('/login')}>Go Home</button>
          </div>
        )
    }
  }

  return (
    <div className="app">
      <nav className="nav">
        <Link href="/login">Login</Link>
        {profile?.userType === 'customer' && <Link href="/customer">Customer</Link>}
        {profile?.userType === 'driver' && <Link href="/driver">Driver</Link>}
        <Link href="/admin">Admin</Link>
      </nav>
      {render()}
    </div>
  )
}

export default function App() {
  return (
    <ProfileProvider>
      <AdminAuthProvider>
        <AppContent />
      </AdminAuthProvider>
    </ProfileProvider>
  )
}
