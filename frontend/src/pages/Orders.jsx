import { useEffect, useState } from 'react'
import api from '../api/axios'

const STATUS_COLORS = {
  PENDING: '#f0a500', PAID: '#3b6d11', PROCESSING: '#2563eb',
  SHIPPED: '#7c3aed', DELIVERED: '#059669', CANCELLED: '#dc2626'
}

export default function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/orders/my').then(r => setOrders(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', fontFamily: 'var(--fs)', fontSize: '1.5rem' }}>Loading orders...</div>

  if (orders.length === 0) return (
    <div style={{ textAlign: 'center', padding: '6rem 2rem', color: 'var(--mid)' }}>
      <p style={{ fontFamily: 'var(--fs)', fontSize: '2rem' }}>No orders yet</p>
    </div>
  )

  return (
    <div style={styles.wrap}>
      <h1 style={styles.title}>My Orders</h1>
      {orders.map(order => (
        <div key={order.id} style={styles.card}>
          <div style={styles.cardHeader}>
            <div>
              <p style={styles.orderId}>Order #{order.id}</p>
              <p style={styles.orderDate}>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
            <span style={{ ...styles.statusBadge, background: STATUS_COLORS[order.status] + '20', color: STATUS_COLORS[order.status] }}>{order.status}</span>
          </div>
          <div style={styles.items}>
            {order.items?.map((item, i) => (
              <div key={i} style={styles.item}>
                <div style={styles.itemImg}>{item.imageUrl ? <img src={item.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/> : '👗'}</div>
                <div>
                  <p style={styles.itemName}>{item.productName}</p>
                  <p style={styles.itemMeta}>Size: {item.size} · Color: {item.color} · Qty: {item.quantity}</p>
                  <p style={styles.itemPrice}>₹{item.unitPrice?.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={styles.cardFooter}>
            <span style={styles.total}>Total: ₹{order.totalAmount?.toLocaleString()}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

const styles = {
  wrap: { maxWidth: 800, margin: '2.5rem auto', padding: '0 5% 4rem' },
  title: { fontFamily: 'var(--fs)', fontSize: '2rem', fontWeight: 300, marginBottom: '2rem' },
  card: { background: '#fff', border: '1px solid rgba(201,168,124,.15)', marginBottom: '1.5rem' },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.2rem', borderBottom: '1px solid rgba(201,168,124,.1)' },
  orderId: { fontFamily: 'var(--fs)', fontSize: '1.1rem', fontWeight: 400 },
  orderDate: { fontSize: '.75rem', color: 'var(--mid)', marginTop: 2 },
  statusBadge: { fontSize: '.65rem', letterSpacing: '.12em', textTransform: 'uppercase', padding: '4px 12px', borderRadius: 20, fontWeight: 500 },
  items: { padding: '1rem 1.2rem' },
  item: { display: 'flex', gap: '1rem', marginBottom: '.8rem', alignItems: 'center' },
  itemImg: { width: 56, height: 70, background: 'linear-gradient(135deg,#e8d5b7,#c9a87c)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  itemName: { fontFamily: 'var(--fs)', fontSize: '1rem' },
  itemMeta: { fontSize: '.72rem', color: 'var(--mid)', marginTop: 2 },
  itemPrice: { fontSize: '.85rem', marginTop: 4 },
  cardFooter: { borderTop: '1px solid rgba(201,168,124,.1)', padding: '.8rem 1.2rem', textAlign: 'right' },
  total: { fontFamily: 'var(--fs)', fontSize: '1.2rem', fontWeight: 400 }
}
