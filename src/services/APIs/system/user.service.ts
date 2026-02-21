import api from '@/services/api'
import type { BaseResponse } from '@/types/api'
import type { SystemUser, CreateUserDTO, UpdateUserDTO, ConnectedSession } from '@/types/user'
import swalService from '@/services/swal.service'

interface UserForm extends Partial<CreateUserDTO> {
  CONFIRM_PASSWORD?: string
}

export interface PaginationData {
  total: number
  page: number
  totalPages: number
  limit: number
}

export interface PaginatedUsers {
  data: SystemUser[]
  pagination: PaginationData
}

class UserService {
  /**
   * Validate user form data
   */
  validate(formData: UserForm, isEditing: boolean): boolean {
    if (!formData.FULL_NAME?.trim()) {
      swalService.error('الاسم الكامل مطلوب')
      return false
    }
    if (!formData.USERNAME?.trim()) {
      swalService.error('اسم المستخدم مطلوب')
      return false
    }
    if (!isEditing && !formData.PASSWORD) {
      swalService.error('كلمة المرور مطلوبة')
      return false
    }
    if (!formData.ROLE) {
      swalService.error('الدور مطلوب')
      return false
    }

    // Validate password confirmation
    if (formData.PASSWORD && formData.PASSWORD !== formData.CONFIRM_PASSWORD) {
      swalService.error('كلمات المرور غير متطابقة')
      return false
    }

    return true
  }

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
  async getAllUsers(filters?: {
    searchTerm?: string
    role?: string
    status?: string
    page?: number
    limit?: number
  }): Promise<PaginatedUsers> {
    const response = await api.get<BaseResponse<PaginatedUsers>>('/auth/users', {
      params: filters,
    })
    return response.data.data!
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

  /**
   * Get all connected active sessions
   */
  async getConnectedUsers(): Promise<ConnectedSession[]> {
    const response = await api.get<BaseResponse<ConnectedSession[]>>('/auth/users/connected')
    return response.data.data!
  }

  /**
   * Revoke a specific session
   */
  async revokeSession(tokenId: number): Promise<void> {
    await api.delete(`/auth/users/connected/${tokenId}`)
  }
}

export const userService = new UserService()
