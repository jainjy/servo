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
  RefreshCw,
  ExternalLink,
  Target,
  TrendingUp,
  Clock,
  AlertCircle,
  Home,
  Video,
  Play
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
    image: null,
    video: null
  })
  const [imagePreview, setImagePreview] = useState('')
  const [videoPreview, setVideoPreview] = useState('')
  const [dateError, setDateError] = useState('')

  // Charger les publicités
  const loadAdvertisements = async () => {
    try {
      setLoading(true);
      
      const params = {};
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.position !== 'all') params.position = filters.position;
  
      const response = await advertisementsAPI.getAdvertisements(params);
      
      // CORRECTION : Vérifier si response.data existe directement
      if (response.data && Array.isArray(response.data.advertisements)) {
        setAdvertisements(response.data.advertisements);
      } else if (response.data && response.data.success) {
        // Fallback pour l'ancienne structure
        setAdvertisements(response.data.advertisements || []);
      } else {
        setAdvertisements([]);
      }
    } catch (error) {
      console.error('Erreur chargement publicités:', error);
      const errorMessage = error.response?.data?.message || error.message || "Impossible de charger les publicités";
      toast({
        title: "Erreur",
        description: errorMessage,
        variant: "destructive"
      });
      setAdvertisements([]);
    } finally {
      setLoading(false);
    }
  };

  // Charger les statistiques
  const loadStats = async () => {
    try {
      const response = await advertisementsAPI.getStats()
      if (response.data.success) {
        setStats(response.data.stats)
      }
    } catch (error) {
      console.error('Erreur chargement statistiques:', error)
    }
  }

  useEffect(() => {
    loadAdvertisements()
    loadStats()
  }, [filters])

  // Validation des dates
  const validateDates = (startDate, endDate) => {
    if (!startDate && !endDate) {
      setDateError('')
      return true
    }

    if (startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      
      if (end < start) {
        setDateError('La date de fin ne peut pas être avant la date de début')
        return false
      }
    }

    setDateError('')
    return true
  }

  // Gestion du formulaire
  const handleInputChange = (field, value) => {
    const newFormData = { ...formData, [field]: value }
    setFormData(newFormData)

    // Réinitialiser les prévisualisations si le type change
    if (field === 'type') {
      if (value === 'video') {
        setImagePreview('')
        setFormData(prev => ({ ...prev, image: null }))
      } else {
        setVideoPreview('')
        setFormData(prev => ({ ...prev, video: null }))
      }
    }

    // Valider les dates quand elles changent
    if (field === 'startDate' || field === 'endDate') {
      validateDates(
        field === 'startDate' ? value : newFormData.startDate,
        field === 'endDate' ? value : newFormData.endDate
      )
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validation de la taille du fichier (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Erreur",
          description: "L'image ne doit pas dépasser 5MB",
          variant: "destructive"
        })
        return
      }
      
      setFormData(prev => ({ ...prev, image: file, video: null }))
      setImagePreview(URL.createObjectURL(file))
      setVideoPreview('')
    }
  }

  const handleVideoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validation de la taille du fichier (50MB max pour les vidéos)
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "Erreur",
          description: "La vidéo ne doit pas dépasser 50MB",
          variant: "destructive"
        })
        return
      }
      
      // Validation du type de fichier
      const videoTypes = ['video/mp4', 'video/webm', 'video/ogg']
      if (!videoTypes.includes(file.type)) {
        toast({
          title: "Erreur",
          description: "Format vidéo non supporté. Utilisez MP4, WebM ou OGG",
          variant: "destructive"
        })
        return
      }
      
      setFormData(prev => ({ ...prev, video: file, image: null }))
      setVideoPreview(URL.createObjectURL(file))
      setImagePreview('')
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
      image: null,
      video: null
    })
    setImagePreview('')
    setVideoPreview('')
    setDateError('')
  }

  // Créer une publicité - CORRIGÉ
  const handleCreate = async (e) => {
    e.preventDefault()
    
    // Validation des dates
    if (!validateDates(formData.startDate, formData.endDate)) {
      return
    }

    // Validation des champs requis selon le type
    if (!formData.title) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir le titre",
        variant: "destructive"
      })
      return
    }

    // Validation média selon le type
    if (formData.type === 'video' && !formData.video) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une vidéo pour les publicités vidéo",
        variant: "destructive"
      })
      return
    }

    if ((formData.type === 'banner' || formData.type === 'popup') && !formData.image) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une image pour les bannières et popups",
        variant: "destructive"
      })
      return
    }

    try {
      const formDataToSend = new FormData()
      
      // Ajouter tous les champs texte
      Object.keys(formData).forEach(key => {
        if (key !== 'image' && key !== 'video' && formData[key] !== null && formData[key] !== '') {
          formDataToSend.append(key, formData[key])
        }
      })

      // Ajouter le fichier approprié selon le type
      if (formData.type === 'video' && formData.video) {
        formDataToSend.append('video', formData.video)
      } else if ((formData.type === 'banner' || formData.type === 'popup') && formData.image) {
        formDataToSend.append('image', formData.image)
      }

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

  // Modifier une publicité - CORRIGÉ
  const handleEdit = async (e) => {
    e.preventDefault()
    
    // Validation des dates
    if (!validateDates(formData.startDate, formData.endDate)) {
      return
    }

    // Validation des champs requis selon le type
    if (!formData.title) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir le titre",
        variant: "destructive"
      })
      return
    }

    try {
      const formDataToSend = new FormData()
      
      // Ajouter tous les champs texte
      Object.keys(formData).forEach(key => {
        if (key !== 'image' && key !== 'video' && formData[key] !== null && formData[key] !== '') {
          formDataToSend.append(key, formData[key])
        }
      })

      // Ajouter le fichier approprié selon le type seulement si un nouveau fichier est fourni
      if (formData.type === 'video' && formData.video) {
        formDataToSend.append('video', formData.video)
      } else if ((formData.type === 'banner' || formData.type === 'popup') && formData.image) {
        formDataToSend.append('image', formData.image)
      }

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
      image: null,
      video: null
    })
    setImagePreview(ad.type === 'video' ? '' : ad.imageUrl)
    setVideoPreview(ad.type === 'video' ? ad.imageUrl : '')
    setIsEditDialogOpen(true)
  }

  // Obtenir le statut actuel basé sur les dates
  const getCurrentStatus = (ad) => {
    // Si le statut est 'inactive', retourner directement
    if (ad.status === 'inactive') return 'inactive'
    
    // Pour les statuts 'scheduled' stockés, les garder comme scheduled
    if (ad.status === 'scheduled') return 'scheduled'
    
    // Pour le statut 'active', vérifier les dates
    const now = new Date()
    const startDate = ad.startDate ? new Date(ad.startDate) : null
    const endDate = ad.endDate ? new Date(ad.endDate) : null

    if (startDate && now < startDate) return 'scheduled'
    if (endDate && now > endDate) return 'expired'
    
    return 'active'
  }

  const getStatusBadge = (ad) => {
    const currentStatus = getCurrentStatus(ad)
    const variants = {
      active: 'default',
      inactive: 'secondary',
      scheduled: 'outline',
      expired: 'destructive'
    }
    const labels = {
      active: 'Actif',
      inactive: 'Inactif',
      scheduled: 'Planifié',
      expired: 'Expiré'
    }
    return <Badge variant={variants[currentStatus]}>{labels[currentStatus]}</Badge>
  }

  const getPositionBadge = (position) => {
    const labels = {
      header: 'En-tête',
      sidebar: 'Barre latérale',
      homepage: 'Accueil',
      footer: 'Pied de page'
    }
    const icons = {
      header: <Target className="w-3 h-3 mr-1" />,
      sidebar: <BarChart3 className="w-3 h-3 mr-1" />,
      homepage: <Home className="w-3 h-3 mr-1" />,
      footer: <Clock className="w-3 h-3 mr-1" />
    }
    return (
      <Badge variant="outline" className="flex items-center">
        {icons[position]}
        {labels[position] || position}
      </Badge>
    )
  }

  const getTypeBadge = (type) => {
    const variants = {
      banner: 'default',
      popup: 'secondary',
      video: 'destructive'
    }
    const labels = {
      banner: 'Bannière',
      popup: 'Popup',
      video: 'Vidéo'
    }
    const icons = {
      banner: <ImageIcon className="w-3 h-3 mr-1" />,
      popup: <Eye className="w-3 h-3 mr-1" />,
      video: <Video className="w-3 h-3 mr-1" />
    }
    return (
      <Badge variant={variants[type]} className="flex items-center">
        {icons[type]}
        {labels[type]}
      </Badge>
    )
  }

  // Obtenir la date minimale pour la date de fin
  const getMinEndDate = () => {
    return formData.startDate || ''
  }

  // Formater l'URL pour l'affichage
  const formatUrl = (url) => {
    if (!url) return ''
    try {
      const urlObj = new URL(url)
      return urlObj.hostname + (urlObj.pathname !== '/' ? urlObj.pathname : '')
    } catch {
      return url
    }
  }

  // Filtrer les publicités selon les critères
  const filteredAdvertisements = advertisements.filter(ad => {
    const matchesSearch = filters.search === '' || 
      ad.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      (ad.description && ad.description.toLowerCase().includes(filters.search.toLowerCase()))
    
    const matchesStatus = filters.status === 'all' || getCurrentStatus(ad) === filters.status
    const matchesPosition = filters.position === 'all' || ad.position === filters.position
    
    return matchesSearch && matchesStatus && matchesPosition
  })

  return (
    <div className="space-y-6">
      {/* En-tête amélioré */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Gestion des Publicités
          </h1>
          <p className="text-muted-foreground mt-2">
            Créez et gérez les campagnes publicitaires de votre site
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
              <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4" />
                Nouvelle Publicité
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Créer une nouvelle publicité
                </DialogTitle>
                <DialogDescription>
                  Remplissez les informations pour créer une nouvelle campagne publicitaire
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-6">
                {/* Informations de base */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Informations de base
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="flex items-center gap-2">
                        Titre *
                        {formData.title && (
                          <Badge variant="outline" className="text-xs">
                            {formData.title.length}/50
                          </Badge>
                        )}
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="Nom de votre campagne"
                        maxLength={50}
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
                          <SelectItem value="sidebar">Barre latérale</SelectItem>
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
                      rows={2}
                      placeholder="Description de la publicité..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetUrl" className="flex items-center gap-2">
                      URL de destination
                      <ExternalLink className="w-3 h-3" />
                    </Label>
                    <Input
                      id="targetUrl"
                      type="url"
                      value={formData.targetUrl}
                      onChange={(e) => handleInputChange('targetUrl', e.target.value)}
                      placeholder="https://example.com/offre-speciale"
                    />
                  </div>
                </div>

                {/* Configuration */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Configuration
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Type de publicité</Label>
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
                      <Label htmlFor="priority">Priorité (1-10)</Label>
                      <Input
                        id="priority"
                        type="number"
                        min="1"
                        max="10"
                        value={formData.priority}
                        onChange={(e) => handleInputChange('priority', parseInt(e.target.value) || 1)}
                      />
                    </div>
                  </div>
                </div>

                {/* Planning */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Planning
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Date de début</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">Date de fin</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        min={getMinEndDate()}
                      />
                    </div>
                  </div>
                  
                  {dateError && (
                    <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                      <AlertCircle className="w-4 h-4" />
                      {dateError}
                    </div>
                  )}
                  
                  {(formData.startDate || formData.endDate) && !dateError && (
                    <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>
                          {formData.startDate && formData.endDate 
                            ? `Du ${new Date(formData.startDate).toLocaleDateString('fr-FR')} au ${new Date(formData.endDate).toLocaleDateString('fr-FR')}`
                            : formData.startDate 
                              ? `À partir du ${new Date(formData.startDate).toLocaleDateString('fr-FR')}`
                              : `Jusqu'au ${new Date(formData.endDate).toLocaleDateString('fr-FR')}`
                          }
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Média */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    {formData.type === 'video' ? (
                      <Video className="w-4 h-4" />
                    ) : (
                      <ImageIcon className="w-4 h-4" />
                    )}
                    {formData.type === 'video' ? 'Vidéo de la publicité' : 'Image de la publicité'}
                  </h3>
                  
                  <div className="space-y-2">
                    <Label htmlFor="media">
                      {formData.type === 'video' ? 'Vidéo *' : 'Image *'}
                    </Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                      <Input
                        id="media"
                        type="file"
                        accept={formData.type === 'video' ? "video/*" : "image/*"}
                        onChange={formData.type === 'video' ? handleVideoChange : handleImageChange}
                        className="hidden"
                      />
                      <Label htmlFor="media" className="cursor-pointer">
                        <div className="flex flex-col items-center gap-2">
                          {formData.type === 'video' ? (
                            <>
                              <Video className="w-8 h-8 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                Cliquez pour uploader une vidéo
                              </span>
                              <span className="text-xs text-muted-foreground">
                                MP4, WebM, OGG jusqu'à 50MB
                              </span>
                            </>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                Cliquez pour uploader une image
                              </span>
                              <span className="text-xs text-muted-foreground">
                                PNG, JPG, WEBP jusqu'à 5MB
                              </span>
                            </>
                          )}
                        </div>
                      </Label>
                    </div>
                    
                    {/* Aperçu */}
                    {imagePreview && formData.type !== 'video' && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Aperçu :</p>
                        <img 
                          src={imagePreview} 
                          alt="Aperçu" 
                          className="max-h-40 rounded-lg object-cover border"
                        />
                      </div>
                    )}
                    
                    {videoPreview && formData.type === 'video' && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2">Aperçu :</p>
                        <div className="relative max-h-40 rounded-lg border overflow-hidden">
                          <video 
                            src={videoPreview} 
                            className="w-full h-full object-cover"
                            controls
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <Play className="w-12 h-12 text-white" />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsCreateDialogOpen(false)
                      resetForm()
                    }}
                  >
                    Annuler
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={loading || !!dateError}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Création...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Créer la publicité
                      </>
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Cartes de statut */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{advertisements.length}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Actives</p>
                <p className="text-2xl font-bold">
                  {advertisements.filter(ad => getCurrentStatus(ad) === 'active').length}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Planifiées</p>
                <p className="text-2xl font-bold">
                  {advertisements.filter(ad => getCurrentStatus(ad) === 'scheduled').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expirées</p>
                <p className="text-2xl font-bold">
                  {advertisements.filter(ad => getCurrentStatus(ad) === 'expired').length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres améliorés */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Rechercher par titre, description..."
                  className="pl-10"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select 
                value={filters.status} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="active">Actives</SelectItem>
                  <SelectItem value="inactive">Inactives</SelectItem>
                  <SelectItem value="scheduled">Planifiées</SelectItem>
                  <SelectItem value="expired">Expirées</SelectItem>
                </SelectContent>
              </Select>
              <Select 
                value={filters.position} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, position: value }))}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes positions</SelectItem>
                  <SelectItem value="header">En-tête</SelectItem>
                  <SelectItem value="sidebar">Barre latérale</SelectItem>
                  <SelectItem value="homepage">Page d'accueil</SelectItem>
                  <SelectItem value="footer">Pied de page</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des publicités amélioré */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Campagnes Publicitaires
          </CardTitle>
          <CardDescription>
            {filteredAdvertisements.length} publicité{filteredAdvertisements.length > 1 ? 's' : ''} trouvée{filteredAdvertisements.length > 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-12 h-12 animate-spin text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">Chargement des publicités...</p>
            </div>
          ) : filteredAdvertisements.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Aucune publicité trouvée</h3>
              <p className="text-muted-foreground mb-6">
                {filters.status !== 'all' || filters.position !== 'all' || filters.search
                  ? "Aucune publicité ne correspond à vos critères de recherche"
                  : "Commencez par créer votre première campagne publicitaire"
                }
              </p>
              {(filters.status !== 'all' || filters.position !== 'all' || filters.search) ? (
                <Button 
                  variant="outline" 
                  onClick={() => setFilters({ status: 'all', position: 'all', search: '' })}
                >
                  Réinitialiser les filtres
                </Button>
              ) : (
                <Button onClick={() => setIsCreateDialogOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Créer une publicité
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Publicité</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Planning</TableHead>
                    <TableHead className="w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdvertisements.map((ad) => (
                    <TableRow key={ad.id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {ad.type === 'video' ? (
                            <div className="relative w-12 h-12 rounded-lg border overflow-hidden bg-muted flex items-center justify-center">
                              <Video className="w-6 h-6 text-muted-foreground" />
                              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                <Play className="w-4 h-4 text-white" />
                              </div>
                            </div>
                          ) : (
                            <img 
                              src={ad.imageUrl} 
                              alt={ad.title}
                              className="w-12 h-12 rounded-lg object-cover border"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold truncate flex items-center gap-2">
                              {ad.title}
                            </div>
                            {ad.description && (
                              <div className="text-sm text-muted-foreground truncate">
                                {ad.description}
                              </div>
                            )}
                            {ad.targetUrl && (
                              <div className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                                <Link className="w-3 h-3" />
                                <span className="truncate">{formatUrl(ad.targetUrl)}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{getPositionBadge(ad.position)}</TableCell>
                      <TableCell>{getTypeBadge(ad.type)}</TableCell>
                      <TableCell>{getStatusBadge(ad)}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <TrendingUp className="w-3 h-3 text-green-600" />
                            <span className="font-medium">{ad.clicks || 0} clics</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Eye className="w-3 h-3" />
                            <span>{ad.impressions || 0} impressions</span>
                          </div>
                          {ad.impressions > 0 && (
                            <div className="text-xs text-blue-600">
                              CTR: {((ad.clicks / ad.impressions) * 100).toFixed(1)}%
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          {ad.startDate && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3 text-muted-foreground" />
                              <span>Début: {new Date(ad.startDate).toLocaleDateString('fr-FR')}</span>
                            </div>
                          )}
                          {ad.endDate && (
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3 h-3 text-muted-foreground" />
                              <span>Fin: {new Date(ad.endDate).toLocaleDateString('fr-FR')}</span>
                            </div>
                          )}
                          {!ad.startDate && !ad.endDate && (
                            <span className="text-muted-foreground">Aucune date</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditDialog(ad)}
                            title="Modifier"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(ad.id)}
                            title="Supprimer"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
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
            <DialogTitle className="flex items-center gap-2">
              <Edit className="w-5 h-5" />
              Modifier la publicité
            </DialogTitle>
            <DialogDescription>
              Modifiez les informations de la campagne publicitaire
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-6">
            {/* Informations de base */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Target className="w-4 h-4" />
                Informations de base
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title" className="flex items-center gap-2">
                    Titre *
                    {formData.title && (
                      <Badge variant="outline" className="text-xs">
                        {formData.title.length}/50
                      </Badge>
                    )}
                  </Label>
                  <Input
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Nom de votre campagne"
                    maxLength={50}
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
                      <SelectItem value="sidebar">Barre latérale</SelectItem>
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
                  rows={2}
                  placeholder="Description de la publicité..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-targetUrl" className="flex items-center gap-2">
                  URL de destination
                  <ExternalLink className="w-3 h-3" />
                </Label>
                <Input
                  id="edit-targetUrl"
                  type="url"
                  value={formData.targetUrl}
                  onChange={(e) => handleInputChange('targetUrl', e.target.value)}
                  placeholder="https://example.com/offre-speciale"
                />
              </div>
            </div>

            {/* Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Configuration
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-type">Type de publicité</Label>
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
                  <Label htmlFor="edit-priority">Priorité (1-10)</Label>
                  <Input
                    id="edit-priority"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>
            </div>

            {/* Planning */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Planning
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-startDate">Date de début</Label>
                  <Input
                    id="edit-startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-endDate">Date de fin</Label>
                  <Input
                    id="edit-endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    min={getMinEndDate()}
                  />
                </div>
              </div>
              
              {dateError && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  {dateError}
                </div>
              )}
              
              {(formData.startDate || formData.endDate) && !dateError && (
                <div className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>
                      {formData.startDate && formData.endDate 
                        ? `Du ${new Date(formData.startDate).toLocaleDateString('fr-FR')} au ${new Date(formData.endDate).toLocaleDateString('fr-FR')}`
                        : formData.startDate 
                          ? `À partir du ${new Date(formData.startDate).toLocaleDateString('fr-FR')}`
                          : `Jusqu'au ${new Date(formData.endDate).toLocaleDateString('fr-FR')}`
                      }
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Média */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                {formData.type === 'video' ? (
                  <Video className="w-4 h-4" />
                ) : (
                  <ImageIcon className="w-4 h-4" />
                )}
                {formData.type === 'video' ? 'Vidéo de la publicité' : 'Image de la publicité'}
              </h3>
              
              <div className="space-y-2">
                <Label htmlFor="edit-media">
                  {formData.type === 'video' ? 'Vidéo' : 'Image'}
                </Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
                  <Input
                    id="edit-media"
                    type="file"
                    accept={formData.type === 'video' ? "video/*" : "image/*"}
                    onChange={formData.type === 'video' ? handleVideoChange : handleImageChange}
                    className="hidden"
                  />
                  <Label htmlFor="edit-media" className="cursor-pointer">
                    <div className="flex flex-col items-center gap-2">
                      {formData.type === 'video' ? (
                        <>
                          <Video className="w-8 h-8 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Cliquez pour changer la vidéo
                          </span>
                          <span className="text-xs text-muted-foreground">
                            MP4, WebM, OGG jusqu'à 50MB
                          </span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            Cliquez pour changer l'image
                          </span>
                          <span className="text-xs text-muted-foreground">
                            PNG, JPG, WEBP jusqu'à 5MB
                          </span>
                        </>
                      )}
                    </div>
                  </Label>
                </div>
                
                {/* Aperçu actuel */}
                {(imagePreview || videoPreview) && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2">Aperçu actuel :</p>
                    {formData.type === 'video' && videoPreview ? (
                      <div className="relative max-h-40 rounded-lg border overflow-hidden">
                        <video 
                          src={videoPreview} 
                          className="w-full h-full object-cover"
                          controls
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                      </div>
                    ) : formData.type !== 'video' && imagePreview ? (
                      <img 
                        src={imagePreview} 
                        alt="Aperçu" 
                        className="max-h-40 rounded-lg object-cover border"
                      />
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  setIsEditDialogOpen(false)
                  setSelectedAd(null)
                  resetForm()
                }}
              >
                Annuler
              </Button>
              <Button 
                type="submit" 
                disabled={loading || !!dateError}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Modification...
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Modifier la publicité
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdvertisementManager