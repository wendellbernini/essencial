export interface User {
  id: string
  name: string
  email: string
  image?: string
  role: 'USER' | 'ADMIN'
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  images: string[]
  stock: number
  brand: string
  categoryId: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
}

export interface CartItem {
  productId: string
  quantity: number
  price: number
  name: string
  image: string
}

export interface Order {
  id: string
  userId: string
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  total: number
  items: CartItem[]
  createdAt: string
  updatedAt: string
} 