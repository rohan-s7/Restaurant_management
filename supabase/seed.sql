-- ==========================================================================
-- THE GRAND TABLE - SUPABASE MINIMAL SEED DATA (3 Records per Entity)
-- All UUIDs are 100% valid hexadecimal strings ([0-9a-f])
-- ==========================================================================

-- 1. SEED CATEGORIES (3 Records)
INSERT INTO public.categories (id, name, description) VALUES
('c0000000-0000-0000-0000-000000000001', 'Starters', 'Crunchy appetizers, kebabs, and gourmet finger bites'),
('c0000000-0000-0000-0000-000000000002', 'Main Course', 'Royal curries, handi biryanis, and chef special steaks'),
('c0000000-0000-0000-0000-000000000003', 'Desserts', 'Decadent Belgian molten cakes, rabri sweets, and artisanal pastries')
ON CONFLICT (name) DO UPDATE SET description = EXCLUDED.description;

-- 2. SEED USERS (3 Records: Admin, Staff, Customer)
INSERT INTO public.users (id, email, full_name, role, phone, profile_image, address) VALUES
('a0000000-0000-0000-0000-000000000001', 'admin@restaurant.com', 'Ananya Verma', 'admin', '+91 98765 99887', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80', 'Indiranagar, Bengaluru'),
('a0000000-0000-0000-0000-000000000002', 'staff@restaurant.com', 'Vikram Singh', 'staff', '+91 98765 11223', 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&q=80', 'Kitchen Station 1, Bengaluru'),
('a0000000-0000-0000-0000-000000000003', 'customer@restaurant.com', 'Rahul Sharma', 'customer', '+91 98765 43210', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80', '42, Park Avenue, Bengaluru')
ON CONFLICT (email) DO NOTHING;

-- 3. SEED STAFF DETAILS (1 Record)
INSERT INTO public.staff_details (id, user_id, designation, status) VALUES
('b0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000002', 'Kitchen Staff', 'active')
ON CONFLICT (id) DO NOTHING;

-- 4. SEED RESTAURANT TABLES (3 Records)
INSERT INTO public.restaurant_tables (id, table_number, capacity, status) VALUES
('d0000000-0000-0000-0000-000000000001', '01', 2, 'available'),
('d0000000-0000-0000-0000-000000000002', '02', 4, 'reserved'),
('d0000000-0000-0000-0000-000000000003', '03', 6, 'occupied')
ON CONFLICT (table_number) DO NOTHING;

-- 5. SEED FOOD ITEMS (3 Records)
INSERT INTO public.food_items (id, category_id, name, description, ingredients, price, image_url, rating, is_vegetarian, availability) VALUES
('f0000000-0000-0000-0000-000000000001', 'c0000000-0000-0000-0000-000000000001', 'Tandoori Paneer Tikka', 'Char-grilled cottage cheese marinated in aromatic yogurt spices.', 'Paneer, Spiced Yogurt, Bell Peppers, Onions, Mint Chutney', 229.00, 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&q=80', 4.8, true, true),
('f0000000-0000-0000-0000-000000000002', 'c0000000-0000-0000-0000-000000000002', 'Dum Handi Chicken Biryani', 'Slow-cooked fragrant aged Basmati rice layered with marinated chicken and saffron.', 'Aged Basmati Rice, Chicken, Saffron, Fried Onions, Mint Raita', 299.00, 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80', 4.9, false, true),
('f0000000-0000-0000-0000-000000000003', 'c0000000-0000-0000-0000-000000000003', 'Molten Belgian Chocolate Lava Cake', 'Warm chocolate cake with molten ganache center served with vanilla bean ice cream.', 'Belgian Dark Chocolate, Butter, Vanilla Bean Ice Cream', 149.00, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80', 4.9, true, true)
ON CONFLICT (id) DO NOTHING;

-- 6. SEED RESERVATIONS (3 Records)
INSERT INTO public.reservations (id, customer_id, table_id, reservation_date, reservation_time, guest_count, status) VALUES
('e1000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000002', '2026-09-30', '19:30:00', 4, 'confirmed'),
('e1000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000001', '2026-10-01', '20:00:00', 2, 'pending'),
('e1000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000003', '2026-09-28', '13:00:00', 6, 'completed')
ON CONFLICT (id) DO NOTHING;

-- 7. SEED ORDERS (3 Records)
INSERT INTO public.orders (id, customer_id, order_type, total_amount, payment_status, order_status, created_at) VALUES
('e0000000-0000-0000-0000-000000000001', 'a0000000-0000-0000-0000-000000000003', 'dine_in', 528.00, 'paid', 'new', now() - interval '10 minutes'),
('e0000000-0000-0000-0000-000000000002', 'a0000000-0000-0000-0000-000000000003', 'delivery', 299.00, 'paid', 'preparing', now() - interval '30 minutes'),
('e0000000-0000-0000-0000-000000000003', 'a0000000-0000-0000-0000-000000000003', 'takeaway', 149.00, 'paid', 'completed', now() - interval '2 hours')
ON CONFLICT (id) DO NOTHING;

-- 8. SEED ORDER ITEMS (3 Records)
INSERT INTO public.order_items (order_id, food_id, quantity, price) VALUES
('e0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000001', 1, 229.00),
('e0000000-0000-0000-0000-000000000001', 'f0000000-0000-0000-0000-000000000002', 1, 299.00),
('e0000000-0000-0000-0000-000000000002', 'f0000000-0000-0000-0000-000000000002', 1, 299.00)
ON CONFLICT (id) DO NOTHING;

-- 9. SEED PAYMENTS (3 Records)
INSERT INTO public.payments (order_id, amount, payment_method, payment_status, transaction_id) VALUES
('e0000000-0000-0000-0000-000000000001', 528.00, 'upi', 'paid', 'UPI-98471203'),
('e0000000-0000-0000-0000-000000000002', 299.00, 'card', 'paid', 'TXN-CARD-4412'),
('e0000000-0000-0000-0000-000000000003', 149.00, 'cash', 'paid', 'CASH-PAY-003')
ON CONFLICT (id) DO NOTHING;

-- 10. SEED REVIEWS (3 Records)
INSERT INTO public.reviews (customer_id, food_id, rating, comment, status) VALUES
('a0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000001', 5, 'The Tandoori Paneer Tikka was flavorful with perfect char and mint chutney.', 'approved'),
('a0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000002', 5, 'Authentic aroma and succulent chicken pieces in the Dum Handi Biryani!', 'approved'),
('a0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000003', 5, 'Belgian molten chocolate lava cake was decadent and served warm with ice cream.', 'approved')
ON CONFLICT (id) DO NOTHING;

-- 11. SEED FAVORITES (2 Records)
INSERT INTO public.favorites (customer_id, food_id) VALUES
('a0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000001'),
('a0000000-0000-0000-0000-000000000003', 'f0000000-0000-0000-0000-000000000002')
ON CONFLICT DO NOTHING;
