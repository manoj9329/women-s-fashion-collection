import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { toast } from 'react-toastify'

export default function Profile() {
  const { user, login } = useApp()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('personal')
  const [orders, setOrders] = useState([])
  const [loadingOrders, setLoadingOrders] = useState(false)

  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || ''
  })

  const [addresses, setAddresses] = useState(() => {
    try { return JSON.parse(localStorage.getItem('wfc_addresses')) || [] } catch { return [] }
  })
  const [newAddress, setNewAddress] = useState('')
  const [showAddAddress, setShowAddAddress] = useState(false)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoadingOrders(true)
    try {
      const { data } = await api.get('/orders/my')
      setOrders(data)
    } catch (e) {} finally { setLoadingOrders(false) }
  }

  const savePersonalDetails = () => {
    const updated = { ...user, name: form.name, phone: form.phone }
    localStorage.setItem('wfc_user', JSON.stringify(updated))
    login(updated, localStorage.getItem('wfc_token'))
    toast.success('Personal details updated! ✓')
  }

  const saveAddress = () => {
    if (!newAddress.trim()) { toast.error('Please enter an address'); return }
    const updated = [...addresses, { id: Date.now(), text: newAddress.trim(), isDefault: addresses.length === 0 }]
    setAddresses(updated)
    localStorage.setItem('wfc_addresses', JSON.stringify(updated))
    setNewAddress('')
    setShowAddAddress(false)
    toast.success('Address saved! ✓')
  }

  const deleteAddress = (id) => {
    const updated = addresses.filter(a => a.id !== id)
    setAddresses(updated)
    localStorage.setItem('wfc_addresses', JSON.stringify(updated))
    toast.info('Address removed')
  }

  const setDefaultAddress = (id) => {
    const updated = addresses.map(a => ({ ...a, isDefault: a.id === id }))
    setAddresses(updated)
    localStorage.setItem('wfc_addresses', JSON.stringify(updated))
    toast.success('Default address updated! ✓')
  }

  const currentOrders = orders.filter(o => !['DELIVERED', 'CANCELLED'].includes(o.status))
  const previousOrders = orders.filter(o => ['DELIVERED', 'CANCELLED'].includes(o.status))
  const lastOrder = orders[0]

  const STATUS_COLORS = {
    PENDING: '#f0a500', PAID: '#3b6d11', PROCESSING: '#2563eb',
    SHIPPED: '#7c3aed', DELIVERED: '#059669', CANCELLED: '#dc2626'
  }

  const printInvoice = (order) => {
    const win = window.open('', '_blank')
    win.document.write(`
      <html><head><title>Invoice #${order.id}</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; color: #1a1208; }
        h1 { font-size: 24px; margin-bottom: 4px; }
        .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #6b5c44; margin-bottom: 4px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #f5ede0; padding: 10px; text-align: left; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
        td { padding: 10px; border-bottom: 1px solid #f0e9de; font-size: 13px; }
        .total { text-align: right; font-size: 16px; font-weight: bold; margin-top: 10px; }
        .badge { background: #eaf3de; color: #3b6d11; padding: 3px 10px; border-radius: 20px; font-size: 11px; }
        .footer { margin-top: 40px; text-align: center; color: #6b5c44; font-size: 12px; }
      </style></head><body>
      <div class="header">
        <div>
          <h1>Women's Fashion Collection</h1>
          <p style="color:#c9a87c">Invoice</p>
        </div>
        <div style="text-align:right">
          <p class="label">Invoice #</p>
          <p><strong>${order.id}</strong></p>
          <p class="label" style="margin-top:8px">Date</p>
          <p>${new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>
      <div style="margin-bottom:20px">
        <p class="label">Ship To</p>
        <p>${order.shippingAddress || 'N/A'}</p>
      </div>
      <div style="margin-bottom:20px">
        <p class="label">Payment</p>
        <p>${order.razorpayOrderId?.startsWith('COD') ? 'Cash on Delivery' : 'Online Payment'}</p>
        <span class="badge">${order.status}</span>
      </div>
      <table>
        <thead><tr><th>Item</th><th>Size</th><th>Color</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
        <tbody>
          ${order.items?.map(i => `
            <tr>
              <td>${i.productName}</td>
              <td>${i.size || '-'}</td>
              <td>${i.color || '-'}</td>
              <td>${i.quantity}</td>
              <td>₹${i.unitPrice?.toLocaleString()}</td>
              <td>₹${(i.unitPrice * i.quantity)?.toLocaleString()}</td>
            </tr>
          `).join('') || '<tr><td colspan="6">No items</td></tr>'}
        </tbody>
      </table>
      <div class="total">Total: ₹${order.totalAmount?.toLocaleString()}</div>
      <div class="footer">
        <p>Thank you for shopping with Women's Fashion Collection!</p>
        <p>wfc-frontend.onrender.com</p>
      </div>
      </body></html>
    `)
    win.document.close()
    win.print()
  }

  const tabs = [
    { id: 'personal', label: '👤 Personal Details' },
    { id: 'orders', label: '📦 My Orders' },
    { id: 'addresses', label: '📍 Saved Addresses' },
    { id: 'invoice', label: '🧾 Last Invoice' }
  ]

  return (
    <div style={styles.wrap}>
      <div style={styles.header}>
        <h1 style={styles.title}>My <em style={{ fontStyle: 'italic', color: 'var(--rose)' }}>Profile</em></h1>
        <p style={styles.subtitle}>Welcome back, {user?.name?.split(' ')[0]}!</p>
      </div>

      <div style={styles.layout}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          {tabs.map(tab => (
            <button key={tab.id} style={{ ...styles.tabBtn, ...(activeTab === tab.id ? styles.tabActive : {}) }}
                    onClick={() => setActiveTab(tab.id)}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={styles.content}>

          {/* PERSONAL DETAILS */}
          {activeTab === 'personal' && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Personal Details</h3>
              <div style={styles.field}>
                <label style={styles.label}>Full Name</label>
                <input style={styles.input} value={form.name}
                       onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                       placeholder="Your name"/>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Email</label>
                <input style={{ ...styles.input, background: '#f5f5f5', color: '#999' }}
                       value={form.email} disabled/>
                <p style={{ fontSize: '.7rem', color: 'var(--mid)', marginTop: 4 }}>Email cannot be changed</p>
              </div>
              <div style={styles.field}>
                <label style={styles.label}>Phone Number</label>
                <input style={styles.input} value={form.phone}
                       onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                       placeholder="+91 98765 43210"/>
              </div>
              <button className="btn-primary" style={{ padding: '12px 28px', marginTop: '.5rem' }}
                      onClick={savePersonalDetails}>Save Changes</button>
            </div>
          )}

          {/* ORDERS */}
          {activeTab === 'orders' && (
            <div>
              {loadingOrders ? (
                <div style={{ textAlign: 'center', padding: '3rem', fontFamily: 'var(--fs)', fontSize: '1.2rem' }}>Loading orders...</div>
              ) : orders.length === 0 ? (
                <div style={styles.empty}>
                  <span style={{ fontSize: '3rem' }}>📦</span>
                  <p style={styles.emptyText}>No orders yet</p>
                </div>
              ) : (
                <div>
                  {currentOrders.length > 0 && (
                    <div style={{ marginBottom: '2rem' }}>
                      <h3 style={styles.sectionTitle}>Current Orders ({currentOrders.length})</h3>
                      {currentOrders.map(order => <OrderCard key={order.id} order={order} statusColors={STATUS_COLORS} onPrint={printInvoice}/>)}
                    </div>
                  )}
                  {previousOrders.length > 0 && (
                    <div>
                      <h3 style={styles.sectionTitle}>Previous Orders ({previousOrders.length})</h3>
                      {previousOrders.map(order => <OrderCard key={order.id} order={order} statusColors={STATUS_COLORS} onPrint={printInvoice}/>)}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ADDRESSES */}
          {activeTab === 'addresses' && (
            <div style={styles.card}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={styles.cardTitle}>Saved Addresses</h3>
                <button className="btn-rose" style={{ padding: '8px 20px', fontSize: '.68rem' }}
                        onClick={() => setShowAddAddress(!showAddAddress)}>+ Add New</button>
              </div>

              {showAddAddress && (
                <div style={{ marginBottom: '1.5rem', padding: '1.2rem', background: '#f5ede0', borderRadius: 2 }}>
                  <label style={styles.label}>New Address</label>
                  <textarea style={{ ...styles.input, resize: 'none', marginBottom: '.8rem' }} rows={3}
                            value={newAddress} onChange={e => setNewAddress(e.target.value)}
                            placeholder="House no, Street, City, State, Pincode"/>
                  <div style={{ display: 'flex', gap: '.6rem' }}>
                    <button className="btn-primary" style={{ padding: '10px 20px', fontSize: '.68rem' }} onClick={saveAddress}>Save Address</button>
                    <button style={{ background: 'none', border: '1px solid rgba(107,92,68,.3)', padding: '10px 20px', fontSize: '.68rem', cursor: 'pointer' }} onClick={() => setShowAddAddress(false)}>Cancel</button>
                  </div>
                </div>
              )}

              {addresses.length === 0 ? (
                <div style={styles.empty}>
                  <span style={{ fontSize: '2.5rem' }}>📍</span>
                  <p style={styles.emptyText}>No saved addresses</p>
                </div>
              ) : (
                addresses.map(addr => (
                  <div key={addr.id} style={{ ...styles.addrCard, borderColor: addr.isDefault ? 'var(--rose)' : 'rgba(201,168,124,.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        {addr.isDefault && <span style={styles.defaultBadge}>Default</span>}
                        <p style={{ fontSize: '.88rem', lineHeight: 1.6, marginTop: addr.isDefault ? '.4rem' : 0 }}>{addr.text}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '.4rem', flexShrink: 0, marginLeft: '1rem' }}>
                        {!addr.isDefault && (
                          <button style={styles.addrBtn} onClick={() => setDefaultAddress(addr.id)}>Set Default</button>
                        )}
                        <button style={{ ...styles.addrBtn, color: '#dc2626', borderColor: '#dc2626' }}
                                onClick={() => deleteAddress(addr.id)}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* LAST INVOICE */}
          {activeTab === 'invoice' && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>Last Purchase Invoice</h3>
              {!lastOrder ? (
                <div style={styles.empty}>
                  <span style={{ fontSize: '3rem' }}>🧾</span>
                  <p style={styles.emptyText}>No purchases yet</p>
                </div>
              ) : (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <div>
                      <p style={{ fontFamily: 'var(--fs)', fontSize: '1.2rem' }}>Order #{lastOrder.id}</p>
                      <p style={{ fontSize: '.75rem', color: 'var(--mid)', marginTop: 4 }}>
                        {new Date(lastOrder.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    <span style={{ ...styles.statusBadge, background: STATUS_COLORS[lastOrder.status] + '20', color: STATUS_COLORS[lastOrder.status] }}>
                      {lastOrder.status}
                    </span>
                  </div>

                  <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1rem' }}>
                    <thead>
                      <tr style={{ background: '#f5ede0' }}>
                        {['Item', 'Size', 'Qty', 'Price'].map(h => (
                          <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontSize: '.65rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--mid)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {lastOrder.items?.map((item, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(201,168,124,.1)' }}>
                          <td style={{ padding: '10px', fontSize: '.85rem' }}>{item.productName}</td>
                          <td style={{ padding: '10px', fontSize: '.85rem' }}>{item.size}</td>
                          <td style={{ padding: '10px', fontSize: '.85rem' }}>{item.quantity}</td>
                          <td style={{ padding: '10px', fontSize: '.85rem' }}>₹{item.unitPrice?.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid rgba(201,168,124,.2)' }}>
                    <span style={{ fontFamily: 'var(--fs)', fontSize: '1.3rem' }}>Total: ₹{lastOrder.totalAmount?.toLocaleString()}</span>
                    <button className="btn-primary" style={{ padding: '10px 24px', fontSize: '.68rem' }}
                            onClick={() => printInvoice(lastOrder)}>🖨 Print Invoice</button>
                  </div>

                  <p style={{ fontSize: '.75rem', color: 'var(--mid)', marginTop: '1rem' }}>
                    Payment: {lastOrder.razorpayOrderId?.startsWith('COD') ? 'Cash on Delivery' : 'Online Payment'} &nbsp;·&nbsp;
                    Address: {lastOrder.shippingAddress}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function OrderCard({ order, statusColors, onPrint }) {
  return (
    <div style={{ background: '#fff', border: '1px solid rgba(201,168,124,.15)', marginBottom: '1rem', padding: '1.2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <p style={{ fontFamily: 'var(--fs)', fontSize: '1.1rem' }}>Order #{order.id}</p>
          <p style={{ fontSize: '.72rem', color: 'var(--mid)', marginTop: 2 }}>
            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '.6rem', alignItems: 'center' }}>
          <span style={{ fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', padding: '4px 12px', borderRadius: 20, background: statusColors[order.status] + '20', color: statusColors[order.status], fontWeight: 500 }}>
            {order.status}
          </span>
          <button style={{ background: 'none', border: '1px solid rgba(107,92,68,.25)', padding: '4px 12px', fontSize: '.65rem', cursor: 'pointer', letterSpacing: '.1em', textTransform: 'uppercase' }}
                  onClick={() => onPrint(order)}>🖨 Invoice</button>
        </div>
      </div>
      <div style={{ fontSize: '.82rem', color: 'var(--mid)' }}>
        {order.items?.slice(0, 2).map((i, idx) => (
          <p key={idx}>• {i.productName} × {i.quantity} ({i.size})</p>
        ))}
        {order.items?.length > 2 && <p>+ {order.items.length - 2} more items</p>}
      </div>
      <div style={{ marginTop: '.8rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: 'var(--fs)', fontSize: '1.1rem' }}>₹{order.totalAmount?.toLocaleString()}</span>
        <span style={{ fontSize: '.72rem', color: 'var(--mid)' }}>{order.razorpayOrderId?.startsWith('COD') ? '💵 Cash on Delivery' : '💳 Online Payment'}</span>
      </div>
    </div>
  )
}

const styles = {
  wrap: { maxWidth: 1100, margin: '2.5rem auto', padding: '0 5% 4rem' },
  header: { marginBottom: '2.5rem' },
  title: { fontFamily: 'var(--fs)', fontSize: '2.2rem', fontWeight: 300 },
  subtitle: { fontSize: '.85rem', color: 'var(--mid)', marginTop: '.4rem' },
  layout: { display: 'grid', gridTemplateColumns: '220px 1fr', gap: '2rem', alignItems: 'start' },
  sidebar: { background: '#fff', border: '1px solid rgba(201,168,124,.15)', padding: '.5rem', position: 'sticky', top: 80 },
  tabBtn: { width: '100%', background: 'none', border: 'none', padding: '12px 16px', textAlign: 'left', fontSize: '.75rem', letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--mid)', cursor: 'pointer', borderRadius: 2, transition: 'all .2s', display: 'block' },
  tabActive: { background: 'var(--dark)', color: 'var(--cream)' },
  content: { minHeight: 400 },
  card: { background: '#fff', border: '1px solid rgba(201,168,124,.15)', padding: '1.8rem' },
  cardTitle: { fontFamily: 'var(--fs)', fontSize: '1.4rem', fontWeight: 400, marginBottom: '1.5rem' },
  sectionTitle: { fontFamily: 'var(--fs)', fontSize: '1.2rem', fontWeight: 400, marginBottom: '1rem', color: 'var(--mid)' },
  field: { marginBottom: '1.2rem' },
  label: { fontSize: '.65rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--mid)', display: 'block', marginBottom: 6 },
  input: { width: '100%', border: '1px solid rgba(107,92,68,.25)', padding: '10px 12px', fontSize: '.88rem', outline: 'none', fontFamily: 'var(--fn)', color: 'var(--dark)' },
  empty: { textAlign: 'center', padding: '3rem', color: 'var(--mid)' },
  emptyText: { fontFamily: 'var(--fs)', fontSize: '1.2rem', marginTop: '.8rem' },
  addrCard: { border: '1px solid', padding: '1rem 1.2rem', marginBottom: '1rem', borderRadius: 2 },
  defaultBadge: { background: 'var(--rose)', color: 'var(--dark)', fontSize: '.6rem', letterSpacing: '.1em', textTransform: 'uppercase', padding: '2px 8px', borderRadius: 20 },
  addrBtn: { background: 'none', border: '1px solid rgba(107,92,68,.3)', padding: '5px 12px', fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', cursor: 'pointer', color: 'var(--mid)', whiteSpace: 'nowrap' },
  statusBadge: { fontSize: '.65rem', letterSpacing: '.1em', textTransform: 'uppercase', padding: '4px 12px', borderRadius: 20, fontWeight: 500 }
}