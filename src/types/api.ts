export interface BaseResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
  errors?: unknown
  meta?: Record<string, unknown>
}
