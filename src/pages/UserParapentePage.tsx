import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin, Euro, Calendar, Users, Star, Globe, User, Mail, Phone, AlertCircle, Briefcase, Map } from 'lucide-react';
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
    email: string;
    phone: string;
  };
}

interface Profile {
  id: string;
  firstName: string | null;
  lastName: string | null;
  commercialName: string | null;
  companyName: string | null;
  email: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  zipCode: string | null;
  avatar: string | null;
  websiteUrl: string | null;
  professionalCategory: string | null;
  description?: string;
  experience?: string;
  rating?: number;
  totalFlights?: number;
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
  const [profileLoading, setProfileLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
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
    fetchProfile();
    fetchParapentes();
  }, []);

  // Filtrer les parapentes quand les filtres changent
  useEffect(() => {
    filterParapentes();
  }, [searchFilters, parapentes]);

  const fetchProfile = async () => {
    try {
      setProfileLoading(true);
      setProfileError(null);
      
      // Utiliser la nouvelle API
      const response = await api.get('/parapenteprofile');
      
     
      
      let userData;
      
      // Vérifier différents formats de réponse possibles
      if (response.data.success && response.data.data) {
        // Format: { success: true, data: {...} }
        userData = response.data.data;
      } else if (response.data && response.data.id) {
        // Format direct ou { data: {...} }
        userData = response.data;
      } else {
        throw new Error('Format de réponse inattendu de l\'API');
      }

      if (userData) {
        // Transformer les données de l'API en format Profile
        const profileData: Profile = {
          id: userData.id || '1',
          firstName: userData.firstName || "Air",
          lastName: userData.lastName || "Lagon",
          commercialName: userData.commercialName || userData.companyName || "AIR LAGON PARAPENTE",
          companyName: userData.companyName || "Air Lagon Parapente",
          email: userData.email || "contact@airlagon-parapente.fr",
          phone: userData.phone || "+33 4 67 96 00 00",
          address: userData.address || userData.location ||"" ,
          city: userData.city || "",
          zipCode: userData.zipCode || "34",
          avatar: userData.avatar || userData.image || "/airlagon-avatar.jpg",
          websiteUrl: userData.websiteUrl || userData.website || "https://www.airlagon-parapente.fr",
          professionalCategory: userData.professionalCategory || userData.category || "tourism",
          description: userData.description || "École de parapente certifiée, spécialisée dans les vols tandem et les stages d'initiation au-dessus du magnifique Lac du Salagou.",
          experience: userData.experience || "10+ ans",
          rating: userData.rating || 4.9,
          totalFlights: userData.totalFlights || userData.flightCount || 5000
        };
        setProfile(profileData);
      } else {
        throw new Error('Aucune donnée de profil reçue');
      }
    } catch (err: any) {
      console.error('Erreur lors du chargement du profil:', err);
      setProfileError(err.message || 'Impossible de charger le profil. Veuillez réessayer.');
    } finally {
      setProfileLoading(false);
    }
  };

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


  const submitReservation = async () => {
    if (!selectedParapente) return;
    
    try {
      setReservationLoading(true);
      
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

  const visitWebsite = () => {
    if (profile?.websiteUrl) {
      window.open(profile.websiteUrl, '_blank');
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className=" text-slate-900 relative overflow-hidden">

        {/* Contenu du hero */}
        <div
          className="container mx-auto px-4 pb-4 pt-20 relative z-10"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-medium mb-4">
              {profile?.commercialName || "Air Lagon Parapente"}
            </h1>
            <p className="text-md mb-8 opacity-90">
              École de parapente au Lac du Salagou - Vols tandem & Stages
            </p>
          </div>
        </div>
      </div>

      {/* Contenu principal avec profil à gauche et activités à droite */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* PROFIL À GAUCHE */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg sticky top-8">
              {profileLoading ? (
                <div className="p-6 text-center">
                  <div
                    className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
                    style={{ borderColor: "#556B2F" }}
                  ></div>
                  <p className="mt-4" style={{ color: "#8B4513" }}>
                    Chargement du profil...
                  </p>
                </div>
              ) : profileError ? (
                <div className="p-6 text-center">
                  <div
                    className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#DC2626" }}
                  >
                    <AlertCircle className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-gray-600 mb-8">{profileError}</p>
                  <button
                    onClick={fetchProfile}
                    className="px-6 py-3 rounded-lg font-medium"
                    style={{
                      backgroundColor: "#556B2F",
                      color: "white",
                    }}
                  >
                    Réessayer
                  </button>
                </div>
              ) : profile ? (
                <>
                  {/* Photo de profil */}
                  <div className="relative h-48 bg-secondary-text  rounded-t-lg overflow-hidden">
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt={profile.commercialName || `${profile.firstName} ${profile.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-24 h-24 text-white/70" />
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-yellow-500" fill="#FBBF24" />
                        <span className="font-bold">{profile.rating || 4.9}</span>
                       
                      </div>
                    </div>
                  </div>

                  {/* Informations du profil */}
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-2" style={{ color: "#8B4513" }}>
                      {profile.commercialName || `${profile.firstName} ${profile.lastName}`}
                    </h2>
                    {profile.companyName && (
                      <div className="flex items-center gap-2 mb-2">
                        <Briefcase className="w-4 h-4" style={{ color: "#556B2F" }} />
                        <span className="text-gray-600 text-sm">{profile.companyName}</span>
                      </div>
                    )}
                    <p className="text-gray-600 mb-4">{profile.description || "École de parapente certifiée au Lac du Salagou."}</p>

                

                    {/* Contact */}
                    <div className="space-y-3 mb-6">
                      {profile.address && (
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 mt-0.5" style={{ color: "#556B2F" }} />
                          <div>
                            <span className="text-gray-700">{profile.address}</span>
                            {(profile.city || profile.zipCode) && (
                              <div className="text-gray-600 text-sm">
                                {profile.zipCode} {profile.city}
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                      {profile.email && (
                        <div className="flex items-center gap-3">
                          <Mail className="w-5 h-5" style={{ color: "#556B2F" }} />
                          <span className="text-gray-700">{profile.email}</span>
                        </div>
                      )}
                      {profile.phone && (
                        <div className="flex items-center gap-3">
                          <Phone className="w-5 h-5" style={{ color: "#556B2F" }} />
                          <span className="text-gray-700">{profile.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Bouton Visiter le site */}
                    {profile.websiteUrl && (
                      <button
                        onClick={visitWebsite}
                        className="w-full py-3 rounded-lg font-medium text-white flex items-center justify-center gap-2"
                        style={{ backgroundColor: "#8B4513" }}
                      >
                        <Globe className="w-5 h-5" />
                        Visiter le site officiel
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-6 text-center">
                  <AlertCircle className="w-12 h-12 mx-auto mb-4" style={{ color: "#8B4513" }} />
                  <p className="text-gray-600">Profil non disponible</p>
                  <button
                    onClick={fetchProfile}
                    className="mt-4 px-6 py-2 rounded-lg font-medium"
                    style={{
                      backgroundColor: "#556B2F",
                      color: "white",
                    }}
                  >
                    Recharger le profil
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ACTIVITÉS À DROITE */}
          <div className="lg:col-span-2">
            {/* Barre de recherche et filtres */}
            <div className="mb-8 bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <Search className="w-5 h-5" style={{ color: "#556B2F" }} />
                <h2 className="text-lg font-semibold" style={{ color: "#8B4513" }}>
                  Rechercher des activités
                </h2>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Rechercher une activité..."
                      value={searchFilters.searchQuery}
                      onChange={(e) =>
                        setSearchFilters({
                          ...searchFilters,
                          searchQuery: e.target.value,
                        })
                      }
                      className="w-full pl-4 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#556B2F] text-gray-800"
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

            {/* Contenu des activités */}
            {loading ? (
              <div className="text-center py-16 bg-white rounded-lg shadow">
                <div
                  className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto"
                  style={{ borderColor: "#556B2F" }}
                ></div>
                <p className="mt-4" style={{ color: "#8B4513" }}>
                  Chargement des activités...
                </p>
              </div>
            ) : error ? (
              <div className="text-center py-16 bg-white rounded-lg shadow">
                <div
                  className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: "#DC2626" }}
                >
                  <AlertCircle className="w-8 h-8 text-white" />
                </div>
                <h2
                  className="text-xl font-bold mb-2"
                  style={{ color: "#8B4513" }}
                >
                  Erreur de chargement
                </h2>
                <p className="text-gray-600 mb-8">{error}</p>
                <button
                  onClick={fetchParapentes}
                  className="px-6 py-3 rounded-lg font-medium"
                  style={{
                    backgroundColor: "#556B2F",
                    color: "white",
                  }}
                >
                  Réessayer
                </button>
              </div>
            ) : filteredParapentes.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: "#F0F7F0" }}>
                  <AlertCircle className="w-8 h-8" style={{ color: "#556B2F" }} />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: "#8B4513" }}>
                  Aucune activité disponible
                </h3>
                <p className="text-gray-600 mb-8">
                  Aucune activité de parapente n'est disponible pour le moment.
                </p>
                {profile?.websiteUrl && (
                  <button
                    onClick={visitWebsite}
                    className="px-6 py-3 rounded-lg font-medium text-white flex items-center gap-2 mx-auto"
                    style={{ backgroundColor: "#8B4513" }}
                  >
                    <Globe className="w-5 h-5" />
                    Consulter le site officiel pour les activités
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* En-tête des résultats */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold" style={{ color: "#8B4513" }}>
                    {filteredParapentes.length} activité{filteredParapentes.length > 1 ? "s" : ""} disponible{filteredParapentes.length > 1 ? "s" : ""}
                  </h2>
                </div>

                {/* Liste des activités de l'API */}
                <div className="space-y-6">
                  {filteredParapentes.map((parapente) => (
                    <div
                      key={parapente.id}
                      className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300"
                    >
                      <div className="flex flex-col md:flex-row">
                        {/* Image */}
                        <div className="md:w-1/3">
                          <div className="h-48 md:h-full">
                            {parapente.images.length > 0 ? (
                              <img
                                src={parapente.images[0]}
                                alt={parapente.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div
                                className="w-full h-full flex items-center justify-center"
                                style={{ backgroundColor: "#6B8E23" }}
                              >
                                <span className="text-white">Pas d'image</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Contenu */}
                        <div className="md:w-2/3 p-6">
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h3 className="text-xl font-bold mb-2" style={{ color: "#8B4513" }}>
                                {parapente.title}
                              </h3>
                              <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                                <MapPin className="w-4 h-4" />
                                <span>{parapente.location}</span>
                              </div>
                            </div>
                            <div className="text-2xl font-bold" style={{ color: "#556B2F" }}>
                              {formatPrice(parapente.price)}/jour
                            </div>
                          </div>

                          <p className="text-gray-600 mb-4">{parapente.description}</p>

                         
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal de réservation */}
      {isReservationModalOpen && selectedParapente && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold" style={{ color: "#8B4513" }}>
                  Réserver cette activité
                </h2>
                <button
                  onClick={() => setIsReservationModalOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                  disabled={reservationLoading}
                >
                  <span className="text-2xl">&times;</span>
                </button>
              </div>

              {/* Détails de l'activité */}
              <div
                className="mb-6 p-4 rounded-lg border"
                style={{ borderColor: "#D3D3D3" }}
              >
                <h3 className="font-semibold mb-2" style={{ color: "#8B4513" }}>
                  {selectedParapente.title}
                </h3>
                <div className="flex justify-between text-sm">
                  <span>Prix par jour:</span>
                  <span className="font-semibold">
                    {formatPrice(selectedParapente.price)}
                  </span>
                </div>
                <div className="flex justify-between text-sm mt-1">
                  <span>Lieu:</span>
                  <span>{selectedParapente.location}</span>
                </div>
              </div>

              {/* Formulaire de réservation */}
              <div className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#8B4513" }}
                  >
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Date de début
                  </label>
                  <input
                    type="date"
                    value={reservationData.startDate}
                    onChange={(e) =>
                      setReservationData({
                        ...reservationData,
                        startDate: e.target.value,
                      })
                    }
                    className="w-full p-3 border rounded-lg"
                    style={{ borderColor: "#D3D3D3" }}
                    disabled={reservationLoading}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#8B4513" }}
                  >
                    <Calendar className="inline w-4 h-4 mr-1" />
                    Date de fin
                  </label>
                  <input
                    type="date"
                    value={reservationData.endDate}
                    onChange={(e) =>
                      setReservationData({
                        ...reservationData,
                        endDate: e.target.value,
                      })
                    }
                    className="w-full p-3 border rounded-lg"
                    style={{ borderColor: "#D3D3D3" }}
                    disabled={reservationLoading}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#8B4513" }}
                  >
                    <Users className="inline w-4 h-4 mr-1" />
                    Nombre de participants
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={reservationData.participants}
                    onChange={(e) =>
                      setReservationData({
                        ...reservationData,
                        participants: parseInt(e.target.value) || 1,
                      })
                    }
                    className="w-full p-3 border rounded-lg"
                    style={{ borderColor: "#D3D3D3" }}
                    disabled={reservationLoading}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium mb-2"
                    style={{ color: "#8B4513" }}
                  >
                    Notes supplémentaires
                  </label>
                  <textarea
                    value={reservationData.notes}
                    onChange={(e) =>
                      setReservationData({
                        ...reservationData,
                        notes: e.target.value,
                      })
                    }
                    className="w-full p-3 border rounded-lg"
                    style={{ borderColor: "#D3D3D3" }}
                    rows={3}
                    disabled={reservationLoading}
                    placeholder="Informations supplémentaires (allergies, préférences, etc.)"
                  />
                </div>

                {/* Résumé du prix */}
                <div
                  className="p-4 rounded-lg"
                  style={{ backgroundColor: "#F0F7F0" }}
                >
                  <div className="flex justify-between mb-1">
                    <span>Prix par jour:</span>
                    <span>{formatPrice(selectedParapente.price)}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span>Nombre de jours:</span>
                    <span>
                      {calculateDays(
                        reservationData.startDate,
                        reservationData.endDate,
                      )}{" "}
                      jours
                    </span>
                  </div>
                  <div
                    className="flex justify-between font-bold text-lg pt-2 border-t"
                    style={{ borderColor: "#D3D3D3" }}
                  >
                    <span>Total:</span>
                    <span style={{ color: "#556B2F" }}>
                      {formatPrice(
                        selectedParapente.price *
                          calculateDays(
                            reservationData.startDate,
                            reservationData.endDate,
                          ),
                      )}
                    </span>
                  </div>
                </div>

                {/* Boutons */}
                <div className="flex gap-4 pt-4">
                  <button
                    onClick={() => setIsReservationModalOpen(false)}
                    className="flex-1 py-3 border rounded-lg font-medium"
                    style={{
                      borderColor: "#D3D3D3",
                      color: "#8B4513",
                    }}
                    disabled={reservationLoading}
                  >
                    Annuler
                  </button>
                  <button
                    onClick={submitReservation}
                    className="flex-1 py-3 rounded-lg font-medium text-white flex items-center justify-center gap-2"
                    style={{
                      backgroundColor: reservationLoading
                        ? "#9CA3AF"
                        : "#556B2F",
                    }}
                    disabled={reservationLoading}
                  >
                    {reservationLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Traitement...
                      </>
                    ) : (
                      "Confirmer la réservation"
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