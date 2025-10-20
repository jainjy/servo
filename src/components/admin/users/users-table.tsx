// components/admin/users/users-table.tsx
import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { UserModal } from "./user-modal"
import { 
  Search, 
  Mail, 
  Phone, 
  Ban, 
  CheckCircle, 
  Edit, 
  Trash2, 
  Building2, 
  Package,
  Home,
  FileText,
  MapPin
} from "lucide-react"
import api from "@/lib/api"

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
      alert("Une erreur est survenue lors de la suppression");
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
      <Card className="bg-card border-border">
        <div className="p-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher par nom, email, entreprise ou ville..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-input"
              />
            </div>
            <Button variant="outline" className="border-border bg-transparent">
              Filtres
            </Button>
          </div>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">Chargement des utilisateurs...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredUsers.map((user) => (
                <Card key={user.id} className="border-border bg-card p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {getInitials(user)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        {user.companyName && (
                          <div className="flex items-center gap-1 mt-1">
                            <Building2 className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">{user.companyName}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge variant="secondary" className={statusColors[user.status as keyof typeof statusColors]}>
                        {user.status === "active" ? "Actif" : "Inactif"}
                      </Badge>
                      <Badge variant="secondary" className={roleColors[user.role as keyof typeof roleColors]}>
                        {user.role === 'professional' ? 'Pro' : user.role}
                      </Badge>
                    </div>
                  </div>

                  {/* Informations de contact */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{user.email}</span>
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>{user.phone}</span>
                      </div>
                    )}
                    {user.city && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{user.city}</span>
                      </div>
                    )}
                  </div>

                  {/* Métiers et services pour les professionnels */}
                  {user.role === 'professional' && (
                    <div className="space-y-2 mb-4">
                      {user.metiers.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Métiers:</p>
                          <div className="flex flex-wrap gap-1">
                            {user.metiers.slice(0, 3).map((metier: any) => (
                              <Badge key={metier.id} variant="outline" className="text-xs">
                                {metier.libelle}
                              </Badge>
                            ))}
                            {user.metiers.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{user.metiers.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Statistiques */}
                  <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                    <div className="flex flex-col items-center">
                      <Package className="h-4 w-4 text-muted-foreground mb-1" />
                      <span className="text-sm font-medium">{user.productsCount}</span>
                      <span className="text-xs text-muted-foreground">Produits</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Home className="h-4 w-4 text-muted-foreground mb-1" />
                      <span className="text-sm font-medium">{user.propertiesCount}</span>
                      <span className="text-xs text-muted-foreground">Biens</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <FileText className="h-4 w-4 text-muted-foreground mb-1" />
                      <span className="text-sm font-medium">{user.articlesCount}</span>
                      <span className="text-xs text-muted-foreground">Articles</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2 pt-4 border-t border-border">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(user)}
                      className="flex-1 border-border hover:bg-accent"
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Modifier
                    </Button>
                    {user.status === "inactive" ? (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleActivate(user)}
                        className="flex-1 bg-success hover:bg-success/90"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Activer
                      </Button>
                    ) : (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleSuspend(user)}
                        className="flex-1"
                      >
                        <Ban className="h-4 w-4 mr-2" />
                        Suspendre
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
          {filteredUsers.length === 0 && !loading && (
            <div className="text-center py-8 text-muted-foreground">
              Aucun utilisateur trouvé
            </div>
          )}
        </div>
      </Card>
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