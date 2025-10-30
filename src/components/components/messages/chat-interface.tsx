// components/messages/chat-interface.tsx


import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { 
  Send, 
  ArrowLeft, 
  MoreVertical, 
  Flag, 
  Ban, 
  Info, 
  Paperclip, 
  Image, 
  FileText,
  X,
  Smile
} from "lucide-react"
import { toast } from "sonner"

interface Message {
  id: string
  content: string
  authorId: string
  timestamp: string
  type: 'text' | 'system' | 'image' | 'file'
  fileUrl?: string
  fileName?: string
  fileSize?: string
}

interface ChatInterfaceProps {
  conversationId: string
  onBack: () => void
}

export function ChatInterface({ conversationId, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [showMenu, setShowMenu] = useState(false)
  const [showFileMenu, setShowFileMenu] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [currentUser] = useState({ id: "user1", name: "Vous", type: "user" as const })
  
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageInputRef = useRef<HTMLInputElement>(null)

  // Données mockées - à remplacer par l'API
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        id: "1",
        content: "Bonjour, je suis intéressé par votre annonce",
        authorId: "user1",
        timestamp: "2024-01-15T10:00:00Z",
        type: 'text'
      },
      {
        id: "2",
        content: "Bonjour ! Je suis disponible pour une visite demain",
        authorId: "pro1",
        timestamp: "2024-01-15T10:05:00Z",
        type: 'text'
      },
      {
        id: "3",
        content: "Voici quelques photos du bien",
        authorId: "pro1",
        timestamp: "2024-01-15T10:07:00Z",
        type: 'image',
        fileUrl: "/placeholder.jpg",
        fileName: "appartement.jpg"
      },
      {
        id: "4",
        content: "Et le contrat à consulter",
        authorId: "pro1",
        timestamp: "2024-01-15T10:08:00Z",
        type: 'file',
        fileUrl: "/contrat.pdf",
        fileName: "contrat_location.pdf",
        fileSize: "2.4 MB"
      },
      {
        id: "5",
        content: "Parfait, à quelle heure ?",
        authorId: "user1",
        timestamp: "2024-01-15T10:10:00Z",
        type: 'text'
      },
      {
        id: "6",
        content: "Conversation liée à l'annonce: Appartement T3 Centre Ville",
        authorId: "system",
        timestamp: "2024-01-15T10:00:00Z",
        type: 'system'
      }
    ]
    setMessages(mockMessages)
  }, [conversationId])

  // Fermer les menus quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    // Scroll vers le bas quand de nouveaux messages arrivent
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = () => {
    if (!newMessage.trim() && selectedFiles.length === 0) return

    if (selectedFiles.length > 0) {
      // Envoyer les fichiers d'abord
      handleSendFiles()
    } else if (newMessage.trim()) {
      // Envoyer le message texte
      const message: Message = {
        id: Date.now().toString(),
        content: newMessage,
        authorId: currentUser.id,
        timestamp: new Date().toISOString(),
        type: 'text'
      }

      setMessages(prev => [...prev, message])
      setNewMessage("")
    }
  }

  const handleSendFiles = async () => {
    if (selectedFiles.length === 0) return

    setIsUploading(true)

    try {
      // Simulation d'upload
      for (const file of selectedFiles) {
        const isImage = file.type.startsWith('image/')
        
        const message: Message = {
          id: Date.now().toString() + Math.random(),
          content: isImage ? "Photo envoyée" : "Fichier envoyé",
          authorId: currentUser.id,
          timestamp: new Date().toISOString(),
          type: isImage ? 'image' : 'file',
          fileName: file.name,
          fileSize: formatFileSize(file.size)
        }

        setMessages(prev => [...prev, message])
        
        // Simuler un délai d'upload
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi des fichiers:", error)
      toast.error("Erreur lors de l'envoi des fichiers");
    } finally {
      setSelectedFiles([])
      setIsUploading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    if (files.length > 0) {
      setSelectedFiles(prev => [...prev, ...files])
      setShowFileMenu(false)
    }
  }

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const imageFiles = files.filter(file => file.type.startsWith('image/'))
    
    if (imageFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...imageFiles])
      setShowFileMenu(false)
    } else {
      toast.error("Veuillez sélectionner une image valide");
    }
  }

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const isCurrentUser = (authorId: string) => authorId === currentUser.id

  const handleReport = () => {
    setShowMenu(false)
    toast.info("Signalement envoyé au support");
  }

  const handleBlockUser = () => {
    setShowMenu(false)
    if (confirm("Êtes-vous sûr de vouloir bloquer cet utilisateur ?")) {
      toast.info("Utilisateur bloqué");
    }
  }

  const handleConversationDetails = () => {
    setShowMenu(false)
    toast.info("Détails de la conversation");
  }

  const toggleMenu = () => {
    setShowMenu(!showMenu)
  }

  const renderFilePreview = () => {
    if (selectedFiles.length === 0) return null

    return (
      <div className="flex flex-wrap gap-2 mb-3 p-3 bg-muted rounded-lg">
        {selectedFiles.map((file, index) => (
          <div key={index} className="flex items-center gap-2 bg-white rounded-lg p-2 border">
            {file.type.startsWith('image/') ? (
              <Image className="h-8 w-8 text-blue-500" />
            ) : (
              <FileText className="h-8 w-8 text-gray-500" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate max-w-[150px]">
                {file.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(file.size)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => removeFile(index)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </div>
    )
  }

  const renderMessageContent = (message: Message) => {
    switch (message.type) {
      case 'image':
        return (
          <div className="space-y-2">
            <div className="rounded-lg overflow-hidden border">
              <img 
                src={message.fileUrl || "/placeholder.jpg"} 
                alt={message.fileName || "Image"}
                className="max-w-[300px] max-h-[300px] object-cover"
              />
            </div>
            <p className="text-sm text-muted-foreground">{message.content}</p>
          </div>
        )
      
      case 'file':
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-accent rounded-lg border">
              <FileText className="h-8 w-8 text-blue-500" />
              <div className="flex-1">
                <p className="text-sm font-medium">{message.fileName}</p>
                <p className="text-xs text-muted-foreground">
                  {message.fileSize} • {message.content}
                </p>
              </div>
              <Button variant="outline" size="sm">
                Télécharger
              </Button>
            </div>
          </div>
        )
      
      case 'system':
        return (
          <div className="text-center">
            <Badge variant="outline" className="text-xs font-normal">
              {message.content}
            </Badge>
          </div>
        )
      
      default:
        return <p className="text-sm">{message.content}</p>
    }
  }

  return (
    <div className="flex flex-col h-auto w-full overflow-y-auto ">
      {/* En-tête du chat */}
      <div className="flex items-center justify-between p-4 border-b relative">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onBack} className="md:hidden">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Avatar className="h-8 w-8">
            <AvatarFallback>IP</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">ImmoPro</h3>
              <Badge variant="secondary">Pro</Badge>
            </div>
            <p className="text-xs text-muted-foreground">En ligne</p>
          </div>
        </div>
        
        {/* Menu custom */}
        <div className="relative" ref={menuRef}>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleMenu}
            className="relative"
          >
            <MoreVertical className="h-4 w-4" />
          </Button>

          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 rounded-md border bg-white shadow-lg z-50">
              <div className="p-1">
                <button
                  onClick={handleConversationDetails}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
                >
                  <Info className="h-4 w-4" />
                  Détails de la conversation
                </button>
                
                <button
                  onClick={handleReport}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
                >
                  <Flag className="h-4 w-4" />
                  Signaler un problème
                </button>
                
                <div className="border-t my-1"></div>
                
                <button
                  onClick={handleBlockUser}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 rounded-md hover:bg-red-50 transition-colors"
                >
                  <Ban className="h-4 w-4" />
                  Bloquer l'utilisateur
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Zone des messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${isCurrentUser(message.authorId) ? 'justify-end' : 'justify-start'}`}
            >
              {message.type === 'system' ? (
                <div className="w-full flex justify-center">
                  {renderMessageContent(message)}
                </div>
              ) : (
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    isCurrentUser(message.authorId)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-accent'
                  }`}
                >
                  {renderMessageContent(message)}
                  <p
                    className={`text-xs mt-2 ${
                      isCurrentUser(message.authorId)
                        ? 'text-primary-foreground/70'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {formatMessageTime(message.timestamp)}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Prévisualisation des fichiers */}
      {renderFilePreview()}

      {/* Zone de saisie */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          {/* Bouton pièce jointe */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowFileMenu(!showFileMenu)}
              disabled={isUploading}
            >
              <Paperclip className="h-4 w-4" />
            </Button>

            {showFileMenu && (
              <div className="absolute bottom-full left-0 mb-2 w-48 rounded-md border bg-white shadow-lg z-50">
                <div className="p-2">
                  <button
                    onClick={() => imageInputRef.current?.click()}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <Image className="h-4 w-4" />
                    Envoyer une image
                  </button>
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <FileText className="h-4 w-4" />
                    Envoyer un fichier
                  </button>
                </div>
              </div>
            )}

            {/* Inputs cachés pour les fichiers */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              multiple
              accept="*/*"
              className="hidden"
            />
            <input
              type="file"
              ref={imageInputRef}
              onChange={handleImageSelect}
              multiple
              accept="image/*"
              className="hidden"
            />
          </div>

          {/* Champ de texte */}
          <Input
            placeholder="Tapez votre message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1"
            disabled={isUploading}
          />

          {/* Bouton d'envoi */}
          <Button 
            onClick={handleSendMessage} 
            disabled={(!newMessage.trim() && selectedFiles.length === 0) || isUploading}
            size="icon"
          >
            {isUploading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Indicateur d'upload */}
        {isUploading && (
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
            Envoi en cours...
          </div>
        )}
      </div>
    </div>
  )
}