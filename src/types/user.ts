export interface SystemUser {
  USER_ID: number
  USERNAME: string
  FULL_NAME?: string
  PHONE_NUMBER?: string
  EMAIL?: string
  AVATAR?: string | null
  ROLE: 'admin' | 'employee'
  CREATED_AT: string
  IS_ACTIVE?: string | null
  LAST_LOGIN?: string | null
}

export interface CreateUserDTO {
  USERNAME: string
  PASSWORD?: string
  FULL_NAME?: string
  PHONE_NUMBER?: string
  EMAIL?: string
  AVATAR?: string | File | null
  ROLE: 'admin' | 'employee'
  IS_ACTIVE?: string | null
}

export interface UpdateUserDTO extends Partial<CreateUserDTO> {
  USER_ID: number
}

export interface ConnectedSession {
  TOKEN_ID: number
  DEVICE_INFO?: string
  IP_ADDRESS?: string
  CREATED_AT: string
  EXPIRES_AT: string
  user: {
    USER_ID: number
    USERNAME: string
    ROLE: 'admin' | 'employee'
    AVATAR?: string | null
    FULL_NAME?: string
  }
}
