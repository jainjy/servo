// components/messages/new-conversation-modal.tsx


import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"

interface User {
  id: string
  name: string
  type: 'user' | 'pro' | 'admin'
  avatar?: string
  context?: {
    type: 'listing' | 'service' | 'product'
    title: string
  }
}

interface NewConversationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConversationStart: (conversationId: string) => void
}

export function NewConversationModal({ open, onOpenChange, onConversationStart }: NewConversationModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Données mockées - à remplacer par l'API
  const availableUsers: User[] = [
    {
      id: "pro1",
      name: "ImmoPro",
      type: "pro",
      context: { type: "listing", title: "Appartement T3 Centre Ville" }
    },
    {
      id: "pro2",
      name: "Artisan Électricité",
      type: "pro", 
      context: { type: "service", title: "Réparation électrique" }
    },
    {
      id: "admin1", 
      name: "Support SERVO",
      type: "admin"
    }
  ]

  const filteredUsers = availableUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.context?.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleStartConversation = (user: User) => {
    // Ici, on créerait la conversation via l'API
    const conversationId = `conv_${Date.now()}`
    onConversationStart(conversationId)
    onOpenChange(false)
    setSelectedUser(null)
    setSearchQuery("")
  }

  const getUserTypeBadge = (type: string) => {
    const config = {
      user: { label: "Utilisateur", variant: "outline" as const },
      pro: { label: "Professionnel", variant: "secondary" as const },
      admin: { label: "Support", variant: "default" as const }
    }
    const conf = config[type as keyof typeof config] || config.user
    return <Badge variant={conf.variant} className="text-xs">{conf.label}</Badge>
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nouvelle conversation</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher un contact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer hover:bg-accent/50 transition-colors"
                onClick={() => handleStartConversation(user)}
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {user.name.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{user.name}</span>
                    {getUserTypeBadge(user.type)}
                  </div>
                  
                  {user.context && (
                    <p className="text-xs text-muted-foreground">
                      {user.context.title}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}