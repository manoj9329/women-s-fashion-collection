import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../api/axios'
import ProductCard from '../components/ProductCard'

const CATEGORIES = ['All', 'Sarees', 'Kurtis', 'Dresses', 'Lehengas', 'Tops', 'Co-ords']

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const activeCategory = searchParams.get('category') || 'All'

  useEffect(() => {
    setLoading(true)
    const params = {}
    if (search) params.search = search
    else if (activeCategory !== 'All') params.category = activeCategory
    api.get('/products', { params }).then(r => {
      let data = [...r.data]
      if (sort === 'price-asc') data.sort((a,b) => a.price - b.price)
      else if (sort === 'price-desc') data.sort((a,b) => b.price - a.price)
      else if (sort === 'name') data.sort((a,b) => a.name.localeCompare(b.name))
      setProducts(data)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [activeCategory, search, sort])

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '2rem 5% 4rem' }}>
      <h1 style={styles.title}>Our <em style={{ fontStyle: 'italic', color: 'var(--rose)' }}>Collection</em></h1>

      {/* FILTER BAR */}
      <div style={styles.filterBar}>
        <div style={styles.tabs}>
          {CATEGORIES.map(cat => (
            <button key={cat} style={{ ...styles.tab, ...(activeCategory === cat ? styles.tabActive : {}) }}
                    onClick={() => setSearchParams(cat === 'All' ? {} : { category: cat })}>
              {cat}
            </button>
          ))}
        </div>
        <div style={styles.searchRow}>
          <input style={styles.searchInput} placeholder="Search dresses..." value={search}
                 onChange={e => setSearch(e.target.value)}/>
          <select style={styles.sortSel} value={sort} onChange={e => setSort(e.target.value)}>
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="name">Name A–Z</option>
          </select>
        </div>
      </div>

      <p style={styles.count}>{products.length} item{products.length !== 1 ? 's' : ''}</p>

      {loading ? (
        <div style={styles.loading}>Loading collection...</div>
      ) : products.length === 0 ? (
        <div style={styles.empty}><span style={{ fontSize: '3rem' }}>🪡</span><p>No dresses found</p></div>
      ) : (
        <div style={styles.grid}>
          {products.map(p => <ProductCard key={p.id} product={p}/>)}
        </div>
      )}
    </div>
  )
}

const styles = {
  title: { fontFamily: 'var(--fs)', fontSize: '2.5rem', fontWeight: 300, marginBottom: '2rem' },
  filterBar: { marginBottom: '2rem' },
  tabs: { display: 'flex', gap: '.5rem', flexWrap: 'wrap', marginBottom: '1rem' },
  tab: { background: 'none', border: '1px solid rgba(107,92,68,.25)', fontSize: '.68rem', letterSpacing: '.12em', textTransform: 'uppercase', padding: '7px 18px', color: 'var(--mid)', transition: 'all .2s', cursor: 'pointer' },
  tabActive: { background: 'var(--dark)', color: 'var(--cream)', borderColor: 'var(--dark)' },
  searchRow: { display: 'flex', gap: '1rem', alignItems: 'center' },
  searchInput: { border: '1px solid rgba(107,92,68,.25)', padding: '8px 14px', fontSize: '.85rem', background: 'transparent', outline: 'none', minWidth: 220 },
  sortSel: { border: '1px solid rgba(107,92,68,.25)', padding: '8px 12px', fontSize: '.78rem', background: 'transparent', outline: 'none' },
  count: { fontSize: '.78rem', color: 'var(--mid)', marginBottom: '1.5rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: '1.4rem' },
  loading: { textAlign: 'center', padding: '4rem', color: 'var(--mid)', fontFamily: 'var(--fs)', fontSize: '1.2rem' },
  empty: { textAlign: 'center', padding: '4rem', color: 'var(--mid)' }
}
