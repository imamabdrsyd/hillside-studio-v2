-- ============================================
-- HILLSIDE STUDIO FINANCE APP v2
-- Database Schema for Supabase (PostgreSQL)
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUM TYPES
-- ============================================

-- Kategori transaksi
CREATE TYPE transaction_category AS ENUM (
    'EARN',   -- Pendapatan sewa (hijau)
    'OPEX',   -- Pengeluaran operasional (merah)
    'VAR',    -- Variable cost (ungu)
    'CAPEX',  -- Pembelian aset (abu)
    'TAX',    -- Pajak: PBB, PPN, VAT (biru)
    'FIN'     -- Pembayaran dividen/financing (lilac)
);

-- Tipe akun pembayaran
CREATE TYPE account_type AS ENUM (
    'BCA',
    'Jago',
    'Cash',
    'Airbnb',
    'Booking.com',
    'Dirjen Pajak',
    'Standard Chartered',
    'SPay',
    'Other'
);

-- Role pengguna
CREATE TYPE user_role AS ENUM (
    'superadmin',  -- Full access (CRUD)
    'viewer'       -- Read-only
);

-- ============================================
-- TABLES
-- ============================================

-- Tabel Users (untuk autentikasi)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    role user_role DEFAULT 'viewer',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel Transactions (transaksi keuangan)
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE,
    date DATE NOT NULL,
    category transaction_category NOT NULL,
    description TEXT NOT NULL,
    income DECIMAL(15,2) DEFAULT 0 CHECK (income >= 0),
    expense DECIMAL(15,2) DEFAULT 0 CHECK (expense >= 0),
    account account_type DEFAULT 'Cash',
    notes TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraint: harus ada income ATAU expense, tidak keduanya
    CONSTRAINT check_income_or_expense CHECK (
        (income > 0 AND expense = 0) OR 
        (income = 0 AND expense > 0) OR
        (income = 0 AND expense = 0)
    )
);

-- Tabel Assets (aset tetap)
CREATE TABLE assets (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE,
    item_name VARCHAR(255) NOT NULL,
    asset_type VARCHAR(50) NOT NULL, -- Property, Equipment, Furniture, Linen
    purchase_price DECIMAL(15,2) DEFAULT 0,
    quantity INTEGER DEFAULT 1,
    purchase_date DATE,
    status VARCHAR(50) DEFAULT 'active', -- active, disposed, maintenance
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel Bookings (untuk tracking tamu)
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE,
    guest_name VARCHAR(255) NOT NULL,
    nights INTEGER NOT NULL CHECK (nights >= 0),
    check_in_date DATE NOT NULL,
    payout DECIMAL(15,2) DEFAULT 0,
    platform VARCHAR(50), -- Airbnb, Booking.com, Direct Whatsapp
    identity_card TEXT, -- path to KTP image
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabel Settings (konfigurasi aplikasi)
CREATE TABLE settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_category ON transactions(category);
CREATE INDEX idx_transactions_date_category ON transactions(date, category);
CREATE INDEX idx_bookings_check_in ON bookings(check_in_date);
CREATE INDEX idx_assets_type ON assets(asset_type);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function untuk update timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function untuk menghitung summary bulanan
CREATE OR REPLACE FUNCTION get_monthly_summary(year_param INTEGER, month_param INTEGER)
RETURNS TABLE (
    total_income DECIMAL,
    total_expense DECIMAL,
    earn DECIMAL,
    opex DECIMAL,
    var DECIMAL,
    capex DECIMAL,
    tax DECIMAL,
    fin DECIMAL,
    net_profit DECIMAL,
    gross_profit DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(t.income), 0) as total_income,
        COALESCE(SUM(t.expense), 0) as total_expense,
        COALESCE(SUM(CASE WHEN t.category = 'EARN' THEN t.income ELSE 0 END), 0) as earn,
        COALESCE(SUM(CASE WHEN t.category = 'OPEX' THEN t.expense ELSE 0 END), 0) as opex,
        COALESCE(SUM(CASE WHEN t.category = 'VAR' THEN t.expense ELSE 0 END), 0) as var,
        COALESCE(SUM(CASE WHEN t.category = 'CAPEX' THEN t.expense ELSE 0 END), 0) as capex,
        COALESCE(SUM(CASE WHEN t.category = 'TAX' THEN t.expense ELSE 0 END), 0) as tax,
        COALESCE(SUM(CASE WHEN t.category = 'FIN' THEN t.expense ELSE 0 END), 0) as fin,
        COALESCE(SUM(CASE WHEN t.category = 'EARN' THEN t.income ELSE 0 END), 0) -
        COALESCE(SUM(CASE WHEN t.category IN ('OPEX', 'VAR', 'TAX') THEN t.expense ELSE 0 END), 0) as net_profit,
        COALESCE(SUM(CASE WHEN t.category = 'EARN' THEN t.income ELSE 0 END), 0) -
        COALESCE(SUM(CASE WHEN t.category = 'VAR' THEN t.expense ELSE 0 END), 0) as gross_profit
    FROM transactions t
    WHERE EXTRACT(YEAR FROM t.date) = year_param
      AND EXTRACT(MONTH FROM t.date) = month_param;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

CREATE TRIGGER update_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_assets_updated_at
    BEFORE UPDATE ON assets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policies untuk transactions
CREATE POLICY "Users can view all transactions"
    ON transactions FOR SELECT
    USING (true);

CREATE POLICY "Superadmins can insert transactions"
    ON transactions FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'superadmin'
        )
    );

CREATE POLICY "Superadmins can update transactions"
    ON transactions FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'superadmin'
        )
    );

CREATE POLICY "Superadmins can delete transactions"
    ON transactions FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM users 
            WHERE users.id = auth.uid() 
            AND users.role = 'superadmin'
        )
    );

-- ============================================
-- DEFAULT SETTINGS
-- ============================================

INSERT INTO settings (key, value, description) VALUES
    ('initial_capital', '350000000', 'Modal awal investasi properti'),
    ('property_name', 'Hillside Studio', 'Nama properti'),
    ('property_address', 'Galeri Ciumbuleuit Apartment 2, Bandung', 'Alamat properti'),
    ('currency', 'IDR', 'Mata uang'),
    ('fiscal_year_start', '01', 'Bulan awal tahun fiskal');

-- ============================================
-- VIEWS
-- ============================================

-- View untuk summary tahunan
CREATE VIEW yearly_summary AS
SELECT 
    EXTRACT(YEAR FROM date) as year,
    EXTRACT(MONTH FROM date) as month,
    SUM(income) as total_income,
    SUM(expense) as total_expense,
    SUM(CASE WHEN category = 'EARN' THEN income ELSE 0 END) as earn,
    SUM(CASE WHEN category = 'OPEX' THEN expense ELSE 0 END) as opex,
    SUM(CASE WHEN category = 'VAR' THEN expense ELSE 0 END) as var,
    SUM(CASE WHEN category = 'CAPEX' THEN expense ELSE 0 END) as capex,
    SUM(CASE WHEN category = 'TAX' THEN expense ELSE 0 END) as tax,
    SUM(CASE WHEN category = 'FIN' THEN expense ELSE 0 END) as fin
FROM transactions
GROUP BY EXTRACT(YEAR FROM date), EXTRACT(MONTH FROM date)
ORDER BY year, month;
