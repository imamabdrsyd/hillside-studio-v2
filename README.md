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

### Option 1: Static HTML (Simple)
Buka file `index.html` di browser.

### Option 2: Local Server
```bash
# Python
python -m http.server 8000

# Node.js
npx serve
```

### Option 3: Deploy to Vercel
```bash
npm install -g vercel
vercel
```

## 📁 Project Structure

```
hillside-studio-v2/
├── index.html          # Main application (standalone)
├── README.md           # Documentation
├── LICENSE             # MIT License
├── package.json        # Node.js config (optional)
├── vercel.json         # Vercel deployment config
├── public/
│   └── favicon.ico     # App icon
├── sql/
│   ├── schema.sql      # Database schema
│   └── seed.sql        # Sample data
└── docs/
    └── SETUP.md        # Deployment guide
```

## 🛠️ Tech Stack

- **Frontend**: HTML5, Tailwind CSS, Vanilla JavaScript
- **Charts**: Chart.js
- **PDF Export**: jsPDF + jsPDF-AutoTable
- **Font**: Plus Jakarta Sans (Google Fonts)

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

## 🔐 Future: Authentication (Supabase)

```javascript
// Planned roles
- superadmin: Full access (CRUD)
- viewer: Read-only access
```

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
