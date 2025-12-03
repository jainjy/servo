// pages/ProReservations.tsx
import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  User, 
  Clock, 
  Euro, 
  MapPin, 
  Check, 
  X, 
  Mail, 
  Phone,
  BarChart3,
  Filter,
  Trash2,
  Eye,
  Search,
  Download,
  BookOpen,
  Users,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  XCircle,
  PlayCircle
} from "lucide-react";
import { ReservationCoursService, ReservationCours, ReservationCoursStats } from "@/services/reservationCoursService";

const ProReservations: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [reservations, setReservations] = useState<ReservationCours[]>([]);
  const [stats, setStats] = useState<ReservationCoursStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReservation, setSelectedReservation] = useState<ReservationCours | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadReservations();
      loadStats();
    }
  }, [isAuthenticated, user, filter]);

  const loadReservations = async () => {
    try {
      setLoading(true);
      const response = await ReservationCoursService.getReservations({
        professionalId: user.id,
        status: filter === 'all' ? undefined : filter
      });
      
      if (response.success) {
        setReservations(response.data);
      } else {
        console.error('Erreur lors du chargement des réservations');
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const response = await ReservationCoursService.getProfessionalStats(user.id);
      
      if (response.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques');
    }
  };

  const updateReservationStatus = async (reservationId: string, status: string, raisonAnnulation?: string) => {
    try {
      setUpdating(reservationId);
      await ReservationCoursService.updateReservationStatus(reservationId, status, raisonAnnulation);
      await loadReservations();
      await loadStats();
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la mise à jour');
    } finally {
      setUpdating(null);
    }
  };

  const deleteReservation = async (reservationId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réservation ? Cette action est irréversible.')) {
      try {
        setUpdating(reservationId);
        await ReservationCoursService.deleteReservation(reservationId);
        await loadReservations();
        await loadStats();
      } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression');
      } finally {
        setUpdating(null);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      en_attente: { 
        variant: 'secondary' as const, 
        text: 'En attente', 
        color: 'text-yellow-600',
        icon: <AlertCircle className="w-3 h-3 mr-1" />
      },
      confirmee: { 
        variant: 'default' as const, 
        text: 'Confirmée', 
        color: 'text-green-600',
        icon: <CheckCircle className="w-3 h-3 mr-1" />
      },
      annulee: { 
        variant: 'destructive' as const, 
        text: 'Annulée', 
        color: 'text-red-100',
        icon: <XCircle className="w-3 h-3 mr-1" />
      },
      terminee: { 
        variant: 'default' as const, 
        text: 'Terminée', 
        color: 'text-blue-600',
        icon: <PlayCircle className="w-3 h-3 mr-1" />
      }
    };
    
    const statusInfo = variants[status as keyof typeof variants] || variants.en_attente;
    return (
      <Badge variant={statusInfo.variant} className={`flex items-center ${statusInfo.color}`}>
        {statusInfo.icon}
        {statusInfo.text}
      </Badge>
    );
  };

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = searchTerm === '' || 
      reservation.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.courseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reservation.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const exportReservations = () => {
    const csvContent = [
      ['Date', 'Client', 'Email', 'Cours', 'Participants', 'Prix', 'Statut', 'Date réservation'],
      ...filteredReservations.map(reservation => [
        new Date(reservation.date).toLocaleDateString('fr-FR'),
        reservation.userName,
        reservation.userEmail,
        reservation.courseTitle,
        reservation.participants.toString(),
        `${reservation.totalPrice}€`,
        ReservationCoursService.getStatusLabel(reservation.status),
        new Date(reservation.createdAt).toLocaleDateString('fr-FR')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `reservations-cours-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Accès non autorisé</h2>
          <p>Veuillez vous connecter pour accéder à cette page.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-2 lg:p-0">
      <div className="container mx-auto px-4">
        {/* En-tête */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-lg lg:text-3xl font-bold text-gray-900 mb-2">
                Gestion des réservations de cours
              </h1>
              <p className="text-gray-600">
                Gérez les réservations de vos cours et suivez vos performances
              </p>
            </div>
            <Button onClick={exportReservations} className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Exporter CSV
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
            <Card className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
              <div className="text-gray-600 text-sm">Total réservations</div>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <AlertCircle className="w-8 h-8 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-yellow-600">{stats.en_attente}</div>
              <div className="text-gray-600 text-sm">En attente</div>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">{stats.confirmee}</div>
              <div className="text-gray-600 text-sm">Confirmées</div>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <div className="text-2xl font-bold text-red-600">{stats.annulee}</div>
              <div className="text-gray-600 text-sm">Annulées</div>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <PlayCircle className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">{stats.terminee}</div>
              <div className="text-gray-600 text-sm">Terminées</div>
            </Card>
            
            <Card className="p-6 text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600">{stats.totalRevenue}€</div>
              <div className="text-gray-600 text-sm">Chiffre d'affaires</div>
            </Card>
          </div>
        )}

        {/* Filtres et recherche */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Barre de recherche */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher par client, cours ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Filtres par statut */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={filter === 'all' ? 'default' : 'outline'}
              className="cursor-pointer flex items-center"
              onClick={() => setFilter('all')}
            >
              <Filter className="w-3 h-3 mr-1" />
              Toutes
            </Badge>
            <Badge
              variant={filter === 'en_attente' ? 'default' : 'outline'}
              className="cursor-pointer flex items-center"
              onClick={() => setFilter('en_attente')}
            >
              <AlertCircle className="w-3 h-3 mr-1" />
              En attente
            </Badge>
            <Badge
              variant={filter === 'confirmee' ? 'default' : 'outline'}
              className="cursor-pointer flex items-center"
              onClick={() => setFilter('confirmee')}
            >
              <CheckCircle className="w-3 h-3 mr-1" />
              Confirmées
            </Badge>
            <Badge
              variant={filter === 'annulee' ? 'default' : 'outline'}
              className="cursor-pointer flex items-center"
              onClick={() => setFilter('annulee')}
            >
              <XCircle className="w-3 h-3 mr-1" />
              Annulées
            </Badge>
            <Badge
              variant={filter === 'terminee' ? 'default' : 'outline'}
              className="cursor-pointer flex items-center"
              onClick={() => setFilter('terminee')}
            >
              <PlayCircle className="w-3 h-3 mr-1" />
              Terminées
            </Badge>
          </div>
        </div>

        {/* Liste des réservations */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredReservations.length === 0 ? (
          <Card className="p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune réservation</h3>
            <p className="text-gray-600">
              {filter === 'all' 
                ? "Vous n'avez aucune réservation pour le moment." 
                : `Aucune réservation avec le statut "${filter}".`
              }
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              {filteredReservations.length} réservation(s) trouvée(s)
            </div>
            
            {filteredReservations.map((reservation) => (
              <Card key={reservation.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Informations réservation */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {reservation.courseTitle}
                        </h3>
                        <div className="flex items-center gap-4 mt-2 flex-wrap">
                          {getStatusBadge(reservation.status)}
                          <span className="text-sm text-gray-600 flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {ReservationCoursService.formatDate(reservation.date)}
                          </span>
                          <span className="text-sm text-gray-600 flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {reservation.courseDuration} min
                          </span>
                          <span className="text-sm font-semibold text-green-600 flex items-center">
                            <Euro className="w-4 h-4 mr-1" />
                            {reservation.totalPrice}€
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Informations client */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          Client
                        </h4>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{reservation.userName}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <a 
                              href={`mailto:${reservation.userEmail}`} 
                              className="text-blue-600 hover:underline"
                            >
                              {reservation.userEmail}
                            </a>
                          </div>
                          {reservation.user.phone && (
                            <div className="flex items-center gap-2">
                              <Phone className="w-4 h-4 text-gray-500" />
                              <a 
                                href={`tel:${reservation.user.phone}`} 
                                className="text-blue-600 hover:underline"
                              >
                                {reservation.user.phone}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                          <BookOpen className="w-4 h-4 mr-2" />
                          Détails
                        </h4>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-gray-500" />
                            <strong>Participants:</strong> {reservation.participants} personne(s)
                          </div>
                          <div>
                            <strong>Réservé le:</strong> {new Date(reservation.createdAt).toLocaleDateString('fr-FR')}
                          </div>
                          <div>
                            <strong>Catégorie:</strong> {reservation.courseCategory}
                          </div>
                          {reservation.notes && (
                            <div>
                              <strong>Notes:</strong> {reservation.notes}
                            </div>
                          )}
                          {reservation.raisonAnnulation && (
                            <div className="text-red-600">
                              <strong>Raison annulation:</strong> {reservation.raisonAnnulation}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 lg:w-48">
                    {reservation.status === 'en_attente' && (
                      <>
                        <Button
                          onClick={() => updateReservationStatus(reservation.id, 'confirmee')}
                          disabled={updating === reservation.id}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {updating === reservation.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Confirmer
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => {
                            const raison = prompt('Raison de l\'annulation:');
                            if (raison) {
                              updateReservationStatus(reservation.id, 'annulee', raison);
                            }
                          }}
                          disabled={updating === reservation.id}
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Refuser
                        </Button>
                      </>
                    )}

                    {reservation.status === 'confirmee' && (
                      <>
                        <Button
                          onClick={() => updateReservationStatus(reservation.id, 'terminee')}
                          disabled={updating === reservation.id}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          {updating === reservation.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              Terminer
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => {
                            const raison = prompt('Raison de l\'annulation:');
                            if (raison) {
                              updateReservationStatus(reservation.id, 'annulee', raison);
                            }
                          }}
                          disabled={updating === reservation.id}
                          variant="outline"
                          className="text-red-600 border-red-600 hover:bg-red-50"
                        >
                          <X className="w-4 h-4 mr-2" />
                          Annuler
                        </Button>
                      </>
                    )}

                    {(reservation.status === 'annulee' || reservation.status === 'terminee') && (
                      <Button
                        onClick={() => deleteReservation(reservation.id)}
                        disabled={updating === reservation.id}
                        variant="outline"
                        className="text-red-600 border-red-600 hover:bg-red-50"
                      >
                        {updating === reservation.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4 mr-2" />
                            Supprimer
                          </>
                        )}
                      </Button>
                    )}

                    {/* Bouton pour voir les détails */}
                    <Button
                      onClick={() => setSelectedReservation(reservation)}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Détails
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Modal de détails */}
        {selectedReservation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Détails de la réservation</h3>
                    <p className="text-gray-600 mt-2">{selectedReservation.courseTitle}</p>
                  </div>
                  <button
                    onClick={() => setSelectedReservation(null)}
                    className="h-10 w-10 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Informations cours */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Cours
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Titre:</strong> {selectedReservation.courseTitle}</div>
                      <div><strong>Catégorie:</strong> {selectedReservation.courseCategory}</div>
                      <div><strong>Durée:</strong> {selectedReservation.courseDuration} minutes</div>
                      <div><strong>Prix:</strong> {selectedReservation.totalPrice}€</div>
                      <div><strong>Participants:</strong> {selectedReservation.participants}</div>
                    </div>
                  </div>

                  {/* Informations client */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      Client
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Nom:</strong> {selectedReservation.userName}</div>
                      <div><strong>Email:</strong> {selectedReservation.userEmail}</div>
                      {selectedReservation.user.phone && (
                        <div><strong>Téléphone:</strong> {selectedReservation.user.phone}</div>
                      )}
                      <div><strong>Date réservation:</strong> {new Date(selectedReservation.createdAt).toLocaleDateString('fr-FR')}</div>
                    </div>
                  </div>

                  {/* Statut et dates */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                      <Calendar className="w-4 h-4 mr-2" />
                      Planning
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Date du cours:</strong> {ReservationCoursService.formatDate(selectedReservation.date)}</div>
                      <div><strong>Statut:</strong> {ReservationCoursService.getStatusLabel(selectedReservation.status)}</div>
                      {selectedReservation.dateAnnulation && (
                        <div><strong>Annulé le:</strong> {new Date(selectedReservation.dateAnnulation).toLocaleDateString('fr-FR')}</div>
                      )}
                    </div>
                  </div>

                  {/* Notes */}
                  {(selectedReservation.notes || selectedReservation.raisonAnnulation) && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <FileText className="w-4 h-4 mr-2" />
                        Informations
                      </h4>
                      <div className="space-y-2 text-sm">
                        {selectedReservation.notes && (
                          <div>
                            <strong>Notes:</strong> 
                            <p className="mt-1 text-gray-600">{selectedReservation.notes}</p>
                          </div>
                        )}
                        {selectedReservation.raisonAnnulation && (
                          <div className="text-red-600">
                            <strong>Raison annulation:</strong> 
                            <p className="mt-1">{selectedReservation.raisonAnnulation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                  <Button
                    onClick={() => setSelectedReservation(null)}
                    variant="outline"
                  >
                    Fermer
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProReservations;