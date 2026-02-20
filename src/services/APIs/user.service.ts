import api from '@/services/api'
import type { BaseResponse } from '@/types/api'
import type { SystemUser, CreateUserDTO, UpdateUserDTO } from '@/types/user'

class UserService {
  /**
   * Helper to convert object to FormData
   */
  private toFormData<T extends object>(data: T): FormData {
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        // If it's a file, append it normally
        if (value instanceof File) {
          formData.append(key, value)
        } else {
          formData.append(key, String(value))
        }
      }
    })
    return formData
  }

  /**
   * Fetch all users
   */
  async getAllUsers(): Promise<SystemUser[]> {
    const response = await api.get<BaseResponse<SystemUser[]>>('/auth/users')
    return response.data.data || []
  }

  /**
   * Create a new user
   */
  async createUser(userData: CreateUserDTO | FormData): Promise<SystemUser> {
    const data = userData instanceof FormData ? userData : this.toFormData(userData)
    const response = await api.post<BaseResponse<SystemUser>>('/auth/users', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.data!
  }

  /**
   * Update an existing user
   */
  async updateUser(userId: number, userData: UpdateUserDTO | FormData): Promise<SystemUser> {
    const data = userData instanceof FormData ? userData : this.toFormData(userData)
    const response = await api.put<BaseResponse<SystemUser>>(`/auth/users/${userId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.data!
  }

  /**
   * Delete a user
   */
  async deleteUser(userId: number): Promise<void> {
    await api.delete(`/auth/users/${userId}`)
  }
}

export const userService = new UserService()
