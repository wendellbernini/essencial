<<<<<<< Updated upstream
import webpush from 'web-push'
import { prisma } from '@/lib/prisma'

const vapidKeys = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  privateKey: process.env.VAPID_PRIVATE_KEY!,
}

webpush.setVapidDetails(
  'mailto:' + process.env.VAPID_CONTACT_EMAIL!,
  vapidKeys.publicKey,
  vapidKeys.privateKey
)

interface PushSubscription {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

interface PushNotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  image?: string
  data?: any
  actions?: Array<{
    action: string
    title: string
  }>
}

export async function sendPushNotification(
  userId: string,
  payload: PushNotificationPayload
) {
  try {
    const subscriptions = await prisma.pushSubscription.findMany({
      where: {
        userId,
        active: true,
      },
    })

    const notifications = subscriptions.map((subscription) =>
      webpush
        .sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
          },
          JSON.stringify(payload)
        )
        .catch((error) => {
          if (error.statusCode === 410) {
            // Subscription has expired or is no longer valid
            return prisma.pushSubscription.update({
              where: { id: subscription.id },
              data: { active: false },
            })
          }
          throw error
        })
    )

    await Promise.all(notifications)
  } catch (error) {
    console.error('[Push Notification Error]', error)
    throw new Error('Erro ao enviar notificação push')
  }
}

export async function savePushSubscription(
  userId: string,
  subscription: PushSubscription
) {
  try {
    await prisma.pushSubscription.create({
      data: {
        userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        active: true,
      },
    })
  } catch (error) {
    console.error('[Save Push Subscription Error]', error)
    throw new Error('Erro ao salvar inscrição push')
  }
}

export async function removePushSubscription(endpoint: string) {
  try {
    await prisma.pushSubscription.updateMany({
      where: { endpoint },
      data: { active: false },
    })
  } catch (error) {
    console.error('[Remove Push Subscription Error]', error)
    throw new Error('Erro ao remover inscrição push')
  }
=======
import webpush from 'web-push'
import { prisma } from '@/lib/prisma'

const vapidKeys = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  privateKey: process.env.VAPID_PRIVATE_KEY!,
}

webpush.setVapidDetails(
  'mailto:' + process.env.VAPID_CONTACT_EMAIL!,
  vapidKeys.publicKey,
  vapidKeys.privateKey
)

interface PushSubscription {
  endpoint: string
  keys: {
    p256dh: string
    auth: string
  }
}

interface PushNotificationPayload {
  title: string
  body: string
  icon?: string
  badge?: string
  image?: string
  data?: any
  actions?: Array<{
    action: string
    title: string
  }>
}

export async function sendPushNotification(
  userId: string,
  payload: PushNotificationPayload
) {
  try {
    const subscriptions = await prisma.pushSubscription.findMany({
      where: {
        userId,
        active: true,
      },
    })

    const notifications = subscriptions.map((subscription) =>
      webpush
        .sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              p256dh: subscription.p256dh,
              auth: subscription.auth,
            },
          },
          JSON.stringify(payload)
        )
        .catch((error) => {
          if (error.statusCode === 410) {
            // Subscription has expired or is no longer valid
            return prisma.pushSubscription.update({
              where: { id: subscription.id },
              data: { active: false },
            })
          }
          throw error
        })
    )

    await Promise.all(notifications)
  } catch (error) {
    console.error('[Push Notification Error]', error)
    throw new Error('Erro ao enviar notificação push')
  }
}

export async function savePushSubscription(
  userId: string,
  subscription: PushSubscription
) {
  try {
    await prisma.pushSubscription.create({
      data: {
        userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        active: true,
      },
    })
  } catch (error) {
    console.error('[Save Push Subscription Error]', error)
    throw new Error('Erro ao salvar inscrição push')
  }
}

export async function removePushSubscription(endpoint: string) {
  try {
    await prisma.pushSubscription.updateMany({
      where: { endpoint },
      data: { active: false },
    })
  } catch (error) {
    console.error('[Remove Push Subscription Error]', error)
    throw new Error('Erro ao remover inscrição push')
  }
>>>>>>> Stashed changes
} 