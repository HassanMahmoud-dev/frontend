export interface SystemUser {
  USER_ID: number
  USERNAME: string
  FULL_NAME?: string
  PHONE_NUMBER?: string
  EMAIL?: string
  AVATAR?: string | null
  ROLE: 'admin' | 'employee'
  CREATED_AT: string
}

export interface CreateUserDTO {
  USERNAME: string
  PASSWORD?: string
  FULL_NAME?: string
  PHONE_NUMBER?: string
  EMAIL?: string
  AVATAR?: string | File | null
  ROLE: 'admin' | 'employee'
}

export interface UpdateUserDTO extends Partial<CreateUserDTO> {
  USER_ID: number
}
