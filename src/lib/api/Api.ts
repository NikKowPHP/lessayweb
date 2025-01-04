import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

interface RequestConfig extends AxiosRequestConfig {
  params?: Record<string, string>
}

export class Api {
  protected axios: AxiosInstance
  protected baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
    this.axios = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Enables sending cookies with requests
    })

    // Request interceptor
    this.axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token')
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // Response interceptor
    this.axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response) {
          // Handle specific HTTP errors
          switch (error.response.status) {
            case 401:
              // Handle unauthorized
              localStorage.removeItem('auth_token')
              break
            case 403:
              // Handle forbidden
              break
            case 404:
              // Handle not found
              break
            case 500:
              // Handle server error
              break
          }
          throw new ApiError(
            error.response.status,
            error.response.data?.message || 'An error occurred'
          )
        }
        throw new ApiError(500, 'Network error')
      }
    )
  }

  protected async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const response = await this.axios.get<T>(endpoint, config)
    return response.data
  }

  protected async post<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    const response = await this.axios.post<T>(endpoint, data, config)
    return response.data
  }

  protected async put<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    const response = await this.axios.put<T>(endpoint, data, config)
    return response.data
  }

  protected async patch<T>(endpoint: string, data?: any, config?: RequestConfig): Promise<T> {
    const response = await this.axios.patch<T>(endpoint, data, config)
    return response.data
  }

  protected async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    const response = await this.axios.delete<T>(endpoint, config)
    return response.data
  }
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
} 