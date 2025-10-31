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
  ChevronDown
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
import api from '@/lib/api';
import ProOrderDetailsModal from './ProOrderDetailsModal';

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

  // Configuration des statuts
  const STATUS_CONFIG = {
    pending: { 
      label: 'En attente', 
      variant: 'secondary', 
      icon: Clock,
      nextLabel: 'Confirmer',
      nextStatus: 'confirmed'
    },
    confirmed: { 
      label: 'Confirmée', 
      variant: 'default', 
      icon: CheckCircle,
      nextLabel: 'Commencer le traitement',
      nextStatus: 'processing'
    },
    processing: { 
      label: 'En traitement', 
      variant: 'default', 
      icon: Package,
      nextLabel: 'Expédier',
      nextStatus: 'shipped'
    },
    shipped: { 
      label: 'Expédiée', 
      variant: 'default', 
      icon: Truck,
      nextLabel: 'Marquer comme livrée',
      nextStatus: 'delivered'
    },
    delivered: { 
      label: 'Livrée', 
      variant: 'success', 
      icon: CheckCircle,
      nextLabel: null,
      nextStatus: null
    },
    cancelled: { 
      label: 'Annulée', 
      variant: 'destructive', 
      icon: XCircle,
      nextLabel: null,
      nextStatus: null
    }
  };

  // Fonction pour déclencher la mise à jour des notifications
  const triggerNotificationsUpdate = () => {
    window.dispatchEvent(new Event('ordersUpdated'));
  };

  // Charger les statistiques
  const fetchStats = async () => {
    try {
      console.log('📊 Chargement des statistiques...');
      const response = await api.get('/orders/pro/stats');
      console.log('✅ Statistiques reçues:', response.data);
      setStats(response.data.stats);
    } catch (error) {
      console.error('❌ Erreur chargement statistiques:', error);
    }
  };

  // Charger les statistiques par type de produit
  const fetchProductTypeStats = async () => {
    try {
      console.log('📈 Chargement des statistiques par type de produit...');
      const response = await api.get('/orders/pro/product-types');
      if (response.data.success) {
        console.log('✅ Statistiques types produits reçues:', response.data.productTypes);
        setProductTypeStats(response.data.productTypes);
      }
    } catch (error) {
      console.error('❌ Erreur chargement statistiques types produits:', error);
    }
  };

  // CORRIGÉ : Charger les commandes du pro avec une seule route
  const fetchOrders = async (productType = 'all', status = 'all') => {
    try {
      setLoading(true);
      console.log(`🔄 Chargement des commandes (productType: ${productType}, status: ${status})...`);
      
      // Construire les paramètres de requête
      const params = new URLSearchParams();
      if (productType !== 'all') params.append('productType', productType);
      if (status !== 'all') params.append('status', status);
      
      // Utiliser une seule route avec paramètres
      const response = await api.get(`/orders/pro?${params.toString()}`);
      
      console.log('✅ Commandes reçues:', response.data);
      
      if (response.data.success) {
        setOrders(response.data.orders || []);
        
        // Charger les stats seulement pour l'onglet "all"
        if (productType === 'all' && status === 'all') {
          await fetchStats();
        }
        
        await fetchProductTypeStats();
        
        // Déclencher la mise à jour des notifications
        triggerNotificationsUpdate();
      } else {
        console.error('❌ API a retourné success: false', response.data);
        setOrders([]);
      }
    } catch (error) {
      console.error('❌ Erreur chargement commandes:', error);
      setOrders([]);
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
    fetchOrders(activeTab, statusFilter);
  };

  // Mettre à jour le statut d'une commande
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      console.log(`🔄 Mise à jour statut commande ${orderId} vers: ${newStatus}`);
      
      const response = await api.put(`/orders/pro/${orderId}/status`, { status: newStatus });
      
      if (response.data.success) {
        console.log('✅ Statut mis à jour avec succès');
        // Recharger les données actuelles sans changer les filtres
        fetchOrders(activeTab, statusFilter);
        
        // Déclencher la mise à jour des notifications
        triggerNotificationsUpdate();
      } else {
        console.error('❌ Erreur API lors de la mise à jour:', response.data);
      }
    } catch (error) {
      console.error('❌ Erreur mise à jour statut:', error);
    }
  };

  // CORRIGÉ : Obtenir les actions disponibles selon le statut actuel
  const getAvailableActions = (order) => {
    if (!order || order.status === STATUS_CANCELLED || order.status === 'delivered') {
      return []; // Aucune action possible si annulé ou livré
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
        icon: config.icon
      });
    }

    // Toujours permettre l'annulation
    statuses.push({
      value: STATUS_CANCELLED,
      label: 'Annuler la commande',
      description: 'Annuler définitivement cette commande',
      icon: XCircle,
      destructive: true
    });

    return statuses;
  };

  // Filtrer les commandes (pour la recherche côté client)
  const filteredOrders = orders.filter(order => {
    if (!order) return false;
    
    const matchesSearch = 
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  // Obtenir la couleur du badge selon le statut
  const getStatusBadge = (status) => {
    const config = STATUS_CONFIG[status] || { label: status, variant: 'secondary', icon: Clock };
    const IconComponent = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center gap-1 w-fit">
        <IconComponent className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  // Obtenir la couleur de fond selon le statut (pour les cartes)
  const getStatusBorderColor = (status) => {
    const colors = {
      pending: 'border-l-orange-500',
      confirmed: 'border-l-blue-500',
      processing: 'border-l-purple-500',
      shipped: 'border-l-indigo-500',
      delivered: 'border-l-green-500',
      cancelled: 'border-l-red-500'
    };
    return colors[status] || 'border-l-gray-500';
  };

  // Obtenir la couleur pour les types de produits
  const getProductTypeColor = (productType) => {
    const colors = {
      'food': 'bg-green-100 text-green-800 border-green-200',
      'general': 'bg-blue-100 text-blue-800 border-blue-200',
      'default': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[productType] || colors.default;
  };

  // Obtenir l'icône pour le type de produit
  const getProductTypeIcon = (productType) => {
    const icons = {
      'food': Utensils,
      'general': Box
    };
    return icons[productType] || Package;
  };

  // Obtenir le label pour le type de produit
  const getProductTypeLabel = (productType) => {
    const labels = {
      'food': 'Alimentation',
      'general': 'Materiaux Généraux'
    };
    return labels[productType] || productType;
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
    // Réinitialiser le filtre de statut quand on change d'onglet
    setStatusFilter('all');
  };

  // Composant Dropdown pour les statuts
  const StatusDropdown = ({ order }) => {
    const availableStatuses = getAvailableStatuses(order);
    const currentStatusConfig = STATUS_CONFIG[order.status];

    if (availableStatuses.length === 0) {
      return (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <currentStatusConfig.icon className="h-4 w-4" />
          {currentStatusConfig.label}
        </div>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <span>Changer le statut</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-64">
          <div className="p-2 border-b">
            <div className="text-sm font-medium">Statut actuel</div>
            <div className="flex items-center gap-2 mt-1">
              <currentStatusConfig.icon className="h-4 w-4" />
              <span className="text-sm">{currentStatusConfig.label}</span>
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
                    ? 'text-red-600 hover:bg-red-50 hover:text-red-700' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <IconComponent className="h-4 w-4" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{status.label}</span>
                  <span className="text-xs text-gray-500">{status.description}</span>
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
    const statusBorderColor = getStatusBorderColor(order.status);

    // Obtenir les types de produits uniques dans la commande
    const productTypes = [...new Set(order.items?.map(item => item.productType).filter(Boolean))];

    return (
      <Card className={`border-l-4 ${statusBorderColor} hover:shadow-md transition-shadow`}>
        <CardContent className="p-4">
          {/* En-tête de la carte */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-400" />
              <span className="font-semibold text-sm">{order.orderNumber || 'N/A'}</span>
            </div>
            <div className="text-right">
              <div className="font-bold text-green-600 text-lg">
                €{(order.totalAmount || 0).toFixed(2)}
              </div>
              <div className="text-xs text-gray-500">{dateInfo.relative}</div>
            </div>
          </div>

          {/* Informations client */}
          <div className="space-y-2 mb-3">
            <div className="flex items-center gap-2">
              <Users className="h-3 w-3 text-gray-400" />
              <span className="font-medium text-sm">
                {order.user?.firstName || 'Non'} {order.user?.lastName || 'renseigné'}
              </span>
            </div>
            {order.user?.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-3 w-3 text-gray-400" />
                <span className="text-xs text-gray-600 truncate">{order.user.email}</span>
              </div>
            )}
          </div>

          {/* Articles et types de produits */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-2">
              <Package className="h-3 w-3 text-gray-400" />
              <span className="text-sm font-medium">
                {(order.items?.length || 0)} article(s)
              </span>
            </div>
            
            {/* Affichage des types de produits */}
            {productTypes.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {productTypes.map((productType, index) => {
                  const IconComponent = getProductTypeIcon(productType);
                  return (
                    <Badge key={index} variant="outline" className={`text-xs ${getProductTypeColor(productType)}`}>
                      <IconComponent className="h-2 w-2 mr-1" />
                      {getProductTypeLabel(productType)}
                    </Badge>
                  );
                })}
              </div>
            )}
            
            {/* Liste des articles */}
            {order.items && order.items.length > 0 && (
              <div className="text-xs text-gray-600 pl-5">
                {order.items.slice(0, 2).map((item, index) => (
                  <div key={index} className="truncate">
                    • {item.name} {item.quantity > 1 && `(x${item.quantity})`}
                  </div>
                ))}
                {order.items.length > 2 && (
                  <div className="text-gray-500">... et {order.items.length - 2} autre(s)</div>
                )}
              </div>
            )}
          </div>

          {/* Statut et date */}
          <div className="flex justify-between items-center mb-3">
            <div>
              {getStatusBadge(order.status)}
            </div>
            <div className="text-xs text-gray-500 text-right">
              <div>{dateInfo.full}</div>
              <div>{dateInfo.time}</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-3 border-t border-gray-100">
            <Button
              variant="outline"
              size="sm"
              onClick={() => openOrderDetails(order)}
              className="flex-1 flex items-center gap-1 text-xs"
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Chargement de vos commandes...</p>
          <p className="text-sm text-gray-500 mt-2">Vérification de la connexion à l'API</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 lg:p-6 space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Gestion des Commandes</h1>
          <p className="text-gray-600 mt-2 text-sm lg:text-base">
            Gérez et suivez toutes les commandes de votre boutique
          </p>
        </div>
        <Button 
          onClick={handleRefresh} 
          variant="outline" 
          size="sm" 
          className="w-full sm:w-auto"
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Actualisation...' : 'Actualiser'}
        </Button>
      </div>

      {/* Statistiques améliorées */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <Card className="col-span-2 lg:col-span-1">
          <CardHeader className="pb-2 p-4 lg:p-6">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="text-xs lg:text-sm">Total Commandes</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 lg:p-6 pt-0">
            <div className="text-xl lg:text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-gray-600">{stats.thisWeek} cette semaine</p>
          </CardContent>
        </Card>

        <Card className="col-span-2 lg:col-span-1">
          <CardHeader className="pb-2 p-4 lg:p-6">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-xs lg:text-sm">En Cours</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 lg:p-6 pt-0">
            <div className="text-xl lg:text-2xl font-bold text-blue-600">
              {stats.confirmed + stats.processing + stats.shipped}
            </div>
            <p className="text-xs text-gray-600">À traiter</p>
          </CardContent>
        </Card>

        <Card className="col-span-2 lg:col-span-1">
          <CardHeader className="pb-2 p-4 lg:p-6">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="text-xs lg:text-sm">En Attente</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 lg:p-6 pt-0">
            <div className="text-xl lg:text-2xl font-bold text-orange-600">{stats.pending}</div>
            <p className="text-xs text-gray-600">En attente de confirmation</p>
          </CardContent>
        </Card>

        <Card className="col-span-2 lg:col-span-1">
          <CardHeader className="pb-2 p-4 lg:p-6">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Euro className="h-4 w-4 text-green-500" />
              <span className="text-xs lg:text-sm">Chiffre d'Affaires</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 lg:p-6 pt-0">
            <div className="text-xl lg:text-2xl font-bold text-green-600">
              €{stats.totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-gray-600">€{stats.monthlyRevenue.toFixed(2)} ce mois</p>
          </CardContent>
        </Card>
      </div>

      {/* Statistiques par type de produit */}
      {productTypeStats.length > 0 && (
        <Card>
          <CardHeader className="p-4 lg:p-6">
            <CardTitle className="text-lg lg:text-xl flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance par Type de Produit
            </CardTitle>
            <CardDescription>
              Répartition des ventes par type de produits
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 lg:p-6 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {productTypeStats.slice(0, 6).map((productType, index) => {
                const IconComponent = getProductTypeIcon(productType.productType);
                return (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${getProductTypeColor(productType.productType)}`}>
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="font-medium text-sm">{getProductTypeLabel(productType.productType)}</div>
                        <div className="text-xs text-gray-600">{productType.itemsCount} articles</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">€{productType.revenue}</div>
                      <div className="text-xs text-gray-500">{productType.percentage}%</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation par types de produits */}
      <Card>
        <CardContent className="p-4 lg:p-6">
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 mb-4">
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
                <span className="hidden sm:inline">Materiaux Généraux</span>
                <Badge variant="secondary" className="text-xs">
                  {productTypeStats.find(stat => stat.productType === 'general')?.ordersCount || 0}
                </Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader className="p-4 lg:p-6">
          <CardTitle className="text-lg lg:text-xl flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtrer les Commandes
          </CardTitle>
          <CardDescription>
            {orders.length} commande(s) {activeTab !== 'all' ? `de type "${getProductTypeLabel(activeTab)}"` : 'au total'}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 lg:p-6 pt-0">
          <div className="flex flex-col sm:flex-row gap-3 lg:gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par numéro, client, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 text-sm lg:text-base"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px] text-sm lg:text-base">
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
      <Card>
        <CardHeader className="p-4 lg:p-6">
          <CardTitle className="text-lg lg:text-xl">
            {activeTab === 'all' ? 'Toutes les Commandes' : `Commandes - ${getProductTypeLabel(activeTab)}`}
          </CardTitle>
          <CardDescription>
            {filteredOrders.length} commande(s) trouvée(s) après filtrage
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 lg:p-6">
          {orders.length === 0 ? (
            <div className="text-center py-12 px-4">
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucune commande trouvée</h3>
              <p className="text-gray-600 mb-4">
                {loading ? 'Chargement en cours...' : 'Aucune commande n\'a été trouvée dans la base de données.'}
              </p>
              <Button onClick={handleRefresh} variant="outline">
                Réessayer
              </Button>
            </div>
          ) : (
            <>
              {/* Version Desktop - Tableau */}
              <div className="hidden lg:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Numéro</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Articles</TableHead>
                      <TableHead>Types</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                          Aucune commande ne correspond aux filtres
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map((order) => {
                        const dateInfo = formatDate(order.createdAt);
                        const productTypes = [...new Set(order.items?.map(item => item.productType).filter(Boolean))];
                        
                        return (
                          <TableRow key={order.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">
                              <div className="flex items-center gap-2">
                                <Package className="h-4 w-4 text-gray-400" />
                                {order.orderNumber || 'N/A'}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <div className="font-medium">
                                  {order.user?.firstName || 'Non'} {order.user?.lastName || 'renseigné'}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {order.user?.email || 'Email non disponible'}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {(order.items?.length || 0)} article(s)
                                {order.items && order.items.length > 0 && (
                                  <div className="text-xs text-gray-500 mt-1">
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
                                  return (
                                    <Badge key={index} variant="outline" className={`text-xs ${getProductTypeColor(productType)}`}>
                                      <IconComponent className="h-2 w-2 mr-1" />
                                      {getProductTypeLabel(productType)}
                                    </Badge>
                                  );
                                })}
                              </div>
                            </TableCell>
                            <TableCell className="font-bold text-green-600">
                              €{(order.totalAmount || 0).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              {getStatusBadge(order.status)}
                            </TableCell>
                            <TableCell className="text-sm">
                              {order.createdAt ? (
                                <>
                                  {dateInfo.full}
                                  <div className="text-xs text-gray-500">
                                    {dateInfo.time}
                                  </div>
                                </>
                              ) : (
                                'Date inconnue'
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openOrderDetails(order)}
                                  className="flex items-center gap-1"
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
                  <div className="text-center py-8 text-gray-500">
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