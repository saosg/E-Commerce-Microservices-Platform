import React from 'react'
import { Package, ShoppingCart } from 'lucide-react'

const ProductCard = ({ product, index, onOrder, ordering }) => {
  return (
    <div className="product-card animate-fade-in" style={{ animationDelay: `${index * 0.08}s` }}>
      <div className="product-image">
        <div className="image-overlay"></div>
        <Package size={48} />
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-footer">
          <span className="price">${Number(product.price).toFixed(2)}</span>
          <button
            onClick={() => onOrder(product)}
            disabled={ordering === product.id}
            className="btn btn-primary"
          >
            <ShoppingCart size={16} />
            {ordering === product.id ? 'Processing...' : 'Buy'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
