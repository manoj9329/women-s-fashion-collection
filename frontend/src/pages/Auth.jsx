import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useApp } from '../context/AppContext'
import { toast } from 'react-toastify'

function AuthForm({ mode }) {
  const { login } = useApp()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' })
  const [loading, setLoading] = useState(false)

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
      const endpoint = mode === 'login' ? '/auth/login' : '/auth/register'
      const { data } = await api.post(endpoint, form)
      login({ name: data.name, email: data.email, role: data.role }, data.token)
      toast.success(mode === 'login' ? 'Welcome back!' : 'Account created!')
      navigate(data.role === 'ADMIN' ? '/admin' : '/')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Something went wrong')
    } finally { setLoading(false) }
  }

  return (
    <div style={styles.wrap}>
      <div style={styles.box}>
        <h2 style={styles.title}>{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
        <p style={styles.sub}>{mode === 'login' ? 'Sign in to your account' : 'Join Women\'s Fashion Collection'}</p>
        <form onSubmit={submit}>
          {mode === 'register' && <>
            <Field label="Full Name" name="name" value={form.name} onChange={handle} placeholder="Priya Sharma"/>
            <Field label="Phone" name="phone" value={form.phone} onChange={handle} placeholder="+91 98765 43210"/>
          </>}
          <Field label="Email" name="email" type="email" value={form.email} onChange={handle} placeholder="priya@email.com"/>
          <Field label="Password" name="password" type="password" value={form.password} onChange={handle} placeholder="••••••••"/>
          <button className="btn-primary" style={{ width: '100%', padding: '13px', marginTop: '.5rem' }} disabled={loading}>
            {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        <p style={styles.switch}>
          {mode === 'login' ? <>Don't have an account? <Link to="/register" style={{ color: 'var(--rose)' }}>Register</Link></> : <>Already have an account? <Link to="/login" style={{ color: 'var(--rose)' }}>Login</Link></>}
        </p>
      </div>
    </div>
  )
}

function Field({ label, name, type = 'text', value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ fontSize: '.65rem', letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--mid)', display: 'block', marginBottom: 5 }}>{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} placeholder={placeholder} required
             style={{ width: '100%', border: '1px solid rgba(107,92,68,.25)', padding: '10px 12px', fontSize: '.88rem', outline: 'none', fontFamily: 'var(--fn)' }}/>
    </div>
  )
}

const styles = {
  wrap: { minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' },
  box: { background: '#fff', border: '1px solid rgba(201,168,124,.2)', padding: '2.5rem', width: '100%', maxWidth: 420 },
  title: { fontFamily: 'var(--fs)', fontSize: '2rem', fontWeight: 300, marginBottom: '.4rem' },
  sub: { fontSize: '.82rem', color: 'var(--mid)', marginBottom: '2rem' },
  switch: { fontSize: '.8rem', color: 'var(--mid)', textAlign: 'center', marginTop: '1.5rem' }
}

export function Login() { return <AuthForm mode="login"/> }
export function Register() { return <AuthForm mode="register"/> }
