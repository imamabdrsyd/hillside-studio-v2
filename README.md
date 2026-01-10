# Hillside Studio Finance App v2

Aplikasi manajemen keuangan untuk bisnis rental apartemen Airbnb dengan fitur akuntansi lengkap dan financial forecasting.

![Hillside Studio](https://img.shields.io/badge/version-2.0-green) ![License](https://img.shields.io/badge/license-MIT-blue)

## 🏔️ Overview

Aplikasi interactive untuk sistem input keuangan Hillside Studio yang sekali input bisa mengupdate seluruh buku akuntansi sesuai dengan standar akuntansi internasional untuk skala usaha kecil, serta mengupdate perhitungan financial forecasting seperti detail ROI dan payback period.

## ✨ Features

### 📊 Dashboard
- Summary Cards: Revenue, OPEX, VAR, TAX, Net Profit
- Revenue vs Expense Chart (Bar chart bulanan)
- Expenses Breakdown (Doughnut chart)
- ROI Cards: Gross Margin, Cash Balance, ROI, Payback Period
- Recent Transactions dengan filter bulan

### 📋 Transaction Management
| Kategori | Warna | Deskripsi |
|----------|-------|-----------|
| 🟢 EARN | Hijau | Pendapatan sewa |
| 🔴 OPEX | Merah | Pengeluaran operasional |
| 🟣 VAR | Ungu | Variable cost |
| ⚪ CAPEX | Abu | Pembelian aset/modal |
| 🔵 TAX | Biru | Pajak (PBB, PPN, VAT) |
| 🩷 FIN | Lilac | Pembayaran dividen/financing |

- Add, Edit, Delete transaksi
- Filter by category
- Search transactions
- Bulk delete

### 📈 Accounting Reports
- **Income Statement** - Laporan Laba Rugi
- **Balance Sheet** - Neraca Keuangan
- **Cash Flow Statement** - Laporan Arus Kas

### 🔮 ROI & Financial Forecast
- Investment Summary
- Return Analysis (ROI, Margin, Payback Period)
- Monthly/Annual Projections
- Performance Trend Chart

### 📄 Export PDF
- Export semua transaksi
- Export laporan bulanan (Income Statement + Cash Flow + Transactions)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Supabase account (free tier available)
- Git installed

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd hillside-studio-v2
npm install
```

### 2. Setup Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Run the SQL schema from `sql/schema.sql` in Supabase SQL Editor
3. (Optional) Run `sql/seed.sql` for sample data
4. Copy your Supabase URL and Anon Key

### 3. Configure Environment
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Deploy to Vercel
```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo to Vercel dashboard and add environment variables.

## 📁 Project Structure

```
hillside-studio-v2/
├── src/
│   ├── app/
│   │   ├── layout.tsx       # Root layout
│   │   ├── page.tsx         # Main page
│   │   └── globals.css      # Global styles
│   ├── components/
│   │   ├── Sidebar.tsx      # Navigation sidebar
│   │   ├── Header.tsx       # App header
│   │   ├── Dashboard.tsx    # Dashboard view
│   │   └── Transactions.tsx # Transaction management
│   ├── lib/
│   │   ├── supabase.ts      # Supabase client
│   │   ├── utils.ts         # Utility functions
│   │   └── constants.ts     # App constants
│   └── types/
│       └── index.ts         # TypeScript types
├── sql/
│   ├── schema.sql           # Database schema
│   └── seed.sql             # Sample data
├── package.json             # Dependencies
├── tsconfig.json            # TypeScript config
├── tailwind.config.ts       # Tailwind config
├── next.config.js           # Next.js config
└── vercel.json              # Vercel deployment config
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Charts**: Chart.js + react-chartjs-2
- **PDF Export**: jsPDF + jsPDF-AutoTable
- **Font**: Plus Jakarta Sans (Google Fonts)
- **Deployment**: Vercel

## 📊 Database Schema (for Supabase)

```sql
-- Categories
CREATE TYPE transaction_category AS ENUM ('EARN', 'OPEX', 'VAR', 'CAPEX', 'TAX', 'FIN');

-- Transactions Table
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    category transaction_category NOT NULL,
    description TEXT NOT NULL,
    income DECIMAL(15,2) DEFAULT 0,
    expense DECIMAL(15,2) DEFAULT 0,
    account VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔐 Database & Authentication

### Current Implementation
- Direct Supabase client integration
- Real-time CRUD operations
- PostgreSQL with Row Level Security (RLS)

### Planned: Authentication
```javascript
// Future roles
- superadmin: Full access (CRUD)
- viewer: Read-only access
```

To enable authentication:
1. Enable Email Auth in Supabase Dashboard
2. Update RLS policies in `sql/schema.sql`
3. Add authentication UI components

## 📱 Responsive Design

Optimized for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## 👤 Author

**Imam** - Hillside Studio Owner

---

Made with ❤️ for Hillside Studio Bandung
