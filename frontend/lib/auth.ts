import Cookies from 'js-cookie'
import api from './api'

export interface User {
  id: string
  email: string
  firstName?: string
  lastName?: string
  username?: string
  balance: number
  isPremium: boolean
  brainAge?: number
}

export interface AuthResponse {
  user: User
  access_token: string
}

export const authService = {
  async register(data: {
    email: string
    password: string
    firstName?: string
    lastName?: string
    username?: string
  }): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data)
    if (response.data.access_token) {
      Cookies.set('token', response.data.access_token, { expires: 7 })
    }
    return response.data
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    })
    if (response.data.access_token) {
      Cookies.set('token', response.data.access_token, { expires: 7 })
    }
    return response.data
  },

  async getProfile(): Promise<User> {
    const response = await api.get<User>('/auth/profile')
    return response.data
  },

  logout() {
    Cookies.remove('token')
    window.location.href = '/login'
  },

  isAuthenticated(): boolean {
    return !!Cookies.get('token')
  },
}
