import React, { useState, useEffect, useRef } from 'react'
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
  Play,
  X,
  FileVideo
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
  });

  const positionList = [
    { value: 'hero-top', label: 'Hero - Haut' },
    { value: 'hero-bottom', label: 'Hero - Bas' },
    { value: 'hero-left', label: 'Hero - Gauche' },
    { value: 'hero-right', label: 'Hero - Droit' },
    { value: 'section-accueil-travaux', label: 'section-accueil-travaux' },
    { value: 'section-accueil-art-creation', label: 'section-accueil-art-creation' },
    { value: 'section-accueil-carte-partenaire', label: 'section-accueil-carte-partenaire' },
    { value: 'section-accueil-partenaire-officiel', label: 'section-accueil-partenaire-officiel' },
    { value: 'page-achat', label: 'page-achat' },
    { value: 'pop-up', label: 'pop-up' },
    { value: 'page-location', label: 'page-location' },
    { value: 'page-gestion-immobilier', label: 'page-gestion-immobilier' },
    { value: 'page-investisment-1', label: 'page-investisment-1' },
    { value: 'page-investisment-2', label: 'page-investisment-2' },
    { value: 'page-financement-1', label: 'page-financement-1' },
    { value: 'page-financement-2', label: 'page-financement-2' },
    { value: 'page-assurance-1', label: 'page-assurance-1' },
    { value: 'page-assurance-2', label: 'page-assurance-2' },
    { value: 'page-assurance-3', label: 'page-assurance-3' },
    { value: 'page-logement-sociaux', label: 'page-logement-sociaux' },
    { value: 'page-services-trouver-pro', label: 'page-services-trouver-pro' },
    { value: 'page-services-traveaux', label: 'page-services-traveaux' },
    { value: 'page-services-equipements', label: 'page-services-equipements' },
    { value: 'page-services-bien-etre', label: 'page-services-bien-etre' },
    { value: 'page-explorer-decouvrir', label: 'page-explorer-decouvrir' },
    { value: 'page-explorer-manger', label: 'page-explorer-manger' },
    { value: 'page-explorer-produits-1', label: 'page-explorer-produits-1' },
    { value: 'page-explorer-produits-2', label: 'page-explorer-produits-2' },
    { value: 'page-explorer-art', label: 'page-explorer-art' },
    { value: 'page-partenaires-nos-partenaires', label: 'page-partenaires-nos-partenaires' },
    { value: 'page-partenaires-nos-agences', label: 'page-partenaires-nos-agences' },
    { value: 'page-blog', label: 'page-blog' }
  ]

  // Références pour les éléments vidéo
  const videoPreviewRef = useRef(null)

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
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  // Charger les publicités
  const loadAdvertisements = async () => {
    try {
      setLoading(true);

      const params = {};
      if (filters.status !== 'all') params.status = filters.status;
      if (filters.position !== 'all') params.position = filters.position;

      const response = await advertisementsAPI.getAdvertisements(params);

      if (response.data && Array.isArray(response.data.advertisements)) {
        setAdvertisements(response.data.advertisements);
      } else if (response.data && response.data.success) {
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

  // Nettoyer les URLs d'aperçu lors du démontage
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, []);

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
        if (imagePreview) {
          URL.revokeObjectURL(imagePreview);
          setImagePreview('');
        }
        setFormData(prev => ({ ...prev, image: null }))
      } else {
        if (videoPreview) {
          URL.revokeObjectURL(videoPreview);
          setVideoPreview('');
        }
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

  // Fonction pour gérer l'upload d'image
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

      // Validation du type de fichier
      const imageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!imageTypes.includes(file.type)) {
        toast({
          title: "Erreur",
          description: "Format d'image non supporté. Utilisez JPG, PNG, GIF ou WebP",
          variant: "destructive"
        })
        return
      }

      // Nettoyer l'ancienne prévisualisation
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }

      setFormData(prev => ({ ...prev, image: file, video: null }))
      setImagePreview(URL.createObjectURL(file))
      setVideoPreview('')
      setIsVideoPlaying(false)
    }
  }

  // Fonction pour gérer l'upload de vidéo
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
      const videoTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime', 'video/x-msvideo']
      if (!videoTypes.includes(file.type)) {
        toast({
          title: "Erreur",
          description: "Format vidéo non supporté. Utilisez MP4, WebM, OGG, AVI ou MOV",
          variant: "destructive"
        })
        return
      }

      // Nettoyer l'ancienne prévisualisation
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      if (videoPreview) {
        URL.revokeObjectURL(videoPreview);
      }

      setFormData(prev => ({ ...prev, video: file, image: null }))
      setVideoPreview(URL.createObjectURL(file))
      setImagePreview('')
      setIsVideoPlaying(false)
    }
  }

  // Fonction pour supprimer le média sélectionné
  const handleRemoveMedia = () => {
    if (formData.type === 'video' && videoPreview) {
      URL.revokeObjectURL(videoPreview);
      setVideoPreview('');
      setFormData(prev => ({ ...prev, video: null }));
    } else if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview('');
      setFormData(prev => ({ ...prev, image: null }));
    }
    setIsVideoPlaying(false);
  };

  // Fonction pour jouer/mettre en pause la vidéo
  const toggleVideoPlay = () => {
    if (videoPreviewRef.current) {
      if (isVideoPlaying) {
        videoPreviewRef.current.pause();
      } else {
        videoPreviewRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  // Fonction pour réinitialiser le formulaire
  const resetForm = () => {
    // Nettoyer les URLs d'aperçu
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }

    setFormData({
      title: '',
      description: '',
      targetUrl: '',
      position: positionList[0].value,
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
    setIsVideoPlaying(false)
  }

  // CORRECTION CRITIQUE : Créer une publicité avec le bon nom de champ pour le fichier
  const handleCreate = async (e) => {
    e.preventDefault()

    // Validation des dates
    if (!validateDates(formData.startDate, formData.endDate)) {
      return
    }

    // Validation des champs requis
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

      // CORRECTION : Utiliser un nom de champ unique "media" pour le fichier
      // Cela évite le problème "Unexpected field" avec Multer
      if (formData.type === 'video' && formData.video) {
        formDataToSend.append('media', formData.video)
      } else if ((formData.type === 'banner' || formData.type === 'popup') && formData.image) {
        formDataToSend.append('media', formData.image)
      }

      // console.log('FormData envoyé:', {
      //   title: formData.title,
      //   type: formData.type,
      //   hasFile: !!(formData.video || formData.image),
      //   fileType: formData.video ? 'video' : formData.image ? 'image' : 'none'
      // });

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

  // CORRECTION CRITIQUE : Modifier une publicité avec le bon nom de champ pour le fichier
  const handleEdit = async (e) => {
    e.preventDefault()

    // Validation des dates
    if (!validateDates(formData.startDate, formData.endDate)) {
      return
    }

    // Validation des champs requis
    if (!formData.title) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir le titre",
        variant: "destructive"
      })
      return
    }

    // Validation: Si on change le type, il faut un nouveau média
    if (selectedAd && selectedAd.type !== formData.type) {
      if (formData.type === 'video' && !formData.video) {
        toast({
          title: "Erreur",
          description: "Vous avez changé le type en vidéo. Veuillez sélectionner une nouvelle vidéo.",
          variant: "destructive"
        })
        return
      } else if ((formData.type === 'banner' || formData.type === 'popup') && !formData.image) {
        toast({
          title: "Erreur",
          description: "Vous avez changé le type en image. Veuillez sélectionner une nouvelle image.",
          variant: "destructive"
        })
        return
      }
    }

    try {
      const formDataToSend = new FormData()

      // Ajouter tous les champs texte
      Object.keys(formData).forEach(key => {
        if (key !== 'image' && key !== 'video' && formData[key] !== null && formData[key] !== '') {
          formDataToSend.append(key, formData[key])
        }
      })

      // CORRECTION : Utiliser un nom de champ unique "media" pour le fichier
      // Cela évite le problème "Unexpected field" avec Multer
      if (formData.type === 'video' && formData.video) {
        formDataToSend.append('media', formData.video)
      } else if ((formData.type === 'banner' || formData.type === 'popup') && formData.image) {
        formDataToSend.append('media', formData.image)
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

    // Nettoyer les anciennes prévisualisations
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    if (videoPreview) URL.revokeObjectURL(videoPreview);

    // Mettre à jour l'aperçu selon le type
    if (ad.type === 'video') {
      setVideoPreview(ad.imageUrl || '')
      setImagePreview('')
    } else {
      setImagePreview(ad.imageUrl || '')
      setVideoPreview('')
    }
    setIsVideoPlaying(false)
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
      header: 'hero',
      sidebar: 'section1',
      homepage: 'section2',
      footer: 'section3'
    }
    const icons = {
      header: <Target className="w-3 h-3 mr-1" />,
      sidebar: <BarChart3 className="w-3 h-3 mr-1" />,
      homepage: <Home className="w-3 h-3 mr-1" />,
      footer: <Clock className="w-3 h-3 mr-1" />
    }
    return (
      <Badge variant="outline" className="flex items-center border-[#D3D3D3] text-[#8B4513]">
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
      <Badge variant={variants[type]} className="flex items-center bg-[#556B2F] hover:bg-[#6B8E23]">
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

  // Obtenir l'URL de l'aperçu pour une publicité
  const getAdPreviewUrl = (ad) => {
    if (!ad) return '';

    // Si c'est une nouvelle publicité en cours de création/modification
    if (ad.id === selectedAd?.id) {
      if (ad.type === 'video' && videoPreview) return videoPreview;
      if (ad.type !== 'video' && imagePreview) return imagePreview;
    }

    // Pour les publicités existantes
    return ad.imageUrl || '';
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#556B2F] to-[#6B8E23] bg-clip-text text-transparent">
            Gestion des Publicités
          </h1>
          <p className=" mt-2">
            Créez et gérez les campagnes publicitaires de votre site
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={loadAdvertisements}
            disabled={loading}
            className="flex items-center gap-2 border-[#D3D3D3] text-[#8B4513] hover:bg-[#6B8E23]/10 hover:text-[#6B8E23]"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Actualiser
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-[#556B2F] hover:bg-[#6B8E23] text-white">
                <Plus className="w-4 h-4" />
                Nouvelle Publicité
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-[#D3D3D3]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-[#8B4513]">
                  <Plus className="w-5 h-5" />
                  Créer une nouvelle publicité
                </DialogTitle>
                <DialogDescription className="text-[#8B4513]/80">
                  Remplissez les informations pour créer une nouvelle campagne publicitaire
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate} className="space-y-6">
                {/* Informations de base */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-[#8B4513]">
                    <Target className="w-4 h-4" />
                    Informations de base
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="flex items-center gap-2 text-[#8B4513]">
                        Titre *
                        {formData.title && (
                          <Badge variant="outline" className="text-xs border-[#D3D3D3] text-[#8B4513]">
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
                        className="border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="position" className="text-[#8B4513]">Position *</Label>
                      <Select
                        value={formData.position}
                        onValueChange={(value) => handleInputChange('position', value)}
                      >
                        <SelectTrigger className="border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-[#D3D3D3]">
                          {positionList.map((pos) => (
                            <SelectItem value={pos.value}>{pos.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-[#8B4513]">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={2}
                      placeholder="Description de la publicité..."
                      className="border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="targetUrl" className="flex items-center gap-2 text-[#8B4513]">
                      URL de destination
                      <ExternalLink className="w-3 h-3" />
                    </Label>
                    <Input
                      id="targetUrl"
                      type="url"
                      value={formData.targetUrl}
                      onChange={(e) => handleInputChange('targetUrl', e.target.value)}
                      placeholder="https://example.com/offre-speciale"
                      className="border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F]"
                    />
                  </div>
                </div>

                {/* Configuration */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-[#8B4513]">
                    <BarChart3 className="w-4 h-4" />
                    Configuration
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type" className="text-[#8B4513]">Type de publicité *</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => handleInputChange('type', value)}
                      >
                        <SelectTrigger className="border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-[#D3D3D3]">
                          <SelectItem value="banner">Bannière (image)</SelectItem>
                          <SelectItem value="popup">Popup (image)</SelectItem>
                          <SelectItem value="video">Vidéo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status" className="text-[#8B4513]">Statut *</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => handleInputChange('status', value)}
                      >
                        <SelectTrigger className="border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-[#D3D3D3]">
                          <SelectItem value="active">Actif</SelectItem>
                          <SelectItem value="inactive">Inactif</SelectItem>
                          <SelectItem value="scheduled">Planifié</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="priority" className="text-[#8B4513]">Priorité (1-10)</Label>
                      <Input
                        id="priority"
                        type="number"
                        min="1"
                        max="10"
                        value={formData.priority}
                        onChange={(e) => handleInputChange('priority', parseInt(e.target.value) || 1)}
                        className="border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F]"
                      />
                    </div>
                  </div>
                </div>

                {/* Planning */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-[#8B4513]">
                    <Calendar className="w-4 h-4" />
                    Planning
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate" className="text-[#8B4513]">Date de début</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate" className="text-[#8B4513]">Date de fin</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        min={getMinEndDate()}
                        className="border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F]"
                      />
                    </div>
                  </div>

                  {dateError && (
                    <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                      <AlertCircle className="w-4 h-4" />
                      {dateError}
                    </div>
                  )}

                  {(formData.startDate || formData.endDate) && !dateError && (
                    <div className="text-sm text-[#8B4513] bg-[#6B8E23]/10 p-3 rounded-lg border border-[#D3D3D3]">
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
                  <h3 className="text-lg font-semibold flex items-center gap-2 text-[#8B4513]">
                    {formData.type === 'video' ? (
                      <FileVideo className="w-4 h-4" />
                    ) : (
                      <ImageIcon className="w-4 h-4" />
                    )}
                    {formData.type === 'video' ? 'Vidéo de la publicité' : 'Image de la publicité'} *
                  </h3>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="media" className="text-[#8B4513]">
                        {formData.type === 'video' ? 'Sélectionner une vidéo' : 'Sélectionner une image'}
                      </Label>
                      {(imagePreview || videoPreview) && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveMedia}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-3"
                        >
                          <X className="w-3 h-3 mr-1" />
                          Supprimer
                        </Button>
                      )}
                    </div>

                    {/* Zone de dépôt de fichier */}
                    <div className="border-2 border-dashed border-[#D3D3D3] rounded-lg p-8 text-center hover:border-[#556B2F] transition-colors bg-[#6B8E23]/5">
                      <Input
                        id="media"
                        type="file"
                        accept={formData.type === 'video' ? "video/*" : "image/*"}
                        onChange={formData.type === 'video' ? handleVideoChange : handleImageChange}
                        className="hidden"
                      />
                      <Label htmlFor="media" className="cursor-pointer block">
                        <div className="flex flex-col items-center gap-3">
                          {formData.type === 'video' ? (
                            <>
                              <div className="w-16 h-16 rounded-full bg-[#556B2F]/20 flex items-center justify-center">
                                <Video className="w-8 h-8 text-[#8B4513]" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-[#8B4513]">
                                  {videoPreview ? 'Remplacer la vidéo' : 'Cliquez pour uploader une vidéo'}
                                </p>
                                <p className="text-xs text-[#8B4513]/70 mt-1">
                                  Formats supportés: MP4, WebM, OGG, AVI, MOV
                                </p>
                                <p className="text-xs text-[#8B4513]/70">
                                  Taille maximum: 50MB
                                </p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-16 h-16 rounded-full bg-[#556B2F]/20 flex items-center justify-center">
                                <Upload className="w-8 h-8 text-[#8B4513]" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-[#8B4513]">
                                  {imagePreview ? 'Remplacer l\'image' : 'Cliquez pour uploader une image'}
                                </p>
                                <p className="text-xs text-[#8B4513]/70 mt-1">
                                  Formats supportés: JPG, PNG, GIF, WebP
                                </p>
                                <p className="text-xs text-[#8B4513]/70">
                                  Taille maximum: 5MB
                                </p>
                              </div>
                            </>
                          )}
                          <Button
                            type="button"
                            variant="outline"
                            className="mt-2 border-[#D3D3D3] text-[#8B4513] hover:bg-[#6B8E23]/10 hover:text-[#6B8E23]"
                            onClick={() => document.getElementById('media').click()}
                          >
                            {formData.type === 'video' ? 'Parcourir les vidéos...' : 'Parcourir les images...'}
                          </Button>
                        </div>
                      </Label>
                    </div>

                    {/* Aperçu du média */}
                    {imagePreview && formData.type !== 'video' && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2 text-[#8B4513]">Aperçu de l'image :</p>
                        <div className="relative max-h-60 rounded-lg overflow-hidden border border-[#D3D3D3] group">
                          <img
                            src={imagePreview}
                            alt="Aperçu de l'image"
                            className="w-full h-full object-contain max-h-60"
                          />
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={handleRemoveMedia}
                              className="h-8 w-8"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Aperçu de la vidéo */}
                    {videoPreview && formData.type === 'video' && (
                      <div className="mt-4">
                        <p className="text-sm font-medium mb-2 text-[#8B4513]">Aperçu de la vidéo :</p>
                        <div className="relative max-h-60 rounded-lg overflow-hidden border border-[#D3D3D3] group">
                          <video
                            ref={videoPreviewRef}
                            src={videoPreview}
                            className="w-full h-full object-contain max-h-60"
                            controls={isVideoPlaying}
                            onEnded={() => setIsVideoPlaying(false)}
                          />
                          {!isVideoPlaying && (
                            <>
                              <div className="absolute inset-0 bg-black/20" />
                              <div
                                className="absolute inset-0 flex items-center justify-center cursor-pointer"
                                onClick={toggleVideoPlay}
                              >
                                <div className="bg-white/90 p-4 rounded-full hover:bg-white transition-colors shadow-lg">
                                  <Play className="w-8 h-8 text-[#8B4513]" />
                                </div>
                              </div>
                            </>
                          )}
                          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="flex gap-2">
                              <Button
                                type="button"
                                variant="secondary"
                                size="icon"
                                onClick={toggleVideoPlay}
                                className="h-8 w-8 bg-white/90 hover:bg-white"
                              >
                                {isVideoPlaying ? (
                                  <X className="w-4 h-4" />
                                ) : (
                                  <Play className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={handleRemoveMedia}
                                className="h-8 w-8"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-xs text-[#8B4513]/70">
                          <Video className="w-3 h-3" />
                          <span>Cliquez sur le bouton play pour prévisualiser la vidéo</span>
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
                    className="border-[#D3D3D3] text-[#8B4513] hover:bg-[#6B8E23]/10 hover:text-[#6B8E23]"
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading || !!dateError || (formData.type === 'video' ? !formData.video : !formData.image)}
                    className="bg-[#556B2F] hover:bg-[#6B8E23] text-white"
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
        <Card className="border-l-4 border-l-[#556B2F] border-[#D3D3D3]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#8B4513]">Total</p>
                <p className="text-2xl font-bold text-[#8B4513]">{advertisements.length}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-[#556B2F]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#6B8E23] border-[#D3D3D3]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#8B4513]">Actives</p>
                <p className="text-2xl font-bold text-[#8B4513]">
                  {advertisements.filter(ad => getCurrentStatus(ad) === 'active').length}
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-[#6B8E23]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#8B4513] border-[#D3D3D3]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#8B4513]">Planifiées</p>
                <p className="text-2xl font-bold text-[#8B4513]">
                  {advertisements.filter(ad => getCurrentStatus(ad) === 'scheduled').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-[#8B4513]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-[#A52A2A] border-[#D3D3D3]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#8B4513]">Expirées</p>
                <p className="text-2xl font-bold text-[#8B4513]">
                  {advertisements.filter(ad => getCurrentStatus(ad) === 'expired').length}
                </p>
              </div>
              <AlertCircle className="w-8 h-8 text-[#A52A2A]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres améliorés */}
      <Card className="border-[#D3D3D3]">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8B4513] w-4 h-4" />
                <Input
                  placeholder="Rechercher par titre, description..."
                  className="pl-10 border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F] text-[#8B4513] placeholder:text-[#8B4513]/60"
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
                <SelectTrigger className="w-40 border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F]">
                  <Filter className="w-4 h-4 mr-2 text-[#8B4513]" />
                  <SelectValue placeholder="Statut" className="text-[#8B4513]" />
                </SelectTrigger>
                <SelectContent className="border-[#D3D3D3]">
                  <SelectItem value="all" className="text-[#8B4513]">Tous les statuts</SelectItem>
                  <SelectItem value="active" className="text-[#8B4513]">Actives</SelectItem>
                  <SelectItem value="inactive" className="text-[#8B4513]">Inactives</SelectItem>
                  <SelectItem value="scheduled" className="text-[#8B4513]">Planifiées</SelectItem>
                  <SelectItem value="expired" className="text-[#8B4513]">Expirées</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filters.position}
                onValueChange={(value) => setFilters(prev => ({ ...prev, position: value }))}
              >
                <SelectTrigger className="w-48 border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F]">
                  <SelectValue placeholder="Position" className="text-[#8B4513]" />
                </SelectTrigger>
                <SelectContent className="border-[#D3D3D3]">
                  <SelectItem value="all" className="text-[#8B4513]">tous</SelectItem>
                  {positionList.map((pos) => (
                    <SelectItem value={pos.value}>{pos.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tableau des publicités amélioré */}
      <Card className="border-[#D3D3D3]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-[#8B4513]">
            <BarChart3 className="w-5 h-5" />
            Campagnes Publicitaires
          </CardTitle>
          <CardDescription className="">
            {filteredAdvertisements.length} publicité{filteredAdvertisements.length > 1 ? 's' : ''} trouvée{filteredAdvertisements.length > 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-12 h-12 animate-spin text-[#8B4513]/60 mx-auto mb-4" />
              <p className="text-[#8B4513]">Chargement des publicités...</p>
            </div>
          ) : filteredAdvertisements.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="w-16 h-16 text-[#8B4513]/60 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2 text-[#8B4513]">Aucune publicité trouvée</h3>
              <p className="text-[#8B4513] mb-6">
                {filters.status !== 'all' || filters.position !== 'all' || filters.search
                  ? "Aucune publicité ne correspond à vos critères de recherche"
                  : "Commencez par créer votre première campagne publicitaire"
                }
              </p>
              {(filters.status !== 'all' || filters.position !== 'all' || filters.search) ? (
                <Button
                  variant="outline"
                  onClick={() => setFilters({ status: 'all', position: 'all', search: '' })}
                  className="border-[#D3D3D3] text-[#8B4513] hover:bg-[#6B8E23]/10 hover:text-[#6B8E23]"
                >
                  Réinitialiser les filtres
                </Button>
              ) : (
                <Button
                  onClick={() => setIsCreateDialogOpen(true)}
                  className="bg-[#556B2F] hover:bg-[#6B8E23] text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Créer une publicité
                </Button>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-[#D3D3D3]">
              <Table>
                <TableHeader>
                  <TableRow className="border-b-[#D3D3D3] hover:bg-transparent">
                    <TableHead className="font-semibold">Publicité</TableHead>
                    <TableHead className="font-semibold">Position</TableHead>
                    <TableHead className="font-semibold">Type</TableHead>
                    <TableHead className="font-semibold">Statut</TableHead>
                    <TableHead className="font-semibold">Performance</TableHead>
                    <TableHead className="font-semibold">Planning</TableHead>
                    <TableHead className="font-semibold w-[120px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdvertisements.map((ad) => (
                    <TableRow key={ad.id} className="border-b-[#D3D3D3] hover:bg-[#6B8E23]/5">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {ad.type === 'video' ? (
                            <div className="relative w-16 h-16 rounded-lg border border-[#D3D3D3] overflow-hidden bg-gradient-to-br from-[#556B2F]/20 to-[#6B8E23]/10 flex items-center justify-center">
                              <div className="relative w-full h-full group">
                                <video
                                  src={getAdPreviewUrl(ad)}
                                  className="w-full h-full object-cover"
                                  preload="metadata"
                                />
                                <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="bg-white/90 p-2 rounded-full cursor-pointer">
                                    <Play className="w-4 h-4 text-[#8B4513]" />
                                  </div>
                                </div>
                                <div className="absolute top-1 right-1">
                                  <Video className="w-3 h-3 text-white bg-black/50 p-0.5 rounded" />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="relative w-16 h-16">
                              <img
                                src={getAdPreviewUrl(ad)}
                                alt={ad.title}
                                className="w-full h-full rounded-lg object-cover border border-[#D3D3D3]"
                                onError={(e) => {
                                  e.target.src = `https://via.placeholder.com/64x64/556B2F/FFFFFF?text=${encodeURIComponent(ad.title.charAt(0))}`;
                                }}
                              />
                            </div>
                          )}
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold truncate flex items-center gap-2 ">
                              {ad.title}
                            </div>
                            {ad.description && (
                              <div className="text-sm text-[#8B4513]/70 truncate">
                                {ad.description}
                              </div>
                            )}
                            {ad.targetUrl && (
                              <div className="text-xs text-[#556B2F] flex items-center gap-1 mt-1">
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
                            <TrendingUp className="w-3 h-3 text-[#6B8E23]" />
                            <span className="font-medium ">{ad.clicks || 0} clics</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm ">
                            <Eye className="w-3 h-3" />
                            <span>{ad.impressions || 0} impressions</span>
                          </div>
                          {ad.impressions > 0 && (
                            <div className="text-xs text-[#556B2F]">
                              CTR: {((ad.clicks / ad.impressions) * 100).toFixed(1)}%
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm">
                          {ad.startDate && (
                            <div className="flex items-center gap-2 ">
                              <Calendar className="w-3 h-3" />
                              <span>Début: {new Date(ad.startDate).toLocaleDateString('fr-FR')}</span>
                            </div>
                          )}
                          {ad.endDate && (
                            <div className="flex items-center gap-2 ">
                              <Calendar className="w-3 h-3" />
                              <span>Fin: {new Date(ad.endDate).toLocaleDateString('fr-FR')}</span>
                            </div>
                          )}
                          {!ad.startDate && !ad.endDate && (
                            <span className="text-[#8B4513]/60">Aucune date</span>
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
                            className="text-[#8B4513] hover:text-[#6B8E23] hover:bg-[#6B8E23]/10"
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-[#D3D3D3]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-[#8B4513]">
              <Edit className="w-5 h-5" />
              Modifier la publicité
            </DialogTitle>
            <DialogDescription className="text-[#8B4513]/80">
              Modifiez les informations de la campagne publicitaire
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit} className="space-y-6">
            {/* Informations de base */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-[#8B4513]">
                <Target className="w-4 h-4" />
                Informations de base
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-title" className="flex items-center gap-2 text-[#8B4513]">
                    Titre *
                    {formData.title && (
                      <Badge variant="outline" className="text-xs border-[#D3D3D3] text-[#8B4513]">
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
                    className="border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-position" className="text-[#8B4513]">Position *</Label>
                  <Select
                    value={formData.position}
                    onValueChange={(value) => handleInputChange('position', value)}
                  >
                    <SelectTrigger className="border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-[#D3D3D3]">
                      {positionList.map((pos) => (
                        <SelectItem value={pos.value}>{pos.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description" className="text-[#8B4513]">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={2}
                  placeholder="Description de la publicité..."
                  className="border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-targetUrl" className="flex items-center gap-2 text-[#8B4513]">
                  URL de destination
                  <ExternalLink className="w-3 h-3" />
                </Label>
                <Input
                  id="edit-targetUrl"
                  type="url"
                  value={formData.targetUrl}
                  onChange={(e) => handleInputChange('targetUrl', e.target.value)}
                  placeholder="https://example.com/offre-speciale"
                  className="border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F]"
                />
              </div>
            </div>

            {/* Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-[#8B4513]">
                <BarChart3 className="w-4 h-4" />
                Configuration
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-type" className="text-[#8B4513]">Type de publicité *</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleInputChange('type', value)}
                  >
                    <SelectTrigger className="border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-[#D3D3D3]">
                      <SelectItem value="banner">Bannière (image)</SelectItem>
                      <SelectItem value="popup">Popup (image)</SelectItem>
                      <SelectItem value="video">Vidéo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-status" className="text-[#8B4513]">Statut *</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger className="border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="border-[#D3D3D3]">
                      <SelectItem value="active">Actif</SelectItem>
                      <SelectItem value="inactive">Inactif</SelectItem>
                      <SelectItem value="scheduled">Planifié</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-priority" className="text-[#8B4513]">Priorité (1-10)</Label>
                  <Input
                    id="edit-priority"
                    type="number"
                    min="1"
                    max="10"
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', parseInt(e.target.value) || 1)}
                    className="border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F]"
                  />
                </div>
              </div>
            </div>

            {/* Planning */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-[#8B4513]">
                <Calendar className="w-4 h-4" />
                Planning
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-startDate" className="text-[#8B4513]">Date de début</Label>
                  <Input
                    id="edit-startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-endDate" className="text-[#8B4513]">Date de fin</Label>
                  <Input
                    id="edit-endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                    min={getMinEndDate()}
                    className="border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F]"
                  />
                </div>
              </div>

              {dateError && (
                <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20">
                  <AlertCircle className="w-4 h-4" />
                  {dateError}
                </div>
              )}

              {(formData.startDate || formData.endDate) && !dateError && (
                <div className="text-sm text-[#8B4513] bg-[#6B8E23]/10 p-3 rounded-lg border border-[#D3D3D3]">
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
              <h3 className="text-lg font-semibold flex items-center gap-2 text-[#8B4513]">
                {formData.type === 'video' ? (
                  <FileVideo className="w-4 h-4" />
                ) : (
                  <ImageIcon className="w-4 h-4" />
                )}
                {formData.type === 'video' ? 'Vidéo de la publicité' : 'Image de la publicité'}
              </h3>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="edit-media" className="text-[#8B4513]">
                    {formData.type === 'video' ? 'Sélectionner une vidéo' : 'Sélectionner une image'}
                  </Label>
                  {(imagePreview || videoPreview) && (formData.video || formData.image) && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveMedia}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-3"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Supprimer
                    </Button>
                  )}
                </div>

                {/* Zone de dépôt de fichier */}
                <div className="border-2 border-dashed border-[#D3D3D3] rounded-lg p-8 text-center hover:border-[#556B2F] transition-colors bg-[#6B8E23]/5">
                  <Input
                    id="edit-media"
                    type="file"
                    accept={formData.type === 'video' ? "video/*" : "image/*"}
                    onChange={formData.type === 'video' ? handleVideoChange : handleImageChange}
                    className="hidden"
                  />
                  <Label htmlFor="edit-media" className="cursor-pointer block">
                    <div className="flex flex-col items-center gap-3">
                      {formData.type === 'video' ? (
                        <>
                          <div className="w-16 h-16 rounded-full bg-[#556B2F]/20 flex items-center justify-center">
                            <Video className="w-8 h-8 text-[#8B4513]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#8B4513]">
                              {videoPreview ? 'Remplacer la vidéo' : selectedAd?.type === 'video' ? 'Conserver la vidéo actuelle ou en uploader une nouvelle' : 'Sélectionner une vidéo'}
                            </p>
                            <p className="text-xs text-[#8B4513]/70 mt-1">
                              Formats supportés: MP4, WebM, OGG, AVI, MOV
                            </p>
                            <p className="text-xs text-[#8B4513]/70">
                              Taille maximum: 50MB
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-16 h-16 rounded-full bg-[#556B2F]/20 flex items-center justify-center">
                            <Upload className="w-8 h-8 text-[#8B4513]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#8B4513]">
                              {imagePreview ? 'Remplacer l\'image' : selectedAd?.type !== 'video' ? 'Conserver l\'image actuelle ou en uploader une nouvelle' : 'Sélectionner une image'}
                            </p>
                            <p className="text-xs text-[#8B4513]/70 mt-1">
                              Formats supportés: JPG, PNG, GIF, WebP
                            </p>
                            <p className="text-xs text-[#8B4513]/70">
                              Taille maximum: 5MB
                            </p>
                          </div>
                        </>
                      )}
                      <Button
                        type="button"
                        variant="outline"
                        className="mt-2 border-[#D3D3D3] text-[#8B4513] hover:bg-[#6B8E23]/10 hover:text-[#6B8E23]"
                        onClick={() => document.getElementById('edit-media').click()}
                      >
                        {formData.type === 'video' ? 'Parcourir les vidéos...' : 'Parcourir les images...'}
                      </Button>
                    </div>
                  </Label>
                </div>

                {/* Aperçu du média */}
                {imagePreview && formData.type !== 'video' && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2 text-[#8B4513]">
                      {formData.image ? 'Nouvel aperçu' : 'Aperçu actuel'} :
                    </p>
                    <div className="relative max-h-60 rounded-lg overflow-hidden border border-[#D3D3D3] group">
                      <img
                        src={imagePreview}
                        alt="Aperçu"
                        className="w-full h-full object-contain max-h-60"
                      />
                      {formData.image && (
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={handleRemoveMedia}
                            className="h-8 w-8"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Aperçu de la vidéo */}
                {videoPreview && formData.type === 'video' && (
                  <div className="mt-4">
                    <p className="text-sm font-medium mb-2 text-[#8B4513]">
                      {formData.video ? 'Nouvel aperçu' : 'Aperçu actuel'} :
                    </p>
                    <div className="relative max-h-60 rounded-lg overflow-hidden border border-[#D3D3D3] group">
                      <video
                        ref={videoPreviewRef}
                        src={videoPreview}
                        className="w-full h-full object-contain max-h-60"
                        controls={isVideoPlaying}
                        onEnded={() => setIsVideoPlaying(false)}
                      />
                      {!isVideoPlaying && (
                        <>
                          <div className="absolute inset-0 bg-black/20" />
                          <div
                            className="absolute inset-0 flex items-center justify-center cursor-pointer"
                            onClick={toggleVideoPlay}
                          >
                            <div className="bg-white/90 p-4 rounded-full hover:bg-white transition-colors shadow-lg">
                              <Play className="w-8 h-8 text-[#8B4513]" />
                            </div>
                          </div>
                        </>
                      )}
                      {formData.video && (
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="secondary"
                              size="icon"
                              onClick={toggleVideoPlay}
                              className="h-8 w-8 bg-white/90 hover:bg-white"
                            >
                              {isVideoPlaying ? (
                                <X className="w-4 h-4" />
                              ) : (
                                <Play className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              type="button"
                              variant="destructive"
                              size="icon"
                              onClick={handleRemoveMedia}
                              className="h-8 w-8"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    {formData.video && (
                      <div className="mt-2 flex items-center gap-2 text-xs text-[#8B4513]/70">
                        <Video className="w-3 h-3" />
                        <span>Cliquez sur le bouton play pour prévisualiser la vidéo</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Message d'information */}
                {!formData.video && !formData.image && selectedAd && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium">Information</p>
                        <p className="mt-1">
                          Si vous ne sélectionnez pas de nouveau média, le média actuel sera conservé.
                          {selectedAd.type !== formData.type && (
                            <span className="block mt-1 text-red-600 font-medium">
                              ⚠️ Attention : Vous avez changé le type de publicité. Vous devez sélectionner un nouveau média.
                            </span>
                          )}
                        </p>
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
                  setIsEditDialogOpen(false)
                  setSelectedAd(null)
                  resetForm()
                }}
                className="border-[#D3D3D3] text-[#8B4513] hover:bg-[#6B8E23]/10 hover:text-[#6B8E23]"
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={loading || !!dateError}
                className="bg-[#556B2F] hover:bg-[#6B8E23] text-white"
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