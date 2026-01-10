// Database Types
export type TransactionCategory = 'EARN' | 'OPEX' | 'VAR' | 'CAPEX' | 'TAX' | 'FIN'

export type AccountType =
  | 'BCA'
  | 'Jago'
  | 'Cash'
  | 'Airbnb'
  | 'Booking.com'
  | 'Agoda'
  | 'Traveloka'
  | 'Tiket.com'
  | 'Dirjen Pajak'

export type UserRole = 'superadmin' | 'viewer'

export interface Transaction {
  id: string
  date: string
  category: TransactionCategory
  description: string
  income: number
  expense: number
  account: AccountType
  notes?: string
  user_id?: string
  created_at?: string
  updated_at?: string
}

export interface Asset {
  id: string
  item_name: string
  asset_type: string
  purchase_date: string
  purchase_price: number
  quantity: number
  status: string
  user_id?: string
  created_at?: string
}

export interface Booking {
  id: string
  guest_name: string
  nights: number
  check_in: string
  check_out: string
  user_id?: string
  created_at?: string
}

export interface User {
  id: string
  email: string
  name?: string
  role: UserRole
  avatar_url?: string
  created_at?: string
  updated_at?: string
}

// UI Types
export interface DashboardStats {
  revenue: number
  opex: number
  variableCost: number
  taxes: number
  netProfit: number
  grossMargin: number
  cashBalance: number
  roiYTD: number
  paybackPeriod: number
}

export interface ChartData {
  labels: string[]
  datasets: Array<{
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string
    borderWidth?: number
  }>
}

export interface CategoryColor {
  bg: string
  text: string
  border: string
}

export const categoryColors: Record<TransactionCategory, CategoryColor> = {
  EARN: { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-500' },
  OPEX: { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-500' },
  VAR: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-500' },
  CAPEX: { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-500' },
  TAX: { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-500' },
  FIN: { bg: 'bg-indigo-100', text: 'text-indigo-700', border: 'border-indigo-500' },
}
