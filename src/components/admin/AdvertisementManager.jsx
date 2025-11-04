import React, { useState, useEffect } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  BarChart3, 
  Search,
  Filter,
  Upload,
  Calendar,
  Link,
  Image as ImageIcon,
  RefreshCw
} from 'lucide-react'
import { Textarea } from "@/components/ui/textarea"
import { advertisementsAPI } from '@/lib/api'

const AdvertisementManager = () => {
  const { toast } = useToast()
  const [advertisements, setAdvertisements] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedAd, setSelectedAd] = useState(null)
  const [filters, setFilters] = useState({
    status: 'all',
    position: 'all',
    search: ''
  })

  // Formulaire
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetUrl: '',
    position: 'header',
    type: 'banner',
    status: 'active',
    startDate: '',
    endDate: '',
    priority: 1,
    image: null
  })
  const [imagePreview, setImagePreview] = useState('')

  // Charger les publicités
  const loadAdvertisements = async () => {
    try {
      setLoading(true)
      
      const params = {}
      if (filters.status !== 'all') params.status = filters.status
      if (filters.position !== 'all') params.position = filters.position

      const response = await advertisementsAPI.getAdvertisements(params)
      
      if (response.data.success) {
        setAdvertisements(response.data.advertisements || [])
      } else {
        throw new Error(response.data.message || 'Erreur lors du chargement')
      }
    } catch (error) {
      console.error('Erreur chargement publicités:', error)
      const errorMessage = error.response?.data?.message || error.message || "Impossible de charger les publicités"
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      })
      setAdvertisements([])
    } finally {
      setLoading(false)
    }
  }

  // Charger les statistiques
  const loadStats = async () => {
    try {
      const response = await advertisementsAPI.getStats()
      if (response.data.success) {
        setStats(response.data.stats)
      }
    } catch (error) {
      console.error('Erreur chargement statistiques:', error)
      // Ne pas afficher de toast pour éviter le spam
    }
  }

  useEffect(() => {
    loadAdvertisements()
    loadStats()
  }, [filters])

  // Gestion du formulaire
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({ ...prev, image: file }))
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      targetUrl: '',
      position: 'header',
      type: 'banner',
      status: 'active',
      startDate: '',
      endDate: '',
      priority: 1,
      image: null
    })
    setImagePreview('')
  }

  // Créer une publicité
  const handleCreate = async (e) => {
    e.preventDefault()
    try {
      const formDataToSend = new FormData()
      
      // Ajouter tous les champs au FormData
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          if (key === 'image' && formData[key]) {
            formDataToSend.append('image', formData[key])
          } else {
            formDataToSend.append(key, formData[key])
          }
        }
      })

      const response = await advertisementsAPI.createAdvertisement(formDataToSend)

      if (response.data.success) {
        toast({
          title: "Succès",
          description: "Publicité créée avec succès"
        })
        setIsCreateDialogOpen(false)
        resetForm()
        loadAdvertisements()
        loadStats()
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      console.error('Erreur création publicité:', error)
      const errorMessage = error.response?.data?.message || error.message || "Erreur lors de la création"
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      })
    }
  }

  // Modifier une publicité
  const handleEdit = async (e) => {
    e.preventDefault()
    try {
      const formDataToSend = new FormData()
      
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '') {
          if (key === 'image' && formData[key]) {
            formDataToSend.append('image', formData[key])
          } else {
            formDataToSend.append(key, formData[key])
          }
        }
      })

      const response = await advertisementsAPI.updateAdvertisement(selectedAd.id, formDataToSend)

      if (response.data.success) {
        toast({
          title: "Succès",
          description: "Publicité modifiée avec succès"
        })
        setIsEditDialogOpen(false)
        setSelectedAd(null)
        resetForm()
        loadAdvertisements()
        loadStats()
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      console.error('Erreur modification publicité:', error)
      const errorMessage = error.response?.data?.message || error.message || "Erreur lors de la modification"
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      })
    }
  }

  // Supprimer une publicité
  const handleDelete = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette publicité ?')) return

    try {
      const response = await advertisementsAPI.deleteAdvertisement(id)

      if (response.data.success) {
        toast({
          title: "Succès",
          description: "Publicité supprimée avec succès"
        })
        loadAdvertisements()
        loadStats()
      } else {
        throw new Error(response.data.message)
      }
    } catch (error) {
      console.error('Erreur suppression publicité:', error)
      const errorMessage = error.response?.data?.message || error.message || "Erreur lors de la suppression"
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      })
    }
  }

  // Ouvrir le modal d'édition
  const openEditDialog = (ad) => {
    setSelectedAd(ad)
    setFormData({
      title: ad.title,
      description: ad.description || '',
      targetUrl: ad.targetUrl || '',
      position: ad.position,
      type: ad.type,
      status: ad.status,
      startDate: ad.startDate ? ad.startDate.split('T')[0] : '',
      endDate: ad.endDate ? ad.endDate.split('T')[0] : '',
      priority: ad.priority,
      image: null
    })
    setImagePreview(ad.imageUrl)
    setIsEditDialogOpen(true)
  }

  const getStatusBadge = (status) => {
    const variants = {
      active: 'default',
      inactive: 'secondary',
      scheduled: 'outline'
    }
    const labels = {
      active: 'Actif',
      inactive: 'Inactif',
      scheduled: 'Planifié'
    }
    return <Badge variant={variants[status]}>{labels[status]}</Badge>
  }

  const getPositionBadge = (position) => {
    const labels = {
      header: 'En-tête',
      sidebar: 'Autres Pages',
      homepage: 'Page d\'accueil',
      footer: 'Pied de page'
    }
    return <Badge variant="outline">{labels[position] || position}</Badge>
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Publicités</h1>
          <p className="text-muted-foreground">
            Créez et gérez les publicités affichées sur votre site
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={loadAdvertisements}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Nouvelle Publicité
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Créer une nouvelle publicité</DialogTitle>
                <DialogDescription>
                  Remplissez les informations pour créer une nouvelle publicité
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titre *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position *</Label>
                    <Select 
                      value={formData.position} 
                      onValueChange={(value) => handleInputChange('position', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="header">En-tête</SelectItem>
                        <SelectItem value="sidebar">Autres Pages</SelectItem>
                        <SelectItem value="homepage">Page d'accueil</SelectItem>
                        <SelectItem value="footer">Pied de page</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="targetUrl">URL de destination</Label>
                  <Input
                    id="targetUrl"
                    type="url"
                    value={formData.targetUrl}
                    onChange={(e) => handleInputChange('targetUrl', e.target.value)}
                    placeholder="https://example.com"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select 
                      value={formData.type} 
                      onValueChange={(value) => handleInputChange('type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="banner">Bannière</SelectItem>
                        <SelectItem value="popup">Popup</SelectItem>
                        <SelectItem value="video">Vidéo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Statut</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value) => handleInputChange('status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Actif</SelectItem>
                        <SelectItem value="inactive">Inactif</SelectItem>
                        <SelectItem value="scheduled">Planifié</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="priority">Priorité</Label>
                    <Input
                      id="priority"
                      type="number"
                      min="1"
                      max="10"
                      value={formData.priority}
                      onChange={(e) => handleInputChange('priority', parseInt(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="startDate">Date de début</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endDate">Date de fin</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Image *</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <Label htmlFor="image" className="cursor-pointer">
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          Cliquez pour uploader une image
                        </span>
                        <span className="text-xs text-muted-foreground">
                          PNG, JPG, WEBP jusqu'à 5MB
                        </span>
                      </div>
                    </Label>
                  </div>
                  {imagePreview && (
                    <div className="mt-2">
                      <img 
                        src={imagePreview} 
                        alt="Aperçu" 
                        className="max-h-32 rounded-lg object-cover"
                      />
                    </div>
                  )}
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Annuler
                  </Button>
                  <Button type="submit" disabled={loading}>
                    Créer la publicité
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* État de connexion */}
      <Card className={`border-l-4 ${advertisements.length > 0 ? 'border-l-green-500' : loading ? 'border-l-blue-500' : 'border-l-amber-500'}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">
                {loading ? '🔄 Chargement...' : advertisements.length > 0 ? '✅ Connecté' : '⚠️ Aucune donnée'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {loading ? 'Connexion à l\'API...' : 
                 advertisements.length > 0 ? `${advertisements.length} publicité(s) chargée(s)` : 
                 'Aucune publicité trouvée'}
              </p>
            </div>
            {loading && (
              <RefreshCw className="w-5 h-5 animate-spin text-blue-500" />
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Publicités</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                {stats.active} actives
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Clics Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalClicks}</div>
              <p className="text-xs text-muted-foreground">
                Taux de clics: {stats.clickThroughRate}%
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Impressions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalImpressions}</div>
              <p className="text-xs text-muted-foreground">
                Affichages total
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {stats.clickThroughRate}%
              </div>
              <p className="text-xs text-muted-foreground">
                Taux de conversion
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtres */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Rechercher une publicité..."
                  className="pl-10"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select 
                value={filters.status} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="w-32">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous statuts</SelectItem>
                  <SelectItem value="active">Actif</SelectItem>
                  <SelectItem value="inactive">Inactif</SelectItem>
                  <SelectItem value="scheduled">Planifié</SelectItem>
                </SelectContent>
              </Select>
              <Select 
                value={filters.position} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, position: value }))}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes positions</SelectItem>
                  <SelectItem value="header">En-tête</SelectItem>
                  <SelectItem value="sidebar">Autre Page</SelectItem>
                  <SelectItem value="homepage">Page d'accueil</SelectItem>
                  <SelectItem value="footer">Pied de page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des publicités */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Publicités</CardTitle>
          <CardDescription>
            {advertisements.length} publicité{advertisements.length > 1 ? 's' : ''} trouvée{advertisements.length > 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-2 text-muted-foreground">Chargement...</p>
            </div>
          ) : advertisements.length === 0 ? (
            <div className="text-center py-8">
              <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune publicité</h3>
              <p className="text-muted-foreground mb-4">
                Commencez par créer votre première publicité
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Créer une publicité
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Titre</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Clics</TableHead>
                    <TableHead>Impressions</TableHead>
                    <TableHead>Créé le</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {advertisements.map((ad) => (
                    <TableRow key={ad.id}>
                      <TableCell>
                        <img 
                          src={ad.imageUrl} 
                          alt={ad.title}
                          className="w-12 h-12 rounded object-cover"
                        />
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{ad.title}</div>
                          {ad.targetUrl && (
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <Link className="w-3 h-3" />
                              {ad.targetUrl}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{getPositionBadge(ad.position)}</TableCell>
                      <TableCell>{getStatusBadge(ad.status)}</TableCell>
                      <TableCell>
                        <div className="font-medium">{ad.clicks}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{ad.impressions}</div>
                      </TableCell>
                      <TableCell>
                        {new Date(ad.createdAt).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(ad)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(ad.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal d'édition */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Modifier la publicité</DialogTitle>
            <DialogDescription>
              Modifiez les informations de la publicité
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Titre *</Label>
                <Input
                  id="edit-title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-position">Position *</Label>
                <Select 
                  value={formData.position} 
                  onValueChange={(value) => handleInputChange('position', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="header">En-tête</SelectItem>
                    <SelectItem value="sidebar">Sidebar</SelectItem>
                    <SelectItem value="homepage">Page d'accueil</SelectItem>
                    <SelectItem value="footer">Pied de page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-targetUrl">URL de destination</Label>
              <Input
                id="edit-targetUrl"
                type="url"
                value={formData.targetUrl}
                onChange={(e) => handleInputChange('targetUrl', e.target.value)}
                placeholder="https://example.com"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-type">Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => handleInputChange('type', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="banner">Bannière</SelectItem>
                    <SelectItem value="popup">Popup</SelectItem>
                    <SelectItem value="video">Vidéo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Statut</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                    <SelectItem value="scheduled">Planifié</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-priority">Priorité</Label>
                <Input
                  id="edit-priority"
                  type="number"
                  min="1"
                  max="10"
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', parseInt(e.target.value))}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-startDate">Date de début</Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-endDate">Date de fin</Label>
                <Input
                  id="edit-endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange('endDate', e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-image">Image</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Input
                  id="edit-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Label htmlFor="edit-image" className="cursor-pointer">
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Cliquez pour changer l'image
                    </span>
                    <span className="text-xs text-muted-foreground">
                      PNG, JPG, WEBP jusqu'à 5MB
                    </span>
                  </div>
                </Label>
              </div>
              {imagePreview && (
                <div className="mt-2">
                  <img 
                    src={imagePreview} 
                    alt="Aperçu" 
                    className="max-h-32 rounded-lg object-cover"
                  />
                </div>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={loading}>
                Modifier la publicité
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdvertisementManager;