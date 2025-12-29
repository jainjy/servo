import React, { useState, useEffect } from 'react';
import { Plus, FolderOpen, CheckCircle, Clock, ClipboardCheck, Trash2, Edit2, Eye, X, Calendar, Folder, CheckCircle as CheckCircleIcon, Link as LinkIcon } from 'lucide-react';
import ProjetModal from './ProjetModal';
import api from '../lib/api';
import { useAuth } from '../hooks/useAuth';

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
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProjet, setCurrentProjet] = useState<Projet | null>(null);
  const [viewProjet, setViewProjet] = useState<Projet | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [projets, setProjets] = useState<Projet[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

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

  // Fonction pour supprimer un projet
  const handleDelete = async (id: number) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      return;
    }

    try {
      await api.delete(`/projets/${id}`);
      // Rafraîchir la liste
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('❌ Erreur suppression projet:', error);
      alert('Erreur lors de la suppression du projet');
    }
  };

  // Fonction pour ouvrir le modal d'édition
  const handleEdit = (projet: Projet) => {
    setCurrentProjet(projet);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  // Fonction pour visualiser un projet
  const handleView = (projet: Projet) => {
    setViewProjet(projet);
    setIsViewModalOpen(true);
  };

  // Fonction pour fermer le modal et réinitialiser
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setCurrentProjet(null);
    setRefreshTrigger(prev => prev + 1); // Rafraîchir la liste
  };

  // Fonction pour fermer le modal de visualisation
  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewProjet(null);
  };

  // Fonction pour ouvrir le modal de création
  const handleCreate = () => {
    setIsEditMode(false);
    setCurrentProjet(null);
    setIsModalOpen(true);
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

  // Formatage détaillé de la date pour le modal
  const formatDateDetailed = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Vérifier si le média est une image
  const isImage = (mediaUrl: string | null) => {
    if (!mediaUrl) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    return imageExtensions.some(ext => mediaUrl.toLowerCase().endsWith(ext));
  };

  // Vérifier si le média est une vidéo
  const isVideo = (mediaUrl: string | null) => {
    if (!mediaUrl) return false;
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
    return videoExtensions.some(ext => mediaUrl.toLowerCase().endsWith(ext));
  };

  // Obtenir l'extension du fichier
  const getFileExtension = (mediaUrl: string | null) => {
    if (!mediaUrl) return '';
    return mediaUrl.split('.').pop()?.toUpperCase() || '';
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
              onClick={handleCreate}
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
                onClick={handleCreate}
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
                          <button 
                            onClick={() => handleView(projet)}
                            className="p-2 hover:bg-gray-100 rounded transition-colors" 
                            title="Voir"
                          >
                            <Eye size={16} style={{ color: colors.primaryDark }} />
                          </button>
                          <button 
                            onClick={() => handleEdit(projet)}
                            className="p-2 hover:bg-gray-100 rounded transition-colors" 
                            title="Modifier"
                          >
                            <Edit2 size={16} style={{ color: colors.primaryDark }} />
                          </button>
                          <button 
                            onClick={() => handleDelete(projet.id)}
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

      {/* Modal pour création/édition de projet */}
      <ProjetModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        projet={currentProjet}
        isEditMode={isEditMode}
        onSuccess={() => setRefreshTrigger(prev => prev + 1)}
      />
      
      {/* Modal pour visualisation de projet */}
      {isViewModalOpen && viewProjet && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={handleCloseViewModal}
          />
          
          {/* Modal Container */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div 
              className="relative w-full max-w-4xl rounded-xl shadow-2xl transform transition-all"
              style={{ backgroundColor: colors.lightBg }}
            >
              {/* En-tête du modal */}
              <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: colors.separator }}>
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: colors.secondaryText }}>
                    {viewProjet.titre}
                  </h2>
                  <div className="flex items-center gap-4 mt-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      viewProjet.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {viewProjet.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                    <span className="flex items-center gap-1 text-sm text-gray-600">
                      <Calendar size={14} />
                      Créé le {formatDateDetailed(viewProjet.createdAt)}
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={handleCloseViewModal}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Contenu du modal */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Colonne gauche : Détails */}
                  <div>
                    {/* Catégorie */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Folder size={20} style={{ color: colors.primaryDark }} />
                        <h3 className="font-semibold" style={{ color: colors.secondaryText }}>Catégorie</h3>
                      </div>
                      <span 
                        className="px-4 py-2 rounded-lg text-sm font-medium inline-block"
                        style={{ backgroundColor: colors.primaryDark + '20', color: colors.primaryDark }}
                      >
                        {viewProjet.categorie || 'Non spécifiée'}
                      </span>
                    </div>

                    {/* Détails */}
                    <div className="mb-6">
                      <h3 className="font-semibold mb-3" style={{ color: colors.secondaryText }}>Description</h3>
                      <div 
                        className="p-4 rounded-lg bg-gray-50 max-h-60 overflow-y-auto"
                        style={{ borderColor: colors.separator }}
                      >
                        <p className="text-gray-700 whitespace-pre-line">{viewProjet.details}</p>
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                        <div className="flex items-center gap-3">
                          <Clock size={20} style={{ color: colors.primaryDark }} />
                          <div>
                            <p className="text-sm text-gray-600">Date de fin</p>
                            <p className="font-medium">{formatDateDetailed(viewProjet.duree)}</p>
                          </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          new Date(viewProjet.duree) > new Date() 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {new Date(viewProjet.duree) > new Date() ? 'En cours' : 'Terminé'}
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                        <div className="flex items-center gap-3">
                          <CheckCircleIcon size={20} style={{ color: colors.primaryDark }} />
                          <div>
                            <p className="text-sm text-gray-600">Dernière mise à jour</p>
                            <p className="font-medium">{formatDateDetailed(viewProjet.updatedAt)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Colonne droite : Média */}
                  <div>
                    <h3 className="font-semibold mb-4" style={{ color: colors.secondaryText }}>Média</h3>
                    
                    {viewProjet.media ? (
                      <div className="space-y-4">
                        {/* Prévisualisation du média */}
                        <div className="rounded-lg overflow-hidden border" style={{ borderColor: colors.separator }}>
                          {isImage(viewProjet.media) ? (
                            <div className="relative">
                              <img 
                                src={viewProjet.media} 
                                alt={viewProjet.titre}
                                className="w-full h-64 object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "https://images.unsplash.com/photo-1574717024453-3b5d5e5b9b1b?auto=format&fit=crop&w=800";
                                }}
                              />
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                <p className="text-white text-sm">Image • {getFileExtension(viewProjet.media)}</p>
                              </div>
                            </div>
                          ) : isVideo(viewProjet.media) ? (
                            <div className="relative">
                              <video 
                                src={viewProjet.media}
                                className="w-full h-64 object-cover"
                                controls
                                poster="https://images.unsplash.com/photo-1574717024453-3b5d5e5b9b1b?auto=format&fit=crop&w=800"
                              />
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                <p className="text-white text-sm">Vidéo • {getFileExtension(viewProjet.media)}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="p-8 text-center">
                              <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-gray-100">
                                <LinkIcon size={32} className="text-gray-400" />
                              </div>
                              <p className="text-gray-600 mb-2">Fichier média</p>
                              <p className="text-sm text-gray-500">{getFileExtension(viewProjet.media)} • Lien externe</p>
                            </div>
                          )}
                        </div>

                        {/* Lien vers le média */}
                      

                        {/* Informations sur le média */}
                        <div className="p-4 rounded-lg bg-gray-50">
                          <h4 className="font-medium mb-3" style={{ color: colors.secondaryText }}>Informations du fichier</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Type :</span>
                              <span className="text-sm font-medium">
                                {isImage(viewProjet.media) ? 'Image' : isVideo(viewProjet.media) ? 'Vidéo' : 'Fichier'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Format :</span>
                              <span className="text-sm font-medium">{getFileExtension(viewProjet.media)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-600">Statut :</span>
                              <span className="text-sm font-medium">
                                {viewProjet.status === 'active' ? 'Média actif' : 'Média inactif'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 text-center rounded-lg border-2 border-dashed" style={{ borderColor: colors.separator }}>
                        <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" 
                             style={{ backgroundColor: colors.primaryDark + '10' }}>
                          <X size={32} style={{ color: colors.separator }} />
                        </div>
                        <h4 className="font-medium mb-2" style={{ color: colors.secondaryText }}>
                          Aucun média associé
                        </h4>
                        <p className="text-sm text-gray-600">
                          Ce projet ne contient pas de fichier média.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Pied du modal */}
              <div className="flex justify-end gap-3 p-6 border-t" style={{ borderColor: colors.separator }}>
                <button
                  onClick={handleCloseViewModal}
                  className="px-6 py-2 rounded-lg font-medium border transition-colors hover:bg-gray-50"
                  style={{ borderColor: colors.separator, color: colors.secondaryText }}
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjetsPage;