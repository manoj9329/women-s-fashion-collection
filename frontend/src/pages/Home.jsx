import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'

const CATEGORY_IMAGES = {
  'Sarees': 'https://images.unsplash.com/photo-1610189020745-8e502b8d5c2c?w=400&q=80',
  'Kurtis': 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&q=80',
  'Dresses': 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80',
  'Lehengas': 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=400&q=80',
  'Tops': 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&q=80',
  'Co-ords': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80'
}

export default function Home() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/products').then(r => setProducts(r.data.slice(0, 6))).catch(() => {})
    api.get('/products/categories').then(r => setCategories(r.data)).catch(() => {})
  }, [])

  return (
    <div style={{ background: 'var(--cream)', minHeight: '100vh' }}>

      {/* MARQUEE */}
      <div style={styles.marqueeWrap}>
        <div style={styles.marquee}>
          {[...Array(2)].map((_, i) => (
            <span key={i}>
              ✦ New Arrivals Just Dropped &nbsp;&nbsp;&nbsp;
              ✦ Free Shipping Over ₹1999 &nbsp;&nbsp;&nbsp;
              ✦ Premium Quality &nbsp;&nbsp;&nbsp;
              ✦ Cash on Delivery Available &nbsp;&nbsp;&nbsp;
              ✦ Exclusive Designs &nbsp;&nbsp;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <p style={styles.heroTag}>☆ New Collection — 2025</p>
          <h1 style={styles.heroTitle}>
            Where Style<br/>
            <em style={styles.heroEm}>Meets</em>{' '}Grace
          </h1>
          <p style={styles.heroSub}>
            Handpicked new arrivals every day — curated dresses,
            ethnic wear and fusion styles for every woman.
          </p>
          <div style={styles.heroBtns}>
            <Link to="/shop"><button className="btn-rose" style={{ padding: '14px 32px' }}>Shop Now</button></Link>
            <Link to="/shop"><button className="btn-outline" style={{ padding: '14px 32px' }}>View All</button></Link>
          </div>
        </div>
        <div style={styles.heroStats}>
          {[{ num: products.length || '10+', label: 'Items Available' },
            { num: 'Daily', label: 'New Arrivals' },
            { num: '500+', label: 'Happy Customers' }].map(s => (
            <div key={s.label} style={styles.heroStat}>
              <strong style={styles.heroStatNum}>{s.num}</strong>
              <span style={styles.heroStatLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={styles.section}>
        <p style={styles.sectionTag}>Browse By</p>
        <h2 style={styles.sectionTitle}>Shop <em style={{ fontStyle: 'italic' }}>Categories</em></h2>
        <div style={styles.divider}/>
        <div style={styles.catGrid}>
          {(categories.length > 0 ? categories : Object.keys(CATEGORY_IMAGES)).map(cat => (
            <Link to={`/shop?category=${cat}`} key={cat} style={styles.catCard}>
              <div style={styles.catImgWrap}>
                <img src={CATEGORY_IMAGES[cat] || CATEGORY_IMAGES['Dresses']}
                     alt={cat} style={styles.catImg}
                     onError={e => e.target.src = CATEGORY_IMAGES['Dresses']}/>
                <div style={styles.catOverlay}>
                  <p style={styles.catName}>{cat}</p>
                  <p style={styles.catExplore}>Explore →</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section style={{ ...styles.section, background: 'var(--light)', padding: '3rem 5%' }}>
        <p style={styles.sectionTag}>Handpicked</p>
        <h2 style={styles.sectionTitle}>Featured <em style={{ fontStyle: 'italic' }}>Pieces</em></h2>
        <div style={styles.divider}/>
        {products.length === 0 ? (
          <div style={styles.empty}>
            <p>No products yet. Admin can add products from the Admin Panel.</p>
          </div>
        ) : (
          <div style={styles.prodGrid}>
            {products.map(p => <ProductCard key={p.id} product={p}/>)}
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link to="/shop"><button className="btn-outline" style={{ padding: '13px 32px' }}>View All Pieces</button></Link>
        </div>
      </section>

      {/* WHATSAPP */}
      <a href="https://wa.me/919876543210?text=Hi! I'm interested in your fashion collection."
         target="_blank" rel="noreferrer" style={styles.waBtn}>
        <span style={{ fontSize: '1.2rem' }}>💬</span>
        <span style={{ fontSize: '.75rem', fontWeight: 500 }}>Order on WhatsApp</span>
      </a>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <p style={styles.footerLogo}>Women's <span style={{ color: 'var(--rose)' }}>Fashion</span></p>
        <p style={styles.footerSub}>© 2025 All rights reserved. Bengaluru, India.</p>
      </footer>
    </div>
  )
}

const styles = {
  marqueeWrap: { background: 'var(--rose)', overflow: 'hidden', whiteSpace: 'nowrap', padding: '8px 0' },
  marquee: { display: 'inline-block', animation: 'marquee 25s linear infinite', fontSize: '.65rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--dark)' },
  hero: { background: 'var(--dark)', padding: '3rem 5% 2.5rem', color: 'var(--cream)' },
  heroContent: { marginBottom: '2rem' },
  heroTag: { fontSize: '.72rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--rose)', marginBottom: '1rem' },
  heroTitle: { fontFamily: 'var(--fs)', fontSize: '3rem', fontWeight: 700, lineHeight: 1.15, marginBottom: '1rem' },
  heroEm: { fontStyle: 'italic', color: 'var(--rose)', fontWeight: 400 },
  heroSub: { fontSize: '.88rem', color: 'rgba(250,247,242,.65)', lineHeight: 1.7, marginBottom: '1.8rem' },
  heroBtns: { display: 'flex', gap: '1rem', flexWrap: 'wrap' },
  heroStats: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '.8rem' },
  heroStat: { border: '1px solid rgba(201,168,124,.2)', padding: '1rem', textAlign: 'center', borderRadius: 4 },
  heroStatNum: { fontFamily: 'var(--fs)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--rose)', display: 'block' },
  heroStatLabel: { fontSize: '.6rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(250,247,242,.5)' },
  section: { padding: '3rem 5%', maxWidth: 1280, margin: '0 auto' },
  sectionTag: { fontSize: '.65rem', letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--mid)', marginBottom: '.5rem', textAlign: 'center' },
  sectionTitle: { fontFamily: 'var(--fs)', fontSize: '2rem', fontWeight: 700, marginBottom: '.8rem', textAlign: 'center' },
  divider: { width: 40, height: 2, background: 'var(--rose)', margin: '0 auto 2rem' },
  catGrid: { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1rem' },
  catCard: { display: 'block', borderRadius: 8, overflow: 'hidden' },
  catImgWrap: { position: 'relative', aspectRatio: '1/1', overflow: 'hidden' },
  catImg: { width: '100%', height: '100%', objectFit: 'cover', transition: 'transform .4s ease' },
  catOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent,rgba(26,18,8,.7))', padding: '2rem 1rem 1rem', color: 'white' },
  catName: { fontFamily: 'var(--fs)', fontSize: '1.2rem', fontWeight: 600, marginBottom: 2 },
  catExplore: { fontSize: '.68rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.8)' },
  prodGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '1rem' },
  empty: { textAlign: 'center', padding: '3rem', color: 'var(--mid)', fontSize: '.88rem' },
  waBtn: { position: 'fixed', bottom: '80px', right: '1rem', background: '#25D366', color: '#fff', display: 'flex', alignItems: 'center', gap: '.5rem', padding: '10px 16px', borderRadius: '50px', boxShadow: '0 4px 20px rgba(37,211,102,.35)', zIndex: 90, textDecoration: 'none' },
  footer: { background: 'var(--dark)', color: 'var(--cream)', textAlign: 'center', padding: '2rem 5%' },
  footerLogo: { fontFamily: 'var(--fs)', fontSize: '1.2rem', fontWeight: 700, marginBottom: '.4rem' },
  footerSub: { fontSize: '.72rem', opacity: .4 }
}