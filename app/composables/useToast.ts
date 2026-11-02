export interface Toast {
  id: string
  title: string
  message?: string
  type?: 'success' | 'info' | 'error'
  duration?: number
  actionText?: string
  onAction?: () => void
}

const toasts = ref<Toast[]>([])

export const useToast = () => {
  const show = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    const newToast: Toast = {
      id,
      duration: 3000,
      type: 'success',
      ...toast,
    }

    toasts.value.push(newToast)

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        remove(id)
      }, newToast.duration)
    }

    return id
  }

  const remove = (id: string) => {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  return {
    toasts,
    show,
    remove,
  }
}

