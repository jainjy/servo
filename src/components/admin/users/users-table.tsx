// components/admin/users/users-table.tsx
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { UserModal } from "./user-modal"
import LoadingSpinner from "@/components/Loading/LoadingSpinner";
import { 
  Search, 
  Phone, 
  Ban, 
  CheckCircle, 
  Edit, 
  Building2, 
  Package,
  Home,
  FileText,
  MapPin,
  Users,
  ChevronDown
} from "lucide-react"
import api from "@/lib/api"
import { toast } from "sonner"

interface User {
  id: string
  firstName: string | null
  lastName: string | null
  email: string
  phone: string | null
  role: string
  status: string
  companyName: string | null
  demandType: string | null
  address: string | null
  city: string | null
  metiers: any[]
  services: any[]
  productsCount: number
  propertiesCount: number
  articlesCount: number
  createdAt: string
  avatar?: string | null
  userType?: string | null
}

export function UsersTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | undefined>()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await api.get('/users')
      setUsers(response.data)
    } catch (error) {
      console.error("Error fetching users:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      (user.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (user.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false) ||
      (user.city?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false)
  )

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setEditModalOpen(true)
  }

  const handleActivate = async (user: User) => {
    try {
      await api.patch(`/users/${user.id}`, { status: "active" })
      fetchUsers() // Recharger la liste
    } catch (error) {
      console.error("Error activating user:", error)
    }
  }

  const handleSuspend = async (user: User) => {
    try {
      await api.patch(`/users/${user.id}`, { status: "inactive" })
      fetchUsers() // Recharger la liste
    } catch (error) {
      console.error("Error suspending user:", error)
    }
  }

  const handleDelete = async (user: User) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      return;
    }

    try {
      await api.delete(`/users/${user.id}`);
      fetchUsers(); // Recharger la liste
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Une erreur est survenue lors de la suppression");
    }
  };

  const handleModalSuccess = () => {
    fetchUsers() // Recharger la liste après création/modification
  }

  const getInitials = (user: User) => {
    return `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase()
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Utilisateurs</h1>
                <p className="text-sm text-muted-foreground">{filteredUsers.length} utilisateur{filteredUsers.length !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <Card className="bg-card border-border p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Rechercher par nom, email, entreprise..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background border-input text-sm sm:text-base"
                />
              </div>
              <Button variant="outline" className="border-border bg-transparent w-full sm:w-auto whitespace-nowrap">
                <ChevronDown className="h-4 w-4 mr-2" />
                Filtres
              </Button>
            </div>
          </Card>
        </div>

        {/* Users Grid */}
        {loading ? (
          <LoadingSpinner text="Chargement des utilisateurs..." />
        ) : filteredUsers.length === 0 ? (
          <Card className="bg-card border-border p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground text-lg">Aucun utilisateur trouvé</p>
            <p className="text-sm text-muted-foreground mt-2">Essayez de modifier vos critères de recherche</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredUsers.map((user) => (
              <Card 
                key={user.id} 
                className="border-border bg-card overflow-hidden hover:shadow-xl hover:border-primary/50 transition-all duration-300 flex flex-col"
              >
                {/* Card Header with Status Badges */}
                <div className="p-4 sm:p-6 pb-0">
                  <div className="flex items-start justify-between mb-4 gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex gap-2 flex-wrap">
                        <Badge 
                          className={`${statusColors[user.status as keyof typeof statusColors]} text-xs sm:text-sm`}
                        >
                          {user.status === "active" ? "✓ Actif" : "○ Inactif"}
                        </Badge>
                        <Badge 
                          className={`${roleColors[user.role as keyof typeof roleColors]} text-xs sm:text-sm`}
                        >
                          {user.role === 'professional' ? 'Pro' : user.role === 'admin' ? 'Admin' : 'Utilisateur'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Avatar and Name */}
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-14 w-14 sm:h-16 sm:w-16 overflow-hidden flex-shrink-0 ring-2 ring-primary/20">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={`${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || user.email}
                          className="h-full w-full object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = "/placeholder-user.jpg"
                          }}
                        />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/10 text-primary font-bold text-sm sm:text-base">
                          {getInitials(user)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">
                        {user.firstName} {user.lastName}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground truncate">{user.email}</p>
                      {user.companyName && (
                        <div className="flex items-center gap-1 mt-1">
                          <Building2 className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                          <span className="text-xs text-muted-foreground truncate">{user.companyName}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="px-4 sm:px-6 py-3 space-y-2 border-t border-border/50">
                  {user.phone && (
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                      <Phone className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{user.phone}</span>
                    </div>
                  )}
                  {user.city && (
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{user.city}</span>
                    </div>
                  )}
                </div>

                {/* Métiers for Professionals */}
                {user.role === 'professional' && user.metiers.length > 0 && (
                  <div className="px-4 sm:px-6 py-3 border-t border-border/50">
                    <p className="text-xs font-medium text-muted-foreground mb-2">Métiers:</p>
                    <div className="flex flex-wrap gap-1">
                      {user.metiers.slice(0, 2).map((metier: any) => (
                        <Badge key={metier.id} variant="outline" className="text-xs">
                          {metier.libelle}
                        </Badge>
                      ))}
                      {user.metiers.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{user.metiers.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Statistics */}
                <div className="px-4 sm:px-6 py-3 border-t border-border/50">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="flex flex-col items-center p-2 rounded-lg bg-background/50">
                      <Package className="h-4 w-4 text-muted-foreground mb-1" />
                      <span className="text-sm font-semibold text-foreground">{user.productsCount}</span>
                      <span className="text-xs text-muted-foreground">Produits</span>
                    </div>
                    <div className="flex flex-col items-center p-2 rounded-lg bg-background/50">
                      <Home className="h-4 w-4 text-muted-foreground mb-1" />
                      <span className="text-sm font-semibold text-foreground">{user.propertiesCount}</span>
                      <span className="text-xs text-muted-foreground">Biens</span>
                    </div>
                    <div className="flex flex-col items-center p-2 rounded-lg bg-background/50">
                      <FileText className="h-4 w-4 text-muted-foreground mb-1" />
                      <span className="text-sm font-semibold text-foreground">{user.articlesCount}</span>
                      <span className="text-xs text-muted-foreground">Articles</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-4 sm:px-6 py-4 mt-auto border-t border-border/50 space-y-2 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(user)}
                    className="border-border hover:bg-accent w-full text-xs sm:text-sm"
                  >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Modifier</span>
                    <span className="sm:hidden">Éditer</span>
                  </Button>
                  {user.status === "inactive" ? (
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleActivate(user)}
                      className="bg-green-600 hover:bg-green-700 w-full text-xs sm:text-sm"
                    >
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Activer</span>
                      <span className="sm:hidden">Actif</span>
                    </Button>
                  ) : (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleSuspend(user)}
                      className="w-full text-xs sm:text-sm"
                    >
                      <Ban className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="hidden sm:inline">Suspendre</span>
                      <span className="sm:hidden">Susp.</span>
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      <UserModal 
        open={editModalOpen} 
        onOpenChange={setEditModalOpen} 
        user={selectedUser} 
        mode="edit"
        onSuccess={handleModalSuccess}
      />
    </>
  )
}

const roleColors = {
  user: "bg-blue-100 text-blue-800",
  professional: "bg-green-100 text-green-800",
  admin: "bg-red-100 text-red-800",
}

const statusColors = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
}