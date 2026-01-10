export const INITIAL_CAPITAL = 350000000 // Rp 350 juta

export const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
]

export const MONTH_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
  'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
]

export const CATEGORIES = [
  { value: 'EARN', label: 'Pendapatan (EARN)', color: 'green' },
  { value: 'OPEX', label: 'Beban Operasional (OPEX)', color: 'red' },
  { value: 'VAR', label: 'Beban Variabel (VAR)', color: 'purple' },
  { value: 'CAPEX', label: 'Belanja Modal (CAPEX)', color: 'gray' },
  { value: 'TAX', label: 'Pajak (TAX)', color: 'blue' },
  { value: 'FIN', label: 'Financing (FIN)', color: 'indigo' },
] as const

export const ACCOUNTS = [
  'BCA',
  'Jago',
  'Cash',
  'Airbnb',
  'Booking.com',
  'Agoda',
  'Traveloka',
  'Tiket.com',
  'Dirjen Pajak'
] as const
