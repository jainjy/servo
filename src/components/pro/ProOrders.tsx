// components/pro/ProOrders.jsx
import { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  Eye, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Users, 
  Euro, 
  MapPin, 
  Calendar, 
  Mail, 
  Phone,
  Filter,
  Tag,
  BarChart3,
  Utensils,
  Box,
  RefreshCw,
  ChevronDown,
  Leaf,
  Sparkles,
  Heart,
  Zap,
  Flame,
  Info
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ProOrderDetailsModal from './ProOrderDetailsModal';
import { ordersProAPI } from '@/lib/api';

// Constantes de couleur basées sur votre palette
const COLORS = {
  logo: "#556B2F",           /* Olive green - logo/accent */
  primary: "#6B8E23",        /* Yellow-green - primary-dark */
  lightBg: "#FFFFFF",        /* White - light-bg */
  separator: "#D3D3D3",      /* Light gray - separator */
  secondaryText: "#8B4513",  /* Saddle brown - secondary-text */
  smallText: "#000000",      /* Black for small text */
};

// Fonction pour masquer l'email
const maskEmail = (email) => {
  if (!email) return '';
  const [name, domain] = email.split('@');
  const maskedName = name.length > 2 
    ? name.substring(0, 2) + '***' 
    : '***';
  return `${maskedName}@${domain}`;
};

// Fonction pour masquer le téléphone
const maskPhone = (phone) => {
  if (!phone) return '';
  // Garde les 4 derniers chiffres visibles
  const visibleDigits = phone.slice(-4);
  return `•••• •••• ${visibleDigits}`;
};

const ProOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [productTypeStats, setProductTypeStats] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    thisWeek: 0
  });

  // Ordre des statuts (workflow)
  const STATUS_WORKFLOW = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
  const STATUS_CANCELLED = 'cancelled';

  // Configuration des statuts avec les nouvelles couleurs
  const STATUS_CONFIG = {
    pending: { 
      label: 'En attente', 
      variant: 'secondary', 
      icon: Clock,
      nextLabel: 'Confirmer',
      nextStatus: 'confirmed',
      color: '#F97316', // orange-500
      bgColor: '#FFEDD5', // orange-100
      borderColor: '#FDBA74' // orange-300
    },
    confirmed: { 
      label: 'Confirmée', 
      variant: 'default', 
      icon: CheckCircle,
      nextLabel: 'Commencer le traitement',
      nextStatus: 'processing',
      color: COLORS.primary, // yellow-green
      bgColor: `${COLORS.primary}20`, // light version
      borderColor: COLORS.primary
    },
    processing: { 
      label: 'En traitement', 
      variant: 'default', 
      icon: Package,
      nextLabel: 'Expédier',
      nextStatus: 'shipped',
      color: '#8B5CF6', // purple-500
      bgColor: '#F5F3FF', // purple-100
      borderColor: '#C4B5FD' // purple-300
    },
    shipped: { 
      label: 'Expédiée', 
      variant: 'default', 
      icon: Truck,
      nextLabel: 'Marquer comme livrée',
      nextStatus: 'delivered',
      color: '#4F46E5', // indigo-600
      bgColor: '#EEF2FF', // indigo-100
      borderColor: '#A5B4FC' // indigo-300
    },
    delivered: { 
      label: 'Livrée', 
      variant: 'success', 
      icon: CheckCircle,
      nextLabel: null,
      nextStatus: null,
      color: '#059669', // emerald-600
      bgColor: '#D1FAE5', // emerald-100
      borderColor: '#6EE7B7' // emerald-300
    },
    cancelled: { 
      label: 'Annulée', 
      variant: 'destructive', 
      icon: XCircle,
      nextLabel: null,
      nextStatus: null,
      color: '#DC2626', // red-600
      bgColor: '#FEE2E2', // red-100
      borderColor: '#FCA5A5' // red-300
    }
  };

  // Configuration des types de produits naturels avec les nouvelles couleurs
  const PRODUCT_TYPE_CONFIG = {
    'all': { 
      label: 'Tous les produits', 
      icon: Package, 
      color: `bg-gray-100 text-gray-800 border-gray-200`,
      accentColor: '#6B7280'
    },
    'food': { 
      label: 'Alimentation', 
      icon: Utensils, 
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      accentColor: '#F97316'
    },
    'general': { 
      label: 'Materiaux Généraux', 
      icon: Box, 
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      accentColor: '#3B82F6'
    },
    'produitnaturel': { 
      label: 'Produits Naturels', 
      icon: Leaf, 
      color: `bg-green-100 text-green-800 border-green-200`,
      accentColor: '#10B981'
    },
    'huiles-essentielles': { 
      label: 'Huiles Essentielles', 
      icon: Sparkles, 
      color: 'bg-purple-100 text-purple-800 border-purple-200',
      accentColor: '#8B5CF6'
    },
    'thes-infusions': { 
      label: 'Thés & Infusions', 
      icon: Heart, 
      color: 'bg-red-100 text-red-800 border-red-200',
      accentColor: '#EF4444'
    },
    'soins-bien-etre': { 
      label: 'Soins Bien-être', 
      icon: Zap, 
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      accentColor: '#EAB308'
    },
    'complements-alimentaires': { 
      label: 'Compléments', 
      icon: Flame, 
      color: 'bg-pink-100 text-pink-800 border-pink-200',
      accentColor: '#EC4899'
    },
    'ambiance-relaxation': { 
      label: 'Ambiance', 
      icon: Heart, 
      color: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      accentColor: '#6366F1'
    },
    'accessoires': { 
      label: 'Accessoires', 
      icon: Package, 
      color: 'bg-cyan-100 text-cyan-800 border-cyan-200',
      accentColor: '#06B6D4'
    }
  };

  // Fonction pour obtenir la configuration d'un type de produit
  const getProductTypeConfig = (productType) => {
    return PRODUCT_TYPE_CONFIG[productType] || PRODUCT_TYPE_CONFIG.general;
  };

  // Fonction pour obtenir l'icône d'un type de produit
  const getProductTypeIcon = (productType) => {
    return getProductTypeConfig(productType).icon;
  };

  // Fonction pour obtenir le label d'un type de produit
  const getProductTypeLabel = (productType) => {
    return getProductTypeConfig(productType).label;
  };

  // Fonction pour obtenir la couleur d'un type de produit
  const getProductTypeColor = (productType) => {
    return getProductTypeConfig(productType).color;
  };

  // Fonction pour obtenir la couleur d'accent d'un type de produit
  const getProductTypeAccentColor = (productType) => {
    return getProductTypeConfig(productType).accentColor || COLORS.primary;
  };

  // Fonction pour déclencher la mise à jour des notifications
  const triggerNotificationsUpdate = () => {
    window.dispatchEvent(new Event('ordersUpdated'));
  };

  // Charger les statistiques
  const fetchStats = async () => {
    try {
      const response = await ordersProAPI.getProStats();
      setStats(response.data.stats);
    } catch (error) {
      console.error('❌ Erreur chargement statistiques:', error);
    }
  };

  // Charger les statistiques par type de produit
  const fetchProductTypeStats = async () => {
    try {
      const response = await ordersProAPI.getProProductTypes();
      if (response.data.success) {
        setProductTypeStats(response.data.productTypes);
      }
    } catch (error) {
      console.error('❌ Erreur chargement statistiques types produits:', error);
    }
  };

  // Charger les commandes du pro avec gestion des produits naturels
  const fetchOrders = async (productType = 'all', status = 'all') => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await ordersProAPI.getProOrders({
        productType: productType !== 'all' ? productType : undefined,
        status: status !== 'all' ? status : undefined
      });
      
      if (response.data.success) {
        let filteredOrders = response.data.orders || [];
        
        // Transformation des données pour s'adapter au nouveau format backend
        const transformedOrders = filteredOrders.map(order => ({
          ...order,
          // Adaptation : utilisation de deliveryAddress au lieu de user
          user: {
            firstName: order.deliveryAddress?.firstName || 'Non',
            lastName: order.deliveryAddress?.lastName || 'renseigné',
            email: order.contactInfo?.email ? maskEmail(order.contactInfo.email) : 'Email masqué',
            phone: order.contactInfo?.phone ? maskPhone(order.contactInfo.phone) : undefined
          }
        }));
        
        if (productType === 'produitnaturel') {
          const naturalOrders = transformedOrders.filter(order => 
            order.items?.some(item => 
              item.productType === 'produitnaturel' || 
              (item.productType && [
                'huiles-essentielles', 
                'thes-infusions', 
                'soins-bien-etre', 
                'complements-alimentaires',
                'ambiance-relaxation',
                'accessoires'
              ].includes(item.productType))
            )
          );
          setOrders(naturalOrders);
        } else {
          setOrders(transformedOrders);
        }
        
        if (productType === 'all' && status === 'all') {
          await fetchStats();
        }
        
        await fetchProductTypeStats();
        triggerNotificationsUpdate();
      } else {
        console.error('❌ API a retourné success: false', response.data);
        setOrders([]);
        setError('Erreur lors du chargement des commandes');
      }
    } catch (error) {
      console.error('❌ Erreur chargement commandes:', error);
      setOrders([]);
      setError(
        error.response?.status === 401 
          ? 'Session expirée. Veuillez vous reconnecter.'
          : 'Erreur de connexion au serveur'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Chargement initial
  useEffect(() => {
    fetchOrders('all', 'all');
  }, []);

  // Recharger les commandes quand les filtres changent
  useEffect(() => {
    fetchOrders(activeTab, statusFilter);
  }, [activeTab, statusFilter]);

  // Fonction de rafraîchissement manuel
  const handleRefresh = () => {
    setRefreshing(true);
    setError(null);
    fetchOrders(activeTab, statusFilter);
  };

  // Mettre à jour le statut d'une commande
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await ordersProAPI.updateOrderStatus(orderId, newStatus);
      
      if (response.data.success) {
        fetchOrders(activeTab, statusFilter);
        triggerNotificationsUpdate();
      } else {
        console.error('❌ Erreur API lors de la mise à jour:', response.data);
      }
    } catch (error) {
      console.error('❌ Erreur mise à jour statut:', error);
    }
  };

  // Obtenir les actions disponibles selon le statut actuel
  const getAvailableActions = (order) => {
    if (!order || order.status === STATUS_CANCELLED || order.status === 'delivered') {
      return [];
    }

    const currentStatusConfig = STATUS_CONFIG[order.status];
    const actions = [];

    // Toujours permettre l'annulation sauf pour les commandes livrées
    if (order.status !== 'delivered') {
      actions.push({
        label: 'Annuler la commande',
        action: () => updateOrderStatus(order.id, STATUS_CANCELLED),
        variant: 'destructive',
        type: 'cancel',
        icon: XCircle
      });
    }

    // Ajouter l'action suivante dans le workflow
    if (currentStatusConfig.nextStatus) {
      actions.push({
        label: currentStatusConfig.nextLabel,
        action: () => updateOrderStatus(order.id, currentStatusConfig.nextStatus),
        variant: 'default',
        type: 'next',
        icon: CheckCircle
      });
    }

    return actions;
  };

  // Obtenir tous les statuts disponibles pour le dropdown (inclut l'annulation)
  const getAvailableStatuses = (order) => {
    if (!order) return [];

    const currentStatus = order.status;
    const currentIndex = STATUS_WORKFLOW.indexOf(currentStatus);
    const statuses = [];

    // Si la commande est annulée ou livrée, aucun changement possible
    if (currentStatus === STATUS_CANCELLED || currentStatus === 'delivered') {
      return [];
    }

    // Ajouter les statuts suivants dans le workflow
    for (let i = currentIndex + 1; i < STATUS_WORKFLOW.length; i++) {
      const status = STATUS_WORKFLOW[i];
      const config = STATUS_CONFIG[status];
      statuses.push({
        value: status,
        label: `Marquer comme ${config.label.toLowerCase()}`,
        description: `Passer la commande au statut "${config.label}"`,
        icon: config.icon,
        color: config.color
      });
    }

    // Toujours permettre l'annulation
    statuses.push({
      value: STATUS_CANCELLED,
      label: 'Annuler la commande',
      description: 'Annuler définitivement cette commande',
      icon: XCircle,
      color: '#DC2626',
      destructive: true
    });

    return statuses;
  };

  // Fonction pour extraire les types de produits uniques d'une commande
  const getUniqueProductTypes = (order) => {
    if (!order.items || !Array.isArray(order.items)) return [];
    
    const productTypes = new Set();
    
    order.items.forEach(item => {
      if (item.productType) {
        productTypes.add(item.productType);
      }
    });
    
    return Array.from(productTypes);
  };

  // Fonction pour vérifier si une commande contient des produits naturels
  const hasNaturalProducts = (order) => {
    return order.items?.some(item => 
      item.productType === 'produitnaturel' || 
      (item.productType && [
        'huiles-essentielles', 
        'thes-infusions', 
        'soins-bien-etre', 
        'complements-alimentaires',
        'ambiance-relaxation',
        'accessoires'
      ].includes(item.productType))
    );
  };

  // Filtrer les commandes (pour la recherche côté client)
  const filteredOrders = orders.filter(order => {
    if (!order) return false;
    
    const matchesSearch = 
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.deliveryAddress?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.deliveryAddress?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.contactInfo?.email && maskEmail(order.contactInfo.email).toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearch;
  });

  // Obtenir la couleur du badge selon le statut
  const getStatusBadge = (status) => {
    const config = STATUS_CONFIG[status] || { label: status, variant: 'secondary', icon: Clock };
    const IconComponent = config.icon;
    
    return (
      <Badge 
        variant={config.variant} 
        className="flex items-center gap-1 w-fit"
        style={{ 
          backgroundColor: config.bgColor,
          color: config.color,
          borderColor: config.borderColor
        }}
      >
        <IconComponent className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  // Obtenir la couleur de bordure selon le statut (pour les cartes)
  const getStatusBorderColor = (status) => {
    const config = STATUS_CONFIG[status];
    return config ? { borderColor: config.color } : { borderColor: '#6B7280' };
  };

  // Ouvrir les détails d'une commande
  const openOrderDetails = (order) => {
    if (!order) return;
    
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  // Formater la date
  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue';
    
    const date = new Date(dateString);
    return {
      full: date.toLocaleDateString('fr-FR'),
      time: date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      relative: getRelativeTime(date)
    };
  };

  // Obtenir le temps relatif
  const getRelativeTime = (date) => {
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'À l\'instant';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    if (diffInHours < 168) return `Il y a ${Math.floor(diffInHours / 24)}j`;
    return `Il y a ${Math.floor(diffInHours / 168)}sem`;
  };

  // Gérer le changement d'onglet
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setStatusFilter('all');
  };

  // Composant Dropdown pour les statuts
  const StatusDropdown = ({ order }) => {
    const availableStatuses = getAvailableStatuses(order);
    const currentStatusConfig = STATUS_CONFIG[order.status];

    if (availableStatuses.length === 0) {
      return (
        <div className="flex items-center gap-2 text-sm" style={{ color: currentStatusConfig.color }}>
          <currentStatusConfig.icon className="h-4 w-4" />
          {currentStatusConfig.label}
        </div>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2" style={{ borderColor: COLORS.separator }}>
            <span style={{ color: COLORS.smallText }}>Changer le statut</span>
            <ChevronDown className="h-4 w-4" style={{ color: COLORS.smallText }} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <div className="p-2 border-b" style={{ borderColor: COLORS.separator }}>
            <div className="text-sm font-medium" style={{ color: COLORS.secondaryText }}>Statut actuel</div>
            <div className="flex items-center gap-2 mt-1">
              <currentStatusConfig.icon className="h-4 w-4" style={{ color: currentStatusConfig.color }} />
              <span className="text-sm" style={{ color: currentStatusConfig.color }}>{currentStatusConfig.label}</span>
            </div>
          </div>
          {availableStatuses.map((status, index) => {
            const IconComponent = status.icon;
            return (
              <DropdownMenuItem
                key={index}
                onClick={() => updateOrderStatus(order.id, status.value)}
                className={`flex items-center gap-3 p-3 cursor-pointer ${
                  status.destructive 
                    ? 'hover:bg-red-50' 
                    : 'hover:bg-gray-50'
                }`}
                style={{ color: status.destructive ? '#DC2626' : COLORS.smallText }}
              >
                <IconComponent className="h-4 w-4" style={{ color: status.color || COLORS.primary }} />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{status.label}</span>
                  <span className="text-xs" style={{ color: COLORS.logo }}>{status.description}</span>
                </div>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  // Composant Carte pour mobile
  const OrderCard = ({ order }) => {
    const availableActions = getAvailableActions(order);
    const dateInfo = formatDate(order.createdAt);
    const statusBorderStyle = getStatusBorderColor(order.status);
    const productTypes = getUniqueProductTypes(order);
    const currentStatusConfig = STATUS_CONFIG[order.status];

    return (
      <Card className="hover:shadow-md transition-shadow" style={{ borderLeftWidth: '4px', ...statusBorderStyle, borderColor: COLORS.separator }}>
        <CardContent className="p-4">
          {/* En-tête de la carte */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" style={{ color: COLORS.logo }} />
              <span className="font-semibold text-sm" style={{ color: COLORS.smallText }}>
                {order.orderNumber || 'N/A'}
              </span>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg" style={{ color: COLORS.primary }}>
                €{(order.totalAmount || 0).toFixed(2)}
              </div>
              <div className="text-xs" style={{ color: COLORS.logo }}>{dateInfo.relative}</div>
            </div>
          </div>

          {/* Informations client (adaptées au nouveau format) */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2">
              <Users className="h-3 w-3" style={{ color: COLORS.logo }} />
              <span className="font-medium text-sm" style={{ color: COLORS.smallText }}>
                {order.deliveryAddress?.firstName || 'Non'} {order.deliveryAddress?.lastName || 'renseigné'}
              </span>
            </div>
            {order.contactInfo?.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3" style={{ color: COLORS.logo }} />
                <span className="text-xs truncate" style={{ color: COLORS.logo }}>
                  {maskEmail(order.contactInfo.email)}
                </span>
              </div>
            )}
            {order.contactInfo?.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-3 w-3" style={{ color: COLORS.logo }} />
                <span className="text-xs truncate" style={{ color: COLORS.logo }}>
                  {maskPhone(order.contactInfo.phone)}
                </span>
              </div>
            )}
          </div>

          {/* Articles et types de produits */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-3 w-3" style={{ color: COLORS.logo }} />
              <span className="text-sm font-medium" style={{ color: COLORS.smallText }}>
                {(order.items?.length || 0)} article(s)
              </span>
            </div>
            
            {/* Affichage des types de produits avec nouvelles icônes */}
            {productTypes.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {productTypes.map((productType, index) => {
                  const IconComponent = getProductTypeIcon(productType);
                  const accentColor = getProductTypeAccentColor(productType);
                  return (
                    <Badge 
                      key={index} 
                      variant="outline" 
                      className="text-xs"
                      style={{ 
                        backgroundColor: `${accentColor}15`,
                        color: accentColor,
                        borderColor: `${accentColor}30`
                      }}
                    >
                      <IconComponent className="h-2 w-2 mr-1" />
                      {getProductTypeLabel(productType)}
                    </Badge>
                  );
                })}
              </div>
            )}
            
            {/* Liste des articles */}
            {order.items && order.items.length > 0 && (
              <div className="text-xs pl-5" style={{ color: COLORS.logo }}>
                {order.items.slice(0, 2).map((item, index) => (
                  <div key={index} className="truncate">
                    • {item.name} {item.quantity > 1 && `(x${item.quantity})`}
                  </div>
                ))}
                {order.items.length > 2 && (
                  <div className="opacity-75">... et {order.items.length - 2} autre(s)</div>
                )}
              </div>
            )}
          </div>

          {/* Statut et date */}
          <div className="flex justify-between items-center mb-3">
            <div>
              {getStatusBadge(order.status)}
            </div>
            <div className="text-xs text-right" style={{ color: COLORS.logo }}>
              <div>{dateInfo.full}</div>
              <div>{dateInfo.time}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-3" style={{ borderTopColor: COLORS.separator, borderTopWidth: '1px' }}>
            <Button
              variant="outline"
              size="sm"
              onClick={() => openOrderDetails(order)}
              className="flex-1 flex items-center gap-1 text-xs"
              style={{ borderColor: COLORS.separator, color: COLORS.smallText }}
            >
              <Eye className="h-3 w-3" />
              Détails
            </Button>
            
            {/* Dropdown pour changer le statut */}
            <div className="flex-1">
              <StatusDropdown order={order} />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Affichage des erreurs
  if (error) {
    return (
      <div className="container mx-auto p-6" style={{ backgroundColor: COLORS.lightBg }}>
        <div className="text-center py-12">
          <XCircle className="h-16 w-16 mx-auto mb-4" style={{ color: '#DC2626' }} />
          <h2 className="text-2xl font-bold mb-2" style={{ color: COLORS.secondaryText }}>Erreur</h2>
          <p className="mb-6" style={{ color: COLORS.logo }}>{error}</p>
          <Button onClick={handleRefresh} variant="outline" style={{ borderColor: COLORS.separator }}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  // Affichage du chargement
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: COLORS.lightBg }}>
        <div className="text-center">
          <div className="w-8 h-8 border-4 rounded-full animate-spin mx-auto mb-4" style={{ borderColor: COLORS.primary, borderTopColor: 'transparent' }}></div>
          <p style={{ color: COLORS.smallText }}>Chargement de vos commandes...</p>
          <p className="text-sm mt-2" style={{ color: COLORS.logo }}>Récupération des données pour {getProductTypeLabel(activeTab)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-6 space-y-6" style={{ backgroundColor: COLORS.lightBg }}>
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold" style={{ color: COLORS.secondaryText }}>Gestion des Commandes</h1>
          <p className="mt-2 text-sm lg:text-base" style={{ color: COLORS.logo }}>
            Gérez et suivez toutes les commandes de votre boutique
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          size="sm" 
          className="w-full sm:w-auto"
          disabled={refreshing}
          style={{ borderColor: COLORS.separator }}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Actualisation...' : 'Actualiser'}
        </Button>
      </div>

      {/* Message d'information sur la protection des données */}
      <Card style={{ borderColor: COLORS.separator, backgroundColor: '#FFFBF5' }}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 mt-0.5" style={{ color: COLORS.primary }} />
            <div>
              <p className="text-sm font-medium" style={{ color: COLORS.secondaryText }}>
                🔒 Protection des données personnelles
              </p>
              <p className="text-xs mt-1" style={{ color: COLORS.logo }}>
                Seules les informations nécessaires à la livraison sont affichées. 
                Les coordonnées complètes sont masquées conformément au RGPD.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistiques améliorées */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <Card style={{ borderColor: COLORS.separator }}>
          <CardHeader className="pb-2 p-4 lg:p-6">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="text-xs lg:text-sm" style={{ color: COLORS.smallText }}>Total Commandes</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 lg:p-6 pt-0">
            <div className="text-xl lg:text-2xl font-bold" style={{ color: COLORS.secondaryText }}>{stats.total}</div>
            <p className="text-xs" style={{ color: COLORS.logo }}>{stats.thisWeek} cette semaine</p>
          </CardContent>
        </Card>

        <Card style={{ borderColor: COLORS.separator }}>
          <CardHeader className="pb-2 p-4 lg:p-6">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" style={{ color: COLORS.primary }} />
              <span className="text-xs lg:text-sm" style={{ color: COLORS.smallText }}>En Cours</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 lg:p-6 pt-0">
            <div className="text-xl lg:text-2xl font-bold" style={{ color: COLORS.primary }}>
              {stats.confirmed + stats.processing + stats.shipped}
            </div>
            <p className="text-xs" style={{ color: COLORS.logo }}>À traiter</p>
          </CardContent>
        </Card>

        <Card style={{ borderColor: COLORS.separator }}>
          <CardHeader className="pb-2 p-4 lg:p-6">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" style={{ color: '#F97316' }} />
              <span className="text-xs lg:text-sm" style={{ color: COLORS.smallText }}>En Attente</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 lg:p-6 pt-0">
            <div className="text-xl lg:text-2xl font-bold" style={{ color: '#F97316' }}>{stats.pending}</div>
            <p className="text-xs" style={{ color: COLORS.logo }}>En attente de confirmation</p>
          </CardContent>
        </Card>

        <Card style={{ borderColor: COLORS.separator }}>
          <CardHeader className="pb-2 p-4 lg:p-6">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Euro className="h-4 w-4" style={{ color: COLORS.primary }} />
              <span className="text-xs lg:text-sm" style={{ color: COLORS.smallText }}>Chiffre d'Affaires</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 lg:p-6 pt-0">
            <div className="text-xl lg:text-2xl font-bold" style={{ color: COLORS.primary }}>
              €{stats.totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs" style={{ color: COLORS.logo }}>€{stats.monthlyRevenue.toFixed(2)} ce mois</p>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques par type de produit */}
      {productTypeStats.length > 0 && (
        <Card style={{ borderColor: COLORS.separator }}>
          <CardHeader className="p-4 lg:p-6">
            <CardTitle className="text-lg lg:text-xl flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              <span style={{ color: COLORS.secondaryText }}>Performance par Type de Produit</span>
            </CardTitle>
            <CardDescription style={{ color: COLORS.logo }}>
              Répartition des ventes par type de produits
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 lg:p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {productTypeStats.slice(0, 6).map((productType, index) => {
                const config = getProductTypeConfig(productType.productType);
                const IconComponent = config.icon;
                const accentColor = getProductTypeAccentColor(productType.productType);
                return (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg" style={{ borderColor: COLORS.separator }}>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full" style={{ backgroundColor: `${accentColor}15` }}>
                        <IconComponent className="h-4 w-4" style={{ color: accentColor }} />
                      </div>
                      <div>
                        <div className="font-medium text-sm" style={{ color: COLORS.smallText }}>{config.label}</div>
                        <div className="text-xs" style={{ color: COLORS.logo }}>{productType.itemsCount} articles</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold" style={{ color: COLORS.primary }}>€{productType.revenue}</div>
                      <div className="text-xs" style={{ color: COLORS.logo }}>{productType.percentage}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation par types de produits avec produits naturels */}
      <Card style={{ borderColor: COLORS.separator }}>
        <CardContent className="p-4 lg:p-6">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 mb-4" style={{ backgroundColor: `${COLORS.separator}30` }}>
              <TabsTrigger value="all" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span className="hidden sm:inline">Toutes</span>
                <Badge variant="secondary" className="text-xs">
                  {stats.total || 0}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="food" className="flex items-center gap-2">
                <Utensils className="h-4 w-4" />
                <span className="hidden sm:inline">Alimentation</span>
                <Badge variant="secondary" className="text-xs">
                  {productTypeStats.find(stat => stat.productType === 'food')?.ordersCount || 0}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="general" className="flex items-center gap-2">
                <Box className="h-4 w-4" />
                <span className="hidden sm:inline">Materiaux</span>
                <Badge variant="secondary" className="text-xs">
                  {productTypeStats.find(stat => stat.productType === 'general')?.ordersCount || 0}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="produitnaturel" className="flex items-center gap-2">
                <Leaf className="h-4 w-4" />
                <span className="hidden sm:inline">Naturels</span>
                <Badge variant="secondary" className="text-xs">
                  {productTypeStats.find(stat => stat.productType === 'produitnaturel')?.ordersCount || 0}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Filtres et recherche */}
      <Card style={{ borderColor: COLORS.separator }}>
        <CardHeader className="p-4 lg:p-6">
          <CardTitle className="text-lg lg:text-xl flex items-center gap-2">
            <Filter className="h-5 w-5" />
            <span style={{ color: COLORS.secondaryText }}>Filtrer les Commandes</span>
          </CardTitle>
          <CardDescription style={{ color: COLORS.logo }}>
            {orders.length} commande(s) {activeTab !== 'all' ? `de type "${getProductTypeLabel(activeTab)}"` : 'au total'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 lg:p-6 pt-0">
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4" style={{ color: COLORS.logo }} />
              <Input
                placeholder="Rechercher par numéro, nom client, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm lg:text-base"
                style={{ 
                  borderColor: COLORS.separator,
                  color: COLORS.smallText
                }}
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px] text-sm lg:text-base" style={{ borderColor: COLORS.separator }}>
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="confirmed">Confirmée</SelectItem>
                <SelectItem value="processing">En traitement</SelectItem>
                <SelectItem value="shipped">Expédiée</SelectItem>
                <SelectItem value="delivered">Livrée</SelectItem>
                <SelectItem value="cancelled">Annulée</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Tableau desktop et Cartes mobile */}
      <Card style={{ borderColor: COLORS.separator }}>
        <CardHeader className="p-4 lg:p-6">
          <CardTitle className="text-lg lg:text-xl" style={{ color: COLORS.secondaryText }}>
            {activeTab === 'all' ? 'Toutes les Commandes' : `Commandes - ${getProductTypeLabel(activeTab)}`}
          </CardTitle>
          <CardDescription style={{ color: COLORS.logo }}>
            {filteredOrders.length} commande(s) trouvée(s) après filtrage
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 lg:p-6">
          {orders.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Package className="h-16 w-16 mx-auto mb-4" style={{ color: COLORS.separator }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: COLORS.secondaryText }}>
                {activeTab === 'all' ? 'Aucune commande trouvée' : `Aucune commande ${getProductTypeLabel(activeTab).toLowerCase()}`}
              </h3>
              <p className="mb-4" style={{ color: COLORS.logo }}>
                {loading 
                  ? 'Chargement en cours...' 
                  : activeTab !== 'all' 
                    ? `Vous n'avez pas de commandes de type "${getProductTypeLabel(activeTab)}" pour le moment.`
                    : "Vous n'avez pas encore de commandes. Elles apparaîtront ici lorsqu'un client passera commande sur vos produits."
                }
              </p>
              {!loading && (
                <div className="space-y-2">
                  <Button onClick={handleRefresh} variant="outline" style={{ borderColor: COLORS.separator }}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Actualiser
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Version Desktop - Tableau */}
              <div className="hidden lg:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead style={{ color: COLORS.secondaryText }}>Numéro</TableHead>
                      <TableHead style={{ color: COLORS.secondaryText }}>Client (Données limitées)</TableHead>
                      <TableHead style={{ color: COLORS.secondaryText }}>Articles</TableHead>
                      <TableHead style={{ color: COLORS.secondaryText }}>Types</TableHead>
                      <TableHead style={{ color: COLORS.secondaryText }}>Total</TableHead>
                      <TableHead style={{ color: COLORS.secondaryText }}>Statut</TableHead>
                      <TableHead style={{ color: COLORS.secondaryText }}>Date</TableHead>
                      <TableHead style={{ color: COLORS.secondaryText }}>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8" style={{ color: COLORS.logo }}>
                          Aucune commande ne correspond aux filtres
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map((order) => {
                        const dateInfo = formatDate(order.createdAt);
                        const productTypes = getUniqueProductTypes(order);
                        
                        return (
                          <TableRow key={order.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Package className="h-4 w-4" style={{ color: COLORS.logo }} />
                                <span style={{ color: COLORS.smallText }}>{order.orderNumber || 'N/A'}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium" style={{ color: COLORS.smallText }}>
                                  {order.deliveryAddress?.firstName || 'Non'} {order.deliveryAddress?.lastName || 'renseigné'}
                                </div>
                                <div className="text-sm" style={{ color: COLORS.logo }}>
                                  {order.contactInfo?.email ? maskEmail(order.contactInfo.email) : 'Contact masqué'}
                                </div>
                                {order.contactInfo?.phone && (
                                  <div className="text-xs mt-1" style={{ color: COLORS.logo }}>
                                    {maskPhone(order.contactInfo.phone)}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm" style={{ color: COLORS.smallText }}>
                                {(order.items?.length || 0)} article(s)
                                {order.items && order.items.length > 0 && (
                                  <div className="text-xs mt-1" style={{ color: COLORS.logo }}>
                                    {order.items.slice(0, 2).map(item => item.name).join(', ')}
                                    {order.items.length > 2 && '...'}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {productTypes.map((productType, index) => {
                                  const IconComponent = getProductTypeIcon(productType);
                                  const accentColor = getProductTypeAccentColor(productType);
                                  return (
                                    <Badge 
                                      key={index} 
                                      variant="outline" 
                                      className="text-xs"
                                      style={{ 
                                        backgroundColor: `${accentColor}15`,
                                        color: accentColor,
                                        borderColor: `${accentColor}30`
                                      }}
                                    >
                                      <IconComponent className="h-2 w-2 mr-1" />
                                      {getProductTypeLabel(productType)}
                                    </Badge>
                                  );
                                })}
                              </div>
                            </TableCell>
                            <TableCell className="font-bold" style={{ color: COLORS.primary }}>
                              €{(order.totalAmount || 0).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(order.status)}
                            </TableCell>
                            <TableCell className="text-sm">
                              {order.createdAt ? (
                                <>
                                  <span style={{ color: COLORS.smallText }}>{dateInfo.full}</span>
                                  <div className="text-xs" style={{ color: COLORS.logo }}>
                                    {dateInfo.time}
                                  </div>
                                </>
                              ) : (
                                <span style={{ color: COLORS.logo }}>Date inconnue</span>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openOrderDetails(order)}
                                  className="flex items-center gap-1"
                                  style={{ borderColor: COLORS.separator, color: COLORS.smallText }}
                                >
                                  <Eye className="h-3 w-3" />
                                  Détails
                                </Button>
                                
                                {/* Dropdown pour changer le statut */}
                                <StatusDropdown order={order} />
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Version Mobile - Cartes */}
              <div className="lg:hidden space-y-4 p-4">
                {filteredOrders.length === 0 ? (
                  <div className="text-center py-8" style={{ color: COLORS.logo }}>
                    Aucune commande ne correspond aux filtres
                  </div>
                ) : (
                  filteredOrders.map((order) => (
                    <OrderCard key={order.id} order={order} />
                  ))
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Modal des détails */}
      <ProOrderDetailsModal
        order={selectedOrder}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedOrder(null);
        }}
        onStatusUpdate={updateOrderStatus}
      />
    </div>
  );
};

export default ProOrders;