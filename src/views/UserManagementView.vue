<template>
  <div class="p-6">
    <BasePageHeader
      title="إدارة المستخدمين"
      subtitle="إدارة حسابات النظام وصلاحيات الوصول"
      add-button-label="إضافة مستخدم"
      @add="openCreateModal"
    />

    <!-- Users Table -->
    <BaseTable
      :columns="tableColumns"
      :rows="users"
      :loading="isLoading"
      row-key="USER_ID"
      loading-text="جاري التحميل..."
      empty-text="لا يوجد مستخدمين لعرضهم"
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

      <template #cell-USER_ID="{ value }"> #{{ value }} </template>

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
    </BaseTable>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      @click.self="showModal = false"
    >
      <div
        class="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all border border-transparent dark:border-slate-800"
      >
        <div
          class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center"
        >
          <h3 class="text-xl font-bold text-slate-900 dark:text-white">{{ modalTitle }}</h3>
          <button
            @click="showModal = false"
            class="text-slate-400 hover:text-slate-500 dark:hover:text-slate-300"
          >
            <i class="bi bi-x-lg"></i>
          </button>
        </div>

        <div class="p-6 space-y-4">
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

          <BaseForm @submit="handleSubmit" content-class="space-y-4">
            <BaseInput v-model="formData.FULL_NAME" label="الاسم الكامل" />

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
              :options="[
                { label: 'موظف', value: 'employee' },
                { label: 'مدير النظام', value: 'admin' },
              ]"
            />

            <template #actions>
              <div class="flex-1 flex gap-3">
                <button
                  type="submit"
                  class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  حفظ
                </button>
                <button
                  type="button"
                  @click="showModal = false"
                  class="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </template>
          </BaseForm>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import { userService } from '@/services/APIs/user.service'
import type { SystemUser } from '@/types/user'
import Swal from 'sweetalert2'
import BaseForm from '@/components/base/BaseForm.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import BaseTable, { type BaseTableColumn } from '@/components/base/BaseTable.vue'
import BasePageHeader from '@/components/base/BasePageHeader.vue'
import { BASE_URL } from '@/services/api'

const router = useRouter()
const authStore = useAuthStore()
const users = ref<SystemUser[]>([])
const isLoading = ref(false)
const showModal = ref(false)
const isEditing = ref(false)
const modalTitle = ref('')
const avatarPreview = ref('')

const tableColumns: BaseTableColumn[] = [
  { key: 'AVATAR', label: 'الصورة', headerClass: 'text-right', class: 'text-right' },
  { key: 'USER_ID', label: 'المعرف', headerClass: 'text-right', class: 'text-right' },
  { key: 'FULL_NAME', label: 'الاسم الكامل', headerClass: 'text-right', class: 'text-right' },
  { key: 'USERNAME', label: 'اسم المستخدم', headerClass: 'text-right', class: 'text-right' },
  { key: 'EMAIL', label: 'البريد الإلكتروني', headerClass: 'text-right', class: 'text-right' },
  { key: 'PHONE_NUMBER', label: 'رقم الهاتف', headerClass: 'text-right', class: 'text-right' },
  { key: 'ROLE', label: 'الدور', headerClass: 'text-right', class: 'text-right' },
  { key: 'CREATED_AT', label: 'تاريخ الإنشاء', headerClass: 'text-right', class: 'text-right' },
  { key: 'ACTIONS', label: 'الإجراءات', headerClass: 'text-right', class: 'text-right' },
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
})

const fetchUsers = async () => {
  isLoading.value = true
  try {
    users.value = await userService.getAllUsers()
  } catch (error) {
    console.error('Error fetching users:', error)
  } finally {
    isLoading.value = false
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
  // Validate password confirmation
  if (formData.value.PASSWORD && formData.value.PASSWORD !== formData.value.CONFIRM_PASSWORD) {
    Swal.fire({
      icon: 'error',
      title: 'خطأ',
      text: 'كلمات المرور غير متطابقة',
    })
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
  const result = await Swal.fire({
    title: 'هل أنت متأكد؟',
    text: 'لن تتمكن من التراجع عن هذا الإجراء!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'نعم، احذفه!',
    cancelButtonText: 'إلغاء',
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

onMounted(() => {
  if (!authStore.isAdmin) {
    router.push('/')
    return
  }
  fetchUsers()
})
</script>
