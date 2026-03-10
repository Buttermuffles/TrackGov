import { create } from 'zustand'
import type { UserRole } from '../types/core'
import { mockData } from '../lib/mockData'

export type AuthUser = {
  id: string
  name: string
  role: UserRole
  officeId: string
}

type AuthState = {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  async login(email, _password) {
    // Mock auth based on provided demo credentials
    const map: Record<string, { role: UserRole }> = {
      'admin@trackgov.gov.ph': { role: 'Super Admin' },
      'records@trackgov.gov.ph': { role: 'Records Officer' },
      'dept@trackgov.gov.ph': { role: 'Department Head' },
      'staff@trackgov.gov.ph': { role: 'Staff' },
    }
    const match = map[email]
    if (!match) {
      throw new Error('Invalid demo credentials')
    }

    const user = mockData.users.find((u) => u.email === email)
    if (!user) {
      throw new Error('User not found in mock data')
    }

    set({
      user: {
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        role: match.role,
        officeId: user.officeId,
      },
    })
  },
  logout() {
    set({ user: null })
  },
}))

