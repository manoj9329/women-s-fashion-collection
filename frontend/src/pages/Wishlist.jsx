import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { toast } from 'react-toastify'

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useApp()
  const navigate = useNavigate()

  const handleAddToCart = (product) => {
    const size = product.sizes?.[0] || 'Free Size'
    const color = product.colors?.[0] || 'Default'
    addToCart(product, size, color)
    toast.success(`${product.name} added to bag!`, { position: 'bottom-right', autoClose: 2000 })
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <h1 style={styles.title}>My <em style={{ fontStyle: 'italic', color: 'var(--rose)' }}>Wishlist</em></h1>
        <p style={styles.count}>{wishlist.length} item{wishlist.length !== 1 ? 's' : ''}</p>
      </div>

      {wishlist.length === 0 ? (
        <div style={styles.empty}>
          <span style={{ fontSize: '4rem' }}>🤍</span>
          <p style={styles.emptyTitle}>Your wishlist is empty</p>
          <p style={styles.emptySub}>Save items you love by clicking the heart icon</p>
          <button className="btn-primary" style={{ marginTop: '1.5rem', padding: '12px 32px' }}
                  onClick={() => navigate('/shop')}>Browse Collection</button>
        </div>
      ) : (
        <div style={styles.grid}>
          {wishlist.map(product => (
            <div key={product.id} style={styles.card}>
              <div style={styles.imgWrap} onClick={() => navigate(`/product/${product.id}`)}>
                {product.imageUrl
                  ? <img src={product.imageUrl} alt={product.name} style={styles.img} onError={e => e.target.style.display = 'none'}/>
                  : <div style={styles.placeholder}>👗</div>
                }
                {product.badge && (
                  <span style={{ ...styles.badge, background: product.badge === 'sale' ? '#7a3e2a' : 'var(--rose)' }}>
                    {product.badge.toUpperCase()}
                  </span>
                )}
              </div>
              <div style={styles.info}>
                <p style={styles.cat}>{product.category}</p>
                <p style={styles.name}>{product.name}</p>
                <div style={styles.priceRow}>
                  <span style={styles.price}>₹{product.price?.toLocaleString()}</span>
                  {product.originalPrice > 0 && (
                    <span style={styles.oldPrice}>₹{product.originalPrice?.toLocaleString()}</span>
                  )}
                </div>
                <div style={styles.actions}>
                  <button className="btn-primary" style={{ flex: 1, padding: '10px', fontSize: '.68rem' }}
                          onClick={() => handleAddToCart(product)}>Add to Bag</button>
                  <button style={styles.removeBtn} onClick={() => toggleWishlist(product)}>🗑</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  wrap: { maxWidth: 1280, margin: '2.5rem auto', padding: '0 5% 4rem' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' },
  title: { fontFamily: 'var(--fs)', fontSize: '2rem', fontWeight: 300 },
  count: { fontSize: '.78rem', color: 'var(--mid)' },
  empty: { textAlign: 'center', padding: '6rem 2rem' },
  emptyTitle: { fontFamily: 'var(--fs)', fontSize: '1.8rem', fontWeight: 300, margin: '1rem 0 .5rem' },
  emptySub: { fontSize: '.85rem', color: 'var(--mid)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '1.4rem' },
  card: { background: '#fff', border: '1px solid rgba(201,168,124,.12)', borderRadius: 2 },
  imgWrap: { aspectRatio: '3/4', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg,#e8d5b7,#c9a87c)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' },
  img: { width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 },
  placeholder: { fontSize: '4rem', opacity: .2 },
  badge: { position: 'absolute', top: 10, left: 10, color: '#fff', fontSize: '.55rem', letterSpacing: '.1em', textTransform: 'uppercase', padding: '3px 8px' },
  info: { padding: '1rem' },
  cat: { fontSize: '.65rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--rose)', marginBottom: 4 },
  name: { fontFamily: 'var(--fs)', fontSize: '1.05rem', marginBottom: 6, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  priceRow: { display: 'flex', gap: '.6rem', alignItems: 'center', marginBottom: '1rem' },
  price: { fontSize: '.9rem', fontWeight: 500 },
  oldPrice: { fontSize: '.78rem', color: 'var(--mid)', textDecoration: 'line-through' },
  actions: { display: 'flex', gap: '.6rem', alignItems: 'center' },
  removeBtn: { background: 'none', border: '1px solid rgba(107,92,68,.25)', padding: '9px 12px', cursor: 'pointer', fontSize: '1rem' }
}