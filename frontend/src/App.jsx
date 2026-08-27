import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AppProvider, useApp } from './context/AppContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import { Login, Register } from './pages/Auth'
import Orders from './pages/Orders'
import AdminDashboard from './pages/admin/AdminDashboard'
import Wishlist from './pages/Wishlist'
import Profile from './pages/Profile'

function ProtectedRoute({ children, adminOnly }) {
  const { user } = useApp()
  if (!user) return <Navigate to="/login"/>
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/"/>
  return children
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/shop" element={<Shop/>}/>
          <Route path="/product/:id" element={<ProductDetail/>}/>
          <Route path="/cart" element={<Cart/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/orders" element={<ProtectedRoute><Orders/></ProtectedRoute>}/>
          <Route path="/wishlist" element={<Wishlist/>}/>
          <Route path="/admin" element={<ProtectedRoute adminOnly><AdminDashboard/></ProtectedRoute>}/>
          <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>}/>
        </Routes>
        <ToastContainer position="bottom-right" autoClose={2500}/>
      </BrowserRouter>
    </AppProvider>
  )
}
