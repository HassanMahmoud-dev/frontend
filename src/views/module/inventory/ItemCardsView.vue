<template>
  <div class="p-6 space-y-6">
    <BasePageHeader
      title="كروت الأصناف"
      subtitle="تسجيل وإدارة كروت الأصناف"
      add-button-label="إضافة كرت صنف"
      @add="openCreateModal"
    />

    <BaseFilter
      title="بحث وتصفية"
      subtitle="ابحث بالكود أو الاسم، أو صفّي حسب الفئة والحالة"
      :active-filters-count="activeFiltersCount"
      :loading="isLoading"
      @search="handleSearch"
      @clear="handleClearFilters"
    >
      <BaseInput v-model="filterData.searchTerm" label="بحث عام" placeholder="كود الصنف أو الاسم" />

      <BaseInput v-model="filterData.category" label="الفئة" placeholder="مثال: مواد خام" />

      <BaseInput
        v-model="filterData.status"
        type="select"
        label="الحالة"
        :options="[
          { label: 'الكل', value: '' },
          { label: 'نشط', value: 'on' },
          { label: 'غير نشط', value: 'off' },
        ]"
      />
    </BaseFilter>

    <BaseTable
      :columns="tableColumns"
      :rows="itemCards"
      :loading="isLoading"
      row-key="CARD_ID"
      loading-text="جاري تحميل كروت الأصناف..."
      empty-text="لا يوجد كروت أصناف"
      show-pagination
      :total="pagination.total"
      :page="pagination.page"
      :limit="pagination.limit"
      :total-pages="pagination.totalPages"
      @update:page="
        (p) => {
          pagination.page = p
          fetchItemCards()
        }
      "
      @update:limit="
        (l) => {
          pagination.limit = l
          pagination.page = 1
          fetchItemCards()
        }
      "
      @refresh="fetchItemCards"
      @edit="openEditModal"
      @delete="(row) => handleDelete(row.CARD_ID)"
    >
      <template #cell-PURCHASE_PRICE="{ value }">
        {{ formatMoney(value) }}
      </template>

      <template #cell-SALE_PRICE="{ value }">
        {{ formatMoney(value) }}
      </template>

      <template #cell-IS_ACTIVE="{ value }">
        <span
          class="px-2 py-1 rounded-full text-xs font-medium"
          :class="
            value === 'on'
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
          "
        >
          {{ value === 'on' ? 'نشط' : 'غير نشط' }}
        </span>
      </template>

      <template #cell-CREATED_AT="{ value }">
        {{ new Date(value as string).toLocaleDateString('ar-EG') }}
      </template>
    </BaseTable>

    <BaseModal
      v-model="showModal"
      :title="isEditing ? 'تعديل كرت صنف' : 'إضافة كرت صنف'"
      size="lg"
      show-footer
      :confirm-label="isEditing ? 'تعديل' : 'إضافة'"
      :confirm-icon="isEditing ? 'bi-pencil-square' : 'bi-plus-lg'"
      @confirm="handleSubmit"
    >
      <BaseForm id="itemCardForm" @submit="handleSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BaseInput v-model="formData.ITEM_CODE" label="كود الصنف" required />
          <BaseInput v-model="formData.ITEM_NAME" label="اسم الصنف" required />
          <BaseInput v-model="formData.CATEGORY" label="الفئة" />
          <BaseInput v-model="formData.UNIT" label="الوحدة" />
          <BaseInput v-model="formData.PURCHASE_PRICE" type="number" label="سعر الشراء" />
          <BaseInput v-model="formData.SALE_PRICE" type="number" label="سعر البيع" />
          <BaseInput v-model="formData.QUANTITY" type="number" label="الكمية" />
          <div class="flex items-end pb-2">
            <BaseInput
              :model-value="formData.IS_ACTIVE"
              type="checkbox"
              placeholder="الصنف نشط"
              @update:model-value="(val) => (formData.IS_ACTIVE = val ? 'on' : 'off')"
            />
          </div>
        </div>
        <div class="mt-4">
          <BaseInput v-model="formData.NOTES" type="textarea" label="ملاحظات" />
        </div>
      </BaseForm>
    </BaseModal>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import BaseFilter from '@/components/base/BaseFilter.vue'
import BaseForm from '@/components/base/BaseForm.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import BasePageHeader from '@/components/base/BasePageHeader.vue'
import BaseTable, { type BaseTableColumn } from '@/components/base/BaseTable.vue'
import swalService from '@/services/swal.service'
import {
  itemCardService,
  type PaginationData,
} from '@/services/APIs/module/inventory/itemCard.service'
import type { ItemCard } from '@/types/inventory'

const itemCards = ref<ItemCard[]>([])
const isLoading = ref(false)
const showModal = ref(false)
const isEditing = ref(false)

const pagination = ref<PaginationData>({
  total: 0,
  page: 1,
  limit: 50,
  totalPages: 1,
})

const filterData = ref({
  searchTerm: '',
  category: '',
  status: '',
})

const formData = ref({
  CARD_ID: 0,
  ITEM_CODE: '',
  ITEM_NAME: '',
  UNIT: '',
  CATEGORY: '',
  PURCHASE_PRICE: '0',
  SALE_PRICE: '0',
  QUANTITY: '0',
  IS_ACTIVE: 'on',
  NOTES: '',
})

const tableColumns: BaseTableColumn[] = [
  { key: 'CARD_ID', label: 'المعرف', headerClass: 'text-right', class: 'text-right' },
  { key: 'ITEM_CODE', label: 'كود الصنف', headerClass: 'text-right', class: 'text-right' },
  { key: 'ITEM_NAME', label: 'اسم الصنف', headerClass: 'text-right', class: 'text-right' },
  { key: 'CATEGORY', label: 'الفئة', headerClass: 'text-right', class: 'text-right' },
  { key: 'UNIT', label: 'الوحدة', headerClass: 'text-right', class: 'text-right' },
  { key: 'PURCHASE_PRICE', label: 'سعر الشراء', headerClass: 'text-right', class: 'text-right' },
  { key: 'SALE_PRICE', label: 'سعر البيع', headerClass: 'text-right', class: 'text-right' },
  { key: 'QUANTITY', label: 'الكمية', headerClass: 'text-right', class: 'text-right' },
  { key: 'IS_ACTIVE', label: 'الحالة', headerClass: 'text-right', class: 'text-right' },
  { key: 'CREATED_AT', label: 'تاريخ الإنشاء', headerClass: 'text-right', class: 'text-right' },
  { key: 'ACTIONS', label: 'الإجراءات', headerClass: 'text-right', class: 'text-right' },
]

const activeFiltersCount = computed(() => {
  let count = 0
  if (filterData.value.searchTerm) count++
  if (filterData.value.category) count++
  if (filterData.value.status) count++
  return count
})

const resetForm = () => {
  formData.value = {
    CARD_ID: 0,
    ITEM_CODE: '',
    ITEM_NAME: '',
    UNIT: '',
    CATEGORY: '',
    PURCHASE_PRICE: '0',
    SALE_PRICE: '0',
    QUANTITY: '0',
    IS_ACTIVE: 'on',
    NOTES: '',
  }
}

const formatMoney = (value: number | string | null | undefined) => {
  const parsed = Number(value || 0)
  return Number.isFinite(parsed) ? parsed.toLocaleString('ar-EG') : '0'
}

const fetchItemCards = async () => {
  isLoading.value = true
  try {
    const result = await itemCardService.getAllItemCards({
      ...filterData.value,
      page: pagination.value.page,
      limit: pagination.value.limit,
    })
    itemCards.value = result.data
    pagination.value = result.pagination
  } finally {
    isLoading.value = false
  }
}

const handleSearch = () => {
  pagination.value.page = 1
  fetchItemCards()
}

const handleClearFilters = () => {
  filterData.value = {
    searchTerm: '',
    category: '',
    status: '',
  }
  pagination.value.page = 1
  fetchItemCards()
}

const openCreateModal = () => {
  isEditing.value = false
  resetForm()
  showModal.value = true
}

const openEditModal = (row: ItemCard) => {
  isEditing.value = true
  formData.value = {
    CARD_ID: row.CARD_ID,
    ITEM_CODE: row.ITEM_CODE,
    ITEM_NAME: row.ITEM_NAME,
    UNIT: row.UNIT || '',
    CATEGORY: row.CATEGORY || '',
    PURCHASE_PRICE: String(row.PURCHASE_PRICE ?? 0),
    SALE_PRICE: String(row.SALE_PRICE ?? 0),
    QUANTITY: String(row.QUANTITY ?? 0),
    IS_ACTIVE: row.IS_ACTIVE || 'on',
    NOTES: row.NOTES || '',
  }
  showModal.value = true
}

const handleSubmit = async () => {
  if (!itemCardService.validate(formData.value)) {
    return
  }

  const payload = {
    ITEM_CODE: formData.value.ITEM_CODE,
    ITEM_NAME: formData.value.ITEM_NAME,
    UNIT: formData.value.UNIT,
    CATEGORY: formData.value.CATEGORY,
    PURCHASE_PRICE: Number(formData.value.PURCHASE_PRICE || 0),
    SALE_PRICE: Number(formData.value.SALE_PRICE || 0),
    QUANTITY: Number(formData.value.QUANTITY || 0),
    IS_ACTIVE: formData.value.IS_ACTIVE,
    NOTES: formData.value.NOTES,
  }

  if (isEditing.value) {
    await itemCardService.updateItemCard(formData.value.CARD_ID, {
      CARD_ID: formData.value.CARD_ID,
      ...payload,
    })
  } else {
    await itemCardService.createItemCard(payload)
  }

  showModal.value = false
  await fetchItemCards()
}

const handleDelete = async (cardId: number) => {
  const result = await swalService.confirm({
    title: 'تأكيد الحذف',
    text: 'هل تريد حذف كرت الصنف؟',
    confirmButtonText: 'نعم، حذف',
    cancelButtonText: 'إلغاء',
    icon: 'warning',
    isDanger: true,
  })

  if (!result.isConfirmed) {
    return
  }

  await itemCardService.deleteItemCard(cardId)
  await fetchItemCards()
}

onMounted(() => {
  fetchItemCards()
})
</script>
