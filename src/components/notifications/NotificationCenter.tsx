<<<<<<< Updated upstream
'use client'

import { useState } from 'react'
import { Bell, Settings, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useNotifications } from '@/contexts/NotificationContext'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/Sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Switch } from '@/components/ui/Switch'
import { NotificationType } from '@/types/notification'

const notificationIcons: Record<NotificationType, React.ReactNode> = {
  price: <span className="text-green-500">💰</span>,
  stock: <span className="text-blue-500">📦</span>,
  order: <span className="text-purple-500">🛍️</span>,
  promotion: <span className="text-yellow-500">🏷️</span>,
  system: <span className="text-gray-500">⚙️</span>,
}

export function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    preferences,
    markAsRead,
    markAllAsRead,
    updatePreferences,
    deleteNotification,
    clearAll,
  } = useNotifications()

  const [isOpen, setIsOpen] = useState(false)

  const handleNotificationClick = async (id: string) => {
    await markAsRead(id)
  }

  const handleClearAll = async () => {
    await clearAll()
    setIsOpen(false)
  }

  const handlePreferenceChange = async (key: keyof typeof preferences, value: boolean) => {
    if (preferences) {
      await updatePreferences({ [key]: value })
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:max-w-none">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Notificações</span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => markAllAsRead()}
                title="Marcar todas como lidas"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearAll}
                title="Limpar todas"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="notifications" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="preferences">Preferências</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="mt-4 space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                Nenhuma notificação
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`
                    relative p-4 rounded-lg border
                    ${notification.read ? 'bg-gray-50' : 'bg-white'}
                  `}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">
                      {notificationIcons[notification.type]}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{notification.title}</h4>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(notification.createdAt, {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteNotification(notification.id)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="preferences" className="mt-4 space-y-6">
            {preferences && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notificações por E-mail</h4>
                    <p className="text-sm text-gray-600">
                      Receba notificações por e-mail
                    </p>
                  </div>
                  <Switch
                    checked={preferences.email}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange('email', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notificações Push</h4>
                    <p className="text-sm text-gray-600">
                      Receba notificações no navegador
                    </p>
                  </div>
                  <Switch
                    checked={preferences.push}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange('push', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Alertas de Preço</h4>
                    <p className="text-sm text-gray-600">
                      Seja notificado quando o preço baixar
                    </p>
                  </div>
                  <Switch
                    checked={preferences.priceAlerts}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange('priceAlerts', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Alertas de Estoque</h4>
                    <p className="text-sm text-gray-600">
                      Seja notificado quando o produto voltar ao estoque
                    </p>
                  </div>
                  <Switch
                    checked={preferences.stockAlerts}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange('stockAlerts', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Atualizações de Pedidos</h4>
                    <p className="text-sm text-gray-600">
                      Receba atualizações sobre seus pedidos
                    </p>
                  </div>
                  <Switch
                    checked={preferences.orderUpdates}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange('orderUpdates', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Promoções</h4>
                    <p className="text-sm text-gray-600">
                      Receba notificações sobre promoções
                    </p>
                  </div>
                  <Switch
                    checked={preferences.promotions}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange('promotions', checked)
                    }
                  />
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
=======
'use client'

import { useState } from 'react'
import { Bell, Settings, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useNotifications } from '@/contexts/NotificationContext'
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/Sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { Switch } from '@/components/ui/Switch'
import { NotificationType } from '@/types/notification'

const notificationIcons: Record<NotificationType, React.ReactNode> = {
  price: <span className="text-green-500">💰</span>,
  stock: <span className="text-blue-500">📦</span>,
  order: <span className="text-purple-500">🛍️</span>,
  promotion: <span className="text-yellow-500">🏷️</span>,
  system: <span className="text-gray-500">⚙️</span>,
}

export function NotificationCenter() {
  const {
    notifications,
    unreadCount,
    preferences,
    markAsRead,
    markAllAsRead,
    updatePreferences,
    deleteNotification,
    clearAll,
  } = useNotifications()

  const [isOpen, setIsOpen] = useState(false)

  const handleNotificationClick = async (id: string) => {
    await markAsRead(id)
  }

  const handleClearAll = async () => {
    await clearAll()
    setIsOpen(false)
  }

  const handlePreferenceChange = async (key: keyof typeof preferences, value: boolean) => {
    if (preferences) {
      await updatePreferences({ [key]: value })
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:max-w-none">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>Notificações</span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => markAllAsRead()}
                title="Marcar todas como lidas"
              >
                <Settings className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearAll}
                title="Limpar todas"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </SheetTitle>
        </SheetHeader>

        <Tabs defaultValue="notifications" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="preferences">Preferências</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="mt-4 space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                Nenhuma notificação
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`
                    relative p-4 rounded-lg border
                    ${notification.read ? 'bg-gray-50' : 'bg-white'}
                  `}
                  onClick={() => handleNotificationClick(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">
                      {notificationIcons[notification.type]}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{notification.title}</h4>
                      <p className="text-sm text-gray-600">{notification.message}</p>
                      <span className="text-xs text-gray-400">
                        {formatDistanceToNow(notification.createdAt, {
                          addSuffix: true,
                          locale: ptBR,
                        })}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteNotification(notification.id)
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </TabsContent>

          <TabsContent value="preferences" className="mt-4 space-y-6">
            {preferences && (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notificações por E-mail</h4>
                    <p className="text-sm text-gray-600">
                      Receba notificações por e-mail
                    </p>
                  </div>
                  <Switch
                    checked={preferences.email}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange('email', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Notificações Push</h4>
                    <p className="text-sm text-gray-600">
                      Receba notificações no navegador
                    </p>
                  </div>
                  <Switch
                    checked={preferences.push}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange('push', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Alertas de Preço</h4>
                    <p className="text-sm text-gray-600">
                      Seja notificado quando o preço baixar
                    </p>
                  </div>
                  <Switch
                    checked={preferences.priceAlerts}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange('priceAlerts', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Alertas de Estoque</h4>
                    <p className="text-sm text-gray-600">
                      Seja notificado quando o produto voltar ao estoque
                    </p>
                  </div>
                  <Switch
                    checked={preferences.stockAlerts}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange('stockAlerts', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Atualizações de Pedidos</h4>
                    <p className="text-sm text-gray-600">
                      Receba atualizações sobre seus pedidos
                    </p>
                  </div>
                  <Switch
                    checked={preferences.orderUpdates}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange('orderUpdates', checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Promoções</h4>
                    <p className="text-sm text-gray-600">
                      Receba notificações sobre promoções
                    </p>
                  </div>
                  <Switch
                    checked={preferences.promotions}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange('promotions', checked)
                    }
                  />
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  )
>>>>>>> Stashed changes
} 