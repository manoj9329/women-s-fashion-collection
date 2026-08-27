import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'

export default function Home() {
  const [products, setProducts] = useState([])

  useEffect(() => {
    api.get('/products').then(r => setProducts(r.data.slice(0, 8))).catch(() => {})
  }, [])

  return (
    <div>
      {/* MARQUEE */}
      <div style={styles.marqueeWrap}>
        <div style={styles.marquee}>
          {[...Array(2)].map((_, i) => (
            <span key={i}>✦ New Arrivals Daily &nbsp;&nbsp;&nbsp; ✦ Free Shipping Over ₹1999 &nbsp;&nbsp;&nbsp; ✦ Premium Quality &nbsp;&nbsp;&nbsp; ✦ Exclusive Designs &nbsp;&nbsp;&nbsp; ✦ Cash on Delivery Available &nbsp;&nbsp;&nbsp;</span>
          ))}
        </div>
      </div>

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.heroText}>
          <p style={styles.heroTag}>New Collection — 2025</p>
          <h1 style={styles.heroH}>Where Style<br/><em style={{ color: 'var(--rose)' }}>Meets</em> Grace</h1>
          <p style={styles.heroSub}>Handpicked new arrivals every day — curated dresses, ethnic wear and fusion styles for every woman.</p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/shop"><button className="btn-rose" style={{ padding: '13px 32px' }}>Shop Now</button></Link>
            <Link to="/shop"><button className="btn-outline" style={{ padding: '13px 32px', borderColor: 'rgba(201,168,124,.4)', color: 'var(--cream)' }}>View All</button></Link>
          </div>
        </div>
        <div style={styles.heroRight}>
          {[{ num: products.length || '100+', label: 'Items Available' }, { num: 'Daily', label: 'New Arrivals' }, { num: '500+', label: 'Happy Customers' }].map(s => (
            <div key={s.label} style={styles.heroStat}>
              <strong style={{ fontFamily: 'var(--fs)', fontSize: '2rem', fontWeight: 300, color: 'var(--rose)', display: 'block' }}>{s.num}</strong>
              <span style={{ fontSize: '.65rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'rgba(250,247,242,.5)' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={styles.section}>
        <p style={styles.sectionTag}>Browse By</p>
        <h2 style={styles.sectionTitle}>Shop <em>Categories</em></h2>
        <div style={styles.catGrid}>
          {['Sarees', 'Kurtis', 'Dresses', 'Lehengas', 'Tops', 'Co-ords'].map(cat => (
            <Link to={`/shop?category=${cat}`} key={cat} style={styles.catCard}>
              <div style={styles.catIcon}>{{'Sarees':'🌺','Kurtis':'👘','Dresses':'👗','Lehengas':'✨','Tops':'💐','Co-ords':'🎀'}[cat]}</div>
              <p style={styles.catName}>{cat}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section style={{ ...styles.section, background: 'var(--light)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 5%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
            <div><p style={styles.sectionTag}>Handpicked</p><h2 style={styles.sectionTitle}>Featured <em>Pieces</em></h2></div>
            <Link to="/shop" style={{ fontSize: '.72rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--rose)', borderBottom: '1px solid var(--rose)', paddingBottom: 2 }}>View All</Link>
          </div>
          <div style={styles.prodGrid}>
            {products.map(p => <ProductCard key={p.id} product={p}/>)}
          </div>
        </div>
      </section>

      {/* WHATSAPP BUTTON */}
      <a href="https://wa.me/917892441806?text=Hi! I'm interested in your fashion collection." target="_blank" rel="noreferrer" style={styles.waBtn} title="Order on WhatsApp">
        <span style={{ fontSize: '1.4rem' }}>💬</span>
        <span style={{ fontSize: '.72rem', letterSpacing: '.1em', fontWeight: 500 }}>Order on WhatsApp</span>
      </a>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <p style={{ fontFamily: 'var(--fs)', fontSize: '1.2rem', marginBottom: '.5rem' }}>Women's <span style={{ color: 'var(--rose)' }}>Fashion Collection</span></p>
        <p style={{ fontSize: '.72rem', opacity: .4 }}>© 2025 All rights reserved. Bengaluru, India.</p>
      </footer>
    </div>
  )
}

const styles = {
  marqueeWrap: { background: 'var(--rose)', overflow: 'hidden', whiteSpace: 'nowrap', padding: '8px 0' },
  marquee: { display: 'inline-block', animation: 'marquee 22s linear infinite', fontSize: '.65rem', letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--dark)' },
  hero: { background: 'var(--dark)', padding: '4rem 5% 3rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', alignItems: 'center', minHeight: 360 },
  heroText: { color: 'var(--cream)' },
  heroTag: { fontSize: '.65rem', letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--rose)', marginBottom: '1rem' },
  heroH: { fontFamily: 'var(--fs)', fontSize: '3.5rem', fontWeight: 300, lineHeight: 1.1, marginBottom: '1rem' },
  heroSub: { fontSize: '.88rem', color: 'rgba(250,247,242,.6)', lineHeight: 1.8, marginBottom: '2rem' },
  heroRight: { display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'flex-end' },
  heroStat: { border: '1px solid rgba(201,168,124,.25)', padding: '1rem 1.5rem', textAlign: 'center' },
  section: { padding: '5rem 5%', maxWidth: 1280, margin: '0 auto' },
  sectionTag: { fontSize: '.65rem', letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--rose)', marginBottom: '.8rem' },
  sectionTitle: { fontFamily: 'var(--fs)', fontSize: '2.5rem', fontWeight: 300, marginBottom: '2.5rem' },
  catGrid: { display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '1rem' },
  catCard: { background: '#fff', border: '1px solid rgba(201,168,124,.15)', padding: '1.5rem 1rem', textAlign: 'center', transition: 'transform .2s, border-color .2s', cursor: 'pointer', display: 'block' },
  catIcon: { fontSize: '2rem', marginBottom: '.5rem' },
  catName: { fontFamily: 'var(--fs)', fontSize: '1rem', fontWeight: 400 },
  prodGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '1.4rem' },
  waBtn: { position: 'fixed', bottom: '2rem', right: '2rem', background: '#25D366', color: '#fff', display: 'flex', alignItems: 'center', gap: '.6rem', padding: '12px 20px', borderRadius: '50px', boxShadow: '0 4px 20px rgba(37,211,102,.35)', zIndex: 90, textDecoration: 'none' },
  footer: { background: 'var(--dark)', color: 'var(--cream)', textAlign: 'center', padding: '3rem 5%' }
}
