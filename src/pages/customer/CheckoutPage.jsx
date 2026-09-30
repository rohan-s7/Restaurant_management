import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useRestaurant } from '../../context/RestaurantContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/helpers';
import { CheckCircle2, ShieldCheck, CreditCard, QrCode, Banknote, ArrowRight, ArrowLeft, ShoppingBag } from 'lucide-react';

export const CheckoutPage = () => {
  const { cart, subtotal, tax, serviceCharge, deliveryFee, total, orderType, setOrderType, selectedTable, setSelectedTable, clearCart } = useCart();
  const { createOrder } = useRestaurant();
  const { currentUser } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState(currentUser?.name || 'Rahul Sharma');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 98765 43210');
  const [email, setEmail] = useState(currentUser?.email || 'customer@restaurant.com');
  const [address, setAddress] = useState(currentUser?.address || '42, Park Avenue, Indiranagar');
  const [city, setCity] = useState(currentUser?.city || 'Bengaluru');
  const [pincode, setPincode] = useState(currentUser?.pincode || '560038');
  const [paymentMethod, setPaymentMethod] = useState('UPI'); // 'Cash' | 'UPI' | 'Card'
  const [orderNotes, setOrderNotes] = useState('');
  const [upiId, setUpiId] = useState('rahul@okaxis');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');

  const [placedOrder, setPlacedOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  if (cart.length === 0 && !placedOrder) {
    return (
      <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
        <h2>No items to checkout</h2>
        <Link to="/menu" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Explore Our Menu
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!name || !phone || !email) {
      addToast('Please fill all contact details', 'warning');
      return;
    }

    if (orderType === 'Delivery' && (!address || !pincode)) {
      addToast('Please enter complete delivery address', 'warning');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        customerId: currentUser?.id || 'CUST-101',
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        orderType,
        tableNumber: orderType === 'Dine-in' ? selectedTable : null,
        deliveryAddress: orderType === 'Delivery' ? `${address}, ${city} - ${pincode}` : null,
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image
        })),
        subtotal,
        tax,
        serviceCharge,
        deliveryFee: orderType === 'Delivery' ? deliveryFee : 0,
        total,
        paymentMethod,
        notes: orderNotes
      };

      const newOrder = await createOrder(orderData);
      setPlacedOrder(newOrder);
      clearCart();
      addToast(`Order ${newOrder.id} placed successfully!`, 'success');
    } catch (err) {
      addToast('Failed to place order. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '3rem 0 5rem', backgroundColor: 'var(--color-bg-light)', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '1000px' }}>
        {placedOrder ? (
          /* Order Success Screen */
          <div style={{ maxWidth: '640px', margin: '0 auto' }}>
            <div className="card" style={{ padding: '3rem 2rem', textAlign: 'center' }}>
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: 'var(--color-success-bg)',
                  color: 'var(--color-success)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)'
                }}
              >
                <CheckCircle2 size={44} />
              </div>

              <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', color: 'var(--color-text-main)' }}>
                Order Placed Successfully!
              </h2>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-primary)', marginBottom: '1rem' }}>
                Order ID: #{placedOrder.id}
              </div>

              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
                Thank you for your order. Our chefs are already firing up the kitchen to prepare your gourmet meal.
              </p>

              <div style={{ background: 'var(--color-bg-subtle)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', textAlign: 'left', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Order Type:</span>
                  <span style={{ fontWeight: 700 }}>{placedOrder.orderType} {placedOrder.tableNumber && `(Table ${placedOrder.tableNumber})`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Total Amount:</span>
                  <span style={{ fontWeight: 800, color: 'var(--color-primary)' }}>{formatCurrency(placedOrder.total)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--color-text-muted)' }}>Payment Mode:</span>
                  <span style={{ fontWeight: 600 }}>{placedOrder.paymentMethod} (Simulated)</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to={`/customer/orders/${placedOrder.id}`} className="btn btn-primary btn-lg">
                  Track Order
                </Link>
                <Link to="/menu" className="btn btn-secondary btn-lg">
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Checkout Form */
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <Link to="/customer/cart" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                <ArrowLeft size={16} /> Back to Cart
              </Link>
              <h1 style={{ fontSize: '2.5rem', marginTop: '0.5rem', color: 'var(--color-text-main)' }}>Checkout</h1>
            </div>

            <form onSubmit={handlePlaceOrder}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
                {/* Left: Customer Info & Fulfillment */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {/* Customer Information */}
                  <div className="card" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>1. Customer Information</h3>

                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label className="form-label">Phone *</label>
                        <input
                          type="text"
                          className="form-control"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Email *</label>
                        <input
                          type="email"
                          className="form-control"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Order Type & Address / Table */}
                  <div className="card" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>2. Order Type</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                      {['Dine-in', 'Takeaway', 'Delivery'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setOrderType(type)}
                          className={`btn ${orderType === type ? 'btn-primary' : 'btn-secondary'}`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>

                    {orderType === 'Delivery' && (
                      <div style={{ background: 'var(--color-bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                        <div className="form-group">
                          <label className="form-label">Street Address *</label>
                          <input
                            type="text"
                            className="form-control"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Flat/House No., Building, Area"
                            required
                          />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                          <div className="form-group">
                            <label className="form-label">City</label>
                            <input
                              type="text"
                              className="form-control"
                              value={city}
                              onChange={(e) => setCity(e.target.value)}
                            />
                          </div>
                          <div className="form-group">
                            <label className="form-label">Pincode *</label>
                            <input
                              type="text"
                              className="form-control"
                              value={pincode}
                              onChange={(e) => setPincode(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {orderType === 'Dine-in' && (
                      <div className="form-group" style={{ background: 'var(--color-bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                        <label className="form-label">Select Your Dining Table</label>
                        <select
                          className="form-select"
                          value={selectedTable}
                          onChange={(e) => setSelectedTable(e.target.value)}
                        >
                          <option value="01">Table 01 (Window Bay)</option>
                          <option value="03">Table 03 (Central Dining)</option>
                          <option value="04">Table 04 (Central Dining)</option>
                          <option value="05">Table 05 (Garden Courtyard)</option>
                          <option value="08">Table 08 (Bar Lounge)</option>
                          <option value="09">Table 09 (Terrace View)</option>
                        </select>
                      </div>
                    )}

                    <div className="form-group" style={{ marginTop: '1rem' }}>
                      <label className="form-label">Chef Special Cooking Instructions</label>
                      <input
                        type="text"
                        className="form-control"
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                        placeholder="e.g. Less spicy, extra sauce, allergy info..."
                      />
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="card" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>3. Payment Method (Simulated)</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('UPI')}
                        className={`btn ${paymentMethod === 'UPI' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ display: 'flex', flexDirection: 'column', padding: '0.75rem', gap: '4px' }}
                      >
                        <QrCode size={20} />
                        <span style={{ fontSize: '0.8rem' }}>UPI / QR</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('Card')}
                        className={`btn ${paymentMethod === 'Card' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ display: 'flex', flexDirection: 'column', padding: '0.75rem', gap: '4px' }}
                      >
                        <CreditCard size={20} />
                        <span style={{ fontSize: '0.8rem' }}>Credit / Debit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setPaymentMethod('Cash')}
                        className={`btn ${paymentMethod === 'Cash' ? 'btn-primary' : 'btn-secondary'}`}
                        style={{ display: 'flex', flexDirection: 'column', padding: '0.75rem', gap: '4px' }}
                      >
                        <Banknote size={20} />
                        <span style={{ fontSize: '0.8rem' }}>Cash</span>
                      </button>
                    </div>

                    {paymentMethod === 'UPI' && (
                      <div style={{ background: 'var(--color-bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>Simulated Instant UPI Payment</div>
                        <input
                          type="text"
                          className="form-control"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          placeholder="e.g. yourname@upi"
                        />
                      </div>
                    )}

                    {paymentMethod === 'Card' && (
                      <div style={{ background: 'var(--color-bg-subtle)', padding: '1rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                        <div style={{ fontWeight: 600, marginBottom: '4px' }}>Simulated Card Payment</div>
                        <input
                          type="text"
                          className="form-control"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Order Summary Sidebar */}
                <div className="card" style={{ padding: '2rem', height: 'fit-content' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Review Items</h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '240px', overflowY: 'auto', marginBottom: '1.25rem' }}>
                    {cart.map((item) => (
                      <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                        <div>
                          <span style={{ fontWeight: 700, color: 'var(--color-primary)' }}>{item.quantity}x </span>
                          <span>{item.name}</span>
                        </div>
                        <span style={{ fontWeight: 600 }}>{formatCurrency(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ borderTop: '1px solid var(--color-border-light)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
                      <span>Subtotal</span>
                      <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
                      <span>GST (5%)</span>
                      <span>{formatCurrency(tax)}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
                      <span>Service Charge (5%)</span>
                      <span>{formatCurrency(serviceCharge)}</span>
                    </div>
                    {orderType === 'Delivery' && (
                      <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-text-muted)' }}>
                        <span>Delivery Charge</span>
                        <span>{formatCurrency(deliveryFee)}</span>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-text-main)', borderTop: '1.5px solid var(--color-border)', paddingTop: '0.75rem', marginTop: '0.2rem' }}>
                      <span>Grand Total</span>
                      <span style={{ color: 'var(--color-primary)' }}>{formatCurrency(total)}</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary btn-lg"
                    style={{ width: '100%', marginTop: '1.5rem' }}
                  >
                    {loading ? 'Processing Order...' : 'Place Order Now'}
                    <ArrowRight size={18} />
                  </button>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: 'var(--color-text-subtle)', fontSize: '0.75rem', marginTop: '1rem' }}>
                    <ShieldCheck size={14} color="var(--color-success)" />
                    <span>Frontend Project Simulated Payment</span>
                  </div>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
