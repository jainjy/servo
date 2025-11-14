// components/auth/LogoutButton.tsx

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { LogOut, AlertCircle } from "lucide-react"
import AuthService from "@/services/authService"

interface LogoutButtonProps {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
}

export function LogoutButton({ variant = "outline", size = "default", className = "" }: LogoutButtonProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleLogout = () => {
    AuthService.logout()
    setIsDialogOpen(false)
  }

  const handleCancel = () => {
    setIsDialogOpen(false)
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsDialogOpen(true)}
        className={className}
      >
        <LogOut className="h-4 w-4 mr-2" />
        Déconnexion
      </Button>

      {/* Modal Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCancel}
          />

          {/* Dialog Content */}
          <div className="relative z-50 w-full max-w-sm bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center gap-3 p-6 border-b border-gray-100 bg-gradient-to-r from-red-50 to-orange-50">
              <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-red-100">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Confirmer la déconnexion
                </h2>
                <p className="text-sm text-gray-500">
                  Cette action ne peut pas être annulée
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="text-gray-700 text-sm leading-relaxed">
                Êtes-vous sûr de vouloir vous déconnecter ? Vous devrez vous reconnecter pour accéder à votre compte.
              </p>
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-6 border-t border-gray-100 bg-gray-50">
              <Button
                variant="outline"
                onClick={handleCancel}
                className="flex-1 border-gray-200 text-gray-700 hover:bg-gray-100"
              >
                Annuler
              </Button>
              <Button
                variant="destructive"
                onClick={handleLogout}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Se déconnecter
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}