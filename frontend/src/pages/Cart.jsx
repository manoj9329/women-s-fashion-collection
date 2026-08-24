import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { toast } from 'react-toastify'
import api from '../api/axios'

export default function Cart() {
  const { cart, removeFromCart, updateQty, cartTotal, clearCart, user } = useApp()
  const navigate = useNavigate()
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)

  const shipping = cartTotal >= 1999 ? 0 : 99
  const total = cartTotal + shipping

  const handleCheckout = async () => {
    if (!user) { toast.info('Please login to continue'); navigate('/login'); return }
    if (!address.trim()) { toast.error('Please enter shipping address'); return }
    if (cart.length === 0) { toast.error('Your cart is empty'); return }

    setLoading(true)
    try {
      const items = cart.map(i => ({ productId: i.product.id, quantity: i.qty, size: i.size, color: i.color }))
      const { data } = await api.post('/orders', { items, shippingAddress: address })

      // Load Razorpay script dynamically
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      document.body.appendChild(script)
      script.onload = () => {
        const rzp = new window.Razorpay({
          key: data.keyId,
          order_id: data.razorpayOrderId,
          amount: data.amount * 100,
          currency: data.currency || 'INR',
          name: "Women's Fashion Collection",
          description: 'Fashion Purchase',
          handler: async (response) => {
            try {
              await api.post('/orders/verify-payment', {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature
              })
              clearCart()
              toast.success('Payment successful! 🎉')
              navigate('/orders')
            } catch { toast.error('Payment verification failed') }
          },
          prefill: { name: user.name, email: user.email },
          theme: { color: '#c9a87c' }
        })
        rzp.open()
      }
    } catch (e) {
      toast.error(e.response?.data?.message || 'Checkout failed')
    } finally { setLoading(false) }
  }

  if (cart.length === 0) return (
    <div style={{ textAlign: 'center', padding: '6rem 2rem' }}>
      <p style={{ fontFamily: 'var(--fs)', fontSize: '2rem', marginBottom: '1.5rem' }}>Your bag is empty</p>
      <button className="btn-primary" onClick={() => navigate('/shop')}>Continue Shopping</button>
    </div>
  )

  return (
    <div style={styles.wrap}>
      <h1 style={styles.title}>Your Shopping Bag</h1>
      <div style={styles.grid}>
        {/* Items */}
        <div>
          {cart.map(item => (
            <div key={item.key} style={styles.row}>
              <div style={styles.img}>
                {item.product.imageUrl
                  ? <img src={item.product.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                  : <span style={{ fontSize: '2rem' }}>👗</span>}
              </div>
              <div style={{ flex: 1 }}>
                <p style={styles.itemName}>{item.product.name}</p>
                <p style={styles.itemMeta}>{item.product.category} · {item.size} · {item.color}</p>
                <p style={styles.itemPrice}>₹{item.product.price.toLocaleString()}</p>
                <div style={styles.qtyRow}>
                  <button style={styles.qBtn} onClick={() => updateQty(item.key, item.qty - 1)}>−</button>
                  <span style={{ padding: '0 .8rem', fontSize: '.9rem' }}>{item.qty}</span>
                  <button style={styles.qBtn} onClick={() => updateQty(item.key, item.qty + 1)}>+</button>
                  <button style={styles.rmBtn} onClick={() => removeFromCart(item.key)}>Remove</button>
                </div>
              </div>
              <div style={styles.lineTotal}>₹{(item.product.price * item.qty).toLocaleString()}</div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div style={styles.summary}>
          <h3 style={styles.summaryTitle}>Order Summary</h3>
          <div style={styles.summaryRow}><span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span></div>
          <div style={styles.summaryRow}><span>Shipping</span><span>{shipping === 0 ? 'FREE 🎉' : `₹${shipping}`}</span></div>
          {shipping > 0 && <p style={styles.freeShip}>Add ₹{(1999 - cartTotal).toLocaleString()} more for free shipping</p>}
          <div style={styles.totalRow}><span>Total</span><strong>₹{total.toLocaleString()}</strong></div>

          <div style={{ marginTop: '1.5rem' }}>
            <label style={styles.addrLabel}>Shipping Address</label>
            <textarea style={styles.addrInput} rows={3} placeholder="Full address, city, pincode..."
                      value={address} onChange={e => setAddress(e.target.value)}/>
          </div>

          <button className="btn-primary" style={{ width: '100%', padding: 14, marginTop: '.8rem', fontSize: '.75rem' }}
                  onClick={handleCheckout} disabled={loading}>
            {loading ? 'Processing...' : '🔒 Pay with Razorpay'}
          </button>
          <a href={`https://wa.me/919876543210?text=${encodeURIComponent('Hi! I want to place an order for ' + cart.map(i => i.product.name).join(', '))}`}
             target="_blank" rel="noreferrer"
             style={{ display: 'block', marginTop: '.8rem', background: '#25D366', color: '#fff', textAlign: 'center', padding: '13px', fontSize: '.72rem', letterSpacing: '.15em', textTransform: 'uppercase', textDecoration: 'none' }}>
            💬 Order via WhatsApp
          </a>
          <button style={styles.continueBtn} onClick={() => navigate('/shop')}>Continue Shopping</button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  wrap: { maxWidth: 1100, margin: '2.5rem auto', padding: '0 5% 4rem' },
  title: { fontFamily: 'var(--fs)', fontSize: '2rem', fontWeight: 300, marginBottom: '2rem' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 380px', gap: '3rem', alignItems: 'start' },
  row: { display: 'flex', gap: '1.2rem', padding: '1.2rem 0', borderBottom: '1px solid rgba(201,168,124,.15)', alignItems: 'flex-start' },
  img: { width: 80, height: 100, background: 'linear-gradient(135deg,#e8d5b7,#c9a87c)', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  itemName: { fontFamily: 'var(--fs)', fontSize: '1.1rem', marginBottom: 4 },
  itemMeta: { fontSize: '.72rem', color: 'var(--mid)', marginBottom: 4 },
  itemPrice: { fontSize: '.88rem', marginBottom: 8 },
  qtyRow: { display: 'flex', alignItems: 'center', gap: 4 },
  qBtn: { width: 28, height: 28, border: '1px solid rgba(107,92,68,.3)', background: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' },
  rmBtn: { background: 'none', border: 'none', color: 'var(--rose)', fontSize: '.7rem', letterSpacing: '.1em', textTransform: 'uppercase', marginLeft: '.5rem', cursor: 'pointer' },
  lineTotal: { fontFamily: 'var(--fs)', fontSize: '1.1rem', fontWeight: 400, minWidth: 80, textAlign: 'right' },
  summary: { background: '#fff', border: '1px solid rgba(201,168,124,.2)', padding: '1.5rem', position: 'sticky', top: 80 },
  summaryTitle: { fontFamily: 'var(--fs)', fontSize: '1.3rem', fontWeight: 400, marginBottom: '1.2rem' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '.7rem', fontSize: '.85rem', color: 'var(--mid)' },
  freeShip: { fontSize: '.72rem', color: 'var(--rose)', marginBottom: '.7rem' },
  totalRow: { display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(201,168,124,.2)', paddingTop: '.8rem', marginTop: '.4rem', alignItems: 'center' },
  addrLabel: { fontSize: '.65rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--mid)', display: 'block', marginBottom: '.5rem' },
  addrInput: { width: '100%', border: '1px solid rgba(107,92,68,.25)', padding: '10px 12px', fontSize: '.85rem', outline: 'none', resize: 'none', fontFamily: 'var(--fn)' },
  continueBtn: { width: '100%', background: 'none', border: '1px solid rgba(107,92,68,.25)', padding: '12px', fontSize: '.68rem', letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--mid)', marginTop: '.8rem', cursor: 'pointer' }
}
