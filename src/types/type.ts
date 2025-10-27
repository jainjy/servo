export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: 'user' | 'admin' | 'professional'
  companyName?: string
  phone?: string
  address?: string
  bio?: string
  avatar?: string
  createdAt?: string
  permissions?: string[]
  isActive?: boolean
  kycStatus?: 'pending' | 'verified' | 'rejected'
}