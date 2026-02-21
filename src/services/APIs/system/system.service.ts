import api from '../../api'

export interface ApiRoute {
  path: string
  method: string
  status: 'online' | 'offline' | 'degraded'
  statusCode: number
  issues: string[]
}

export interface SystemMetrics {
  cpu: {
    model: string
    cores: number
    loadAvg: number
  }
  memory: {
    total: number
    used: number
    free: number
    percentage: number
  }
  uptime: number
  platform: string
  timestamp: string
}

export interface SystemFault {
  id: string
  timestamp: string
  message: string
  stack?: string
  path?: string
  method?: string
  statusCode?: number
}

export const systemService = {
  async getApiRoutes() {
    const response = await api.get<{ data: ApiRoute[] }>('/system/routes')
    return response.data.data
  },

  async getSystemMetrics() {
    const response = await api.get<{ data: SystemMetrics }>('/system/metrics')
    return response.data.data
  },

  async getSystemFaults() {
    const response = await api.get<{ data: SystemFault[] }>('/system/faults')
    return response.data.data
  },
}
