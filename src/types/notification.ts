export type NotificationType = 'price' | 'stock' | 'order' | 'promotion' | 'system'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  createdAt: Date
  data?: Record<string, any>
}

export interface NotificationPreferences {
  userId: string
  email: boolean
  push: boolean
  priceAlerts: boolean
  stockAlerts: boolean
  orderUpdates: boolean
  promotions: boolean
}

export interface PriceAlert {
  id: string
  userId: string
  productId: string
  targetPrice: number
  createdAt: Date
  active: boolean
}

export interface StockAlert {
  id: string
  userId: string
  productId: string
  createdAt: Date
  active: boolean
} 