import React, { useState, useEffect } from 'react';
import { Plus, FolderOpen, CheckCircle, Clock, ClipboardCheck, Trash2, Edit2, Eye } from 'lucide-react';
import ProjetModal from './ProjetModal';
import api from '../lib/api'; // Assurez-vous d'avoir cette importation
import { useAuth } from '../hooks/useAuth'; // Import du hook d'authentification

interface Projet {
  id: number;
  titre: string;
  details: string;
  duree: string;
  media: string | null;
  status: 'active' | 'inactive';
  categorie: string;
  createdAt: string;
  updatedAt: string;
}

const ProjetsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [projets, setProjets] = useState<Projet[]>([]);
  const [loading, setLoading] = useState(true);
 const { user } = useAuth(); // Récupération de l'utilisateur et du token

  // Couleurs personnalisées
  const colors = {
    logo: "#556B2F",
    primaryDark: "#6B8E23",
    lightBg: "#FFFFFF",
    separator: "#D3D3D3",
    secondaryText: "#8B4513",
  };

  // Fonction pour récupérer les projets de l'utilisateur
const fetchProjets = async () => {
  try {
    setLoading(true);

    const response = await api.get("/projets/me");
    setProjets(response.data.data);
  } catch (error) {
    console.error("Erreur récupération projets:", error);
  } finally {
    setLoading(false);
  }
};

  

  // Calcul des statistiques
  const stats = {
    total: projets.length,
    actifs: projets.filter(p => p.status === 'active').length,
    enAttente: projets.filter(p => new Date(p.duree) > new Date()).length,
    termines: projets.filter(p => new Date(p.duree) <= new Date()).length,
  };

 useEffect(() => {
  if (user) {
    fetchProjets();
  }
}, [user, refreshTrigger]);


  // Formatage de la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.lightBg }}>
      {/* En-tête */}
      <header className="top-0 z-40 shadow-sm border-b" style={{ backgroundColor: 'white', borderColor: colors.separator }}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold" style={{ color: colors.logo }}>
                Mes Projets
              </h1>
              <p className="text-sm opacity-70" style={{ color: colors.secondaryText }}>
                Gérez et organisez vos projets professionnels
              </p>
            </div>
            
            <button
              onClick={() => setIsModalOpen(true)}
              className="group flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
              style={{ backgroundColor: colors.primaryDark }}
            >
              <Plus size={20} />
              Nouveau Projet
            </button>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="container mx-auto px-4 py-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div 
            className="bg-white rounded-xl p-6 shadow-sm border transition-all hover:shadow-md"
            style={{ borderColor: colors.separator }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-70 mb-1" style={{ color: colors.secondaryText }}>Total Projets</p>
                <p className="text-2xl font-bold" style={{ color: colors.logo }}>{stats.total}</p>
              </div>
              <div 
                className="p-3 rounded-full"
                style={{ backgroundColor: colors.primaryDark + '20' }}
              >
                <FolderOpen size={24} style={{ color: colors.primaryDark }} />
              </div>
            </div>
          </div>

          <div 
            className="bg-white rounded-xl p-6 shadow-sm border transition-all hover:shadow-md"
            style={{ borderColor: colors.separator }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-70 mb-1" style={{ color: colors.secondaryText }}>Projets Actifs</p>
                <p className="text-2xl font-bold" style={{ color: colors.logo }}>{stats.actifs}</p>
              </div>
              <div 
                className="p-3 rounded-full"
                style={{ backgroundColor: colors.primaryDark + '20' }}
              >
                <CheckCircle size={24} style={{ color: colors.primaryDark }} />
              </div>
            </div>
          </div>

          <div 
            className="bg-white rounded-xl p-6 shadow-sm border transition-all hover:shadow-md"
            style={{ borderColor: colors.separator }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-70 mb-1" style={{ color: colors.secondaryText }}>En Attente</p>
                <p className="text-2xl font-bold" style={{ color: colors.logo }}>{stats.enAttente}</p>
              </div>
              <div 
                className="p-3 rounded-full"
                style={{ backgroundColor: colors.primaryDark + '20' }}
              >
                <Clock size={24} style={{ color: colors.primaryDark }} />
              </div>
            </div>
          </div>

          <div 
            className="bg-white rounded-xl p-6 shadow-sm border transition-all hover:shadow-md"
            style={{ borderColor: colors.separator }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-70 mb-1" style={{ color: colors.secondaryText }}>Terminés</p>
                <p className="text-2xl font-bold" style={{ color: colors.logo }}>{stats.termines}</p>
              </div>
              <div 
                className="p-3 rounded-full"
                style={{ backgroundColor: colors.primaryDark + '20' }}
              >
                <ClipboardCheck size={24} style={{ color: colors.primaryDark }} />
              </div>
            </div>
          </div>
        </div>

        {/* Liste des projets */}
        <div 
          className="bg-white rounded-xl shadow-sm border overflow-hidden animate-fade-in"
          style={{ borderColor: colors.separator }}
        >
          <div className="p-6 border-b" style={{ borderColor: colors.separator }}>
            <h2 className="text-lg font-semibold" style={{ color: colors.secondaryText }}>
              Liste des Projets ({projets.length})
            </h2>
          </div>
          
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 mx-auto mb-4" style={{ borderColor: colors.primaryDark }} />
              <p style={{ color: colors.secondaryText }}>Chargement des projets...</p>
            </div>
          ) : projets.length === 0 ? (
            <div className="p-12 text-center">
              <div 
                className="w-24 h-24 mx-auto mb-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: colors.primaryDark + '10' }}
              >
                <FolderOpen size={48} style={{ color: colors.separator }} />
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: colors.secondaryText }}>
                Aucun projet pour le moment
              </h3>
              <p className="mb-6 text-gray-600 max-w-md mx-auto">
                Commencez par ajouter votre premier projet pour constituer votre portfolio professionnel.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all hover:shadow-lg active:scale-95"
                style={{ backgroundColor: colors.primaryDark }}
              >
                <Plus size={20} />
                Créer mon Premier Projet
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b" style={{ borderColor: colors.separator }}>
                    <th className="py-4 px-6" style={{ color: colors.secondaryText }}>Titre</th>
                    <th className="py-4 px-6" style={{ color: colors.secondaryText }}>Catégorie</th>
                    <th className="py-4 px-6" style={{ color: colors.secondaryText }}>Date de fin</th>
                    <th className="py-4 px-6" style={{ color: colors.secondaryText }}>Statut</th>
                    <th className="py-4 px-6" style={{ color: colors.secondaryText }}>Créé le</th>
                    <th className="py-4 px-6" style={{ color: colors.secondaryText }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {projets.map((projet) => (
                    <tr key={projet.id} className="border-b hover:bg-gray-50" style={{ borderColor: colors.separator }}>
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-medium" style={{ color: colors.secondaryText }}>{projet.titre}</p>
                          <p className="text-sm text-gray-600 truncate max-w-xs">{projet.details}</p>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="px-3 py-1 rounded-full text-xs font-medium" 
                              style={{ backgroundColor: colors.primaryDark + '20', color: colors.primaryDark }}>
                          {projet.categorie || 'Non spécifiée'}
                        </span>
                      </td>
                      <td className="py-4 px-6" style={{ color: colors.secondaryText }}>
                        {formatDate(projet.duree)}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          projet.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {projet.status === 'active' ? 'Actif' : 'Inactif'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-600">
                        {formatDate(projet.createdAt)}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-gray-100 rounded transition-colors" title="Voir">
                            <Eye size={16} style={{ color: colors.primaryDark }} />
                          </button>
                          <button className="p-2 hover:bg-gray-100 rounded transition-colors" title="Modifier">
                            <Edit2 size={16} style={{ color: colors.primaryDark }} />
                          </button>
                          <button 
                           
                            className="p-2 hover:bg-red-50 rounded transition-colors" 
                            title="Supprimer"
                          >
                            <Trash2 size={16} className="text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal d'ajout de projet */}
      <ProjetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        
      />
    </div>
  );
};

export default ProjetsPage;