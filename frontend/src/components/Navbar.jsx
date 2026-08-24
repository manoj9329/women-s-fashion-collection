import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout, cartCount } = useApp()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/') }

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to="/" style={styles.logo}>
          Women's <span style={{ color: 'var(--rose)' }}>Fashion</span>
        </Link>
        <ul style={{ ...styles.links, display: menuOpen ? 'flex' : undefined }}>
          <li><Link to="/" style={styles.link}>Home</Link></li>
          <li><Link to="/shop" style={styles.link}>Shop</Link></li>
          {user && <li><Link to="/orders" style={styles.link}>My Orders</Link></li>}
          {user?.role === 'ADMIN' && <li><Link to="/admin" style={styles.link} onClick={() => setMenuOpen(false)}>Admin</Link></li>}
        </ul>
        <div style={styles.actions}>
          <Link to="/cart" style={styles.cartBtn}>
            🛍 <span style={styles.badge}>{cartCount}</span>
          </Link>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '.78rem', color: 'rgba(250,247,242,.6)' }}>Hi, {user.name.split(' ')[0]}</span>
              <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '.6rem' }}>
              <Link to="/login"><button style={styles.loginBtn}>Login</button></Link>
              <Link to="/register"><button className="btn-rose" style={{ padding: '7px 18px', fontSize: '.68rem' }}>Register</button></Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

const styles = {
  nav: { background: 'var(--dark)', position: 'sticky', top: 0, zIndex: 100, padding: '0 5%' },
  inner: { maxWidth: 1280, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 },
  logo: { fontFamily: 'var(--fs)', fontSize: '1.4rem', fontWeight: 300, color: 'var(--cream)', letterSpacing: '.06em' },
  links: { display: 'flex', gap: '2rem', listStyle: 'none' },
  link: { fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(250,247,242,.65)', transition: 'color .2s' },
  actions: { display: 'flex', alignItems: 'center', gap: '1.5rem' },
  cartBtn: { fontSize: '1rem', color: 'var(--cream)', position: 'relative', display: 'flex', alignItems: 'center', gap: 4 },
  badge: { background: 'var(--rose)', color: 'var(--dark)', borderRadius: '50%', width: 18, height: 18, fontSize: '.6rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  loginBtn: { background: 'none', border: '1px solid rgba(201,168,124,.4)', color: 'var(--cream)', padding: '7px 18px', fontSize: '.68rem', letterSpacing: '.12em', textTransform: 'uppercase' },
  logoutBtn: { background: 'none', border: 'none', color: 'rgba(250,247,242,.5)', fontSize: '.72rem', letterSpacing: '.1em', textTransform: 'uppercase' }
}
