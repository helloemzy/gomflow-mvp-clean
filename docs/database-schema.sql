-- GOMFLOW MVP Database Schema
-- Minimal but extensible schema for K-pop group order management

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  is_gom BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  artist VARCHAR(255) NOT NULL,
  price_per_item DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  moq INTEGER NOT NULL, -- Minimum Order Quantity
  current_count INTEGER DEFAULT 0,
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  gom_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Submissions table (users joining orders)
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'verified', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(order_id, user_id) -- One submission per user per order
);

-- Payments table (payment verification)
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  proof_url TEXT, -- URL to payment proof image
  notes TEXT,
  verified_by UUID REFERENCES users(id),
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_orders_gom_id ON orders(gom_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_deadline ON orders(deadline);
CREATE INDEX idx_submissions_order_id ON submissions(order_id);
CREATE INDEX idx_submissions_user_id ON submissions(user_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_payments_submission_id ON payments(submission_id);

-- Functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON submissions
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to update order count when submissions change
CREATE OR REPLACE FUNCTION update_order_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE orders 
    SET current_count = (
      SELECT COALESCE(SUM(quantity), 0) 
      FROM submissions 
      WHERE order_id = NEW.order_id 
      AND status IN ('paid', 'verified')
    )
    WHERE id = NEW.order_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE orders 
    SET current_count = (
      SELECT COALESCE(SUM(quantity), 0) 
      FROM submissions 
      WHERE order_id = OLD.order_id 
      AND status IN ('paid', 'verified')
    )
    WHERE id = OLD.order_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';

-- Trigger to automatically update order count
CREATE TRIGGER update_order_count_trigger
  AFTER INSERT OR UPDATE OR DELETE ON submissions
  FOR EACH ROW EXECUTE PROCEDURE update_order_count();

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Users can read all users but only update themselves
CREATE POLICY "Users can view all users" ON users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);

-- Orders are publicly readable, only GOMs can create/update their own
CREATE POLICY "Orders are publicly readable" ON orders FOR SELECT USING (true);
CREATE POLICY "GOMs can create orders" ON orders FOR INSERT WITH CHECK (auth.uid() = gom_id);
CREATE POLICY "GOMs can update own orders" ON orders FOR UPDATE USING (auth.uid() = gom_id);

-- Submissions: users can create their own, GOMs can view their orders' submissions
CREATE POLICY "Users can view own submissions" ON submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "GOMs can view order submissions" ON submissions FOR SELECT USING (
  auth.uid() IN (SELECT gom_id FROM orders WHERE id = order_id)
);
CREATE POLICY "Users can create submissions" ON submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own submissions" ON submissions FOR UPDATE USING (auth.uid() = user_id);

-- Payments: users can manage their own, GOMs can verify for their orders
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (
  auth.uid() IN (SELECT user_id FROM submissions WHERE id = submission_id)
);
CREATE POLICY "GOMs can view order payments" ON payments FOR SELECT USING (
  auth.uid() IN (
    SELECT o.gom_id FROM orders o 
    JOIN submissions s ON o.id = s.order_id 
    WHERE s.id = submission_id
  )
);
CREATE POLICY "Users can create payments" ON payments FOR INSERT WITH CHECK (
  auth.uid() IN (SELECT user_id FROM submissions WHERE id = submission_id)
);
CREATE POLICY "GOMs can verify payments" ON payments FOR UPDATE USING (
  auth.uid() IN (
    SELECT o.gom_id FROM orders o 
    JOIN submissions s ON o.id = s.order_id 
    WHERE s.id = submission_id
  )
);