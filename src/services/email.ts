<<<<<<< Updated upstream
import nodemailer from 'nodemailer'
import { render } from '@react-email/render'
import { NotificationType } from '@/types/notification'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

interface SendEmailOptions {
  to: string
  subject: string
  html: string
}

interface NotificationEmailProps {
  type: NotificationType
  title: string
  message: string
  actionUrl?: string
  actionText?: string
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    })
  } catch (error) {
    console.error('[Email Error]', error)
    throw new Error('Erro ao enviar e-mail')
  }
}

export function NotificationEmail({
  type,
  title,
  message,
  actionUrl,
  actionText,
}: NotificationEmailProps) {
  return (
    <div>
      <h1>{title}</h1>
      <p>{message}</p>
      {actionUrl && actionText && (
        <a href={actionUrl}>{actionText}</a>
      )}
    </div>
  )
}

export async function sendNotificationEmail(
  to: string,
  props: NotificationEmailProps
) {
  const html = render(<NotificationEmail {...props} />)
  await sendEmail({
    to,
    subject: props.title,
    html,
  })
=======
import nodemailer from 'nodemailer'
import { render } from '@react-email/render'
import { NotificationType } from '@/types/notification'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

interface SendEmailOptions {
  to: string
  subject: string
  html: string
}

interface NotificationEmailProps {
  type: NotificationType
  title: string
  message: string
  actionUrl?: string
  actionText?: string
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    })
  } catch (error) {
    console.error('[Email Error]', error)
    throw new Error('Erro ao enviar e-mail')
  }
}

export function NotificationEmail({
  type,
  title,
  message,
  actionUrl,
  actionText,
}: NotificationEmailProps) {
  return (
    <div>
      <h1>{title}</h1>
      <p>{message}</p>
      {actionUrl && actionText && (
        <a href={actionUrl}>{actionText}</a>
      )}
    </div>
  )
}

export async function sendNotificationEmail(
  to: string,
  props: NotificationEmailProps
) {
  const html = render(<NotificationEmail {...props} />)
  await sendEmail({
    to,
    subject: props.title,
    html,
  })
>>>>>>> Stashed changes
} 