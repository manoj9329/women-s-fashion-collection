import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout, cartCount, wishlist } = useApp()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      {/* TOP HEADER */}
      <header style={styles.header}>
        <button style={styles.menuBtn} onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? '✕' : '☰'}
        </button>
        <Link to="/" style={styles.logo}>Women's Fashion</Link>
        <Link to="/cart" style={styles.cartIcon}>
          🛍
          {cartCount > 0 && <span style={styles.cartBadge}>{cartCount}</span>}
        </Link>
      </header>

      {/* SIDE MENU */}
      {menuOpen && (
        <>
          <div style={styles.overlay} onClick={() => setMenuOpen(false)}/>
          <div style={styles.sideMenu}>
            <div style={styles.sideHeader}>
              <p style={styles.sideTitle}>Menu</p>
              <button style={styles.closeBtn} onClick={() => setMenuOpen(false)}>✕</button>
            </div>
            {user && (
              <div style={styles.userInfo}>
                <div style={styles.userAvatar}>{user.name?.[0]?.toUpperCase()}</div>
                <div>
                  <p style={styles.userName}>{user.name}</p>
                  <p style={styles.userEmail}>{user.email}</p>
                </div>
              </div>
            )}
            <div style={styles.menuLinks}>
              {[
                { to: '/', label: '🏠 Home' },
                { to: '/shop', label: '🛍 Shop' },
                { to: '/wishlist', label: '❤️ Wishlist' },
                { to: '/cart', label: '🛒 Cart' },
                ...(user ? [{ to: '/profile', label: '👤 Profile' }, { to: '/orders', label: '📦 My Orders' }] : []),
                ...(user?.role === 'ADMIN' ? [{ to: '/admin', label: '⚙️ Admin Panel' }] : [])
              ].map(item => (
                <Link key={item.to} to={item.to} style={styles.menuLink} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </Link>
              ))}
            </div>
            <div style={styles.menuFooter}>
              {user ? (
                <button style={styles.logoutBtn} onClick={() => { logout(); setMenuOpen(false) }}>Logout</button>
              ) : (
                <div style={{ display: 'flex', gap: '.8rem' }}>
                  <Link to="/login" style={{ flex: 1 }} onClick={() => setMenuOpen(false)}>
                    <button style={{ ...styles.logoutBtn, width: '100%' }}>Login</button>
                  </Link>
                  <Link to="/register" style={{ flex: 1 }} onClick={() => setMenuOpen(false)}>
                    <button className="btn-rose" style={{ width: '100%', padding: '12px' }}>Register</button>
                  </Link>
                </div>
              )}
              <p style={styles.codText}>✦ Cash on Delivery Available</p>
            </div>
          </div>
        </>
      )}

      {/* BOTTOM NAV */}
      <nav style={styles.bottomNav}>
        {[
          { to: '/', icon: '🏠', label: 'Home' },
          { to: '/shop', icon: '⊞', label: 'Shop' },
          { to: '/wishlist', icon: '☆', label: 'Wishlist' },
          { to: '/profile', icon: '👤', label: 'Profile' }
        ].map(item => {
          const active = location.pathname === item.to
          return (
            <Link key={item.to} to={item.to} style={{ ...styles.navItem, color: active ? 'var(--rose)' : 'var(--mid)' }}>
              <span style={{ fontSize: '1.3rem' }}>{item.icon}</span>
              <span style={{ fontSize: '.6rem', letterSpacing: '.05em', textTransform: 'uppercase', fontWeight: active ? 600 : 400 }}>{item.label}</span>
            </Link>
          )
        })}
      </nav>
    </>
  )
}

const styles = {
  header: { background: var(--cream)', position: 'sticky', top: 0, zIndex: 100, padding: '0 5%', height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(201,168,124,.15)', backdropFilter: 'blur(10px)' },
  menuBtn: { background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: 'var(--dark)', padding: '4px' },
  logo: { fontFamily: 'var(--fs)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--dark)', letterSpacing: '.02em' },
  cartIcon: { fontSize: '1.3rem', position: 'relative', display: 'flex', alignItems: 'center' },
  cartBadge: { position: 'absolute', top: -8, right: -8, background: 'var(--rose)', color: 'white', borderRadius: '50%', width: 18, height: 18, fontSize: '.6rem', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 200 },
  sideMenu: { position: 'fixed', top: 0, left: 0, height: '100vh', width: 280, background: 'var(--cream)', zIndex: 300, display: 'flex', flexDirection: 'column', boxShadow: '4px 0 30px rgba(0,0,0,.15)' },
  sideHeader: { padding: '1.2rem 1.5rem', borderBottom: '1px solid rgba(201,168,124,.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  sideTitle: { fontFamily: 'var(--fs)', fontSize: '1.1rem', fontWeight: 600 },
  closeBtn: { background: 'none', border: 'none', fontSize: '1.1rem', cursor: 'pointer', color: 'var(--mid)' },
  userInfo: { padding: '1.2rem 1.5rem', borderBottom: '1px solid rgba(201,168,124,.1)', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(201,168,124,.08)' },
  userAvatar: { width: 42, height: 42, borderRadius: '50%', background: 'var(--rose)', color: 'var(--dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--fs)', fontSize: '1.1rem', fontWeight: 700, flexShrink: 0 },
  userName: { fontWeight: 600, fontSize: '.88rem' },
  userEmail: { fontSize: '.72rem', color: 'var(--mid)', marginTop: 2 },
  menuLinks: { flex: 1, padding: '.8rem 0', overflowY: 'auto' },
  menuLink: { display: 'block', padding: '.9rem 1.5rem', fontSize: '.85rem', color: 'var(--dark)', borderBottom: '1px solid rgba(201,168,124,.08)', transition: 'background .2s' },
  menuFooter: { padding: '1.2rem 1.5rem', borderTop: '1px solid rgba(201,168,124,.15)' },
  logoutBtn: { width: '100%', background: 'none', border: '1.5px solid rgba(107,92,68,.3)', padding: '12px', fontSize: '.75rem', letterSpacing: '.1em', textTransform: 'uppercase', cursor: 'pointer', color: 'var(--dark)', borderRadius: 4 },
  codText: { textAlign: 'center', fontSize: '.65rem', color: 'var(--rose)', letterSpacing: '.1em', marginTop: '1rem', textTransform: 'uppercase' },
  bottomNav: { position: 'fixed', bottom: 0, left: 0, right: 0, background: 'var(--cream)', borderTop: '1px solid rgba(201,168,124,.2)', display: 'flex', zIndex: 100, boxShadow: '0 -4px 20px rgba(0,0,0,.08)' },
  navItem: { flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10px 0', gap: 3, transition: 'color .2s' }
}