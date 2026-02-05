import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useNotification } from '../context/NotificationContext'
import ScrollReveal from '../components/ScrollReveal'
import './Cart.css'

function Cart() {
  const { cart, removeFromCart, updateQuantity, getTotal, clearCart } = useCart()
  const { isAuthenticated, user } = useAuth()
  const { showNotification } = useNotification()
  const navigate = useNavigate()
  const [orderNotes, setOrderNotes] = useState('')

  const handlePlaceOrder = () => {
    if (!isAuthenticated) {
      showNotification('Please login to place an order', 'warning')
      navigate('/login', { state: { from: '/cart' } })
      return
    }

    if (cart.length === 0) {
      showNotification('Your cart is empty!', 'warning')
      return
    }

    // Create order with buyer info for admin
    const order = {
      id: 'ORD-' + new Date().getFullYear() + '-' + String(Date.now()).slice(-6),
      date: new Date().toISOString().split('T')[0],
      items: cart.map(item => ({
        name: item.name,
        qty: item.quantity,
        price: item.price,
        dispatched: item.quantity,
        pending: 0
      })),
      total: getTotal(),
      notes: orderNotes,
      status: 'received',
      buyerName: user?.name || user?.buyerName || user?.shopName,
      buyerMobile: user?.mobile,
      createdAt: new Date().toISOString(),
      timeline: [{ status: 'received', date: new Date().toISOString().split('T')[0], time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) }]
    }

    // Save order
    const orders = JSON.parse(localStorage.getItem('orders') || '[]')
    orders.unshift(order)
    localStorage.setItem('orders', JSON.stringify(orders))

    // Clear cart
    clearCart()
    showNotification('Order placed successfully! Order ID: ' + order.id, 'success', 5000)
    
    setTimeout(() => {
      navigate('/orders')
    }, 1500)
  }

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <ScrollReveal variant="scale">
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <h2>Your cart is empty</h2>
              <p>Add some products to your cart to get started</p>
              <Link to="/products" className="btn-primary large">
                Browse Products
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <div className="container">
        <ScrollReveal variant="fadeUp">
          <div className="page-header">
            <h1>Shopping Cart</h1>
            <span className="pill pill-neutral">{cart.length} items</span>
          </div>
        </ScrollReveal>

        <ScrollReveal variant="fadeUp">
          <div className="cart-container">
            <ScrollReveal variant="stagger" className="cart-items-section">
              {cart.map((item) => (
                <CartItem
                  key={item.cartId}
                  item={item}
                  onRemove={() => removeFromCart(item.cartId)}
                  onUpdateQty={(qty) => updateQuantity(item.cartId, qty, item.moq)}
                />
              ))}

              <div className="order-notes-section">
              <label>Order Notes (Optional)</label>
              <textarea
                placeholder="Add special instructions for this order..."
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
              />
              </div>
            </ScrollReveal>

            <ScrollReveal variant="fadeLeft" className="cart-summary">
            <h2 className="summary-title">Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal ({cart.length} items):</span>
              <span>₹{getTotal().toLocaleString('en-IN')}</span>
            </div>
            <div className="summary-row">
              <span>Tax (if applicable):</span>
              <span>₹0</span>
            </div>
            <div className="summary-row total">
              <span>Total Amount:</span>
              <span>₹{getTotal().toLocaleString('en-IN')}</span>
            </div>
            <div className="cart-actions">
              <Link to="/products" className="btn-secondary full-width">
                Continue Shopping
              </Link>
              <button className="btn-primary full-width large" onClick={handlePlaceOrder}>
                Place Order
              </button>
            </div>
            </ScrollReveal>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}

function CartItem({ item, onRemove, onUpdateQty }) {
  const increaseQty = () => {
    onUpdateQty(item.quantity + item.moq)
  }

  const decreaseQty = () => {
    if (item.quantity > item.moq) {
      onUpdateQty(item.quantity - item.moq)
    }
  }

  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img src={item.image || 'https://via.placeholder.com/120x120'} alt={item.name} />
      </div>
      <div className="cart-item-details">
        <h3>{item.name}</h3>
        <div className="cart-item-tags">
          {item.color && <span className="tag">{item.color}</span>}
          <span className="pill pill-neutral">MOQ {item.moq}</span>
        </div>
        <div className="cart-item-footer">
          <div className="quantity-controls-small">
            <button className="qty-btn-small" onClick={decreaseQty} type="button">−</button>
            <span>{item.quantity}</span>
            <button className="qty-btn-small" onClick={increaseQty} type="button">+</button>
          </div>
          <div className="cart-item-price">
            <span className="price">₹{item.price}/pc</span>
            <span className="total">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>
      <button className="remove-btn" onClick={onRemove} type="button">×</button>
    </div>
  )
}

export default Cart
