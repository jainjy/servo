import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Euro, Calendar, Users, Star } from 'lucide-react';
import api from "../lib/api";
import { useAuth } from '../hooks/useAuth';

interface Parapente {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  location: string;
  createdAt: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    avatar: string;
  };
}

interface SearchFilters {
  location: string;
  minPrice: number;
  maxPrice: number;
  searchQuery: string;
}

const UserParapentePage: React.FC = () => {
  const [parapentes, setParapentes] = useState<Parapente[]>([]);
  const [filteredParapentes, setFilteredParapentes] = useState<Parapente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    location: '',
    minPrice: 0,
    maxPrice: 1000,
    searchQuery: '',
  });
  const [selectedParapente, setSelectedParapente] = useState<Parapente | null>(null);
  const [isReservationModalOpen, setIsReservationModalOpen] = useState(false);
  const [reservationData, setReservationData] = useState({
    startDate: '',
    endDate: '',
    participants: 1,
    notes: '',
  });
  const [reservationLoading, setReservationLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Chargement initial
  useEffect(() => {
    fetchParapentes();
  }, []);

  // Filtrer les parapentes quand les filtres changent
  useEffect(() => {
    filterParapentes();
  }, [searchFilters, parapentes]);

  const fetchParapentes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/parapente');
      if (response.data.success) {
        setParapentes(response.data.data || []);
      }
    } catch (err) {
      console.error('Erreur lors du chargement:', err);
      setError('Impossible de charger les parapentes. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const filterParapentes = () => {
    let filtered = [...parapentes];

    // Filtre par recherche texte
    if (searchFilters.searchQuery) {
      const query = searchFilters.searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.location.toLowerCase().includes(query)
      );
    }

    // Filtre par lieu
    if (searchFilters.location) {
      filtered = filtered.filter(p =>
        p.location.toLowerCase().includes(searchFilters.location.toLowerCase())
      );
    }

    // Filtre par prix
    filtered = filtered.filter(p =>
      p.price >= searchFilters.minPrice && p.price <= searchFilters.maxPrice
    );

    setFilteredParapentes(filtered);
  };

  const handleReservation = (parapente: Parapente) => {
    if (!isAuthenticated) {
      alert('Vous devez être connecté pour effectuer une réservation');
      return;
    }
    
    setSelectedParapente(parapente);
    setIsReservationModalOpen(true);
    
    // Initialiser les dates par défaut (demain et après-demain)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date();
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    
    setReservationData({
      startDate: tomorrow.toISOString().split('T')[0],
      endDate: dayAfterTomorrow.toISOString().split('T')[0],
      participants: 1,
      notes: '',
    });
  };

  const submitReservation = async () => {
    if (!selectedParapente) return;
    
    try {
      setReservationLoading(true);
      
      // Ici vous devrez créer une route de réservation dans votre backend
      // Exemple: POST /reservations
      const response = await api.post('/reservations', {
        parapenteId: selectedParapente.id,
        startDate: reservationData.startDate,
        endDate: reservationData.endDate,
        participants: reservationData.participants,
        notes: reservationData.notes,
        totalPrice: selectedParapente.price * 
                   ((new Date(reservationData.endDate).getTime() - 
                     new Date(reservationData.startDate).getTime()) / 
                    (1000 * 3600 * 24) + 1),
      });
      
      if (response.data.success) {
        alert('Réservation effectuée avec succès!');
        setIsReservationModalOpen(false);
        setSelectedParapente(null);
      }
    } catch (err) {
      console.error('Erreur lors de la réservation:', err);
      alert('Erreur lors de la réservation. Veuillez réessayer.');
    } finally {
      setReservationLoading(false);
    }
  };

  // Calculer le nombre de jours entre deux dates
  const calculateDays = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  // Formatage du prix
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR',
    }).format(price);
  };

  // Formatage de la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#556B2F] to-[#6B8E23] text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Découvrez l'Expérience Parapente
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Réservez votre vol en parapente avec des instructeurs certifiés
            </p>
            
            {/* Barre de recherche principale */}
            <div className="bg-white rounded-lg p-4 shadow-lg">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Rechercher un parapente, un lieu..."
                      value={searchFilters.searchQuery}
                      onChange={(e) => setSearchFilters({...searchFilters, searchQuery: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#556B2F] text-gray-800"
                    />
                  </div>
                </div>
                <button 
                  onClick={() => filterParapentes()}
                  className="bg-[#8B4513] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#A0522D] transition-colors"
                >
                  Rechercher
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 py-8">
        {/* Filtres avancés */}
        <div className="mb-8 bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5" style={{ color: '#556B2F' }} />
            <h2 className="text-lg font-semibold" style={{ color: '#8B4513' }}>
              Filtres de recherche
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#8B4513' }}>
                Lieu
              </label>
              <input
                type="text"
                placeholder="Tous les lieux"
                value={searchFilters.location}
                onChange={(e) => setSearchFilters({...searchFilters, location: e.target.value})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:outline-none"
                style={{ 
                  borderColor: '#D3D3D3',
                  '--tw-ring-color': '#556B2F'
                } as React.CSSProperties}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#8B4513' }}>
                Prix minimum (€)
              </label>
              <input
                type="number"
                min="0"
                value={searchFilters.minPrice}
                onChange={(e) => setSearchFilters({...searchFilters, minPrice: parseInt(e.target.value) || 0})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:outline-none"
                style={{ 
                  borderColor: '#D3D3D3',
                  '--tw-ring-color': '#556B2F'
                } as React.CSSProperties}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#8B4513' }}>
                Prix maximum (€)
              </label>
              <input
                type="number"
                min="0"
                value={searchFilters.maxPrice}
                onChange={(e) => setSearchFilters({...searchFilters, maxPrice: parseInt(e.target.value) || 1000})}
                className="w-full p-3 border rounded-lg focus:ring-2 focus:outline-none"
                style={{ 
                  borderColor: '#D3D3D3',
                  '--tw-ring-color': '#556B2F'
                } as React.CSSProperties}
              />
            </div>
          </div>
        </div>

        {/* Résultats */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: '#556B2F' }}></div>
            <p className="mt-4" style={{ color: '#8B4513' }}>Chargement des parapentes...</p>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#DC2626' }}>
              <Search className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#8B4513' }}>
              Erreur
            </h2>
            <p className="text-gray-600 mb-8">{error}</p>
            <button
              onClick={fetchParapentes}
              className="px-6 py-3 rounded-lg font-medium"
              style={{ 
                backgroundColor: '#556B2F',
                color: 'white'
              }}
            >
              Réessayer
            </button>
          </div>
        ) : (
          <>
            {/* En-tête des résultats */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold" style={{ color: '#8B4513' }}>
                {filteredParapentes.length} parapente{filteredParapentes.length > 1 ? 's' : ''} disponible{filteredParapentes.length > 1 ? 's' : ''}
              </h2>
              
              <div className="text-sm" style={{ color: '#8B4513' }}>
                Tri: 
                <select className="ml-2 p-2 border rounded-lg">
                  <option value="newest">Plus récents</option>
                  <option value="price_asc">Prix croissant</option>
                  <option value="price_desc">Prix décroissant</option>
                </select>
              </div>
            </div>

            {/* Grille des parapentes */}
            {filteredParapentes.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow">
                <Search className="w-16 h-16 mx-auto mb-4" style={{ color: '#8B4513' }} />
                <h3 className="text-xl font-semibold mb-2" style={{ color: '#8B4513' }}>
                  Aucun résultat trouvé
                </h3>
                <p className="text-gray-600">
                  Essayez de modifier vos critères de recherche
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredParapentes.map((parapente) => (
                  <div key={parapente.id} className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300">
                    {/* Image */}
                    <div className="relative h-48">
                      {parapente.images.length > 0 ? (
                        <img
                          src={parapente.images[0]}
                          alt={parapente.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: '#6B8E23' }}>
                          <span className="text-white">Pas d'image</span>
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-semibold px-3 py-1 rounded-full">
                          {formatPrice(parapente.price)}/jour
                        </span>
                      </div>
                    </div>

                    {/* Contenu */}
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="text-lg font-bold mb-1" style={{ color: '#8B4513' }}>
                            {parapente.title}
                          </h3>
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{parapente.location}</span>
                          </div>
                        </div>
                        
                        {/* Note (exemple) */}
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4" style={{ color: '#FBBF24' }} fill="#FBBF24" />
                          <span className="text-sm font-semibold">4.8</span>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {parapente.description}
                      </p>

                      {/* Propriétaire */}
                      <div className="flex items-center gap-3 mb-4 pt-4 border-t border-gray-100">
                        <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                          {parapente.user.avatar ? (
                            <img 
                              src={parapente.user.avatar} 
                              alt={`${parapente.user.firstName} ${parapente.user.lastName}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-sm" style={{ backgroundColor: '#556B2F', color: 'white' }}>
                              {parapente.user.firstName.charAt(0)}{parapente.user.lastName.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium" style={{ color: '#8B4513' }}>
                            {parapente.user.firstName} {parapente.user.lastName}
                          </p>
                          <p className="text-xs text-gray-500">Propriétaire</p>
                        </div>
                      </div>

                      {/* Bouton Réservation */}
                      <button
                        onClick={() => handleReservation(parapente)}
                        className="w-full py-3 rounded-lg font-medium text-white transition-colors"
                        style={{ 
                          backgroundColor: '#556B2F'
                        }}
                      >
                        Réserver maintenant
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de réservation */}
      {isReservationModalOpen && selectedParapente && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold" style={{ color: '#8B4513' }}>
                  Réserver ce parapente
                </h2>
                <button
                  onClick={() => setIsReservationModalOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                  disabled={reservationLoading}
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>

              {/* Détails du parapente */}
              <div className="mb-6 p-4 rounded-lg border" style={{ borderColor: '#D3D3D3' }}>
                <h3 className="font-semibold mb-2" style={{ color: '#8B4513' }}>
                  {selectedParapente.title}
                </h3>
                <div className="flex justify-between text-sm">
                  <span>Prix par jour:</span>
                  <span className="font-semibold">{formatPrice(selectedParapente.price)}</span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>Lieu:</span>
                  <span>{selectedParapente.location}</span>
                </div>
              </div>
              {/* Formulaire de réservation */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: '#8B4513' }}>
                    <Users className="inline w-4 h-4 mr-1" />
                    Nombre de participants
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={reservationData.participants}
                    onChange={(e) => setReservationData({...reservationData, participants: parseInt(e.target.value) || 1})}
                    className="w-full p-3 border rounded-lg"
                    style={{ borderColor: '#D3D3D3' }}
                    disabled={reservationLoading}
                  />
                </div>

              

                {/* Résumé du prix */}
                <div className="p-4 rounded-lg" style={{ backgroundColor: '#F0F7F0' }}>
                  <div className="flex justify-between mb-1">
                    <span>Prix par jour:</span>
                    <span>{formatPrice(selectedParapente.price)}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Nombre de jours:</span>
                    <span>{calculateDays(reservationData.startDate, reservationData.endDate)} jours</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t" style={{ borderColor: '#D3D3D3' }}>
                    <span>Total:</span>
                    <span style={{ color: '#556B2F' }}>
                      {formatPrice(selectedParapente.price * calculateDays(reservationData.startDate, reservationData.endDate))}
                    </span>
                  </div>
                </div>

                {/* Boutons */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setIsReservationModalOpen(false)}
                    className="flex-1 py-3 border rounded-lg font-medium"
                    style={{ 
                      borderColor: '#D3D3D3',
                      color: '#8B4513'
                    }}
                    disabled={reservationLoading}
                  >
                    Annuler
                  </button>
                  <button
                    onClick={submitReservation}
                    className="flex-1 py-3 rounded-lg font-medium text-white flex items-center justify-center gap-2"
                    style={{ 
                      backgroundColor: reservationLoading ? '#9CA3AF' : '#556B2F',
                    }}
                    disabled={reservationLoading}
                  >
                    {reservationLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Traitement...
                      </>
                    ) : (
                      'Confirmer la réservation'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserParapentePage;