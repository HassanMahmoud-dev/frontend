import api from '@/services/api'
import type { BaseResponse } from '@/types/api'
import type { ItemCard, CreateItemCardDTO, UpdateItemCardDTO } from '@/types/inventory'
import swalService from '@/services/swal.service'

export interface PaginationData {
  total: number
  page: number
  totalPages: number
  limit: number
}

export interface PaginatedItemCards {
  data: ItemCard[]
  pagination: PaginationData
}

type ItemCardForm = Partial<CreateItemCardDTO>

class ItemCardService {
  validate(formData: ItemCardForm): boolean {
    if (!formData.ITEM_CODE?.trim()) {
      swalService.error('كود الصنف مطلوب')
      return false
    }

    if (!formData.ITEM_NAME?.trim()) {
      swalService.error('اسم الصنف مطلوب')
      return false
    }

    return true
  }

  async getAllItemCards(filters?: {
    searchTerm?: string
    category?: string
    status?: string
    page?: number
    limit?: number
  }): Promise<PaginatedItemCards> {
    const response = await api.get<BaseResponse<PaginatedItemCards>>('/inventory/item-cards', {
      params: filters,
    })

    return response.data.data!
  }

  async createItemCard(data: CreateItemCardDTO): Promise<ItemCard> {
    const response = await api.post<BaseResponse<ItemCard>>('/inventory/item-cards', data)
    return response.data.data!
  }

  async updateItemCard(cardId: number, data: UpdateItemCardDTO): Promise<ItemCard> {
    const response = await api.put<BaseResponse<ItemCard>>(`/inventory/item-cards/${cardId}`, data)
    return response.data.data!
  }

  async deleteItemCard(cardId: number): Promise<void> {
    await api.delete(`/inventory/item-cards/${cardId}`)
  }
}

export const itemCardService = new ItemCardService()
