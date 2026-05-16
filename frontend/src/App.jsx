import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Package, Plus, ShieldCheck, Zap } from 'lucide-react'
import { supabase } from './supabaseClient'

// Components
import Navbar from './components/Navbar'
import ProductCard from './components/ProductCard'
import Toast from './components/Toast'

const API_BASE = 'http://localhost:8080/api/v1'

// ─── Product List ─────────────────────────────────────────────────────────────
const ProductList = ({ session }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(null)
  const [ordering, setOrdering] = useState(null)

  const showToast = (message, type = 'success') => setToast({ message, type })

  useEffect(() => {
    axios.get(`${API_BASE}/product`)
      .then(res => setProducts(res.data))
      .catch(() => showToast('Could not load catalog. Is the API Gateway running?', 'error'))
      .finally(() => setLoading(false))
  }, [])

  const handleOrder = async (product) => {
    if (!session) {
      showToast('Please sign in to place an order.', 'error')
      return
    }

    setOrdering(product.id)
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      await axios.post(`${API_BASE}/order`, {
        orderLineItemsDtoList: [{ skuCode: product.name, price: product.price, quantity: 1 }]
      }, {
        headers: { Authorization: `Bearer ${currentSession?.access_token}` }
      })
      showToast(`✅ Order placed for ${product.name}!`, 'success')
    } catch (err) {
      showToast('Order failed. Check service logs.', 'error')
    } finally {
      setOrdering(null)
    }
  }

  if (loading) return (
    <div className="loading-state">
      <Zap size={32} style={{ animation: 'pulse 1s infinite' }} />
      <span style={{ marginLeft: '1rem' }}>Syncing catalog...</span>
    </div>
  )

  return (
    <div className="container">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <header className="hero">
        <h1 className="animate-fade-in">Premium Catalog 2026</h1>
        <p className="animate-fade-in" style={{ animationDelay: '0.1s' }}>Curated assets from Stark Industries R&D.</p>
      </header>

      {products.length === 0 ? (
        <div className="animate-fade-in" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)', animationDelay: '0.2s' }}>
          <Package size={64} style={{ opacity: 0.3, marginBottom: '1rem' }} />
          <p>No assets found. Add your first product!</p>
        </div>
      ) : (
        <div className="grid">
          {products.map((p, i) => (
            <ProductCard 
              key={p.id} 
              product={p} 
              index={i} 
              onOrder={handleOrder} 
              ordering={ordering} 
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Login ────────────────────────────────────────────────────────────────────
const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleAuth = async (e, type) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (type === 'signup') {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setMessage(`❌ ${error.message}`)
      else setMessage('✅ Check your email to confirm your account!')
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage(`❌ ${error.message}`)
      else navigate('/')
    }
    setLoading(false)
  }

  return (
    <div className="auth-container">
      <div className="auth-card animate-fade-in">
        <ShieldCheck size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
        <h2>Secure Gateway</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Access your Stark Account</p>

        {message && (
          <div className={`auth-message ${message.includes('❌') ? 'error' : 'success'}`}>
            {message}
          </div>
        )}

        <form className="auth-form">
          <input type="email" placeholder="Email Address" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <div className="auth-actions">
            <button onClick={(e) => handleAuth(e, 'login')} disabled={loading} className="btn btn-primary">
              {loading ? 'Processing...' : 'Sign In'}
            </button>
            <button onClick={(e) => handleAuth(e, 'signup')} disabled={loading} className="btn btn-outline">
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Add Product ──────────────────────────────────────────────────────────────
const AddProduct = () => {
  const [formData, setFormData] = useState({ name: '', description: '', price: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      await axios.post(`${API_BASE}/product`, {
        ...formData,
        price: parseFloat(formData.price)
      }, {
        headers: currentSession ? { Authorization: `Bearer ${currentSession.access_token}` } : {}
      })
      navigate('/')
    } catch (err) {
      setMessage(`❌ Failed to add product: ${err.response?.data?.message || err.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card animate-fade-in">
        <Plus size={40} color="var(--primary)" style={{ marginBottom: '0.75rem' }} />
        <h2>Register New Asset</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Add a product to the Stark catalog</p>

        {message && <div className="auth-message error">{message}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <input placeholder="Asset Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
          <input placeholder="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
          <input type="number" step="0.01" placeholder="Price ($)" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
          <div className="auth-actions">
            <button type="button" onClick={() => navigate('/')} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Deploying...' : 'Deploy Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── App Root ─────────────────────────────────────────────────────────────────
function App() {
  const [session, setSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setSession(session))
    return () => subscription.unsubscribe()
  }, [])

  return (
    <Router>
      <Navbar session={session} />
      <Routes>
        <Route path="/" element={<ProductList session={session} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-product" element={<AddProduct />} />
      </Routes>
    </Router>
  )
}

export default App
