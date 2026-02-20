import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'
import router from '@/router'
import type { BaseResponse } from '@/types/api'

interface User {
  userId: number
  username: string
  fullName?: string
  avatar?: string
  role: 'admin' | 'employee'
}

interface LoginData {
  accessToken: string
  refreshToken: string
  user: User
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(JSON.parse(localStorage.getItem('user') || 'null'))
  const accessToken = ref<string | null>(localStorage.getItem('accessToken'))
  const refreshToken = ref<string | null>(localStorage.getItem('refreshToken'))

  const isAuthenticated = computed(() => !!accessToken.value)
  const isAdmin = computed(() => user.value?.role === 'admin')

  const setTokens = (newAccessToken: string, newRefreshToken: string) => {
    accessToken.value = newAccessToken
    refreshToken.value = newRefreshToken
    localStorage.setItem('accessToken', newAccessToken)
    localStorage.setItem('refreshToken', newRefreshToken)
  }

  const setUser = (newUser: User) => {
    user.value = newUser
    localStorage.setItem('user', JSON.stringify(newUser))
  }

  const login = async (username: string, password: string) => {
    try {
      const response = await api.post<BaseResponse<LoginData>>('/auth/login', {
        username,
        password,
      })
      const {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: newUser,
      } = response.data.data!

      setTokens(newAccessToken, newRefreshToken)
      setUser(newUser)

      router.push('/')
      return true
    } catch (error) {
      console.error('Login failed:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      const token = refreshToken.value
      if (token) {
        await api.post('/auth/logout', { refreshToken: token })
      }
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      user.value = null
      accessToken.value = null
      refreshToken.value = null
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('user')
      router.push('/login')
    }
  }

  return {
    user,
    accessToken,
    refreshToken,
    isAuthenticated,
    isAdmin,
    login,
    logout,
    setUser,
  }
})
