// components/pro/pro-header.tsx


import { Bell, Search, Menu } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { LogoutButton } from "@/components/auth/LogoutButton"
import  AuthService  from "@/services/authService"

export function ProHeader() {
  const user = AuthService.getCurrentUser()

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-black px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Rechercher des réservations, clients..."
            className="pl-10 bg-background"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-red-500"></span>
        </Button>

        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </AvatarFallback>
          </Avatar>
          <div className="hidden sm:block text-sm">
            <div className="font-medium">{user?.firstName} {user?.lastName}</div>
            <div className="text-muted-foreground">{user?.companyName}</div>
          </div>
          <LogoutButton variant="ghost" size="sm" />
        </div>
      </div>
    </header>
  )
}