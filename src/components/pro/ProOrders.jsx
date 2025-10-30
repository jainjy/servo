// components/pro/ProOrders.jsx
import { useState, useEffect } from 'react';
import { Search, Download, Eye, Package, Truck, CheckCircle, Clock, XCircle, Users, Euro } from 'lucide-react';
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

  // Charger les statistiques
  const fetchStats = async () => {
    try {
      console.log('📊 Chargement des statistiques...');
      const response = await api.get('/orders/pro/stats');
      console.log('✅ Statistiques reçues:', response.data);
      setStats(response.data.stats);
    } catch (error) {
      console.error('❌ Erreur chargement statistiques:', error);
      console.error('Détails erreur stats:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
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
      } else {
        console.error('❌ API a retourné success: false', response.data);
        setOrders([]);
      }
    } catch (error) {
      console.error('❌ Erreur chargement commandes:', error);
      console.error('Détails erreur:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      });
      
      // En cas d'erreur, essayer la route de test
      try {
        console.log('🔄 Essai de la route de test...');
        const testResponse = await api.get('/orders/test-data');
        if (testResponse.data.success) {
          console.log('✅ Données de test reçues:', testResponse.data.orders?.length);
          setOrders(testResponse.data.orders || []);
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
      } else {
        console.error('❌ Erreur API lors de la mise à jour:', response.data);
        alert('Erreur lors de la mise à jour du statut: ' + response.data.message);
      }
    } catch (error) {
      console.error('❌ Erreur mise à jour statut:', error);
      console.error('Détails erreur update:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
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
    <div className="container mx-auto p-6 space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Commandes</h1>
          <p className="text-gray-600 mt-2">
            Gérez et suivez toutes les commandes de votre boutique
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchOrders} variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Actualiser
          </Button>
          <Button 
            onClick={() => {
              console.log('📊 État actuel:', { orders, stats, filteredOrders });
            }} 
            variant="secondary" 
            size="sm"
          >
            Debug
          </Button>
        </div>
      </div>

      {/* Statistiques améliorées */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Package className="h-4 w-4" />
              Total Commandes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-gray-600">{stats.thisWeek} cette semaine</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-500" />
              En Cours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.confirmed + stats.processing + stats.shipped}
            </div>
            <p className="text-xs text-gray-600">À traiter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              En Attente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
            <p className="text-xs text-gray-600">En attente de confirmation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Euro className="h-4 w-4 text-green-500" />
              Chiffre d'Affaires
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              €{stats.totalRevenue.toFixed(2)}
            </div>
            <p className="text-xs text-gray-600">€{stats.monthlyRevenue.toFixed(2)} ce mois</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardHeader>
          <CardTitle>Filtrer les Commandes</CardTitle>
          <CardDescription>
            {orders.length} commande(s) au total dans la base de données
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher par numéro, client, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
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

      {/* Tableau des commandes */}
      <Card>
        <CardHeader>
          <CardTitle>Toutes les Commandes</CardTitle>
          <CardDescription>
            {filteredOrders.length} commande(s) trouvée(s) après filtrage
          </CardDescription>
        </CardHeader>
        <CardContent>
          {orders.length === 0 ? (
            <div className="text-center py-12">
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
                              {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                              <div className="text-xs text-gray-500">
                                {new Date(order.createdAt).toLocaleTimeString('fr-FR')}
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
          )}
        </CardContent>
      </Card>

      {/* Légende des statuts */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Légende des Statuts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
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