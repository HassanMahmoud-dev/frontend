import Swal, { type SweetAlertIcon, type SweetAlertOptions } from 'sweetalert2'

const toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  timer: 3000,
  timerProgressBar: true,
  showConfirmButton: false,
})

export const swalService = {
  toast(icon: SweetAlertIcon, title: string) {
    return toast.fire({ icon, title })
  },

  success(title: string) {
    return toast.fire({ icon: 'success', title })
  },

  error(title: string) {
    return toast.fire({ icon: 'error', title })
  },

  warning(title: string) {
    return toast.fire({ icon: 'warning', title })
  },

  info(title: string) {
    return toast.fire({ icon: 'info', title })
  },

  popup(options: SweetAlertOptions) {
    return Swal.fire(options)
  },

  confirm(options: {
    title: string
    text?: string
    confirmButtonText?: string
    cancelButtonText?: string
    icon?: SweetAlertIcon
    isDanger?: boolean
  }) {
    return Swal.fire({
      title: options.title,
      text: options.text,
      icon: options.icon || 'question',
      showCancelButton: true,
      confirmButtonText: options.confirmButtonText || 'تأكيد',
      cancelButtonText: options.cancelButtonText || 'إلغاء',
      customClass: {
        actions: 'gap-3',
        confirmButton: `px-5 py-2.5 rounded-lg text-white font-medium transition-colors border border-transparent ${
          options.isDanger ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'
        }`,
        cancelButton:
          'px-5 py-2.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium transition-colors dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700',
      },
      buttonsStyling: false,
    })
  },
}

export default swalService
