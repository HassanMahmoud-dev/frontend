<template>
  <div class="p-6 space-y-6">
    <BasePageHeader
      title="المخازن"
      subtitle="تسجيل وإدارة المخازن"
      add-button-label="إضافة مخزن"
      @add="openCreateModal"
    />

    <BaseFilter
      title="بحث وتصفية"
      subtitle="ابحث بالكود أو الاسم أو الموقع، أو صفّي حسب الحالة"
      :active-filters-count="activeFiltersCount"
      :loading="isLoading"
      @search="handleSearch"
      @clear="handleClearFilters"
    >
      <BaseInput v-model="filterData.searchTerm" label="بحث عام" placeholder="كود أو اسم أو موقع" />

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
      :rows="warehouses"
      :loading="isLoading"
      row-key="WAREHOUSE_ID"
      loading-text="جاري تحميل المخازن..."
      empty-text="لا يوجد مخازن"
      show-pagination
      :total="pagination.total"
      :page="pagination.page"
      :limit="pagination.limit"
      :total-pages="pagination.totalPages"
      @update:page="
        (p) => {
          pagination.page = p
          fetchWarehouses()
        }
      "
      @update:limit="
        (l) => {
          pagination.limit = l
          pagination.page = 1
          fetchWarehouses()
        }
      "
      @refresh="fetchWarehouses"
      @edit="openEditModal"
      @delete="(row) => handleDelete(row.WAREHOUSE_ID)"
    >
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
      :title="isEditing ? 'تعديل مخزن' : 'إضافة مخزن'"
      size="lg"
      show-footer
      :confirm-label="isEditing ? 'تعديل' : 'إضافة'"
      :confirm-icon="isEditing ? 'bi-pencil-square' : 'bi-plus-lg'"
      @confirm="handleSubmit"
    >
      <BaseForm id="warehouseForm" @submit="handleSubmit">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BaseInput v-model="formData.WAREHOUSE_CODE" label="كود المخزن" required />
          <BaseInput v-model="formData.WAREHOUSE_NAME" label="اسم المخزن" required />
          <BaseInput v-model="formData.LOCATION" label="الموقع" />
          <BaseInput v-model="formData.MANAGER_NAME" label="مسؤول المخزن" />
          <BaseInput v-model="formData.PHONE" label="الهاتف" />
          <div class="flex items-end pb-2">
            <BaseInput
              :model-value="formData.IS_ACTIVE"
              type="checkbox"
              placeholder="المخزن نشط"
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
  warehouseService,
  type PaginationData,
} from '@/services/APIs/module/inventory/warehouse.service'
import type { Warehouse } from '@/types/inventory'

const warehouses = ref<Warehouse[]>([])
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
  status: '',
})

const formData = ref({
  WAREHOUSE_ID: 0,
  WAREHOUSE_CODE: '',
  WAREHOUSE_NAME: '',
  LOCATION: '',
  MANAGER_NAME: '',
  PHONE: '',
  IS_ACTIVE: 'on',
  NOTES: '',
})

const tableColumns: BaseTableColumn[] = [
  { key: 'WAREHOUSE_ID', label: 'المعرف', headerClass: 'text-right', class: 'text-right' },
  { key: 'WAREHOUSE_CODE', label: 'كود المخزن', headerClass: 'text-right', class: 'text-right' },
  { key: 'WAREHOUSE_NAME', label: 'اسم المخزن', headerClass: 'text-right', class: 'text-right' },
  { key: 'LOCATION', label: 'الموقع', headerClass: 'text-right', class: 'text-right' },
  { key: 'MANAGER_NAME', label: 'المسؤول', headerClass: 'text-right', class: 'text-right' },
  { key: 'PHONE', label: 'الهاتف', headerClass: 'text-right', class: 'text-right' },
  { key: 'IS_ACTIVE', label: 'الحالة', headerClass: 'text-right', class: 'text-right' },
  { key: 'CREATED_AT', label: 'تاريخ الإنشاء', headerClass: 'text-right', class: 'text-right' },
  { key: 'ACTIONS', label: 'الإجراءات', headerClass: 'text-right', class: 'text-right' },
]

const activeFiltersCount = computed(() => {
  let count = 0
  if (filterData.value.searchTerm) count++
  if (filterData.value.status) count++
  return count
})

const resetForm = () => {
  formData.value = {
    WAREHOUSE_ID: 0,
    WAREHOUSE_CODE: '',
    WAREHOUSE_NAME: '',
    LOCATION: '',
    MANAGER_NAME: '',
    PHONE: '',
    IS_ACTIVE: 'on',
    NOTES: '',
  }
}

const fetchWarehouses = async () => {
  isLoading.value = true
  try {
    const result = await warehouseService.getAllWarehouses({
      ...filterData.value,
      page: pagination.value.page,
      limit: pagination.value.limit,
    })
    warehouses.value = result.data
    pagination.value = result.pagination
  } finally {
    isLoading.value = false
  }
}

const handleSearch = () => {
  pagination.value.page = 1
  fetchWarehouses()
}

const handleClearFilters = () => {
  filterData.value = {
    searchTerm: '',
    status: '',
  }
  pagination.value.page = 1
  fetchWarehouses()
}

const openCreateModal = () => {
  isEditing.value = false
  resetForm()
  showModal.value = true
}

const openEditModal = (row: Warehouse) => {
  isEditing.value = true
  formData.value = {
    WAREHOUSE_ID: row.WAREHOUSE_ID,
    WAREHOUSE_CODE: row.WAREHOUSE_CODE,
    WAREHOUSE_NAME: row.WAREHOUSE_NAME,
    LOCATION: row.LOCATION || '',
    MANAGER_NAME: row.MANAGER_NAME || '',
    PHONE: row.PHONE || '',
    IS_ACTIVE: row.IS_ACTIVE || 'on',
    NOTES: row.NOTES || '',
  }
  showModal.value = true
}

const handleSubmit = async () => {
  if (!warehouseService.validate(formData.value)) {
    return
  }

  const payload = {
    WAREHOUSE_CODE: formData.value.WAREHOUSE_CODE,
    WAREHOUSE_NAME: formData.value.WAREHOUSE_NAME,
    LOCATION: formData.value.LOCATION,
    MANAGER_NAME: formData.value.MANAGER_NAME,
    PHONE: formData.value.PHONE,
    IS_ACTIVE: formData.value.IS_ACTIVE,
    NOTES: formData.value.NOTES,
  }

  if (isEditing.value) {
    await warehouseService.updateWarehouse(formData.value.WAREHOUSE_ID, {
      WAREHOUSE_ID: formData.value.WAREHOUSE_ID,
      ...payload,
    })
  } else {
    await warehouseService.createWarehouse(payload)
  }

  showModal.value = false
  await fetchWarehouses()
}

const handleDelete = async (warehouseId: number) => {
  const result = await swalService.confirm({
    title: 'تأكيد الحذف',
    text: 'هل تريد حذف المخزن؟',
    confirmButtonText: 'نعم، حذف',
    cancelButtonText: 'إلغاء',
    icon: 'warning',
    isDanger: true,
  })

  if (!result.isConfirmed) {
    return
  }

  await warehouseService.deleteWarehouse(warehouseId)
  await fetchWarehouses()
}

onMounted(() => {
  fetchWarehouses()
})
</script>
