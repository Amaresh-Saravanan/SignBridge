import { create } from 'zustand'

const STORAGE_KEY = 'signbridge_auth'

const getPersistedAuth = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return null
}

export const useAuthStore = create((set, get) => ({
  user: getPersistedAuth()?.user || null,
  isAuthenticated: !!getPersistedAuth()?.user,
  isLoading: false,
  isFirstLogin: false,
  isAdmin: getPersistedAuth()?.isAdmin || false,

  signIn: async ({ email, password, role }) => {
    set({ isLoading: true })
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800))

    // Demo: any email/password works. "admin@signbridge.com" gets admin role
    const isAdmin = email.toLowerCase() === 'admin@signbridge.com'
    const stored = getPersistedAuth()
    const isFirstLogin = !stored || stored.user?.email !== email

    const user = {
      id: 'demo-user-' + Date.now(),
      email,
      name: stored?.user?.name || email.split('@')[0],
      role: role || 'deaf',
      dialect: 'ISL',
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, isAdmin }))
    set({ user, isAuthenticated: true, isLoading: false, isFirstLogin, isAdmin })
    return { success: true, isFirstLogin }
  },

  signUp: async ({ name, email, password, role, dialect }) => {
    set({ isLoading: true })
    await new Promise(r => setTimeout(r, 800))

    const user = {
      id: 'demo-user-' + Date.now(),
      email,
      name,
      role: role || 'deaf',
      dialect: dialect || 'ISL',
    }

    const isAdmin = email.toLowerCase() === 'admin@signbridge.com'
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, isAdmin }))
    set({ user, isAuthenticated: true, isLoading: false, isFirstLogin: true, isAdmin })
    return { success: true }
  },

  signOut: () => {
    localStorage.removeItem(STORAGE_KEY)
    set({ user: null, isAuthenticated: false, isLoading: false, isFirstLogin: false, isAdmin: false })
  },

  resetPassword: async (email) => {
    set({ isLoading: true })
    await new Promise(r => setTimeout(r, 800))
    set({ isLoading: false })
    return { success: true }
  },

  clearFirstLogin: () => set({ isFirstLogin: false }),
}))
