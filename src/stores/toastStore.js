import { create } from 'zustand'

let toastId = 0

export const useToastStore = create((set) => ({
  toasts: [],

  addToast: ({ type = 'success', message, action = null, duration = 4000 }) => {
    const id = ++toastId
    set((state) => ({
      toasts: [...state.toasts, { id, type, message, action, duration, createdAt: Date.now() }]
    }))
    // Auto-dismiss
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter(t => t.id !== id)
      }))
    }, duration)
    return id
  },

  removeToast: (id) => set((state) => ({
    toasts: state.toasts.filter(t => t.id !== id)
  })),
}))
