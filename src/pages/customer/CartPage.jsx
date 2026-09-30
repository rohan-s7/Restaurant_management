import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/helpers';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Utensils, ShieldCheck } from 'lucide-react';
import { EmptyState } from '../../components/common/EmptyState';

export const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, subtotal, tax, serviceCharge, deliveryFee, total, orderType, setOrderType, selectedTable, setSelectedTable } = useCart();
  const { addToast } = useToast();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div style={{ padding: '4rem 0 6rem', backgroundColor: 'var(--color-bg-light)', minHeight: '75vh' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <EmptyState
            icon={ShoppingBag}
            title="Your Cart is Empty"
            description="Looks like you haven't added any delicious dishes yet. Explore our artisanal menu and taste the difference."
            actionText="Browse Menu"
            actionLink="/menu"
          />
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '3rem 0 5rem', backgroundColor: 'var(--color-bg-light)', minHeight: '80vh' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <span className="section-subtitle">Order Bag</span>
            <h1 style={{ fontSize: '2.5rem', margin: 0, color: 'var(--color-text-main)' }}>Your Cart</h1>
          </div>
          <button
            onClick={() => {
              clearCart();
              addToast('Cart cleared', 'info');
            }}
            className="btn btn-secondary btn-sm"
            style={{ color: 'var(--color-danger)' }}
          >
            <Trash2 size={16} />
            Clear Cart
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'flex-start' }}>
          {/* Left: Cart Items List */}
          <div className="card" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--color-border-light)', paddingBottom: '0.75rem' }}>
              Items in Cart ({cart.length})
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem',
                    paddingBottom: '1.25rem',
                    borderBottom: '1px solid var(--color-border-light)'
                  }}
                >
                  {/* Thumbnail & Name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, minWidth: 0 }}>
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-md)', objectFit: 'cover', flexShrink: 0 }}
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80';
                      }}
                    />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className={`dietary-indicator ${item.isVeg ? 'veg' : 'non-veg'}`} />
                        <h4 style={{ fontSize: '1rem', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.name}
                        </h4>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--color-primary)', fontWeight: 700, marginTop: '2px' }}>
                        {formatCurrency(item.price)}
                      </div>
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="btn btn-secondary btn-icon"
                      style={{ width: '28px', height: '28px' }}
                    >
                      <Minus size={12} />
                    </button>
                    <span style={{ fontSize: '0.95rem', fontWeight: 800, minWidth: '20px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="btn btn-secondary btn-icon"
                      style={{ width: '28px', height: '28px' }}
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  {/* Line Total & Remove */}
                  <div style={{ textAlign: 'right', minWidth: '75px' }}>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-text-main)' }}>
                      {formatCurrency(item.price * item.quantity)}
                    </div>
                    <button
                      onClick={() => {
                        removeFromCart(item.id);
                        addToast(`Removed ${item.name}`, 'info');
                      }}
                      style={{ fontSize: '0.75rem', color: 'var(--color-danger)', marginTop: '4px', textDecoration: 'underline' }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link to="/menu" style={{ fontSize: '0.9rem', color: 'var(--color-primary)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                + Add more delicious dishes
              </Link>
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="card" style={{ padding: '1.75rem', position: 'sticky', top: '100px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Order Summary</h3>

            {/* Fulfillment Selector */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label className="form-label" style={{ fontSize: '0.825rem' }}>Fulfillment Option</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                {['Dine-in', 'Takeaway', 'Delivery'].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setOrderType(type)}
                    className={`btn btn-sm ${orderType === type ? 'btn-primary' : 'btn-secondary'}`}
                    style={{ fontSize: '0.78rem' }}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {orderType === 'Dine-in' && (
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '0.825rem' }}>Dine-in Table</label>
                <select
                  className="form-select"
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                  style={{ fontSize: '0.85rem', padding: '0.5rem' }}
                >
                  <option value="01">Table 01 (Window Bay)</option>
                  <option value="03">Table 03 (Central Hall)</option>
                  <option value="04">Table 04 (Central Hall)</option>
                  <option value="05">Table 05 (Garden Courtyard)</option>
                  <option value="08">Table 08 (Bar Lounge)</option>
                  <option value="09">Table 09 (Terrace View)</option>
                </select>
              </div>
            )}

            {/* Calculations Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem', borderTop: '1px solid var(--color-border-light)', paddingTop: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
                <span>GST (5%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
                <span>Restaurant Service Charge (5%)</span>
                <span>{formatCurrency(serviceCharge)}</span>
              </div>
              {orderType === 'Delivery' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
                  <span>Delivery Fee</span>
                  <span>{formatCurrency(deliveryFee)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-text-main)', borderTop: '1.5px solid var(--color-border)', paddingTop: '0.75rem', marginTop: '0.3rem' }}>
                <span>Total Amount</span>
                <span style={{ color: 'var(--color-primary)' }}>{formatCurrency(total)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/customer/checkout')}
              className="btn btn-primary btn-lg"
              style={{ width: '100%' }}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--color-text-subtle)', fontSize: '0.75rem', marginTop: '1rem' }}>
              <ShieldCheck size={14} color="var(--color-success)" />
              <span>Safe & Secure Simulated Order Fulfillment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
