export interface User {
  id: number
  email: string
  role: 'user' | 'admin'
  password?: string
  created_at?: Date
}

export interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  stock: number 
  created_at?: Date
}

export interface Order {
  id: number
  user_id: number
  total: number
  status: 'pendiente' | 'entregada' | 'cancelada'
  delivered_at?: Date
  created_at: Date
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price: number
}
