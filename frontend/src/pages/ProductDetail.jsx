import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useApp } from '../context/AppContext'
import { toast } from 'react-toastify'
import ProductCard from '../components/ProductCard'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart, toggleWishlist, isWishlisted } = useApp()
  const [product, setProduct] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [qty, setQty] = useState(1)

  useEffect(() => {
    api.get(`/products/${id}`).then(r => {
      setProduct(r.data)
      if (r.data.sizes?.length) setSelectedSize(r.data.sizes[0])
      if (r.data.colors?.length) setSelectedColor(r.data.colors[0])
      // Fetch suggestions from same category
      api.get(`/products?category=${r.data.category}`).then(res => {
        setSuggestions(res.data.filter(p => p.id !== r.data.id).slice(0, 4))
      }).catch(() => {})
    }).catch(() => navigate('/shop'))
  }, [id])

  if (!product) return (
    <div style={{ textAlign: 'center', padding: '4rem', fontFamily: 'var(--fs)', fontSize: '1.5rem' }}>
      Loading...
    </div>
  )

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0

  const wishlisted = isWishlisted(product.id)

  const handleAddToCart = () => {
    if (product.sizes?.length && !selectedSize) { toast.error('Please select a size'); return }
    if (product.colors?.length && !selectedColor) { toast.error('Please select a color'); return }
    addToCart(product, selectedSize || 'Free Size', selectedColor || 'Default', qty)
    toast.success('Added to bag!', { position: 'bottom-right', autoClose: 2000 })
  }

  const handleWishlist = () => {
    toggleWishlist(product)
    toast.info(wishlisted ? 'Removed from wishlist' : '❤️ Added to wishlist', { position: 'bottom-right', autoClose: 1500 })
  }

  const waMsg = encodeURIComponent(`Hi! I'm interested in ${product.name} (₹${product.price}). Size: ${selectedSize}. Color: ${selectedColor}`)

  return (
    <div>
      <div style={styles.wrap}>
        {/* Image */}
        <div style={styles.imgWrap}>
          {product.imageUrl
            ? <img src={product.imageUrl} alt={product.name} style={styles.img}/>
            : <div style={styles.imgPlaceholder}>👗</div>
          }
          {product.badge && (
            <span style={{ ...styles.badge, background: product.badge === 'sale' ? '#7a3e2a' : 'var(--rose)' }}>
              {product.badge.toUpperCase()}
            </span>
          )}
          {discount > 0 && (
            <span style={styles.discBadge}>-{discount}% OFF</span>
          )}
        </div>

        {/* Details */}
        <div style={styles.details}>
          <p style={styles.cat}>{product.category}</p>
          <h1 style={styles.name}>{product.name}</h1>

          <div style={styles.priceRow}>
            <span style={styles.price}>₹{product.price.toLocaleString()}</span>
            {product.originalPrice > 0 && <>
              <span style={styles.oldPrice}>₹{product.originalPrice.toLocaleString()}</span>
              <span style={styles.disc}>{discount}% OFF</span>
            </>}
          </div>

          {product.description && <p style={styles.desc}>{product.description}</p>}

          {product.sizes?.length > 0 && (
            <div style={styles.selectGroup}>
              <label style={styles.selectLabel}>Size</label>
              <div style={styles.chips}>
                {product.sizes.map(s => (
                  <button key={s} style={{ ...styles.chip, ...(selectedSize === s ? styles.chipActive : {}) }}
                          onClick={() => setSelectedSize(s)}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {product.colors?.length > 0 && (
            <div style={styles.selectGroup}>
              <label style={styles.selectLabel}>Color</label>
              <div style={styles.chips}>
                {product.colors.map(c => (
                  <button key={c} style={{ ...styles.chip, ...(selectedColor === c ? styles.chipActive : {}) }}
                          onClick={() => setSelectedColor(c)}>{c}</button>
                ))}
              </div>
            </div>
          )}

          <div style={styles.qtyRow}>
            <label style={styles.selectLabel}>Quantity</label>
            <div style={styles.qtyCtrl}>
              <button style={styles.qtyBtn} onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
              <span style={{ padding: '0 1rem', minWidth: 30, textAlign: 'center' }}>{qty}</span>
              <button style={styles.qtyBtn} onClick={() => setQty(q => q + 1)}>+</button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '.8rem', marginTop: '1.5rem' }}>
            <button className="btn-primary" style={{ padding: '14px', width: '100%' }}
                    onClick={handleAddToCart}>Add to Bag</button>

            <button style={{ ...styles.wishlistBtn, background: wishlisted ? '#fff0f0' : '#fff', color: wishlisted ? '#c9405a' : 'var(--dark)', borderColor: wishlisted ? '#c9405a' : 'rgba(107,92,68,.3)' }}
                    onClick={handleWishlist}>
              {wishlisted ? '❤️ Remove from Wishlist' : '🤍 Add to Wishlist'}
            </button>

            <a href={`https://wa.me/919876543210?text=${waMsg}`} target="_blank" rel="noreferrer"
               style={{ background: '#25D366', color: '#fff', border: 'none', padding: '13px', fontFamily: 'var(--fn)', fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', textAlign: 'center', cursor: 'pointer', display: 'block', textDecoration: 'none' }}>
              💬 Order on WhatsApp
            </a>
          </div>

          <div style={styles.meta}>
            <p>Stock: {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}</p>
            <p style={{ marginTop: '.4rem', fontSize: '.75rem', color: 'var(--rose)' }}>✦ Cash on Delivery Available</p>
            <p style={{ marginTop: '.4rem', fontSize: '.75rem', color: 'var(--mid)' }}>🚚 Free shipping on orders above ₹1999</p>
          </div>
        </div>
      </div>

      {/* SUGGESTIONS */}
      {suggestions.length > 0 && (
        <div style={styles.suggestionsWrap}>
          <div style={styles.suggestionsInner}>
            <p style={styles.sugTag}>You May Also Like</p>
            <h2 style={styles.sugTitle}>Similar <em style={{ fontStyle: 'italic', color: 'var(--rose)' }}>Products</em></h2>
            <div style={styles.sugGrid}>
              {suggestions.map(p => <ProductCard key={p.id} product={p}/>)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  wrap: { maxWidth: 1100, margin: '3rem auto', padding: '0 5%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'start' },
  imgWrap: { position: 'relative', background: 'linear-gradient(135deg,#e8d5b7,#c9a87c)', aspectRatio: '3/4', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  img: { width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 },
  imgPlaceholder: { fontSize: '6rem', opacity: .2 },
  badge: { position: 'absolute', top: 16, left: 16, color: '#fff', fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', padding: '4px 10px' },
  discBadge: { position: 'absolute', top: 16, right: 16, background: '#3b6d11', color: '#fff', fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', padding: '4px 10px' },
  details: { paddingTop: '1rem' },
  cat: { fontSize: '.65rem', letterSpacing: '.25em', textTransform: 'uppercase', color: 'var(--rose)', marginBottom: '.5rem' },
  name: { fontFamily: 'var(--fs)', fontSize: '2rem', fontWeight: 300, marginBottom: '1rem' },
  priceRow: { display: 'flex', gap: '.8rem', alignItems: 'center', marginBottom: '1.2rem' },
  price: { fontSize: '1.5rem', fontFamily: 'var(--fs)', fontWeight: 400 },
  oldPrice: { fontSize: '1rem', color: 'var(--mid)', textDecoration: 'line-through' },
  disc: { background: '#eaf3de', color: '#3b6d11', fontSize: '.65rem', padding: '3px 8px', letterSpacing: '.1em' },
  desc: { fontSize: '.88rem', color: 'var(--mid)', lineHeight: 1.8, marginBottom: '1.5rem' },
  selectGroup: { marginBottom: '1.2rem' },
  selectLabel: { fontSize: '.65rem', letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--mid)', display: 'block', marginBottom: '.6rem' },
  chips: { display: 'flex', gap: '.5rem', flexWrap: 'wrap' },
  chip: { background: 'none', border: '1px solid rgba(107,92,68,.3)', padding: '7px 16px', fontSize: '.78rem', color: 'var(--dark)', cursor: 'pointer', transition: 'all .2s' },
  chipActive: { background: 'var(--dark)', color: 'var(--cream)', borderColor: 'var(--dark)' },
  qtyRow: { marginBottom: '1rem' },
  qtyCtrl: { display: 'flex', alignItems: 'center', border: '1px solid rgba(107,92,68,.25)', width: 'fit-content', marginTop: '.6rem' },
  qtyBtn: { background: 'none', border: 'none', width: 36, height: 36, fontSize: '1.1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  wishlistBtn: { width: '100%', border: '1px solid', padding: '13px', fontSize: '.72rem', letterSpacing: '.18em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all .2s', fontFamily: 'var(--fn)' },
  meta: { marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(201,168,124,.2)', fontSize: '.78rem', color: 'var(--mid)' },
  suggestionsWrap: { background: 'var(--light)', padding: '4rem 5%', marginTop: '2rem' },
  suggestionsInner: { maxWidth: 1100, margin: '0 auto' },
  sugTag: { fontSize: '.65rem', letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--rose)', marginBottom: '.8rem' },
  sugTitle: { fontFamily: 'var(--fs)', fontSize: '2rem', fontWeight: 300, marginBottom: '2rem' },
  sugGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '1.4rem' }
}