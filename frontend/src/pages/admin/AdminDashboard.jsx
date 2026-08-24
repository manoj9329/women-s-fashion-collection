import { useEffect, useState } from 'react'
import api from '../../api/axios'
import { toast } from 'react-toastify'

const CATS = ['Sarees', 'Kurtis', 'Dresses', 'Lehengas', 'Tops', 'Co-ords', 'Other']
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size']
const EMPTY = { name: '', description: '', price: '', originalPrice: '', category: '', imageUrl: '', sizes: [], colors: '', stock: '', badge: '', status: 'ACTIVE' }

export default function AdminDashboard() {
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [tab, setTab] = useState('products')
  const [form, setForm] = useState(EMPTY)
  const [editId, setEditId] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => { fetchProducts(); fetchOrders() }, [])

  const fetchProducts = () => api.get('/admin/products').then(r => setProducts(r.data)).catch(() => {})
  const fetchOrders = () => api.get('/admin/orders').then(r => setOrders(r.data)).catch(() => {})

  const handleField = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const toggleSize = s => setForm(f => ({ ...f, sizes: f.sizes.includes(s) ? f.sizes.filter(x => x !== s) : [...f.sizes, s] }))

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.name || !form.price || !form.category) { toast.error('Name, price and category are required'); return }
    setLoading(true)
    try {
      const payload = { ...form, price: parseFloat(form.price), originalPrice: parseFloat(form.originalPrice) || 0,
        stock: parseInt(form.stock) || 0, colors: form.colors.split(',').map(c => c.trim()).filter(Boolean) }
      if (editId) { await api.put(`/admin/products/${editId}`, payload); toast.success('Product updated!') }
      else { await api.post('/admin/products', payload); toast.success('Product added to store!') }
      fetchProducts(); setForm(EMPTY); setEditId(null)
    } catch { toast.error('Failed to save product') } finally { setLoading(false) }
  }

  const handleEdit = p => {
    setEditId(p.id)
    setForm({ name: p.name, description: p.description || '', price: p.price, originalPrice: p.originalPrice || '',
      category: p.category, imageUrl: p.imageUrl || '', sizes: p.sizes || [], colors: p.colors?.join(', ') || '',
      stock: p.stock, badge: p.badge || '', status: p.status })
    setTab('products')
    window.scrollTo(0, 0)
  }

  const handleDelete = async id => {
    if (!confirm('Delete this product?')) return
    await api.delete(`/admin/products/${id}`)
    toast.success('Deleted'); fetchProducts()
  }

  const updateOrderStatus = async (id, status) => {
    await api.put(`/admin/orders/${id}/status`, { status })
    fetchOrders(); toast.success('Order status updated')
  }

  const activeProducts = products.filter(p => p.status === 'ACTIVE').length
  const totalOrders = orders.length
  const revenue = orders.filter(o => o.status !== 'CANCELLED').reduce((s, o) => s + (o.totalAmount || 0), 0)

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <p style={{ fontSize: '.78rem', color: 'var(--mid)' }}>Women's Fashion Collection</p>
      </div>

      {/* STATS */}
      <div style={styles.statsGrid}>
        {[{ label: 'Total Products', val: products.length }, { label: 'Active Listings', val: activeProducts },
          { label: 'Total Orders', val: totalOrders }, { label: 'Revenue', val: `₹${Math.round(revenue/1000)}K` }].map(s => (
          <div key={s.label} style={styles.stat}>
            <strong style={styles.statNum}>{s.val}</strong>
            <span style={styles.statLabel}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* TABS */}
      <div style={styles.tabs}>
        <button style={{ ...styles.tabBtn, ...(tab === 'products' ? styles.tabActive : {}) }} onClick={() => setTab('products')}>Products</button>
        <button style={{ ...styles.tabBtn, ...(tab === 'orders' ? styles.tabActive : {}) }} onClick={() => setTab('orders')}>Orders ({totalOrders})</button>
      </div>

      {tab === 'products' && (
        <div style={styles.grid}>
          {/* FORM */}
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>{editId ? 'Edit Product' : 'Add New Dress'}</h3>
            {form.imageUrl && <img src={form.imageUrl} alt="" style={styles.preview} onError={e => e.target.style.display = 'none'}/>}
            <form onSubmit={handleSubmit}>
              {[['Dress Name *', 'name', 'text', 'Floral Wrap Dress'],
                ['Image URL', 'imageUrl', 'url', 'https://...'],
                ['Price (₹) *', 'price', 'number', '1999'],
                ['Original Price (₹)', 'originalPrice', 'number', '2499'],
                ['Stock Qty', 'stock', 'number', '10']
              ].map(([label, name, type, ph]) => (
                <div key={name} style={styles.field}>
                  <label style={styles.fieldLabel}>{label}</label>
                  <input style={styles.fieldInput} type={type} name={name} value={form[name]} onChange={handleField} placeholder={ph}/>
                </div>
              ))}

              <div style={styles.field}>
                <label style={styles.fieldLabel}>Category *</label>
                <select style={styles.fieldInput} name="category" value={form.category} onChange={handleField}>
                  <option value="">Select...</option>
                  {CATS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.fieldLabel}>Sizes</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                  {SIZES.map(s => (
                    <button type="button" key={s} onClick={() => toggleSize(s)}
                            style={{ padding: '4px 12px', fontSize: '.72rem', border: '1px solid rgba(107,92,68,.3)', background: form.sizes.includes(s) ? 'var(--dark)' : 'none', color: form.sizes.includes(s) ? 'var(--cream)' : 'var(--mid)', cursor: 'pointer' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.fieldLabel}>Colors (comma separated)</label>
                <input style={styles.fieldInput} name="colors" value={form.colors} onChange={handleField} placeholder="Red, Blue, Green"/>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.8rem' }}>
                <div style={styles.field}>
                  <label style={styles.fieldLabel}>Badge</label>
                  <select style={styles.fieldInput} name="badge" value={form.badge} onChange={handleField}>
                    <option value="">None</option>
                    <option value="new">New</option><option value="sale">Sale</option><option value="hot">Hot</option>
                  </select>
                </div>
                <div style={styles.field}>
                  <label style={styles.fieldLabel}>Status</label>
                  <select style={styles.fieldInput} name="status" value={form.status} onChange={handleField}>
                    <option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option>
                  </select>
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.fieldLabel}>Description</label>
                <textarea style={{ ...styles.fieldInput, resize: 'none' }} name="description" value={form.description} onChange={handleField} rows={2} placeholder="Short description..."/>
              </div>

              <div style={{ display: 'flex', gap: '.6rem', marginTop: '.5rem' }}>
                <button className="btn-primary" style={{ flex: 1, padding: '12px' }} disabled={loading}>{loading ? 'Saving...' : editId ? 'Update' : 'Add Dress'}</button>
                {editId && <button type="button" style={{ padding: '12px 16px', background: 'none', border: '1px solid rgba(107,92,68,.3)', cursor: 'pointer', fontSize: '.68rem', letterSpacing: '.12em', textTransform: 'uppercase' }} onClick={() => { setForm(EMPTY); setEditId(null) }}>Cancel</button>}
              </div>
            </form>
          </div>

          {/* LIST */}
          <div style={styles.list}>
            <div style={styles.listHead}>
              <span>Photo</span><span>Product</span><span>Price</span><span>Stock</span><span>Status</span><span>Actions</span>
            </div>
            {products.length === 0 && <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--mid)' }}>No products yet</div>}
            {[...products].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).map(p => (
              <div key={p.id} style={styles.listRow}>
                <div style={styles.thumb}>{p.imageUrl ? <img src={p.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/> : '👗'}</div>
                <div>
                  <p style={{ fontSize: '.88rem', fontWeight: 500 }}>{p.name}</p>
                  <p style={{ fontSize: '.7rem', color: 'var(--mid)' }}>{p.category}{p.badge ? ` · ${p.badge.toUpperCase()}` : ''}</p>
                </div>
                <div style={{ fontSize: '.85rem' }}>
                  <span>₹{p.price?.toLocaleString()}</span>
                  {p.originalPrice > 0 && <span style={{ display: 'block', fontSize: '.72rem', textDecoration: 'line-through', color: 'var(--mid)' }}>₹{p.originalPrice?.toLocaleString()}</span>}
                </div>
                <div style={{ fontSize: '.82rem' }}>{p.stock}</div>
                <span style={{ fontSize: '.62rem', letterSpacing: '.1em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 20, background: p.status === 'ACTIVE' ? '#eaf3de' : '#fcebeb', color: p.status === 'ACTIVE' ? '#3b6d11' : '#a32d2d' }}>{p.status}</span>
                <div style={{ display: 'flex', gap: '.4rem' }}>
                  <button style={styles.actionBtn} onClick={() => handleEdit(p)}>Edit</button>
                  <button style={{ ...styles.actionBtn, color: '#a32d2d' }} onClick={() => handleDelete(p.id)}>Del</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'orders' && (
        <div style={styles.ordersTable}>
          <div style={styles.orderHead}><span>ID</span><span>Customer</span><span>Amount</span><span>Status</span><span>Date</span><span>Update</span></div>
          {orders.map(o => (
            <div key={o.id} style={styles.orderRow}>
              <span style={{ fontFamily: 'var(--fs)', fontSize: '1rem' }}>#{o.id}</span>
              <span style={{ fontSize: '.82rem' }}>{o.shippingAddress?.split(',')[0] || '—'}</span>
              <span style={{ fontSize: '.88rem' }}>₹{o.totalAmount?.toLocaleString()}</span>
              <span style={{ fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', padding: '3px 10px', borderRadius: 20, background: '#f0e9de', color: 'var(--mid)' }}>{o.status}</span>
              <span style={{ fontSize: '.75rem', color: 'var(--mid)' }}>{new Date(o.createdAt).toLocaleDateString('en-IN')}</span>
              <select style={{ border: '1px solid rgba(107,92,68,.25)', padding: '4px 8px', fontSize: '.75rem', background: 'transparent', outline: 'none', cursor: 'pointer' }}
                      value={o.status} onChange={e => updateOrderStatus(o.id, e.target.value)}>
                {['PENDING','PAID','PROCESSING','SHIPPED','DELIVERED','CANCELLED'].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

const styles = {
  wrap: { maxWidth: 1280, margin: '0 auto', padding: '2rem 4% 4rem' },
  header: { marginBottom: '1.5rem' },
  title: { fontFamily: 'var(--fs)', fontSize: '2rem', fontWeight: 300 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1rem', marginBottom: '2rem' },
  stat: { background: '#fff', border: '1px solid rgba(201,168,124,.15)', padding: '1rem 1.2rem' },
  statNum: { fontFamily: 'var(--fs)', fontSize: '1.8rem', fontWeight: 300, color: 'var(--rose)', display: 'block' },
  statLabel: { fontSize: '.62rem', letterSpacing: '.12em', textTransform: 'uppercase', color: 'var(--mid)' },
  tabs: { display: 'flex', gap: '.5rem', marginBottom: '1.5rem' },
  tabBtn: { background: 'none', border: '1px solid rgba(107,92,68,.25)', padding: '8px 24px', fontSize: '.72rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--mid)', cursor: 'pointer' },
  tabActive: { background: 'var(--dark)', color: 'var(--cream)', borderColor: 'var(--dark)' },
  grid: { display: 'grid', gridTemplateColumns: '360px 1fr', gap: '2rem', alignItems: 'start' },
  formCard: { background: '#fff', border: '1px solid rgba(201,168,124,.15)', padding: '1.5rem', position: 'sticky', top: 80 },
  formTitle: { fontFamily: 'var(--fs)', fontSize: '1.3rem', fontWeight: 400, marginBottom: '1.2rem' },
  preview: { width: '100%', height: 140, objectFit: 'cover', marginBottom: '.8rem', display: 'block' },
  field: { marginBottom: '.9rem' },
  fieldLabel: { fontSize: '.62rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--mid)', display: 'block', marginBottom: 4 },
  fieldInput: { width: '100%', border: '1px solid rgba(107,92,68,.25)', padding: '9px 12px', fontSize: '.85rem', outline: 'none', background: '#fff', fontFamily: 'var(--fn)', color: 'var(--dark)' },
  list: { background: '#fff', border: '1px solid rgba(201,168,124,.15)' },
  listHead: { display: 'grid', gridTemplateColumns: '50px 1fr 100px 60px 90px 90px', gap: '.5rem', padding: '.7rem 1rem', background: '#f5ede0', fontSize: '.62rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--mid)' },
  listRow: { display: 'grid', gridTemplateColumns: '50px 1fr 100px 60px 90px 90px', gap: '.5rem', padding: '.7rem 1rem', alignItems: 'center', borderBottom: '1px solid rgba(201,168,124,.1)' },
  thumb: { width: 44, height: 55, background: 'linear-gradient(135deg,#e8d5b7,#c9a87c)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', fontSize: '1.2rem' },
  actionBtn: { background: 'none', border: '1px solid rgba(107,92,68,.2)', padding: '4px 10px', fontSize: '.62rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--mid)', cursor: 'pointer' },
  ordersTable: { background: '#fff', border: '1px solid rgba(201,168,124,.15)' },
  orderHead: { display: 'grid', gridTemplateColumns: '60px 1fr 100px 120px 100px 140px', gap: '.5rem', padding: '.7rem 1rem', background: '#f5ede0', fontSize: '.62rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--mid)' },
  orderRow: { display: 'grid', gridTemplateColumns: '60px 1fr 100px 120px 100px 140px', gap: '.5rem', padding: '.7rem 1rem', alignItems: 'center', borderBottom: '1px solid rgba(201,168,124,.1)' }
}
