// import { apiService, type RegisterData, type LoginData } from './api/auth'

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

export interface AuthResponse {
  user: User
  token: string
}

// Stockage sécurisé qui fonctionne côté client et serveur
class SecureStorage {
  private static storage: Map<string, string> = new Map()
  
  static setItem(key: string, value: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value)
    } else {
      this.storage.set(key, value)
    }
  }
  
  static getItem(key: string): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key)
    } else {
      return this.storage.get(key) || null
    }
  }
  
  static removeItem(key: string): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key)
    } else {
      this.storage.delete(key)
    }
  }
  
  static clear(): void {
    if (typeof window !== 'undefined') {
      localStorage.clear()
    } else {
      this.storage.clear()
    }
  }
}

export class AuthService {
  // Vérifie si on est côté client
  private static isClient(): boolean {
    return typeof window !== 'undefined'
  }

  // login
  static async login(email: string, password: string): Promise<AuthResponse> {
    const response = await apiService.login({ email, password })
    this.setAuthData(response.user, response.token)
    return response
  }

  // inscription
  static async register(userData: any): Promise<AuthResponse> {
    const registerData: RegisterData = {
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      password: userData.password,
      userType: userData.userType,
      companyName: userData.companyName
    }

    const response = await apiService.register(registerData)
    this.setAuthData(response.user, response.token)
    return response
  }

  // mise dans le stockage sécurisé - CORRIGÉ
  static setAuthData(user: User, token: string): void {
    SecureStorage.setItem('auth-token', token)
    SecureStorage.setItem('user-data', JSON.stringify(user))
    SecureStorage.setItem('user-role', user.role)
    
    // ✅ Cookies seulement côté client
    if (this.isClient() && typeof document !== 'undefined') {
      document.cookie = `auth-token=${token}; path=/; max-age=86400; SameSite=Strict`
      document.cookie = `user-role=${user.role}; path=/; max-age=86400; SameSite=Strict`
    }
  }

  // deconnexion - CORRIGÉ
  static logout(): void {
    SecureStorage.removeItem('auth-token')
    SecureStorage.removeItem('user-data')
    SecureStorage.removeItem('user-role')
    
    // ✅ Cookies seulement côté client
    if (this.isClient() && typeof document !== 'undefined') {
      document.cookie = 'auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
      document.cookie = 'user-role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }
    
    // ✅ Redirection seulement côté client
    if (this.isClient() && typeof window !== 'undefined') {
      const currentPath = window.location.pathname
      if (currentPath.startsWith('/admin') || currentPath.startsWith('/pro')) {
        window.location.href = '/login'
      } else {
        window.location.href = '/'
      }
    }
  }

  // obtenir l'utilisateur actuel - CORRIGÉ
  static getCurrentUser(): User | null {
    try {
      const userData = SecureStorage.getItem('user-data')
      return userData ? JSON.parse(userData) : null
    } catch (error) {
      console.error('Error parsing user data:', error)
      return null
    }
  }
   // Méthode pour récupérer le token d'authentification pour les requêtes API
  static getAuthHeaders(): HeadersInit {
    const token = this.getToken()
    
    if (!token) {
      return {}
    }
    
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  }

  // Méthode pour faire des requêtes authentifiées
  static async authenticatedFetch(url: string, options: RequestInit = {}) {
    const headers = {
      ...this.getAuthHeaders(),
      ...options.headers
    }
    
    return fetch(url, {
      ...options,
      headers
    })
  }
  // rafraîchir le token
  static async refreshToken(): Promise<string | null> {
    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.getToken()}`
        }
      })
      
      if (response.ok) {
        const { token } = await response.json()
        const currentUser = this.getCurrentUser()
        if (currentUser) {
          this.setAuthData(currentUser, token)
        }
        return token
      }
    } catch (error) {
      console.error('Token refresh failed:', error)
    }
    
    this.logout()
    return null
  }

  // obtenir le token actuel - CORRIGÉ
  static getToken(): string | null {
    return SecureStorage.getItem('auth-token')
  }

  // obtenir le role actuel - CORRIGÉ
  static getCurrentRole(): string | null {
    return SecureStorage.getItem('user-role')
  }

  // vérifier si l'utilisateur est authentifié - CORRIGÉ
  static isAuthenticated(): boolean {
    return this.getToken() !== null
  }

  // vérifier le role de l'utilisateur - CORRIGÉ
  static hasRole(requiredRole: string | string[]): boolean {
    const user = this.getCurrentUser()
    if (!user) return false

    if (user.role === 'admin') return true
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role)
    }
    
    return user.role === requiredRole
  }

  // redirection selon le role - CORRIGÉ
  static redirectBasedOnRole(): string {
    const role = this.getCurrentRole()
    
    switch (role) {
      case 'admin':
        return '/admin'
      case 'professional':
        return '/pro'
      case 'user':
        return '/mon-compte'
      default:
        return '/'
    }
  }

  static async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de la demande de réinitialisation')
    }

    return response.json()
  }

  // Réinitialisation du mot de passe avec token
  static async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Erreur lors de la réinitialisation du mot de passe')
    }

    return response.json()
  }

  // Vérification de la validité du token
  static async verifyResetToken(token: string): Promise<{ valid: boolean; email?: string }> {
    const response = await fetch(`/api/auth/verify-reset-token?token=${encodeURIComponent(token)}`)

    if (!response.ok) {
      throw new Error('Token invalide ou expiré')
    }

    return response.json()
  }

  // vérifier l'accès aux routes - CORRIGÉ
  static canAccess(path: string): boolean {
    const user = this.getCurrentUser()
    if (!user) return false

    // Routes publiques
    const publicRoutes = ['/', '/login', '/register', '/actualites', '/immobilier', '/services', '/produits', '/tourisme']
    if (publicRoutes.includes(path)) return true

    // Vérification des routes protégées
    if (path.startsWith('/admin')) {
      return user.role === 'admin'
    }

    if (path.startsWith('/pro')) {
      return user.role === 'professional' || user.role === 'admin'
    }

    if (path.startsWith('/mon-compte')) {
      return user.role === 'user' || user.role === 'professional' || user.role === 'admin'
    }

    return true
  }

  // Nettoyage du stockage (utile pour les tests)
  static clearStorage(): void {
    SecureStorage.clear()
  }
}