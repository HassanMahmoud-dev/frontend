import axios, { type AxiosResponse } from 'axios'
import swalService from './swal.service'
import type { BaseResponse } from '@/types/api'

export const API_URL = import.meta.env.VITE_API_URL
export const BASE_URL = import.meta.env.VITE_BASE_URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse<BaseResponse>) => {
    const { success, message, data } = response.data

    // If it's a success response with a message, show a toast
    // We usually show toast for non-GET requests to avoid spamming the user on every fetch
    if (success && message && response.config.method !== 'get') {
      swalService.toast('success', message)
    }

    // If the backend sent success: false even with a 2xx status (unlikely but possible)
    if (success === false) {
      swalService.error(message || 'حدث خطأ ما')
      return Promise.reject(new Error(message || 'API Error'))
    }

    // Return full response to maintain type safety
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // Handle session expiration
    const isLoginRequest = originalRequest.url?.includes('/auth/login')
    if (error.response?.status === 401 && !originalRequest._retry && !isLoginRequest) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        const response = await axios.post<BaseResponse<{ accessToken: string }>>(
          `${API_URL}/auth/refresh-token`,
          {
            refreshToken,
          },
        )

        const { accessToken } = response.data.data!
        localStorage.setItem('accessToken', accessToken)

        // Update authorization header
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`
        return api(originalRequest)
      } catch (refreshError) {
        // Clear tokens and redirect to login
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
        return Promise.reject(refreshError)
      }
    }

    // Handle other errors
    const errorMessage = error.response?.data?.message || error.message || 'حدث خطأ غير متوقع'
    swalService.error(errorMessage)

    return Promise.reject(error)
  },
)

export default api
