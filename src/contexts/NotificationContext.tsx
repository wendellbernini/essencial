'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Notification, NotificationPreferences } from '@/types/notification'

interface NotificationContextData {
  notifications: Notification[]
  unreadCount: number
  preferences: NotificationPreferences | null
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  updatePreferences: (preferences: Partial<NotificationPreferences>) => Promise<void>
  deleteNotification: (notificationId: string) => Promise<void>
  clearAll: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextData>({} as NotificationContextData)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null)

  useEffect(() => {
    // Carregar notificações do usuário
    fetchNotifications()
    // Carregar preferências do usuário
    fetchPreferences()
    // Inicializar WebSocket para notificações em tempo real
    initializeWebSocket()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications')
      const data = await response.json()
      setNotifications(data)
    } catch (error) {
      console.error('Erro ao carregar notificações:', error)
    }
  }

  const fetchPreferences = async () => {
    try {
      const response = await fetch('/api/notifications/preferences')
      const data = await response.json()
      setPreferences(data)
    } catch (error) {
      console.error('Erro ao carregar preferências:', error)
    }
  }

  const initializeWebSocket = () => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001')

    ws.onmessage = (event) => {
      const notification = JSON.parse(event.data)
      setNotifications(prev => [notification, ...prev])
    }

    ws.onerror = (error) => {
      console.error('Erro na conexão WebSocket:', error)
    }

    return () => {
      ws.close()
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
      })
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      )
    } catch (error) {
      console.error('Erro ao marcar notificação como lida:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      await fetch('/api/notifications/read-all', {
        method: 'PUT',
      })
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      )
    } catch (error) {
      console.error('Erro ao marcar todas as notificações como lidas:', error)
    }
  }

  const updatePreferences = async (newPreferences: Partial<NotificationPreferences>) => {
    try {
      const response = await fetch('/api/notifications/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPreferences),
      })
      const data = await response.json()
      setPreferences(data)
    } catch (error) {
      console.error('Erro ao atualizar preferências:', error)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
      })
      setNotifications(prev =>
        prev.filter(notification => notification.id !== notificationId)
      )
    } catch (error) {
      console.error('Erro ao excluir notificação:', error)
    }
  }

  const clearAll = async () => {
    try {
      await fetch('/api/notifications/clear-all', {
        method: 'DELETE',
      })
      setNotifications([])
    } catch (error) {
      console.error('Erro ao limpar todas as notificações:', error)
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        preferences,
        markAsRead,
        markAllAsRead,
        updatePreferences,
        deleteNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)

  if (!context) {
    throw new Error('useNotifications deve ser usado dentro de um NotificationProvider')
  }

  return context
} 