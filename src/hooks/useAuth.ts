import { useSession, signIn, signOut } from 'next-auth/react'

export function useAuth() {
  const { data: session, status } = useSession()

  const isAuthenticated = status === 'authenticated'
  const isLoading = status === 'loading'
  const user = session?.user

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      return result
    } catch (error) {
      throw error
    }
  }

  const loginWithGoogle = async () => {
    try {
      await signIn('google', { callbackUrl: '/' })
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      throw error
    }
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    loginWithGoogle,
    logout,
  }
} 