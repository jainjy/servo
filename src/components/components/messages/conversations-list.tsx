

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Conversation {
  id: string
  participants: {
    id: string
    name: string
    avatar?: string
    type: 'user' | 'pro' | 'admin'
  }[]
  lastMessage: {
    content: string
    timestamp: string
    authorId: string
  }
  unreadCount: number
  context: {
    type: 'listing' | 'service' | 'product' | 'support'
    title: string
  }
  updatedAt: string
}

interface ConversationsListProps {
  searchQuery: string
  selectedConversation: string | null
  onSelectConversation: (id: string) => void
}

export function ConversationsList({
  searchQuery,
  selectedConversation,
  onSelectConversation
}: ConversationsListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [mounted, setMounted] = useState(false)

  // ⚠️ Pour éviter le rendu différent entre client et serveur
  useEffect(() => {
    setMounted(true)
  }, [])

  // Données mockées - à remplacer par l'API
  useEffect(() => {
    const mockConversations: Conversation[] = [
      {
        id: "1",
        participants: [
          { id: "user1", name: "Marie Dubois", type: "user" },
          { id: "pro1", name: "ImmoPro", type: "pro" }
        ],
        lastMessage: {
          content: "Je suis disponible demain pour la visite",
          timestamp: "2024-01-15T10:30:00Z",
          authorId: "pro1"
        },
        unreadCount: 2,
        context: {
          type: "listing",
          title: "Appartement T3 Centre Ville"
        },
        updatedAt: "2024-01-15T10:30:00Z"
      },
      {
        id: "2",
        participants: [
          { id: "user1", name: "Marie Dubois", type: "user" },
          { id: "admin1", name: "Support SERVO", type: "admin" }
        ],
        lastMessage: {
          content: "Votre problème de paiement a été résolu",
          timestamp: "2024-01-15T09:15:00Z",
          authorId: "admin1"
        },
        unreadCount: 0,
        context: {
          type: "support",
          title: "Support Technique"
        },
        updatedAt: "2024-01-15T09:15:00Z"
      },
      {
        id: "3",
        participants: [
          { id: "user1", name: "Marie Dubois", type: "user" },
          { id: "pro2", name: "Artisan Électricité", type: "pro" }
        ],
        lastMessage: {
          content: "Quand souhaitez-vous que j'intervienne ?",
          timestamp: "2024-01-14T16:45:00Z",
          authorId: "user1"
        },
        unreadCount: 1,
        context: {
          type: "service",
          title: "Réparation électrique"
        },
        updatedAt: "2024-01-14T16:45:00Z"
      }
    ]
    setConversations(mockConversations)
  }, [])

  const filteredConversations = conversations.filter(conv =>
    conv.participants.some(p =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) ||
    conv.context.title.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getContextBadge = (type: string) => {
    const config = {
      listing: { label: "Immobilier", variant: "default" as const },
      service: { label: "Service", variant: "secondary" as const },
      product: { label: "Produit", variant: "outline" as const },
      support: { label: "Support", variant: "destructive" as const }
    }
    const conf = config[type as keyof typeof config] || config.support
    return <Badge variant={conf.variant} className="text-xs">{conf.label}</Badge>
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    if (diff < 3600000) return `${Math.floor(diff / 60000)}min`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`
    return date.toLocaleDateString()
  }

  return (
    <ScrollArea className="flex-1">
      <div className="space-y-1 p-2">
        {filteredConversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`p-3 rounded-lg cursor-pointer transition-colors ${
              selectedConversation === conversation.id
                ? "bg-accent"
                : "hover:bg-accent/50"
            } ${conversation.unreadCount > 0 ? "bg-accent/20" : ""}`}
            onClick={() => onSelectConversation(conversation.id)}
          >
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={conversation.participants[1]?.avatar} />
                <AvatarFallback>
                  {conversation.participants[1]?.name
                    .split(" ")
                    .map(n => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">
                      {conversation.participants[1]?.name}
                    </span>
                    {getContextBadge(conversation.context.type)}
                  </div>
                  <div className="flex items-center gap-2">
                    {mounted && (
                      <span className="text-xs text-muted-foreground">
                        {formatTime(conversation.updatedAt)}
                      </span>
                    )}
                    {conversation.unreadCount > 0 && (
                      <Badge variant="default" className="h-5 w-5 p-0 flex items-center justify-center text-xs">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-1">
                  {conversation.lastMessage.content}
                </p>

                <p className="text-xs text-muted-foreground mt-1">
                  {conversation.context.title}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}
