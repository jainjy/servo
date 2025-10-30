// components/pro/ProOrderDetailsModal.jsx
import { X, User, MapPin, CreditCard, Package, Mail, Phone } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProOrderDetailsModal = ({ order, isOpen, onClose, onStatusUpdate }) => {
  if (!isOpen || !order) return null;

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { label: 'En attente', variant: 'secondary' },
      confirmed: { label: 'Confirmée', variant: 'default' },
      processing: { label: 'En traitement', variant: 'default' },
      shipped: { label: 'Expédiée', variant: 'default' },
      delivered: { label: 'Livrée', variant: 'success' },
      cancelled: { label: 'Annulée', variant: 'destructive' }
    };
    
    const config = statusConfig[status] || { label: status, variant: 'secondary' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleStatusUpdate = (newStatus) => {
    onStatusUpdate(order.id, newStatus);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">Commande {order.orderNumber}</h2>
            <p className="text-gray-600">
              Passée le {new Date(order.createdAt).toLocaleDateString('fr-FR')} à {new Date(order.createdAt).toLocaleTimeString('fr-FR')}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Informations client */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informations Client
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nom complet</label>
                    <p className="font-medium">{order.user?.firstName} {order.user?.lastName}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{order.user?.email}</span>
                  </div>
                  {order.user?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span>{order.user?.phone}</span>
                    </div>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Statut de la commande</label>
                  <div className="mt-2">
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Articles de la commande */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Vos Articles dans cette Commande
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 border rounded-lg">
                    {item.images && item.images.length > 0 && (
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">{item.name}</h4>
                      <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
                        <div>
                          <span className="text-gray-600">Quantité:</span>
                          <span className="font-medium ml-2">{item.quantity}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Prix unitaire:</span>
                          <span className="font-medium ml-2">€{item.price.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Sous-total:</span>
                          <span className="font-bold text-green-600 ml-2">
                            €{item.itemTotal.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions rapides */}
          <Card>
            <CardHeader>
              <CardTitle>Actions Rapides</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {order.status === 'pending' && (
                  <>
                    <Button onClick={() => handleStatusUpdate('confirmed')}>
                      Confirmer la commande
                    </Button>
                    <Button variant="outline" onClick={() => handleStatusUpdate('cancelled')}>
                      Annuler la commande
                    </Button>
                  </>
                )}
                {order.status === 'confirmed' && (
                  <Button onClick={() => handleStatusUpdate('processing')}>
                    Commencer le traitement
                  </Button>
                )}
                {order.status === 'processing' && (
                  <Button onClick={() => handleStatusUpdate('shipped')}>
                    Marquer comme expédié
                  </Button>
                )}
                {order.status === 'shipped' && (
                  <Button  onClick={() => handleStatusUpdate('delivered')}>
                    Marquer comme livrée
                  </Button>
                )}
                <Button variant="outline">
                  Contacter le client
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 p-6 border-t">
          <Button variant="outline" onClick={onClose}>
            Fermer
          </Button>
          <Button onClick={window.print}>
            Imprimer la commande
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProOrderDetailsModal;