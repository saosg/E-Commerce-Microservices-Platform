import React, { useEffect } from 'react'
import { CheckCircle, X } from 'lucide-react'

const Toast = ({ message, type, onClose }) => {
  useEffect(() => {
    const t = setTimeout(onClose, 3500)
    return () => clearTimeout(t)
  }, [onClose])

  return (
    <div className={`toast toast-${type}`}>
      {type === 'success' ? <CheckCircle size={22} /> : <X size={22} />}
      <span>{message}</span>
      <button onClick={onClose}>
        <X size={16} />
      </button>
    </div>
  )
}

export default Toast
