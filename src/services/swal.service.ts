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
}

export default swalService
