<template>
  <div class="p-6">
    <!-- Tabs Section -->
    <BaseTabs
      v-model="activeTab"
      :tabs="[
        { label: 'المستخدمين', value: 'users' },
        { label: 'المتصلين', value: 'connected' },
      ]"
    >
      <template #panel>
        <BasePageHeader
          :title="activeTab === 'users' ? 'إدارة المستخدمين' : 'المتصلين'"
          :subtitle="
            activeTab === 'users'
              ? 'إدارة حسابات النظام وصلاحيات الوصول'
              : 'مراقبة وإدارة جلسات المستخدمين المتصلين بالنظام'
          "
          :add-button-label="activeTab === 'users' ? 'إضافة مستخدم' : ''"
          @add="openCreateModal"
        />

        <div v-if="activeTab === 'users'">
          <!-- Filters Section -->
          <BaseFilter
            title="البحث عن المستخدمين"
            subtitle="استخدم الحقول أدناه لتصفية نتائج قائمة المستخدمين"
            :active-filters-count="activeFiltersCount"
            :loading="isLoading"
            @search="handleSearch"
            @clear="handleClearFilters"
          >
            <BaseInput
              v-model="filterData.searchTerm"
              label="بحث عام"
              placeholder="الاسم، اسم المستخدم، البريد..."
            />
            <BaseInput
              v-model="filterData.role"
              type="select"
              label="الدور"
              :options="[
                { label: 'الكل', value: '' },
                { label: 'موظف', value: 'employee' },
                { label: 'مدير النظام', value: 'admin' },
              ]"
            />
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

          <!-- Users Table -->
          <BaseTable
            :columns="tableColumns"
            :rows="users"
            :loading="isLoading"
            row-key="USER_ID"
            loading-text="جاري التحميل..."
            empty-text="لا يوجد مستخدمين لعرضهم"
            :is-delete-visible="(row) => row.USER_ID !== authStore.user?.userId"
            show-pagination
            :total="pagination.total"
            :page="pagination.page"
            :limit="pagination.limit"
            :total-pages="pagination.totalPages"
            @update:page="
              (p) => {
                pagination.page = p
                fetchUsers()
              }
            "
            @update:limit="
              (l) => {
                pagination.limit = l
                pagination.page = 1
                fetchUsers()
              }
            "
            @edit="openEditModal"
            @delete="(row) => handleDelete(row.USER_ID)"
          >
            <template #cell-AVATAR="{ value }">
              <div class="h-10 w-10 flex-shrink-0">
                <img
                  v-if="value"
                  :src="value.startsWith('http') ? value : `${BASE_URL}${value}`"
                  class="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                  alt="Avatar"
                />
                <div
                  v-else
                  class="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400"
                >
                  <i class="bi bi-person text-xl"></i>
                </div>
              </div>
            </template>

            <template #cell-USER_ID="{ value }"> {{ value }} </template>

            <template #cell-ROLE="{ value }">
              <span
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="
                  value === 'admin'
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                "
              >
                {{ value === 'admin' ? 'مدير النظام' : 'موظف' }}
              </span>
            </template>

            <template #cell-CREATED_AT="{ value }">
              {{ new Date(value as string).toLocaleDateString('ar-EG') }}
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

            <template #cell-LAST_LOGIN="{ value }">
              <span v-if="value" class="text-xs text-slate-500 underline decoration-dotted">
                {{ new Date(value as string).toLocaleString('ar-EG') }}
              </span>
              <span v-else class="text-xs text-slate-400">لم يسجل دخول بعد</span>
            </template>
          </BaseTable>
        </div>

        <!-- Connected Users Tab -->
        <div v-else-if="activeTab === 'connected'">
          <BaseTable
            :columns="connectedColumns"
            :rows="connectedUsers"
            :loading="isConnectedLoading"
            row-key="TOKEN_ID"
            loading-text="جاري التحميل..."
            empty-text="لا يوجد مستخدمين متصلين"
            :show-edit-action="false"
            :show-delete-action="false"
          >
            <template #cell-AVATAR="{ row }">
              <div class="flex items-center gap-3">
                <div class="h-10 w-10 flex-shrink-0">
                  <img
                    v-if="row.user?.AVATAR"
                    :src="
                      row.user.AVATAR.startsWith('http')
                        ? row.user.AVATAR
                        : `${BASE_URL}${row.user.AVATAR}`
                    "
                    class="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                    alt="Avatar"
                  />
                  <div
                    v-else
                    class="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400"
                  >
                    <i class="bi bi-person text-xl"></i>
                  </div>
                </div>
                <div>
                  <p class="text-sm font-medium text-slate-900 dark:text-white">
                    {{ row.user?.USERNAME }}
                  </p>
                  <p class="text-xs text-slate-500">{{ row.user?.FULL_NAME }}</p>
                </div>
              </div>
            </template>

            <template #cell-ROLE="{ row }">
              <span
                class="px-2 py-1 rounded-full text-xs font-medium"
                :class="
                  row.user?.ROLE === 'admin'
                    ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                    : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                "
              >
                {{ row.user?.ROLE === 'admin' ? 'مدير النظام' : 'موظف' }}
              </span>
            </template>

            <template #cell-DEVICE_INFO="{ value }">
              <div v-if="value" class="flex items-center gap-2">
                <i :class="getBrowserIcon(value)" class="text-lg text-slate-500"></i>
                <span class="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {{ getBrowserName(value) }}
                </span>
              </div>
              <span v-else class="text-xs text-slate-600 dark:text-slate-400">غير معروف</span>
            </template>

            <template #cell-IP_ADDRESS="{ value }">
              <span class="text-xs text-slate-600 dark:text-slate-400 font-mono">{{
                value ? value.replace('::ffff:', '') : 'غير معروف'
              }}</span>
            </template>

            <template #cell-ACTIONS="{ row }">
              <button
                v-if="row.user?.USER_ID !== authStore.user?.userId"
                @click="handleRevokeSession(row.TOKEN_ID)"
                class="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="تسجيل خروج"
              >
                <i class="bi bi-box-arrow-right"></i>
              </button>
            </template>
          </BaseTable>
        </div>
      </template>
    </BaseTabs>

    <!-- Modal -->
    <BaseModal
      v-model="showModal"
      :title="modalTitle"
      size="lg"
      show-footer
      :confirm-label="isEditing ? 'تعديل' : 'إضافة'"
      :confirm-icon="isEditing ? 'bi-pencil-square' : 'bi-person-plus'"
      @confirm="handleSubmit"
    >
      <div class="space-y-6">
        <!-- Avatar Upload -->
        <div class="flex flex-col items-center gap-4 py-2">
          <div class="relative group">
            <div
              class="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 flex items-center justify-center"
            >
              <img
                v-if="avatarPreview || (typeof formData.AVATAR === 'string' && formData.AVATAR)"
                :src="
                  avatarPreview ||
                  (typeof formData.AVATAR === 'string' && formData.AVATAR.startsWith('/uploads')
                    ? `${BASE_URL}${formData.AVATAR}`
                    : '')
                "
                class="w-full h-full object-cover"
                alt="Avatar Preview"
              />
              <i v-else class="bi bi-person text-4xl text-slate-400"></i>
            </div>
            <label
              class="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
            >
              <i class="bi bi-camera-fill text-xl"></i>
              <input type="file" class="hidden" accept="image/*" @change="handleAvatarChange" />
            </label>
            <button
              v-if="formData.AVATAR || avatarPreview"
              @click="removeAvatar"
              type="button"
              class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
              title="إزالة الصورة"
            >
              <i class="bi bi-x-lg text-xs"></i>
            </button>
          </div>
          <span class="text-xs text-slate-500 dark:text-slate-400">الصورة الشخصية</span>
        </div>

        <div class="px-1">
          <p class="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <span class="text-red-500 font-bold">*</span>
            <span>الحقول المميزة بهذه العلامة اجبارية</span>
          </p>
        </div>

        <BaseForm id="userForm" @submit="handleSubmit">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <BaseInput v-model="formData.FULL_NAME" label="الاسم الكامل" required />

            <BaseInput v-model="formData.USERNAME" label="اسم المستخدم" required />

            <BaseInput v-model="formData.EMAIL" type="email" label="البريد الإلكتروني" />

            <BaseInput v-model="formData.PHONE_NUMBER" label="رقم الهاتف" />

            <BaseInput
              v-model="formData.PASSWORD"
              type="password"
              :label="isEditing ? 'كلمة المرور (اتركه فارغاً للإبقاء على الحالية)' : 'كلمة المرور'"
              :required="!isEditing"
            />

            <BaseInput
              v-model="formData.CONFIRM_PASSWORD"
              type="password"
              label="تأكيد كلمة المرور"
              :required="!isEditing || formData.PASSWORD !== ''"
            />

            <BaseInput
              v-model="formData.ROLE"
              type="select"
              label="الدور"
              required
              :options="[
                { label: 'موظف', value: 'employee' },
                { label: 'مدير النظام', value: 'admin' },
              ]"
            />

            <div class="flex items-end pb-2">
              <BaseInput
                :model-value="formData.IS_ACTIVE"
                type="checkbox"
                placeholder="حساب نشط"
                @update:model-value="(val) => (formData.IS_ACTIVE = val ? 'on' : 'off')"
              />
            </div>
          </div>
        </BaseForm>
      </div>
    </BaseModal>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { userService, type PaginationData } from '@/services/APIs/user.service'
import type { SystemUser, ConnectedSession } from '@/types/user'
import swalService from '@/services/swal.service'
import BaseForm from '@/components/base/BaseForm.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseModal from '@/components/base/BaseModal.vue'
import BaseTable, { type BaseTableColumn } from '@/components/base/BaseTable.vue'
import BasePageHeader from '@/components/base/BasePageHeader.vue'
import BaseTabs from '@/components/base/BaseTabs.vue'
import BaseFilter from '@/components/base/BaseFilter.vue'
import { BASE_URL } from '@/services/api'
import { getSocket } from '@/services/socket.service'
import Bowser from 'bowser'

const router = useRouter()
const authStore = useAuthStore()
const users = ref<SystemUser[]>([])
const pagination = ref<PaginationData>({
  total: 0,
  page: 1,
  limit: 50,
  totalPages: 1,
})
const isLoading = ref(false)
const isConnectedLoading = ref(false)
const showModal = ref(false)
const isEditing = ref(false)
const modalTitle = ref('')
const avatarPreview = ref('')
const activeTab = ref<'users' | 'connected'>('users')
const connectedUsers = ref<ConnectedSession[]>([])

const tableColumns: BaseTableColumn[] = [
  { key: 'AVATAR', label: 'الصورة', headerClass: 'text-right', class: 'text-right' },
  { key: 'USER_ID', label: 'المعرف', headerClass: 'text-right', class: 'text-right' },
  { key: 'FULL_NAME', label: 'الاسم الكامل', headerClass: 'text-right', class: 'text-right' },
  { key: 'USERNAME', label: 'اسم المستخدم', headerClass: 'text-right', class: 'text-right' },
  { key: 'EMAIL', label: 'البريد الإلكتروني', headerClass: 'text-right', class: 'text-right' },
  { key: 'PHONE_NUMBER', label: 'رقم الهاتف', headerClass: 'text-right', class: 'text-right' },
  { key: 'ROLE', label: 'الدور', headerClass: 'text-right', class: 'text-right' },
  { key: 'IS_ACTIVE', label: 'الحالة', headerClass: 'text-right', class: 'text-right' },
  { key: 'LAST_LOGIN', label: 'أخر دخول', headerClass: 'text-right', class: 'text-right' },
  { key: 'CREATED_AT', label: 'تاريخ الإنشاء', headerClass: 'text-right', class: 'text-right' },
  { key: 'ACTIONS', label: 'الإجراءات', headerClass: 'text-right', class: 'text-right' },
]

const connectedColumns: BaseTableColumn[] = [
  { key: 'AVATAR', label: 'المستخدم', headerClass: 'text-right', class: 'text-right' },
  { key: 'ROLE', label: 'الدور', headerClass: 'text-right', class: 'text-right' },
  { key: 'DEVICE_INFO', label: 'بيانات المتصفح', headerClass: 'text-right', class: 'text-right' },
  { key: 'IP_ADDRESS', label: 'IP Address', headerClass: 'text-right', class: 'text-right' },
  { key: 'ACTIONS', label: 'إجراءات', headerClass: 'text-right', class: 'text-right' },
]

const formData = ref({
  USER_ID: 0,
  USERNAME: '',
  PASSWORD: '',
  CONFIRM_PASSWORD: '',
  FULL_NAME: '',
  PHONE_NUMBER: '',
  EMAIL: '',
  AVATAR: '' as string | File,
  ROLE: 'employee' as 'admin' | 'employee',
  IS_ACTIVE: 'on' as string | null,
})

const filterData = ref({
  searchTerm: '',
  role: '',
  status: '',
})

const activeFiltersCount = computed(() => {
  let count = 0
  if (filterData.value.searchTerm) count++
  if (filterData.value.role) count++
  if (filterData.value.status) count++
  return count
})

const handleSearch = () => {
  pagination.value.page = 1
  fetchUsers()
}

const handleClearFilters = () => {
  filterData.value = {
    searchTerm: '',
    role: '',
    status: '',
  }
  pagination.value.page = 1
  fetchUsers()
}

const fetchUsers = async () => {
  isLoading.value = true
  try {
    const response = await userService.getAllUsers({
      searchTerm: filterData.value.searchTerm,
      role: filterData.value.role,
      status: filterData.value.status,
      page: pagination.value.page,
      limit: pagination.value.limit,
    })
    users.value = response.data
    pagination.value = response.pagination
  } catch (error) {
    console.error('Error fetching users:', error)
  } finally {
    isLoading.value = false
  }
}

const fetchConnectedUsers = async () => {
  isConnectedLoading.value = true
  try {
    const data = await userService.getConnectedUsers()
    connectedUsers.value = data
  } catch (error) {
    console.error('Error fetching connected users:', error)
  } finally {
    isConnectedLoading.value = false
  }
}

const openCreateModal = () => {
  isEditing.value = false
  modalTitle.value = 'إضافة مستخدم جديد'
  formData.value = {
    USER_ID: 0,
    USERNAME: '',
    PASSWORD: '',
    CONFIRM_PASSWORD: '',
    FULL_NAME: '',
    PHONE_NUMBER: '',
    EMAIL: '',
    AVATAR: '',
    ROLE: 'employee',
    IS_ACTIVE: 'on',
  }
  avatarPreview.value = ''
  showModal.value = true
}

const openEditModal = (user: SystemUser) => {
  isEditing.value = true
  modalTitle.value = 'تعديل المستخدم'
  formData.value = {
    USER_ID: user.USER_ID,
    USERNAME: user.USERNAME,
    PASSWORD: '',
    CONFIRM_PASSWORD: '',
    FULL_NAME: user.FULL_NAME || '',
    PHONE_NUMBER: user.PHONE_NUMBER || '',
    EMAIL: user.EMAIL || '',
    AVATAR: user.AVATAR || '',
    ROLE: user.ROLE,
    IS_ACTIVE: user.IS_ACTIVE === 'on' ? 'on' : 'off',
  }
  avatarPreview.value = ''
  showModal.value = true
}

const handleAvatarChange = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    formData.value.AVATAR = file
    const reader = new FileReader()
    reader.onload = (e) => {
      avatarPreview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const removeAvatar = () => {
  formData.value.AVATAR = ''
  avatarPreview.value = ''
}

const handleSubmit = async () => {
  if (!userService.validate(formData.value, isEditing.value)) {
    return
  }

  try {
    let result: SystemUser
    if (isEditing.value) {
      if (!formData.value.PASSWORD) {
        // Create a new object excluding PASSWORD and CONFIRM_PASSWORD
        const dataWithoutPassword = { ...formData.value }
        delete (dataWithoutPassword as Partial<typeof formData.value>).PASSWORD
        delete (dataWithoutPassword as Partial<typeof formData.value>).CONFIRM_PASSWORD
        result = await userService.updateUser(formData.value.USER_ID, dataWithoutPassword)
      } else {
        const dataWithPassword = { ...formData.value }
        delete (dataWithPassword as Partial<typeof formData.value>).CONFIRM_PASSWORD
        result = await userService.updateUser(formData.value.USER_ID, dataWithPassword)
      }

      // Update auth store if the edited user is the current logged-in user
      if (authStore.user?.userId === result.USER_ID) {
        authStore.setUser({
          userId: result.USER_ID,
          username: result.USERNAME,
          fullName: result.FULL_NAME,
          avatar: result.AVATAR || undefined,
          role: result.ROLE,
        })
      }
    } else {
      // Create user
      const dataToSubmit = { ...formData.value }
      delete (dataToSubmit as Partial<typeof formData.value>).CONFIRM_PASSWORD
      await userService.createUser(dataToSubmit)
    }
    showModal.value = false
    fetchUsers()
  } catch (error) {
    console.error('Error saving user:', error)
  }
}

const handleDelete = async (userId: number) => {
  if (userId === authStore.user?.userId) {
    swalService.error('لا يمكنك حذف حسابك الخاص')
    return
  }

  const result = await swalService.confirm({
    title: 'هل أنت متأكد؟',
    text: 'لن تتمكن من التراجع عن هذا الإجراء!',
    icon: 'warning',
    confirmButtonText: 'نعم، احذفه!',
    cancelButtonText: 'إلغاء',
    isDanger: true,
  })

  if (result.isConfirmed) {
    try {
      await userService.deleteUser(userId)
      fetchUsers()
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }
}

const handleRevokeSession = async (tokenId: number) => {
  const session = connectedUsers.value.find((s) => s.TOKEN_ID === tokenId)
  if (session && session.user?.USER_ID === authStore.user?.userId) {
    swalService.error('لا يمكنك تسجيل الخروج من جلستك الحالية')
    return
  }

  const result = await swalService.confirm({
    title: 'تسجيل خروج المستخدم؟',
    text: 'هل أنت متأكد من رغبتك في تسجيل خروج هذا المستخدم من هذه الجلسة؟',
    icon: 'warning',
    confirmButtonText: 'نعم، تسجيل خروج',
    cancelButtonText: 'إلغاء',
    isDanger: true,
  })

  if (result.isConfirmed) {
    try {
      await userService.revokeSession(tokenId)
      fetchConnectedUsers()
    } catch (error) {
      console.error('Error revoking session:', error)
    }
  }
}

const getBrowserInfo = (userAgent: string) => {
  try {
    const browser = Bowser.getParser(userAgent)
    return browser.getBrowser()
  } catch (e) {
    console.error('Error parsing User-Agent:', e)
    return null
  }
}

const getBrowserName = (userAgent: string) => {
  const info = getBrowserInfo(userAgent)
  if (!info || !info.name) return userAgent
  return `${info.name} ${info.version ? info.version.split('.')[0] : ''}`
}

const getBrowserIcon = (userAgent: string) => {
  const info = getBrowserInfo(userAgent)
  if (!info || !info.name) return 'bi bi-globe'

  const name = info.name.toLowerCase()
  if (name.includes('chrome')) return 'bi bi-browser-chrome text-blue-500'
  if (name.includes('firefox')) return 'bi bi-browser-firefox text-orange-500'
  if (name.includes('safari')) return 'bi bi-browser-safari text-blue-400'
  if (name.includes('edge')) return 'bi bi-browser-edge text-blue-600'
  if (name.includes('opera')) return 'bi bi-browser-opera text-red-500'
  return 'bi bi-globe text-slate-500'
}

onMounted(() => {
  if (!authStore.isAdmin) {
    router.push('/')
    return
  }
  fetchUsers()
  fetchConnectedUsers()

  const socket = getSocket()
  if (socket) {
    socket.on('sessions_updated', fetchConnectedUsers)
  }
})
onUnmounted(() => {
  const socket = getSocket()
  if (socket) {
    socket.off('sessions_updated', fetchConnectedUsers)
  }
})
</script>
