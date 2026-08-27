import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { toast } from 'react-toastify'

export default function ProductCard({ product }) {
  const { addToCart, toggleWishlist, isWishlisted } = useApp()
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  const wishlisted = isWishlisted(product.id)

  const handleAdd = (e) => {
    e.stopPropagation()
    const size = product.sizes?.[0] || 'Free Size'
    const color = product.colors?.[0] || 'Default'
    addToCart(product, size, color)
    toast.success(`${product.name} added to bag!`, { position: 'bottom-right', autoClose: 2000 })
  }

  const handleWishlist = (e) => {
    e.stopPropagation()
    toggleWishlist(product)
    toast.info(wishlisted ? 'Removed from wishlist' : '❤️ Added to wishlist', { position: 'bottom-right', autoClose: 1500 })
  }

  const discount = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0

  return (
    <div style={styles.card}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => navigate(`/product/${product.id}`)}>
      <div style={styles.imgWrap}>
        {product.badge && (
          <span style={{ ...styles.badge, background: product.badge === 'sale' ? '#7a3e2a' : product.badge === 'hot' ? '#993556' : 'var(--rose)' }}>
            {product.badge.toUpperCase()}
          </span>
        )}
        {discount > 0 && <span style={styles.discBadge}>-{discount}%</span>}

        {/* Wishlist Heart Button */}
        <button style={{ ...styles.heartBtn, background: wishlisted ? 'var(--rose)' : 'white' }}
                onClick={handleWishlist} title={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}>
          {wishlisted ? '❤️' : '🤍'}
        </button>

        {product.imageUrl
          ? <img src={product.imageUrl} alt={product.name} style={styles.img} onError={e => e.target.style.display = 'none'}/>
          : <div style={styles.placeholder}>👗</div>
        }
        <div style={{ ...styles.overlay, background: hovered ? 'rgba(26,18,8,.35)' : 'transparent' }}>
          <button className="btn-primary" style={{ ...styles.addBtn, opacity: hovered ? 1 : 0, transform: hovered ? 'translateY(0)' : 'translateY(10px)' }}
                  onClick={handleAdd}>Add to Bag</button>
        </div>
      </div>
      <div style={styles.info}>
        <p style={styles.cat}>{product.category}</p>
        <p style={styles.name} title={product.name}>{product.name}</p>
        <div style={styles.priceRow}>
          <span style={styles.price}>₹{product.price.toLocaleString()}</span>
          {product.originalPrice > 0 && <span style={styles.oldPrice}>₹{product.originalPrice.toLocaleString()}</span>}
        </div>
        {product.sizes?.length > 0 && (
          <div style={styles.sizes}>{product.sizes.map(s => <span key={s} style={styles.sizeChip}>{s}</span>)}</div>
        )}
      </div>
    </div>
  )
}

const styles = {
  card: { background: '#fff', border: '1px solid rgba(201,168,124,.12)', cursor: 'pointer', transition: 'transform .25s', borderRadius: 2 },
  imgWrap: { aspectRatio: '3/4', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg,#e8d5b7,#c9a87c)', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  img: { width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 },
  placeholder: { fontSize: '4rem', opacity: .2 },
  overlay: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '1rem', transition: 'background .3s' },
  addBtn: { fontSize: '.65rem', padding: '9px 20px', transition: 'all .3s' },
  badge: { position: 'absolute', top: 10, left: 10, color: '#fff', fontSize: '.55rem', letterSpacing: '.1em', textTransform: 'uppercase', padding: '3px 8px', zIndex: 1 },
  discBadge: { position: 'absolute', top: 10, right: 10, background: '#3b6d11', color: '#fff', fontSize: '.55rem', letterSpacing: '.1em', padding: '3px 8px', zIndex: 1 },
  heartBtn: { position: 'absolute', top: 36, right: 10, border: 'none', width: 32, height: 32, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.9rem', zIndex: 2, boxShadow: '0 2px 8px rgba(0,0,0,.15)', transition: 'all .2s' },
  info: { padding: '.9rem 1rem' },
  cat: { fontSize: '.65rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--rose)', marginBottom: 4 },
  name: { fontFamily: 'var(--fs)', fontSize: '1.05rem', marginBottom: 4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  priceRow: { display: 'flex', gap: '.6rem', alignItems: 'center', marginBottom: 6 },
  price: { fontSize: '.9rem', fontWeight: 500 },
  oldPrice: { fontSize: '.78rem', color: 'var(--mid)', textDecoration: 'line-through' },
  sizes: { display: 'flex', gap: 4, flexWrap: 'wrap' },
  sizeChip: { fontSize: '.58rem', border: '1px solid rgba(107,92,68,.25)', padding: '2px 6px', color: 'var(--mid)' }
}