export interface ItemCard {
  CARD_ID: number
  ITEM_CODE: string
  ITEM_NAME: string
  UNIT?: string | null
  CATEGORY?: string | null
  PURCHASE_PRICE?: number | string | null
  SALE_PRICE?: number | string | null
  QUANTITY?: number | string | null
  IS_ACTIVE?: string | null
  NOTES?: string | null
  CREATED_AT: string
}

export interface CreateItemCardDTO {
  ITEM_CODE: string
  ITEM_NAME: string
  UNIT?: string
  CATEGORY?: string
  PURCHASE_PRICE?: number | string
  SALE_PRICE?: number | string
  QUANTITY?: number | string
  IS_ACTIVE?: string
  NOTES?: string
}

export interface UpdateItemCardDTO extends Partial<CreateItemCardDTO> {
  CARD_ID: number
}

export interface Warehouse {
  WAREHOUSE_ID: number
  WAREHOUSE_CODE: string
  WAREHOUSE_NAME: string
  LOCATION?: string | null
  MANAGER_NAME?: string | null
  PHONE?: string | null
  IS_ACTIVE?: string | null
  NOTES?: string | null
  CREATED_AT: string
}

export interface CreateWarehouseDTO {
  WAREHOUSE_CODE: string
  WAREHOUSE_NAME: string
  LOCATION?: string
  MANAGER_NAME?: string
  PHONE?: string
  IS_ACTIVE?: string
  NOTES?: string
}

export interface UpdateWarehouseDTO extends Partial<CreateWarehouseDTO> {
  WAREHOUSE_ID: number
}
