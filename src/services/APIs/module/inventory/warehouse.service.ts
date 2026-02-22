import api from '@/services/api'
import type { BaseResponse } from '@/types/api'
import type { Warehouse, CreateWarehouseDTO, UpdateWarehouseDTO } from '@/types/inventory'
import swalService from '@/services/swal.service'

export interface PaginationData {
  total: number
  page: number
  totalPages: number
  limit: number
}

export interface PaginatedWarehouses {
  data: Warehouse[]
  pagination: PaginationData
}

type WarehouseForm = Partial<CreateWarehouseDTO>

class WarehouseService {
  validate(formData: WarehouseForm): boolean {
    if (!formData.WAREHOUSE_CODE?.trim()) {
      swalService.error('كود المخزن مطلوب')
      return false
    }

    if (!formData.WAREHOUSE_NAME?.trim()) {
      swalService.error('اسم المخزن مطلوب')
      return false
    }

    return true
  }

  async getAllWarehouses(filters?: {
    searchTerm?: string
    status?: string
    page?: number
    limit?: number
  }): Promise<PaginatedWarehouses> {
    const response = await api.get<BaseResponse<PaginatedWarehouses>>('/inventory/warehouses', {
      params: filters,
    })

    return response.data.data!
  }

  async createWarehouse(data: CreateWarehouseDTO): Promise<Warehouse> {
    const response = await api.post<BaseResponse<Warehouse>>('/inventory/warehouses', data)
    return response.data.data!
  }

  async updateWarehouse(warehouseId: number, data: UpdateWarehouseDTO): Promise<Warehouse> {
    const response = await api.put<BaseResponse<Warehouse>>(
      `/inventory/warehouses/${warehouseId}`,
      data,
    )
    return response.data.data!
  }

  async deleteWarehouse(warehouseId: number): Promise<void> {
    await api.delete(`/inventory/warehouses/${warehouseId}`)
  }
}

export const warehouseService = new WarehouseService()
