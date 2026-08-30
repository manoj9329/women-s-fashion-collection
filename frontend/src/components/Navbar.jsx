```jsx
import { Link, useLocation } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { useState } from 'react'

export default function Navbar() {
  const { user, logout, cartCount } = useApp()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const menuItems = [
    { to: '/', label: '🏠 Home' },
    { to: '/shop', label: '🛍 Shop' },
    { to: '/wishlist', label: '❤️ Wishlist' },
    { to: '/cart', label: '🛒 Cart' },
    ...(user
      ? [
          { to: '/profile', label: '👤 Profile' },
          { to: '/orders', label: '📦 My Orders' }
        ]
      : []),
    ...(user?.role === 'ADMIN'
      ? [{ to: '/admin', label: '⚙️ Admin Panel' }]
      : [])
  ]

  const bottomItems = [
    { to: '/', icon: '🏠', label: 'Home' },
    { to: '/shop', icon: '⊞', label: 'Shop' },
    { to: '/wishlist', icon: '☆', label: 'Wishlist' },
    ...(user
      ? [{ to: '/profile', icon: '👤', label: 'Profile' }]
      : [{ to: '/login', icon: '👤', label: 'Login' }])
  ]

  const handleLogout = () => {
    logout()
    setMenuOpen(false)
  }

  return (
    <>
      {/* =========================
          TOP HEADER
      ========================== */}
      <header style={styles.header}>

        {/* MENU BUTTON */}
        <button
          type="button"
          style={styles.menuBtn}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Open menu"
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        {/* LOGO */}
        <Link to="/" style={styles.logo}>
          Women's Fashion
        </Link>

        {/* CART */}
        <Link
          to="/cart"
          style={styles.cartIcon}
          aria-label="Shopping cart"
        >
          🛍

          {cartCount > 0 && (
            <span style={styles.cartBadge}>
              {cartCount}
            </span>
          )}
        </Link>
      </header>


      {/* =========================
          SIDE MENU
      ========================== */}
      {menuOpen && (
        <>
          {/* OVERLAY */}
          <div
            style={styles.overlay}
            onClick={() => setMenuOpen(false)}
          />

          {/* SIDE MENU */}
          <div style={styles.sideMenu}>

            {/* MENU HEADER */}
            <div style={styles.sideHeader}>
              <p style={styles.sideTitle}>
                Menu
              </p>

              <button
                type="button"
                style={styles.closeBtn}
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
              >
                ✕
              </button>
            </div>


            {/* USER INFORMATION */}
            {user && (
              <div style={styles.userInfo}>

                <div style={styles.userAvatar}>
                  {user.name?.[0]?.toUpperCase() || 'U'}
                </div>

                <div style={styles.userDetails}>
                  <p style={styles.userName}>
                    {user.name}
                  </p>

                  <p style={styles.userEmail}>
                    {user.email}
                  </p>
                </div>

              </div>
            )}


            {/* MENU LINKS */}
            <div style={styles.menuLinks}>

              {menuItems.map((item) => {

                const active =
                  location.pathname === item.to

                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    style={{
                      ...styles.menuLink,
                      background: active
                        ? 'rgba(201,168,124,.12)'
                        : 'transparent',
                      color: active
                        ? 'var(--rose)'
                        : 'var(--dark)'
                    }}
                    onClick={() => setMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )
              })}

            </div>


            {/* MENU FOOTER */}
            <div style={styles.menuFooter}>

              {user ? (
                <button
                  type="button"
                  style={styles.logoutBtn}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              ) : (
                <div style={styles.authButtons}>

                  <Link
                    to="/login"
                    style={styles.authLink}
                    onClick={() => setMenuOpen(false)}
                  >
                    <button
                      type="button"
                      style={{
                        ...styles.logoutBtn,
                        width: '100%'
                      }}
                    >
                      Login
                    </button>
                  </Link>

                  <Link
                    to="/register"
                    style={styles.authLink}
                    onClick={() => setMenuOpen(false)}
                  >
                    <button
                      type="button"
                      className="btn-rose"
                      style={styles.registerBtn}
                    >
                      Register
                    </button>
                  </Link>

                </div>
              )}

              <p style={styles.codText}>
                ✦ Cash on Delivery Available
              </p>

            </div>

          </div>
        </>
      )}


      {/* =========================
          BOTTOM NAVIGATION
      ========================== */}
      <nav style={styles.bottomNav}>

        {bottomItems.map((item) => {

          const active =
            location.pathname === item.to

          return (
            <Link
              key={item.to}
              to={item.to}
              style={{
                ...styles.navItem,
                color: active
                  ? 'var(--rose)'
                  : 'var(--mid)'
              }}
            >

              <span style={styles.navIcon}>
                {item.icon}
              </span>

              <span
                style={{
                  ...styles.navLabel,
                  fontWeight: active ? 600 : 400
                }}
              >
                {item.label}
              </span>

            </Link>
          )
        })}

      </nav>
    </>
  )
}


/* =================================
   STYLES
================================= */

const styles = {

  /* TOP HEADER */
  header: {
    background: 'var(--cream)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    padding: '0 5%',
    height: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom:
      '1px solid rgba(201,168,124,.15)',
    backdropFilter: 'blur(10px)'
  },


  /* MENU BUTTON */
  menuBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1.4rem',
    cursor: 'pointer',
    color: 'var(--dark)',
    padding: '4px'
  },


  /* LOGO */
  logo: {
    fontFamily: 'var(--fs)',
    fontSize: '1.2rem',
    fontWeight: 700,
    color: 'var(--dark)',
    letterSpacing: '.02em',
    textDecoration: 'none'
  },


  /* CART */
  cartIcon: {
    fontSize: '1.3rem',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none'
  },


  /* CART BADGE */
  cartBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    background: 'var(--rose)',
    color: 'white',
    borderRadius: '50%',
    width: 18,
    height: 18,
    fontSize: '.6rem',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },


  /* OVERLAY */
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,.5)',
    zIndex: 200
  },


  /* SIDE MENU */
  sideMenu: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    width: 280,
    background: 'var(--cream)',
    zIndex: 300,
    display: 'flex',
    flexDirection: 'column',
    boxShadow:
      '4px 0 30px rgba(0,0,0,.15)'
  },


  /* SIDE MENU HEADER */
  sideHeader: {
    padding: '1.2rem 1.5rem',
    borderBottom:
      '1px solid rgba(201,168,124,.15)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },


  /* MENU TITLE */
  sideTitle: {
    fontFamily: 'var(--fs)',
    fontSize: '1.1rem',
    fontWeight: 600,
    margin: 0
  },


  /* CLOSE BUTTON */
  closeBtn: {
    background: 'none',
    border: 'none',
    fontSize: '1.1rem',
    cursor: 'pointer',
    color: 'var(--mid)'
  },


  /* USER INFO */
  userInfo: {
    padding: '1.2rem 1.5rem',
    borderBottom:
      '1px solid rgba(201,168,124,.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    background:
      'rgba(201,168,124,.08)'
  },


  /* USER AVATAR */
  userAvatar: {
    width: 42,
    height: 42,
    borderRadius: '50%',
    background: 'var(--rose)',
    color: 'var(--dark)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--fs)',
    fontSize: '1.1rem',
    fontWeight: 700,
    flexShrink: 0
  },


  /* USER DETAILS */
  userDetails: {
    minWidth: 0
  },


  /* USER NAME */
  userName: {
    fontWeight: 600,
    fontSize: '.88rem',
    margin: 0
  },


  /* USER EMAIL */
  userEmail: {
    fontSize: '.72rem',
    color: 'var(--mid)',
    marginTop: 2,
    marginBottom: 0,
    wordBreak: 'break-word'
  },


  /* MENU LINKS */
  menuLinks: {
    flex: 1,
    padding: '.8rem 0',
    overflowY: 'auto'
  },


  /* MENU LINK */
  menuLink: {
    display: 'block',
    padding: '.9rem 1.5rem',
    fontSize: '.85rem',
    borderBottom:
      '1px solid rgba(201,168,124,.08)',
    transition: 'background .2s',
    textDecoration: 'none'
  },


  /* MENU FOOTER */
  menuFooter: {
    padding: '1.2rem 1.5rem',
    borderTop:
      '1px solid rgba(201,168,124,.15)'
  },


  /* AUTH BUTTONS */
  authButtons: {
    display: 'flex',
    gap: '.8rem'
  },


  authLink: {
    flex: 1,
    textDecoration: 'none'
  },


  /* LOGOUT / LOGIN */
  logoutBtn: {
    width: '100%',
    background: 'none',
    border:
      '1.5px solid rgba(107,92,68,.3)',
    padding: '12px',
    fontSize: '.75rem',
    letterSpacing: '.1em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    color: 'var(--dark)',
    borderRadius: 4
  },


  /* REGISTER */
  registerBtn: {
    width: '100%',
    padding: '12px',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer'
  },


  /* COD TEXT */
  codText: {
    textAlign: 'center',
    fontSize: '.65rem',
    color: 'var(--rose)',
    letterSpacing: '.1em',
    marginTop: '1rem',
    marginBottom: 0,
    textTransform: 'uppercase'
  },


  /* BOTTOM NAV */
  bottomNav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    background: 'var(--cream)',
    borderTop:
      '1px solid rgba(201,168,124,.2)',
    display: 'flex',
    zIndex: 100,
    boxShadow:
      '0 -4px 20px rgba(0,0,0,.08)'
  },


  /* BOTTOM NAV ITEM */
  navItem: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 0',
    gap: 3,
    transition: 'color .2s',
    textDecoration: 'none'
  },


  /* NAV ICON */
  navIcon: {
    fontSize: '1.3rem'
  },


  /* NAV LABEL */
  navLabel: {
    fontSize: '.6rem',
    letterSpacing: '.05em',
    textTransform: 'uppercase'
  }

}
```
