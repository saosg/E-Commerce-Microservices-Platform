import React from 'react'
import { Link } from 'react-router-dom'
import { Plus, LogOut, User, Cpu } from 'lucide-react'
import { supabase } from '../supabaseClient'

const Navbar = ({ session }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <nav className="nav">
      <Link to="/" className="logo">
        <Cpu size={22} className="logo-icon" />
        <span>STARK_MARKET</span>
      </Link>
      <div className="nav-links">
        {session ? (
          <>
            <Link to="/add-product" className="btn btn-primary btn-sm">
              <Plus size={16} /> <span>New Asset</span>
            </Link>
            <div className="user-badge">
              <User size={14} />
              <span className="user-email">
                {session.user.email}
              </span>
            </div>
            <button onClick={handleLogout} className="btn-icon" title="Sign Out">
              <LogOut size={20} />
            </button>
          </>
        ) : (
          <Link to="/login" className="btn btn-primary">Sign In</Link>
        )}
      </div>
    </nav>
  )
}

export default Navbar
