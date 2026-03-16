// PersonnelGestion.tsx
import React, { useState, useEffect } from 'react';
import { Plus, Users, UserCircle, Shield, Briefcase, UserPlus, Search, Filter, X } from 'lucide-react';
import PersonnelModal from './PersonnelModal';
import PersonnelCard from './PersonnelCard';
import { useAuth } from '../../hooks/useAuth';
import api from "../../lib/api";

// Constantes de couleur basées sur votre palette
const COLORS = {
  logo: "#556B2F",           /* Olive green - logo/accent */
  primary: "#6B8E23",        /* Yellow-green - primary-dark */
  lightBg: "#FFFFFF",        /* White - light-bg */
  separator: "#D3D3D3",      /* Light gray - separator */
  secondaryText: "#8B4513",  /* Saddle brown - secondary-text */
  smallText: "#000000",      /* Black for small text */
};

// Interface pour les données du formulaire (ce qu'on envoie à l'API)
interface PersonnelFormData {
  name: string;
  email: string;
  role: 'commercial' | 'pro';
  description: string | null;
  password: string;
  idUser: string;
}

// Interface pour la réponse de l'API (ce qu'on reçoit)
interface Personnel {
  id: string;
  name: string;
  email: string;
  role: 'commercial' | 'pro' | 'support';
  description: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    userType: string;
    avatar?: string;
    companyName?: string;
  };
  userId: string;
}

const PersonnelGestion: React.FC = () => {
  const [personnels, setPersonnels] = useState<Personnel[]>([]);
  const [filteredPersonnels, setFilteredPersonnels] = useState<Personnel[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPersonnel, setEditingPersonnel] = useState<Personnel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const { isAuthenticated, getAuthHeaders } = useAuth();

  // Récupérer l'utilisateur depuis localStorage
  const getCurrentUser = () => {
    try {
      const userData = localStorage.getItem('user-data');
      if (userData) {
        const parsed = JSON.parse(userData);
        console.log('👤 Utilisateur récupéré:', parsed);
        return parsed;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    }
    return null;
  };

  const currentUser = getCurrentUser();

  // Chargement initial depuis l'API
  useEffect(() => {
    fetchPersonnels();
  }, []);

  // Filtrer les personnels quand les filtres changent
  useEffect(() => {
    filterPersonnels();
  }, [personnels, searchTerm, roleFilter]);

  const fetchPersonnels = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/personel', {
        headers: getAuthHeaders()
      });
      if (response.data.success) {
        // Filtrer pour ne pas afficher les supports
        const filteredData = response.data.data.filter((p: Personnel) => p.role !== 'support');
        setPersonnels(filteredData || []);
      }
    } catch (err: any) {
      console.error('Erreur lors du chargement des personnels:', err);
      setError(err.response?.data?.error || 'Impossible de charger les personnels. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const filterPersonnels = () => {
    let filtered = [...personnels];

    // Filtre par recherche
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(term) ||
        p.email.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        p.user?.firstName?.toLowerCase().includes(term) ||
        p.user?.lastName?.toLowerCase().includes(term) ||
        p.user?.email?.toLowerCase().includes(term)
      );
    }

    // Filtre par rôle
    if (roleFilter) {
      filtered = filtered.filter(p => p.role === roleFilter);
    }

    setFilteredPersonnels(filtered);
  };

  const handleAddPersonnel = async (personnelData: PersonnelFormData) => {
    try {
      if (!isAuthenticated) {
        alert('Vous devez être connecté pour ajouter un personnel');
        return;
      }

      console.log('📤 Données envoyées:', personnelData);

      const headers = getAuthHeaders();
      console.log('🔐 Headers:', headers);

      // Ajouter un timeout de 30 secondes
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await api.post('/personel', personnelData, {
        headers: headers,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      console.log('✅ Réponse reçue:', response.data);
      console.log('✅ Status:', response.status);
      console.log('✅ Headers réponse:', response.headers);

      if (response.data && response.data.success) {
        console.log('✅ Création réussie, rechargement de la liste...');
        await fetchPersonnels(); // Recharger la liste
        return response.data.data;
      } else {
        console.error('❌ Réponse API sans success:', response.data);
        throw new Error(response.data?.message || 'Erreur inconnue');
      }
    } catch (err: any) {
      console.error('❌ Erreur complète:', err);

      if (err.name === 'AbortError' || err.code === 'ECONNABORTED') {
        console.error('⏱️ Timeout - Le serveur a mis trop de temps à répondre');
        alert('Le serveur ne répond pas. Vérifiez que le backend est bien démarré sur http://localhost:3001');
      } else if (err.response) {
        // La requête a été faite et le serveur a répondu avec un code d'erreur
        console.error('📡 Status erreur:', err.response.status);
        console.error('📡 Données erreur:', err.response.data);
        console.error('📡 Headers erreur:', err.response.headers);

        const errorMessage = err.response.data?.message ||
          err.response.data?.error ||
          `Erreur ${err.response.status}: ${err.response.statusText}`;
        alert(errorMessage);
      } else if (err.request) {
        // La requête a été faite mais pas de réponse
        console.error('📡 Pas de réponse reçue du serveur');
        console.error('📡 Request:', err.request);
        alert('Le serveur ne répond pas. Vérifiez que le backend est bien démarré sur http://localhost:3001');
      } else {
        // Une erreur s'est produite lors de la configuration
        console.error('📡 Erreur configuration:', err.message);
        alert(err.message || 'Erreur inconnue');
      }
      throw err;
    }
  };

  const handleUpdatePersonnel = async (personnelData: PersonnelFormData) => {
    try {
      if (!editingPersonnel || !isAuthenticated) {
        alert('Vous devez être connecté pour modifier un personnel');
        return;
      }

      console.log('📤 Données de modification:', personnelData);

      const headers = getAuthHeaders();
      const response = await api.put(`/personel/${editingPersonnel.id}`, personnelData, {
        headers: headers,
      });

      console.log('✅ Réponse modification:', response.data);

      if (response.data.success) {
        await fetchPersonnels(); // Recharger la liste
        return response.data.data;
      }
    } catch (err: any) {
      console.error('❌ Erreur modification:', err);

      if (err.response) {
        const errorMessage = err.response.data?.message ||
          err.response.data?.error ||
          'Erreur lors de la modification';
        alert(errorMessage);
      } else {
        alert(err.message || 'Erreur inconnue');
      }
      throw err;
    }
  };

  const handleDeletePersonnel = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce personnel ?')) {
      return;
    }

    try {
      if (!isAuthenticated) {
        alert('Vous devez être connecté pour supprimer un personnel');
        return;
      }

      const response = await api.delete(`/personel/${id}`, {
        headers: getAuthHeaders(),
      });

      if (response.data.success) {
        // Supprimer localement
        setPersonnels(prevItems => prevItems.filter(item => item.id !== id));
      }
    } catch (err: any) {
      console.error('Erreur lors de la suppression:', err);
      alert(err.response?.data?.message || 'Erreur lors de la suppression. Veuillez réessayer.');
    }
  };

  const handleEditPersonnel = (personnel: Personnel) => {
    setEditingPersonnel(personnel);
    setIsModalOpen(true);
  };

  const handleModalSubmit = async (personnelData: PersonnelFormData) => {
    try {
      if (editingPersonnel) {
        await handleUpdatePersonnel(personnelData);
      } else {
        await handleAddPersonnel(personnelData);
      }
      setIsModalOpen(false);
      setEditingPersonnel(null);
    } catch (err) {
      console.error('Erreur lors de la soumission du modal:', err);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'commercial':
        return <Briefcase className="w-4 h-4" />;
      case 'pro':
        return <Shield className="w-4 h-4" />;
      case 'support':
        return <UserCircle className="w-4 h-4" />;
      default:
        return <UserPlus className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'commercial':
        return COLORS.primary; // Yellow-green
      case 'pro':
        return COLORS.logo; // Olive green
      case 'support':
        return '#10B981'; // Vert
      default:
        return COLORS.separator; // Gris
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'commercial':
        return 'Commercial';
      case 'pro':
        return 'Professionnel';
      case 'support':
        return 'Support';
      default:
        return role;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: COLORS.lightBg }}>
      {/* Header */}
      <header className="sticky top-0 z-40 shadow-sm" style={{ backgroundColor: COLORS.lightBg, borderBottom: `1px solid ${COLORS.separator}` }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg" style={{ backgroundColor: COLORS.logo }}>
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold" style={{ color: COLORS.secondaryText }}>
                  Gestion du Personnel
                </h1>
                <p className="text-sm" style={{ color: COLORS.logo }}>
                  {loading ? 'Chargement...' : `${filteredPersonnels.length} membre${filteredPersonnels.length > 1 ? 's' : ''}`}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                if (!isAuthenticated) {
                  alert('Vous devez être connecté pour ajouter un membre du personnel');
                  return;
                }
                setEditingPersonnel(null);
                setIsModalOpen(true);
              }}
              className="px-6 py-3 rounded-lg font-medium flex items-center gap-2 hover:shadow-md transition-all hover:scale-105"
              style={{
                backgroundColor: COLORS.logo,
                color: 'white'
              }}
            >
              <UserPlus className="w-5 h-5" />
              Ajouter un membre
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Loading State */}
        {loading ? (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: COLORS.logo }}></div>
            <p className="mt-4" style={{ color: COLORS.logo }}>Chargement du personnel...</p>
          </div>
        ) : error ? (
          // Error State
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: '#DC2626' }}>
              <Users className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: COLORS.secondaryText }}>
              Erreur
            </h2>
            <p className="text-gray-600 mb-8">{error}</p>
            <button
              onClick={fetchPersonnels}
              className="px-6 py-3 rounded-lg font-medium"
              style={{
                backgroundColor: COLORS.logo,
                color: 'white'
              }}
            >
              Réessayer
            </button>
          </div>
        ) : personnels.length === 0 ? (
          // Empty State
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS.logo }}>
              <UserPlus className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: COLORS.secondaryText }}>
              Aucun membre trouvé
            </h2>
            <p className="text-gray-600 mb-8">
              {isAuthenticated
                ? 'Commencez par ajouter votre premier membre du personnel'
                : 'Connectez-vous pour gérer le personnel'}
            </p>
            {isAuthenticated && (
              <button
                onClick={() => {
                  setEditingPersonnel(null);
                  setIsModalOpen(true);
                }}
                className="px-6 py-3 rounded-lg font-medium flex items-center gap-2 mx-auto hover:scale-105 transition-all"
                style={{
                  backgroundColor: COLORS.logo,
                  color: 'white'
                }}
              >
                <UserPlus className="w-5 h-5" />
                Ajouter un membre
              </button>
            )}
          </div>
        ) : (
          // Content
          <>
            {/* Filtres */}
            <div className="mb-8 p-4 rounded-lg border" style={{ borderColor: COLORS.separator, backgroundColor: COLORS.lightBg }}>
              <div className="flex flex-col md:flex-row gap-4">
                {/* Barre de recherche */}
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: COLORS.logo }} />
                  <input
                    type="text"
                    placeholder="Rechercher par nom, email, description, utilisateur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-10 p-3 border rounded-lg focus:ring-2 focus:outline-none"
                    style={{
                      borderColor: COLORS.separator,
                      backgroundColor: COLORS.lightBg,
                      color: COLORS.smallText
                    }}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm('')}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Filtre par rôle */}
                <div className="relative min-w-[200px]">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: COLORS.logo }} />
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:outline-none appearance-none"
                    style={{
                      borderColor: COLORS.separator,
                      backgroundColor: COLORS.lightBg,
                      color: COLORS.smallText
                    }}
                  >
                    <option value="">Tous les rôles</option>
                    <option value="commercial">Commercial</option>
                    <option value="pro">Professionnel</option>
                  </select>
                </div>
              </div>

              {/* Résumé des filtres */}
              <div className="mt-4 flex items-center gap-2 text-sm" style={{ color: COLORS.logo }}>
                <span className="font-medium">{filteredPersonnels.length} résultat{filteredPersonnels.length > 1 ? 's' : ''}</span>
                {roleFilter && (
                  <span className="px-2 py-1 rounded-full text-xs flex items-center gap-1"
                    style={{ backgroundColor: `${getRoleColor(roleFilter)}20`, color: getRoleColor(roleFilter) }}>
                    {getRoleIcon(roleFilter)}
                    {getRoleLabel(roleFilter)}
                  </span>
                )}
              </div>
            </div>

            {/* Grille des personnels */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPersonnels.map((personnel) => (
                <PersonnelCard
                  key={personnel.id}
                  personnel={personnel}
                  onEdit={handleEditPersonnel}
                  onDelete={handleDeletePersonnel}
                  getRoleIcon={getRoleIcon}
                  getRoleColor={getRoleColor}
                  getRoleLabel={getRoleLabel}
                />
              ))}
            </div>
          </>
        )}
      </main>

      {/* Modal d'ajout/modification */}
      <PersonnelModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPersonnel(null);
        }}
        onSubmit={handleModalSubmit}
        initialData={editingPersonnel}
        currentUser={currentUser}
      />
    </div>
  );
};

export default PersonnelGestion;