// components/orders/UserOrders.jsx
import { useState, useEffect } from 'react';
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  XCircle, 
  MapPin, 
  CreditCard,
  User,
  DollarSign,
  Calendar,
  RefreshCw,
  Filter,
  Download,
  MessageCircle,
  Star,
  ChevronDown,
  ChevronUp,
  Eye,
  FileText,
  ShoppingBag,
  TrendingUp,
  Award,
  ShoppingCart,
  Euro
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import api from '@/lib/api';

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('all');
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [downloadingInvoice, setDownloadingInvoice] = useState({});
  const [contactingSupport, setContactingSupport] = useState({});
  const [leavingReview, setLeavingReview] = useState({});
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    totalSpent: 0,
    thisWeek: 0,
    thisMonth: 0,
    averageOrder: 0,
    favoriteCategory: '',
    completionRate: 0,
    lastOrderDate: null
  });

  // Fonction pour calculer les stats avancées à partir des commandes
  const calculateStatsFromOrders = (orders) => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Calcul des statistiques de base
    const total = orders.length;
    const pending = orders.filter(order => order.status === 'pending').length;
    const confirmed = orders.filter(order => order.status === 'confirmed').length;
    const processing = orders.filter(order => order.status === 'processing').length;
    const shipped = orders.filter(order => order.status === 'shipped').length;
    const delivered = orders.filter(order => order.status === 'delivered').length;
    const cancelled = orders.filter(order => order.status === 'cancelled').length;
    
    const totalSpent = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    const thisWeek = orders.filter(order => new Date(order.createdAt) > oneWeekAgo).length;
    const thisMonth = orders.filter(order => new Date(order.createdAt) > oneMonthAgo).length;
    const averageOrder = total > 0 ? totalSpent / total : 0;

    // Calcul du taux de complétion (commandes livrées / total des commandes non annulées)
    const completedOrders = delivered;
    const nonCancelledOrders = total - cancelled;
    const completionRate = nonCancelledOrders > 0 ? (completedOrders / nonCancelledOrders) * 100 : 0;

    // Trouver la catégorie favorite
    const categoryCount = {};
    orders.forEach(order => {
      order.items?.forEach(item => {
        const category = item.category || 'Général';
        categoryCount[category] = (categoryCount[category] || 0) + item.quantity;
      });
    });

    const favoriteCategory = Object.keys(categoryCount).length > 0 
      ? Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0][0]
      : 'Aucune';

    // Date de la dernière commande
    const lastOrderDate = orders.length > 0 
      ? new Date(Math.max(...orders.map(order => new Date(order.createdAt))))
      : null;

    return {
      total,
      pending,
      confirmed,
      processing,
      shipped,
      delivered,
      cancelled,
      totalSpent,
      thisWeek,
      thisMonth,
      averageOrder,
      favoriteCategory,
      completionRate,
      lastOrderDate
    };
  };

  // Charger les commandes de l'utilisateur
  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get('/orders/user/my-orders');
      
      if (response.data.success) {
        const ordersData = response.data.orders || [];
        setOrders(ordersData);
        const calculatedStats = calculateStatsFromOrders(ordersData);
        setStats(calculatedStats);
        toast.success("Commandes mises à jour");
      } else {
        setOrders([]);
        setStats(calculateStatsFromOrders([]));
        toast.error("Erreur lors du chargement des commandes");
      }
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
      const mockOrders = getMockOrders();
      setOrders(mockOrders);
      setStats(calculateStatsFromOrders(mockOrders));
      toast.info("Données de démonstration chargées");
    } finally {
      setLoading(false);
    }
  };

  // Données mockées pour le développement
  const getMockOrders = () => [
    {
      id: '1',
      orderNumber: 'CMD-2024-001',
      status: 'delivered',
      totalAmount: 150.50,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      items: [
        {
          productId: 'prod1',
          name: 'Smartphone Premium',
          price: 75.25,
          quantity: 2,
          category: 'Électronique',
          images: ['/api/placeholder/80/80'],
          itemTotal: 150.50
        }
      ],
      shippingAddress: {
        firstName: 'Jean',
        lastName: 'Dupont',
        address: '123 Rue de la Paix',
        city: 'Paris',
        postalCode: '75001',
        country: 'France'
      },
      paymentMethod: 'card',
      paymentStatus: 'paid',
      invoiceUrl: '/api/invoices/1'
    },
    {
      id: '2',
      orderNumber: 'CMD-2024-002',
      status: 'shipped',
      totalAmount: 89.99,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      items: [
        {
          productId: 'prod2',
          name: 'Livre Best-Seller',
          price: 89.99,
          quantity: 1,
          category: 'Livres',
          images: ['/api/placeholder/80/80'],
          itemTotal: 89.99
        }
      ],
      shippingAddress: {
        firstName: 'Jean',
        lastName: 'Dupont',
        address: '123 Rue de la Paix',
        city: 'Paris',
        postalCode: '75001',
        country: 'France'
      },
      paymentMethod: 'paypal',
      paymentStatus: 'paid',
      invoiceUrl: '/api/invoices/2'
    },
    {
      id: '3',
      orderNumber: 'CMD-2024-003',
      status: 'processing',
      totalAmount: 245.75,
      createdAt: new Date(Date.now() - 172800000).toISOString(),
      items: [
        {
          productId: 'prod3',
          name: 'T-shirt Cotton',
          price: 45.99,
          quantity: 3,
          category: 'Mode',
          images: ['/api/placeholder/80/80'],
          itemTotal: 137.97
        },
        {
          productId: 'prod4',
          name: 'Casque Audio',
          price: 107.78,
          quantity: 1,
          category: 'Électronique',
          images: ['/api/placeholder/80/80'],
          itemTotal: 107.78
        }
      ],
      shippingAddress: {
        firstName: 'Jean',
        lastName: 'Dupont',
        address: '123 Rue de la Paix',
        city: 'Paris',
        postalCode: '75001',
        country: 'France'
      },
      paymentMethod: 'card',
      paymentStatus: 'paid',
      invoiceUrl: '/api/invoices/3'
    },
    {
      id: '4',
      orderNumber: 'CMD-2024-004',
      status: 'pending',
      totalAmount: 67.50,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      items: [
        {
          productId: 'prod5',
          name: 'Café Spécialité',
          price: 22.50,
          quantity: 3,
          category: 'Alimentation',
          images: ['/api/placeholder/80/80'],
          itemTotal: 67.50
        }
      ],
      shippingAddress: {
        firstName: 'Jean',
        lastName: 'Dupont',
        address: '123 Rue de la Paix',
        city: 'Paris',
        postalCode: '75001',
        country: 'France'
      },
      paymentMethod: 'card',
      paymentStatus: 'pending',
      invoiceUrl: null
    },
    {
      id: '5',
      orderNumber: 'CMD-2024-005',
      status: 'cancelled',
      totalAmount: 120.00,
      createdAt: new Date(Date.now() - 259200000).toISOString(),
      items: [
        {
          productId: 'prod6',
          name: 'Montre Connectée',
          price: 120.00,
          quantity: 1,
          category: 'Électronique',
          images: ['/api/placeholder/80/80'],
          itemTotal: 120.00
        }
      ],
      shippingAddress: {
        firstName: 'Jean',
        lastName: 'Dupont',
        address: '123 Rue de la Paix',
        city: 'Paris',
        postalCode: '75001',
        country: 'France'
      },
      paymentMethod: 'card',
      paymentStatus: 'refunded',
      invoiceUrl: '/api/invoices/5'
    }
  ];

  useEffect(() => {
    fetchUserOrders();
  }, []);

  // Télécharger la facture
  const downloadInvoice = async (orderId, orderNumber) => {
    setDownloadingInvoice(prev => ({ ...prev, [orderId]: true }));
    
    try {
      // Simulation de téléchargement
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Dans une vraie application, vous utiliseriez l'API comme ceci :
      // const response = await api.get(`/orders/${orderId}/invoice`, {
      //   responseType: 'blob'
      // });
      
      // Créer un blob et télécharger
      // const url = window.URL.createObjectURL(new Blob([response.data]));
      // const link = document.createElement('a');
      // link.href = url;
      // link.setAttribute('download', `facture-${orderNumber}.pdf`);
      // document.body.appendChild(link);
      // link.click();
      // link.remove();
      // window.URL.revokeObjectURL(url);

      // Pour la démo, on simule juste le téléchargement
      toast.success(`Facture ${orderNumber} téléchargée avec succès`);
      
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      toast.error("Erreur lors du téléchargement de la facture");
    } finally {
      setDownloadingInvoice(prev => ({ ...prev, [orderId]: false }));
    }
  };

  // Contacter le support
  const contactSupport = async (orderId, orderNumber) => {
    setContactingSupport(prev => ({ ...prev, [orderId]: true }));
    
    try {
      // Simulation de contact support
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirection vers la page de support ou ouverture d'un chat
      toast.info(`Ouverture du support pour la commande ${orderNumber}`);
      
      // Dans une vraie application, vous pourriez faire :
      // window.open(`/support?order=${orderId}`, '_blank');
      // ou
      // window.location.href = `/support?order=${orderId}`;
      
    } catch (error) {
      console.error('Erreur lors du contact du support:', error);
      toast.error("Erreur lors de la connexion au support");
    } finally {
      setContactingSupport(prev => ({ ...prev, [orderId]: false }));
    }
  };

  // Laisser un avis
  const leaveReview = async (orderId, orderNumber) => {
    setLeavingReview(prev => ({ ...prev, [orderId]: true }));
    
    try {
      // Simulation de l'ouverture du formulaire d'avis
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Ouverture du formulaire d'avis pour la commande ${orderNumber}`);
      
      // Dans une vraie application, vous pourriez faire :
      // window.open(`/review?order=${orderId}`, '_blank');
      // ou ouvrir un modal
      
    } catch (error) {
      console.error('Erreur lors de la création de l\'avis:', error);
      toast.error("Erreur lors de l'ouverture du formulaire d'avis");
    } finally {
      setLeavingReview(prev => ({ ...prev, [orderId]: false }));
    }
  };

  // Voir les détails du produit
  const viewProduct = (productId) => {
    toast.info(`Redirection vers le produit ${productId}`);
    // Dans une vraie application :
    // window.open(`/products/${productId}`, '_blank');
    // ou
    // window.location.href = `/products/${productId}`;
  };

  // Annuler une commande
  const cancelOrder = async (orderId, orderNumber) => {
    if (!confirm(`Êtes-vous sûr de vouloir annuler la commande ${orderNumber} ? Cette action est irréversible.`)) {
      return;
    }

    try {
      // Simulation d'annulation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Dans une vraie application :
      // const response = await api.put(`/orders/user/${orderId}/cancel`);
      // if (response.data.success) {
      
      // Mise à jour locale pour la démo
      setOrders(prev => prev.map(order => 
        order.id === orderId 
          ? { ...order, status: 'cancelled' }
          : order
      ));
      
      // Recalculer les stats
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status: 'cancelled' } : order
      );
      setStats(calculateStatsFromOrders(updatedOrders));
      
      toast.success(`Commande ${orderNumber} annulée avec succès`);
      
    } catch (error) {
      console.error('Erreur lors de l\'annulation:', error);
      toast.error("Erreur lors de l'annulation de la commande");
    }
  };

  // Filtrer les commandes
  const filteredOrders = orders.filter(order => {
    if (!order) return false;
    
    const matchesSearch = 
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.items?.some(item => 
        item.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesTab = activeTab === 'all' || order.status === activeTab;

    return matchesSearch && matchesStatus && matchesTab;
  });

  // Obtenir la configuration du statut
  const getStatusConfig = (status) => {
    const config = {
      pending: { label: 'En attente', variant: 'secondary', icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
      confirmed: { label: 'Confirmée', variant: 'default', icon: CheckCircle, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
      processing: { label: 'En traitement', variant: 'default', icon: Package, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200' },
      shipped: { label: 'Expédiée', variant: 'default', icon: Truck, color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-200' },
      delivered: { label: 'Livrée', variant: 'success', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200' },
      cancelled: { label: 'Annulée', variant: 'destructive', icon: XCircle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' }
    };
    
    return config[status] || { label: status, variant: 'secondary', icon: Clock, color: 'text-gray-500', bg: 'bg-gray-50', border: 'border-gray-200' };
  };

  // Obtenir la description du statut
  const getStatusDescription = (status) => {
    const descriptions = {
      pending: 'Votre commande est en attente de confirmation',
      confirmed: 'Votre commande a été confirmée et sera traitée prochainement',
      processing: 'Votre commande est en cours de préparation',
      shipped: 'Votre commande a été expédiée et est en route vers vous',
      delivered: 'Votre commande a été livrée avec succès',
      cancelled: 'Votre commande a été annulée'
    };
    return descriptions[status] || 'Statut inconnu';
  };

  // Vérifier si une commande peut être annulée
  const canCancelOrder = (order) => {
    return ['pending', 'confirmed'].includes(order.status);
  };

  // Vérifier si une facture est disponible
  const canDownloadInvoice = (order) => {
    return order.paymentStatus === 'paid' && order.status !== 'cancelled';
  };

  // Toggle l'expansion d'une commande
  const toggleOrderExpansion = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Formatage de la date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Composant OrderCard séparé pour une meilleure organisation
  const OrderCard = ({ order }) => {
    const statusConfig = getStatusConfig(order.status);
    const IconComponent = statusConfig.icon;
    const isExpanded = expandedOrder === order.id;

    return (
      <Card className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-white overflow-hidden group">
        {/* En-tête de la carte - Toujours visible */}
        <CardHeader 
          className={`pb-4 border-b-2 ${statusConfig.border} ${statusConfig.bg} cursor-pointer`}
          onClick={() => toggleOrderExpansion(order.id)}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${statusConfig.bg} transition-transform group-hover:scale-105`}>
                <IconComponent className={`h-6 w-6 ${statusConfig.color}`} />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-gray-900">
                  Commande {order.orderNumber}
                </CardTitle>
                <CardDescription className="flex items-center gap-2 text-gray-600 mt-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(order.createdAt).toLocaleDateString('fr-FR', { 
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </CardDescription>
              </div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <Badge variant={statusConfig.variant} className="px-4 py-2 text-sm font-semibold">
                <IconComponent className="h-4 w-4 mr-2" />
                {statusConfig.label}
              </Badge>
              <p className={`text-xs font-medium ${statusConfig.color}`}>
                {getStatusDescription(order.status)}
              </p>
            </div>

            <div className="flex items-center justify-between lg:justify-end gap-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">
                  €{order.totalAmount.toFixed(2)}
                </div>
                <div className="text-sm text-gray-500">
                  {order.items?.length} article{order.items?.length > 1 ? 's' : ''}
                </div>
              </div>
              <Button variant="ghost" size="sm" className="p-2">
                {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Contenu dépliable */}
        <Collapsible open={isExpanded}>
          <CollapsibleContent>
            <CardContent className="p-6 space-y-6">
              {/* Barre de progression */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  {['pending', 'confirmed', 'processing', 'shipped', 'delivered'].map((status, index) => {
                    const stepConfig = getStatusConfig(status);
                    const StepIcon = stepConfig.icon;
                    const isActive = order.status === status;
                    const isCompleted = ['pending', 'confirmed', 'processing', 'shipped', 'delivered']
                      .indexOf(order.status) >= ['pending', 'confirmed', 'processing', 'shipped', 'delivered'].indexOf(status);
                    
                    return (
                      <div key={status} className="flex flex-col items-center flex-1 relative">
                        {/* Ligne de connexion */}
                        {index > 0 && (
                          <div className={`absolute top-5 -left-1/2 w-full h-0.5 ${
                            isCompleted ? 'bg-green-500' : 'bg-gray-300'
                          }`} />
                        )}
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 z-10 ${
                          isCompleted 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : isActive
                            ? 'bg-blue-500 border-blue-500 text-white'
                            : 'bg-white border-gray-300 text-gray-400'
                        } transition-all duration-300`}>
                          <StepIcon className="h-4 w-4" />
                        </div>
                        <span className={`text-xs mt-2 font-medium text-center ${
                          isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {status === 'pending' ? 'Attente' :
                           status === 'confirmed' ? 'Confirmée' :
                           status === 'processing' ? 'Traitement' :
                           status === 'shipped' ? 'Expédiée' : 'Livrée'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Separator />

              {/* Articles de la commande */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                  <ShoppingBag className="h-5 w-5 text-blue-600" />
                  Articles commandés ({order.items?.length || 0})
                </h4>
                <div className="space-y-4">
                  {order.items?.map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 transition-colors">
                      <div className="flex-shrink-0">
                        {item.images && item.images.length > 0 ? (
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="w-16 h-16 object-cover rounded-lg shadow-sm"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                        <p className="text-gray-600 text-sm mt-1">
                          Quantité: {item.quantity} × €{item.price.toFixed(2)}
                        </p>
                        {item.category && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            {item.category}
                          </Badge>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-gray-900 text-lg">
                          €{item.itemTotal.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Informations de livraison et paiement */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      Adresse de livraison
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-gray-600 space-y-1 text-sm">
                      <p className="font-medium">{order.shippingAddress?.firstName} {order.shippingAddress?.lastName}</p>
                      <p>{order.shippingAddress?.address}</p>
                      <p>{order.shippingAddress?.postalCode} {order.shippingAddress?.city}</p>
                      <p>{order.shippingAddress?.country}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                      <CreditCard className="h-4 w-4 text-green-600" />
                      Paiement
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-gray-600 capitalize">
                      {order.paymentMethod === 'card' ? 'Carte bancaire' : 
                       order.paymentMethod === 'paypal' ? 'PayPal' : 
                       order.paymentMethod}
                    </p>
                    <Badge variant={order.paymentStatus === 'paid' ? 'success' : 'secondary'} className="mt-1">
                      {order.paymentStatus === 'paid' ? 'Payé' : 
                       order.paymentStatus === 'pending' ? 'En attente' : 
                       order.paymentStatus}
                    </Badge>
                  </CardContent>
                </Card>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-4">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-2"
                  onClick={() => downloadInvoice(order.id, order.orderNumber)}
                  disabled={!canDownloadInvoice(order) || downloadingInvoice[order.id]}
                >
                  {downloadingInvoice[order.id] ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  {downloadingInvoice[order.id] ? 'Téléchargement...' : 'Facture'}
                </Button>
                {canCancelOrder(order) && (
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => cancelOrder(order.id, order.orderNumber)}
                    className="flex items-center gap-2"
                  >
                    <XCircle className="h-4 w-4" />
                    Annuler
                  </Button>
                )}

                {order.status === 'delivered' && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex items-center gap-2"
                    onClick={() => leaveReview(order.id, order.orderNumber)}
                    disabled={leavingReview[order.id]}
                  >
                    {leavingReview[order.id] ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Star className="h-4 w-4" />
                    )}
                    {leavingReview[order.id] ? 'Ouverture...' : 'Avis'}
                  </Button>
                )}

                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => toggleOrderExpansion(order.id)}
                  className="ml-auto flex items-center gap-2"
                >
                  {isExpanded ? 'Réduire' : 'Détails'}
                </Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    );
  };

  // Squelette d'une carte de commande
  const OrderCardSkeleton = () => (
    <Card className="border-0 shadow-sm bg-white overflow-hidden">
      <CardHeader className="pb-4 border-b-2 border-gray-200 bg-gray-50">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
          <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-3 w-32" />
          </div>
          <div className="flex items-center justify-between lg:justify-end gap-4">
            <div className="text-right space-y-2">
              <Skeleton className="h-7 w-20" />
              <Skeleton className="h-3 w-16" />
            </div>
            <Skeleton className="w-8 h-8 rounded-md" />
          </div>
        </div>
      </CardHeader>
    </Card>
  );

  // Squelette pour les cartes de statistiques
  const StatCardSkeleton = () => (
    <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-0 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-3 w-24" />
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-8">
        <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
          {/* En-tête avec skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start lg:items-center mb-8">
            <div className="space-y-3">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-4 w-80" />
            </div>
            <div className="flex justify-end">
              <Skeleton className="h-10 w-32 rounded-md" />
            </div>
          </div>

          {/* Stats avec skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <StatCardSkeleton key={i} />
            ))}
          </div>

          {/* Filtres avec skeleton */}
          <Card className="border-0 shadow-sm mb-8">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Skeleton className="w-5 h-5" />
                <Skeleton className="h-6 w-40" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                <Skeleton className="h-12 md:col-span-2 lg:col-span-2 xl:col-span-3" />
                <Skeleton className="h-12" />
                <Skeleton className="h-12 md:col-span-2 lg:col-span-1 xl:col-span-1" />
              </div>
              <div className="flex flex-wrap gap-2">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-8 w-24 rounded-full" />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Liste des commandes avec skeleton */}
          <div className="grid gap-6">
            {[...Array(3)].map((_, i) => (
              <OrderCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 mt-10 to-white py-8">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl">
        {/* En-tête */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start lg:items-center mb-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Mes Commandes
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Suivez l'état de vos commandes en temps réel et gérez vos achats
            </p>
          </div>
          <div className="flex justify-end">
            <Button 
              onClick={fetchUserOrders} 
              variant="outline" 
              className="border-2 border-gray-200 hover:border-gray-300 bg-white shadow-sm hover:shadow-md transition-all duration-200"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </div>

        {/* Cartes de statistiques avancées */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Carte Commandes Total */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-sm hover:shadow-md transition-shadow duration-200 group">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-blue-700 flex items-center gap-2">
                <ShoppingCart className="h-4 w-4" />
                Total Commandes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{stats.total}</div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-blue-600 font-medium">
                  {stats.thisWeek} cette semaine
                </p>
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          {/* Carte Total Dépensé */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-0 shadow-sm hover:shadow-md transition-shadow duration-200 group">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-green-700 flex items-center gap-2">
                <Euro className="h-4 w-4" />
                Total Dépensé
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">
                €{stats.totalSpent.toFixed(2)}
              </div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-green-600 font-medium">
                  Moyenne: €{stats.averageOrder.toFixed(2)}
                </p>
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
            </CardContent>
          </Card>

          {/* Carte Taux de Complétion */}
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-0 shadow-sm hover:shadow-md transition-shadow duration-200 group">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-purple-700 flex items-center gap-2">
                <Award className="h-4 w-4" />
                Taux de Livraison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900">
                {stats.completionRate.toFixed(0)}%
              </div>
              <div className="mt-2 space-y-1">
                <Progress value={stats.completionRate} className="h-2" />
                <p className="text-xs text-purple-600 font-medium">
                  {stats.delivered} sur {stats.total - stats.cancelled} livrées
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Carte Activité Récente */}
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-0 shadow-sm hover:shadow-md transition-shadow duration-200 group">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-orange-700 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Activité Mensuelle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900">{stats.thisMonth}</div>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs text-orange-600 font-medium">
                  {stats.thisWeek} cette semaine
                </p>
                <Calendar className="h-4 w-4 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres */}
        <Card className="border-0 shadow-sm mb-8 bg-white/80 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Filter className="h-5 w-5 text-gray-600" />
              Filtrer mes Commandes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <div className="md:col-span-2 lg:col-span-2 xl:col-span-3 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par numéro de commande, produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-2 border-gray-200 focus:border-blue-500 transition-colors w-full"
                />
              </div>
              
              <div className="md:col-span-1">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-blue-500 w-full">
                    <SelectValue placeholder="Statut de commande" />
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
            </div>

            {/* Filtres rapides */}
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge 
                variant={activeTab === 'all' ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-blue-50 transition-colors"
                onClick={() => setActiveTab('all')}
              >
                Toutes ({orders.length})
              </Badge>
              <Badge 
                variant={activeTab === 'pending' ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-orange-50 transition-colors"
                onClick={() => setActiveTab('pending')}
              >
                En attente ({stats.pending})
              </Badge>
              <Badge 
                variant={activeTab === 'processing' ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-blue-50 transition-colors"
                onClick={() => setActiveTab('processing')}
              >
                En cours ({stats.confirmed + stats.processing + stats.shipped})
              </Badge>
              <Badge 
                variant={activeTab === 'delivered' ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-green-50 transition-colors"
                onClick={() => setActiveTab('delivered')}
              >
                Livrées ({stats.delivered})
              </Badge>
              <Badge 
                variant={activeTab === 'cancelled' ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-red-50 transition-colors"
                onClick={() => setActiveTab('cancelled')}
              >
                Annulées ({stats.cancelled})
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Liste des commandes avec séparations */}
        <div className="space-y-6">
          {orders.length === 0 ? (
            <Card className="border-0 shadow-sm bg-white text-center py-12">
              <CardContent>
                <Package className="h-20 w-20 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Aucune commande trouvée</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Vous n'avez pas encore passé de commande. Découvrez nos produits et trouvez ce qui vous correspond.
                </p>
                <Button 
                  onClick={() => window.location.href = '/products'}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Découvrir nos produits
                </Button>
              </CardContent>
            </Card>
          ) : filteredOrders.length === 0 ? (
            <Card className="border-0 shadow-sm bg-white text-center py-8">
              <CardContent>
                <p className="text-gray-500 text-lg">Aucune commande ne correspond aux filtres sélectionnés</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {/* En-tête des résultats */}
              <div className="flex items-center justify-between">
                <p className="text-gray-600">
                  {filteredOrders.length} commande{filteredOrders.length > 1 ? 's' : ''} trouvée{filteredOrders.length > 1 ? 's' : ''}
                </p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <FileText className="h-4 w-4" />
                  <span>Cliquez sur une commande pour voir les détails</span>
                </div>
              </div>

              <Separator />

              {/* Grille des cartes de commandes */}
              <div className="grid gap-6">
                {filteredOrders.map((order, index) => (
                  <div key={order.id} className="relative">
                    <OrderCard order={order} />
                    {/* Séparateur entre les cartes (sauf pour la dernière) */}
                    {index < filteredOrders.length - 1 && (
                      <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
                          <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Légende des statuts */}
        <Card className="border-0 shadow-sm bg-white/80 backdrop-blur-sm mt-12">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <User className="h-5 w-5 text-gray-600" />
              Signification des statuts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries({
                pending: 'En attente - Commande en cours de validation',
                confirmed: 'Confirmée - Commande acceptée par le vendeur',
                processing: 'En traitement - En préparation dans nos entrepôts',
                shipped: 'Expédiée - Envoyée chez vous',
                delivered: 'Livrée - Commande reçue avec succès',
                cancelled: 'Annulée - Commande annulée'
              }).map(([status, description]) => {
                const config = getStatusConfig(status);
                const IconComponent = config.icon;
                
                return (
                  <div key={status} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <Badge variant={config.variant} className="flex-shrink-0">
                      <IconComponent className="h-3 w-3" />
                    </Badge>
                    <span className="text-sm text-gray-700 leading-relaxed">{description}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserOrders;