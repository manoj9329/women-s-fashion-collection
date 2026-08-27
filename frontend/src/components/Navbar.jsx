import { Link, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout, cartCount, wishlist } = useApp()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const handleLogout = () => { logout(); navigate('/') }

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to="/" style={styles.logo}>
          Women's <span style={{ color: 'var(--rose)' }}>Fashion</span>
        </Link>

        <div style={styles.links}>
          <Link to="/" style={styles.link}>Home</Link>
          <Link to="/shop" style={styles.link}>Shop</Link>
          <Link to="/wishlist" style={styles.link}>
  ❤️ Wishlist {wishlist.length > 0 && <span style={styles.badge}>{wishlist.length}</span>}
</Link>
          {user && <Link to="/orders" style={styles.link}>My Orders</Link>}
          {user?.role === 'ADMIN' && <Link to="/admin" style={styles.link}>Admin</Link>}
          <span style={styles.cod}>✦ Cash on Delivery</span>
        </div>

        <div style={styles.actions}>
          <Link to="/cart" style={styles.cartBtn}>
            🛍 <span style={styles.badge}>{cartCount}</span>
          </Link>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to="/profile" style={{ ...styles.userName, textDecoration: 'none' }}>👤 {user.name.split(' ')[0]}</Link>
              <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '.6rem' }}>
              <Link to="/login"><button style={styles.loginBtn}>Login</button></Link>
              <Link to="/register"><button style={styles.registerBtn}>Register</button></Link>
            </div>
          )}
        </div>

        <button style={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
      </div>

      {menuOpen && (
        <div style={styles.mobileMenu}>
          <Link to="/" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/shop" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Shop</Link>
          {user && <Link to="/orders" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>My Orders</Link>}
          {user?.role === 'ADMIN' && <Link to="/admin" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>Admin</Link>}
          <span style={styles.mobileCod}>✦ Cash on Delivery Available</span>
          {user ? (
            <button onClick={() => { handleLogout(); setMenuOpen(false) }} style={styles.mobileLogout}>Logout</button>
          ) : (
            <div style={{ display: 'flex', gap: '.6rem', padding: '0 1.5rem 1rem' }}>
              <Link to="/login" style={{ flex: 1 }} onClick={() => setMenuOpen(false)}>
                <button style={{ ...styles.loginBtn, width: '100%' }}>Login</button>
              </Link>
              <Link to="/register" style={{ flex: 1 }} onClick={() => setMenuOpen(false)}>
                <button style={{ ...styles.registerBtn, width: '100%' }}>Register</button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

const styles = {
  nav: {
    background: 'var(--dark)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 20px rgba(0,0,0,0.3)'
  },
  inner: {
    maxWidth: 1280,
    margin: '0 auto',
    padding: '0 5%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 64
  },
  logo: {
    fontFamily: 'var(--fs)',
    fontSize: '1.4rem',
    fontWeight: 300,
    color: 'var(--cream)',
    letterSpacing: '.06em',
    textDecoration: 'none',
    flexShrink: 0
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.8rem'
  },
  link: {
    fontSize: '.72rem',
    letterSpacing: '.18em',
    textTransform: 'uppercase',
    color: 'rgba(250,247,242,.7)',
    textDecoration: 'none',
    whiteSpace: 'nowrap'
  },
  cod: {
    fontSize: '.65rem',
    letterSpacing: '.12em',
    textTransform: 'uppercase',
    color: 'var(--rose)',
    whiteSpace: 'nowrap'
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flexShrink: 0
  },
  cartBtn: {
    fontSize: '1rem',
    color: 'var(--cream)',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    textDecoration: 'none'
  },
  badge: {
    background: 'var(--rose)',
    color: 'var(--dark)',
    borderRadius: '50%',
    width: 18,
    height: 18,
    fontSize: '.6rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  userName: {
    fontSize: '.78rem',
    color: 'rgba(250,247,242,.6)',
    whiteSpace: 'nowrap'
  },
  loginBtn: {
    background: 'none',
    border: '1px solid rgba(201,168,124,.4)',
    color: 'var(--cream)',
    padding: '7px 16px',
    fontSize: '.68rem',
    letterSpacing: '.12em',
    textTransform: 'uppercase',
    cursor: 'pointer'
  },
  registerBtn: {
    background: 'var(--rose)',
    border: 'none',
    color: 'var(--dark)',
    padding: '7px 16px',
    fontSize: '.68rem',
    letterSpacing: '.12em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    fontWeight: 500
  },
  logoutBtn: {
    background: 'none',
    border: 'none',
    color: 'rgba(250,247,242,.5)',
    fontSize: '.72rem',
    letterSpacing: '.1em',
    textTransform: 'uppercase',
    cursor: 'pointer'
  },
  hamburger: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: 'var(--cream)',
    fontSize: '1.3rem',
    cursor: 'pointer'
  },
  mobileMenu: {
    background: 'var(--dark)',
    borderTop: '1px solid rgba(201,168,124,.15)',
    display: 'flex',
    flexDirection: 'column'
  },
  mobileLink: {
    padding: '.9rem 1.5rem',
    fontSize: '.75rem',
    letterSpacing: '.18em',
    textTransform: 'uppercase',
    color: 'rgba(250,247,242,.7)',
    textDecoration: 'none',
    borderBottom: '1px solid rgba(201,168,124,.08)'
  },
  mobileCod: {
    padding: '.9rem 1.5rem',
    fontSize: '.68rem',
    letterSpacing: '.12em',
    textTransform: 'uppercase',
    color: 'var(--rose)',
    borderBottom: '1px solid rgba(201,168,124,.08)'
  },
  mobileLogout: {
    background: 'none',
    border: 'none',
    padding: '.9rem 1.5rem',
    fontSize: '.75rem',
    letterSpacing: '.18em',
    textTransform: 'uppercase',
    color: 'rgba(250,247,242,.4)',
    textAlign: 'left',
    cursor: 'pointer'
  }
}