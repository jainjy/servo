// components/auth/LogoutButton.tsx


import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import  AuthService  from "@/services/authService"

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function LogoutButton({ variant = "outline", size = "default", className = "" }: LogoutButtonProps) {
  const handleLogout = () => {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
      AuthService.logout()
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogout}
      className={className}
    >
      <LogOut className="h-4 w-4 mr-2" />
      Déconnexion
    </Button>
  )
}