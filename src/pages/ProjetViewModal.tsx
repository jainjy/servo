import React from 'react';
import { X, Calendar, Folder, Clock, CheckCircle, XCircle, Link as LinkIcon } from 'lucide-react';

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

interface ProjetViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  projet: Projet | null;
}

const ProjetViewModal: React.FC<ProjetViewModalProps> = ({ isOpen, onClose, projet }) => {
  if (!isOpen || !projet) return null;

  // Couleurs personnalisées
  const colors = {
    primaryDark: "#6B8E23",
    lightBg: "#FFFFFF",
    separator: "#D3D3D3",
    secondaryText: "#8B4513",
  };

  // Formatage de la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Vérifier si le média est une image ou une vidéo
  const isImage = (mediaUrl: string | null) => {
    if (!mediaUrl) return false;
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    return imageExtensions.some(ext => mediaUrl.toLowerCase().endsWith(ext));
  };

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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
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
                {projet.titre}
              </h2>
              <div className="flex items-center gap-4 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  projet.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {projet.status === 'active' ? 'Actif' : 'Inactif'}
                </span>
                <span className="flex items-center gap-1 text-sm text-gray-600">
                  <Calendar size={14} />
                  Créé le {formatDate(projet.createdAt)}
                </span>
              </div>
            </div>
            
            <button
              onClick={onClose}
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
                    {projet.categorie || 'Non spécifiée'}
                  </span>
                </div>

                {/* Détails */}
                <div className="mb-6">
                  <h3 className="font-semibold mb-3" style={{ color: colors.secondaryText }}>Description</h3>
                  <div 
                    className="p-4 rounded-lg bg-gray-50 max-h-60 overflow-y-auto"
                    style={{ borderColor: colors.separator }}
                  >
                    <p className="text-gray-700 whitespace-pre-line">{projet.details}</p>
                  </div>
                </div>

                {/* Dates */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                      <Clock size={20} style={{ color: colors.primaryDark }} />
                      <div>
                        <p className="text-sm text-gray-600">Date de fin</p>
                        <p className="font-medium">{formatDate(projet.duree)}</p>
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      new Date(projet.duree) > new Date() 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {new Date(projet.duree) > new Date() ? 'En cours' : 'Terminé'}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-3">
                      <CheckCircle size={20} style={{ color: colors.primaryDark }} />
                      <div>
                        <p className="text-sm text-gray-600">Dernière mise à jour</p>
                        <p className="font-medium">{formatDate(projet.updatedAt)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Colonne droite : Média */}
              <div>
                <h3 className="font-semibold mb-4" style={{ color: colors.secondaryText }}>Média</h3>
                
                {projet.media ? (
                  <div className="space-y-4">
                    {/* Prévisualisation du média */}
                    <div className="rounded-lg overflow-hidden border" style={{ borderColor: colors.separator }}>
                      {isImage(projet.media) ? (
                        <div className="relative">
                          <img 
                            src={projet.media} 
                            alt={projet.titre}
                            className="w-full h-64 object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                            <p className="text-white text-sm">Image • {getFileExtension(projet.media)}</p>
                          </div>
                        </div>
                      ) : isVideo(projet.media) ? (
                        <div className="relative">
                          <video 
                            src={projet.media}
                            className="w-full h-64 object-cover"
                            controls
                            poster="https://images.unsplash.com/photo-1574717024453-3b5d5e5b9b1b?auto=format&fit=crop&w=800"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                            <p className="text-white text-sm">Vidéo • {getFileExtension(projet.media)}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-gray-100">
                            <LinkIcon size={32} className="text-gray-400" />
                          </div>
                          <p className="text-gray-600 mb-2">Fichier média</p>
                          <p className="text-sm text-gray-500">{getFileExtension(projet.media)} • Lien externe</p>
                        </div>
                      )}
                    </div>

                  
                    

                    {/* Informations sur le média */}
                    <div className="p-4 rounded-lg bg-gray-50">
                      <h4 className="font-medium mb-3" style={{ color: colors.secondaryText }}>Informations du fichier</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Type :</span>
                          <span className="text-sm font-medium">
                            {isImage(projet.media) ? 'Image' : isVideo(projet.media) ? 'Vidéo' : 'Fichier'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-600">Format :</span>
                          <span className="text-sm font-medium">{getFileExtension(projet.media)}</span>
                        </div>
                        
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-8 text-center rounded-lg border-2 border-dashed" style={{ borderColor: colors.separator }}>
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" 
                         style={{ backgroundColor: colors.primaryDark + '10' }}>
                      <XCircle size={32} style={{ color: colors.separator }} />
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
              onClick={onClose}
              className="px-6 py-2 rounded-lg font-medium border transition-colors hover:bg-gray-50"
              style={{ borderColor: colors.separator, color: colors.secondaryText }}
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjetViewModal;