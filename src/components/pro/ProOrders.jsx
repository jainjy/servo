// components/pro/ProOrders.jsx
import { useState, useEffect } from 'react';
import { Search, Download, Eye, Package, Truck, CheckCircle, Clock, XCircle, Users, Euro, MapPin, Calendar, Mail, Phone } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import api from '@/lib/api';
import ProOrderDetailsModal from './ProOrderDetailsModal';

const ProOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  // Charger les commandes du pro
  const fetchOrders = async () => {
    try {
      setLoading(true);
      console.log('🔄 Chargement des commandes...');
      
      const response = await api.get('/orders/pro');
      console.log('✅ Commandes reçues:', response.data);
      
      if (response.data.success) {
        setOrders(response.data.orders || []);
        await fetchStats(); // Charger les stats en même temps
        
        // Déclencher la mise à jour des notifications
        triggerNotificationsUpdate();
      } else {
        console.error('❌ API a retourné success: false', response.data);
        setOrders([]);
      }
    } catch (error) {
      console.error('❌ Erreur chargement commandes:', error);
      
      // En cas d'erreur, essayer la route de test
      try {
        console.log('🔄 Essai de la route de test...');
        const testResponse = await api.get('/orders/test-data');
        if (testResponse.data.success) {
          console.log('✅ Données de test reçues:', testResponse.data.orders?.length);
          setOrders(testResponse.data.orders || []);
          triggerNotificationsUpdate();
        }
      } catch (testError) {
        console.error('❌ Erreur même avec route test:', testError);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Mettre à jour le statut d'une commande
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      console.log(`🔄 Mise à jour statut commande ${orderId} vers: ${newStatus}`);
      
      const response = await api.put(`/orders/pro/${orderId}/status`, { status: newStatus });
      
      if (response.data.success) {
        console.log('✅ Statut mis à jour avec succès');
        await fetchOrders(); // Recharger les données
        
        // Déclencher la mise à jour des notifications
        triggerNotificationsUpdate();
      } else {
        console.error('❌ Erreur API lors de la mise à jour:', response.data);
        alert('Erreur lors de la mise à jour du statut: ' + response.data.message);
      }
    } catch (error) {
      console.error('❌ Erreur mise à jour statut:', error);
      alert('Erreur lors de la mise à jour du statut: ' + (error.response?.data?.message || error.message));
    }
  };

  // Filtrer les commandes
  const filteredOrders = orders.filter(order => {
    if (!order) return false;
    
    const matchesSearch = 
      order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Obtenir la couleur du badge selon le statut
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'En attente', variant: 'secondary', icon: Clock },
      confirmed: { label: 'Confirmée', variant: 'default', icon: CheckCircle },
      processing: { label: 'En traitement', variant: 'default', icon: Package },
      shipped: { label: 'Expédiée', variant: 'default', icon: Truck },
      delivered: { label: 'Livrée', variant: 'success', icon: CheckCircle },
      cancelled: { label: 'Annulée', variant: 'destructive', icon: XCircle }
    };
    
    const config = statusConfig[status] || { label: status, variant: 'secondary', icon: Clock };
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

  // Actions rapides selon le statut
  const getQuickActions = (order) => {
    if (!order) return [];
    
    const actions = [];
    
    if (order.status === 'pending') {
      actions.push(
        {
          label: 'Confirmer',
          action: () => updateOrderStatus(order.id, 'confirmed'),
          variant: 'default'
        },
        {
          label: 'Annuler',
          action: () => updateOrderStatus(order.id, 'cancelled'),
          variant: 'destructive'
        }
      );
    }
    
    if (order.status === 'confirmed') {
      actions.push(
        {
          label: 'Commencer traitement',
          action: () => updateOrderStatus(order.id, 'processing'),
          variant: 'default'
        }
      );
    }
    
    if (order.status === 'processing') {
      actions.push(
        {
          label: 'Expédier',
          action: () => updateOrderStatus(order.id, 'shipped'),
          variant: 'default'
        }
      );
    }
    
    if (order.status === 'shipped') {
      actions.push(
        {
          label: 'Marquer livrée',
          action: () => updateOrderStatus(order.id, 'delivered'),
          variant: 'success'
        }
      );
    }

    return actions;
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

  // Composant Carte pour mobile
  const OrderCard = ({ order }) => {
    const quickActions = getQuickActions(order);
    const dateInfo = formatDate(order.createdAt);
    const statusBorderColor = getStatusBorderColor(order.status);

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

          {/* Articles */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <Package className="h-3 w-3 text-gray-400" />
              <span className="text-sm font-medium">
                {(order.items?.length || 0)} article(s)
              </span>
            </div>
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
            
            {/* Actions rapides */}
            {quickActions.length > 0 && (
              <Select
                value={order.status}
                onValueChange={(newStatus) => updateOrderStatus(order.id, newStatus)}
              >
                <SelectTrigger className="flex-1 text-xs h-9">
                  <SelectValue placeholder="Action" />
                </SelectTrigger>
                <SelectContent>
                  {quickActions.map((action, index) => (
                    <SelectItem key={index} value={action.variant === 'destructive' ? 'cancelled' : 
                      action.label.includes('Confirmer') ? 'confirmed' :
                      action.label.includes('traitement') ? 'processing' :
                      action.label.includes('Expédier') ? 'shipped' : 'delivered'}>
                      {action.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
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
        <Button onClick={fetchOrders} variant="outline" size="sm" className="w-full sm:w-auto">
          Actualiser
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

      {/* Filtres et recherche */}
      <Card>
        <CardHeader className="p-4 lg:p-6">
          <CardTitle className="text-lg lg:text-xl">Filtrer les Commandes</CardTitle>
          <CardDescription>
            {orders.length} commande(s) au total dans la base de données
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
          <CardTitle className="text-lg lg:text-xl">Toutes les Commandes</CardTitle>
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
              <Button onClick={fetchOrders} variant="outline">
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
                      <TableHead>Total</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          Aucune commande ne correspond aux filtres
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredOrders.map((order) => {
                        const quickActions = getQuickActions(order);
                        const dateInfo = formatDate(order.createdAt);
                        
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
                            <TableCell className="font-bold text-green-600">
                              €{(order.totalAmount || 0).toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Select
                                value={order.status || 'pending'}
                                onValueChange={(newStatus) => 
                                  updateOrderStatus(order.id, newStatus)
                                }
                              >
                                <SelectTrigger className="w-36">
                                  <SelectValue>
                                    {getStatusBadge(order.status)}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">En attente</SelectItem>
                                  <SelectItem value="confirmed">Confirmée</SelectItem>
                                  <SelectItem value="processing">En traitement</SelectItem>
                                  <SelectItem value="shipped">Expédiée</SelectItem>
                                  <SelectItem value="delivered">Livrée</SelectItem>
                                  <SelectItem value="cancelled">Annulée</SelectItem>
                                </SelectContent>
                              </Select>
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
                                
                                {/* Actions rapides */}
                                {quickActions.length > 0 && (
                                  <div className="flex flex-col gap-1">
                                    {quickActions.map((action, index) => (
                                      <Button
                                        key={index}
                                        variant={action.variant}
                                        size="sm"
                                        onClick={action.action}
                                        className="text-xs h-7"
                                      >
                                        {action.label}
                                      </Button>
                                    ))}
                                  </div>
                                )}
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

      {/* Légende des statuts */}
      <Card>
        <CardHeader className="p-4 lg:p-6">
          <CardTitle className="text-sm lg:text-base">Légende des Statuts</CardTitle>
        </CardHeader>
        <CardContent className="p-4 lg:p-6 pt-0">
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 lg:gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                <Clock className="h-3 w-3" />
                En attente
              </Badge>
              <span className="text-sm text-gray-600">- Nouvelle commande</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default">
                <CheckCircle className="h-3 w-3" />
                Confirmée
              </Badge>
              <span className="text-sm text-gray-600">- Commande acceptée</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default">
                <Package className="h-3 w-3" />
                En traitement
              </Badge>
              <span className="text-sm text-gray-600">- En préparation</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default">
                <Truck className="h-3 w-3" />
                Expédiée
              </Badge>
              <span className="text-sm text-gray-600">- Envoyée au client</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="success">
                <CheckCircle className="h-3 w-3" />
                Livrée
              </Badge>
              <span className="text-sm text-gray-600">- Commande terminée</span>
            </div>
          </div>
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