-- ==========================================================================
-- THE GRAND TABLE - SUPABASE POSTGRESQL DATABASE SCHEMA
-- ==========================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'staff', 'admin')),
  profile_image TEXT,
  address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. FOOD ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.food_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  ingredients TEXT,
  price NUMERIC(10, 2) NOT NULL,
  image_url TEXT,
  rating NUMERIC(3, 2) DEFAULT 5.0,
  is_vegetarian BOOLEAN DEFAULT false,
  availability BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. RESTAURANT TABLES TABLE
CREATE TABLE IF NOT EXISTS public.restaurant_tables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_number TEXT UNIQUE NOT NULL,
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'occupied')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. RESERVATIONS TABLE
CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  table_id UUID REFERENCES public.restaurant_tables(id) ON DELETE SET NULL,
  reservation_date DATE NOT NULL,
  reservation_time TIME NOT NULL,
  guest_count INTEGER NOT NULL CHECK (guest_count > 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  reservation_id UUID REFERENCES public.reservations(id) ON DELETE SET NULL,
  order_type TEXT NOT NULL CHECK (order_type IN ('delivery', 'takeaway', 'dine_in')),
  total_amount NUMERIC(10, 2) NOT NULL,
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  order_status TEXT NOT NULL DEFAULT 'new' CHECK (order_status IN ('new', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  food_id UUID NOT NULL REFERENCES public.food_items(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  price NUMERIC(10, 2) NOT NULL
);

-- 9. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'upi', 'card')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  transaction_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  food_id UUID REFERENCES public.food_items(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  status TEXT NOT NULL DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'hidden')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. FAVORITES TABLE
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  food_id UUID NOT NULL REFERENCES public.food_items(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (customer_id, food_id)
);

-- 12. STAFF DETAILS TABLE
CREATE TABLE IF NOT EXISTS public.staff_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  designation TEXT NOT NULL CHECK (designation IN ('Kitchen Staff', 'Waiter', 'Manager')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ==========================================================================
-- 13. REALTIME REPLICATION CONFIGURATION
-- ==========================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.restaurant_tables;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reservations;

-- ==========================================================================
-- 14. AUTHENTICATION TRIGGER (Sync auth.users -> public.users)
-- ==========================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (auth_id, email, full_name, role, phone, profile_image, address)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'customer'),
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'profile_image', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80'),
    COALESCE(NEW.raw_user_meta_data->>'address', '')
  )
  ON CONFLICT (email) DO UPDATE
  SET auth_id = EXCLUDED.auth_id,
      full_name = EXCLUDED.full_name,
      role = EXCLUDED.role;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==========================================================================
-- 15. ROW LEVEL SECURITY (RLS) POLICIES
-- ==========================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.restaurant_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_details ENABLE ROW LEVEL SECURITY;

-- Helper function: Is Admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE auth_id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Helper function: Is Staff or Admin
CREATE OR REPLACE FUNCTION public.is_staff_or_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE auth_id = auth.uid() AND role IN ('staff', 'admin')
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Users RLS
CREATE POLICY "Public read user profiles" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON public.users FOR UPDATE USING (auth_id = auth.uid() OR public.is_admin());
CREATE POLICY "Admins full control users" ON public.users FOR ALL USING (public.is_admin());

-- Categories RLS
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin manage categories" ON public.categories FOR ALL USING (public.is_admin());

-- Food Items RLS
CREATE POLICY "Public read food items" ON public.food_items FOR SELECT USING (true);
CREATE POLICY "Admin manage food items" ON public.food_items FOR ALL USING (public.is_admin());

-- Tables RLS
CREATE POLICY "Public read tables" ON public.restaurant_tables FOR SELECT USING (true);
CREATE POLICY "Staff & Admin update tables" ON public.restaurant_tables FOR UPDATE USING (public.is_staff_or_admin());
CREATE POLICY "Admin manage tables" ON public.restaurant_tables FOR ALL USING (public.is_admin());

-- Reservations RLS
CREATE POLICY "Users read own reservations" ON public.reservations FOR SELECT
  USING (customer_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()) OR public.is_staff_or_admin());
CREATE POLICY "Users create reservations" ON public.reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff and Admin manage reservations" ON public.reservations FOR ALL USING (public.is_staff_or_admin());

-- Orders RLS
CREATE POLICY "Users read own orders" ON public.orders FOR SELECT
  USING (customer_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()) OR public.is_staff_or_admin());
CREATE POLICY "Users create orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Staff update order status" ON public.orders FOR UPDATE USING (public.is_staff_or_admin());
CREATE POLICY "Admin manage orders" ON public.orders FOR ALL USING (public.is_admin());

-- Order Items RLS
CREATE POLICY "Read order items" ON public.order_items FOR SELECT USING (true);
CREATE POLICY "Insert order items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin manage order items" ON public.order_items FOR ALL USING (public.is_admin());

-- Payments RLS
CREATE POLICY "Read own payments" ON public.payments FOR SELECT
  USING (public.is_staff_or_admin() OR order_id IN (
    SELECT id FROM public.orders WHERE customer_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid())
  ));
CREATE POLICY "Insert payments" ON public.payments FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin manage payments" ON public.payments FOR ALL USING (public.is_admin());

-- Reviews RLS
CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Create reviews" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin moderate reviews" ON public.reviews FOR ALL USING (public.is_admin());

-- Favorites RLS
CREATE POLICY "Users manage own favorites" ON public.favorites FOR ALL
  USING (customer_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()))
  WITH CHECK (customer_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

-- Staff Details RLS
CREATE POLICY "Public read staff details" ON public.staff_details FOR SELECT USING (true);
CREATE POLICY "Admin manage staff details" ON public.staff_details FOR ALL USING (public.is_admin());

-- ==========================================================================
-- 16. STORAGE BUCKETS CONFIGURATION
-- ==========================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('food-images', 'food-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public)
VALUES ('restaurant-images', 'restaurant-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public Storage Access Policies
CREATE POLICY "Public Access to Food Images" ON storage.objects FOR SELECT USING (bucket_id = 'food-images');
CREATE POLICY "Admin Upload Food Images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'food-images');
CREATE POLICY "Admin Delete Food Images" ON storage.objects FOR DELETE USING (bucket_id = 'food-images');

CREATE POLICY "Public Access to Profile Images" ON storage.objects FOR SELECT USING (bucket_id = 'profile-images');
CREATE POLICY "User Upload Profile Images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'profile-images');

CREATE POLICY "Public Access to Restaurant Images" ON storage.objects FOR SELECT USING (bucket_id = 'restaurant-images');
CREATE POLICY "Admin Upload Restaurant Images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'restaurant-images');
