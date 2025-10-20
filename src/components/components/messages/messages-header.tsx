// components/messages/messages-header.tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Search } from "lucide-react"

interface MessagesHeaderProps {
  onNewConversation: () => void
  searchQuery: string
  onSearchChange: (value: string) => void
}

export function MessagesHeader({ onNewConversation, searchQuery, onSearchChange }: MessagesHeaderProps) {
  return (
    <div className="p-4 border-b space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Messages</h1>
        <Button onClick={onNewConversation} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Nouveau
        </Button>
      </div>
      
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher une conversation..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  )
}