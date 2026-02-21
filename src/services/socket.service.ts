import { io, Socket } from 'socket.io-client'
import { BASE_URL } from './api'
import { useAuthStore } from '@/stores/auth.store'
import Swal from 'sweetalert2'

let socket: Socket | null = null

export const getSocket = () => socket

export const initSocket = () => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated || !authStore.user) {
    return
  }

  if (!socket) {
    socket = io(BASE_URL, {
      transports: ['websocket', 'polling'],
    })

    socket.on('connect', () => {
      socket?.emit('authenticate', authStore.user?.userId)
    })

    socket.on('force_logout', () => {
      Swal.fire({
        title: 'تنبيه',
        text: 'جاري تسجيل خروجك من قبل النظام خلال 10 ثواني...',
        icon: 'warning',
        timer: 10000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false,
        allowEscapeKey: false,
      }).then(() => {
        authStore.logout()
      })
    })

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason)
    })
  }
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}
