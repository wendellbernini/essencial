import 'next-auth'
import { User } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      image?: string
      role: 'USER' | 'ADMIN'
    }
  }

  interface User extends Omit<User, 'emailVerified' | 'createdAt' | 'updatedAt'> {
    role: 'USER' | 'ADMIN'
  }
} 