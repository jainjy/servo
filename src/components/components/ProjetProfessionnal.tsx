// boutton.txt - Modifié pour afficher les vidéos en pause avec leur titre
import { Badge, Clock, ImageIcon, Play, VideoIcon, X, MapPin, Calendar, User, DollarSign } from "lucide-react";
import { useState, useEffect } from "react"; // Ajout de useEffect
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useAuth } from "@/hooks/useAuth"; // Import du hook d'authentification
import api from "@/lib/api"; // Import de l'API

interface ProfessionalProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  commercialName: string;
  address: string;
  city: string;
  zipCode: string;
  avatar: string;
  userType: string;
  ProfessionalSettings: {
    nomEntreprise: string;
    emailContact: string;
    telephone: string;
    adresse: string;
    horairesLundi: any;
    horairesMardi: any;
    horairesMercredi: any;
    horairesJeudi: any;
    horairesVendredi: any;
    horairesSamedi: any;
    horairesDimanche: any;
  } | null;
  metiers: Array<{
    metier: {
      id: number;
      libelle: string;
    };
  }>;
  services: Array<{
    service: {
      id: number;
      libelle: string;
      description: string;
      price: number;
      duration: number;
      category: {
        name: string;
      };
    };
  }>;
  Review: Array<{
    id: string;
    rating: number;
    comment: string;
    createdAt: string;
    user: {
      firstName: string;
      lastName: string;
      avatar: string;
    };
  }>;
}

// Interface modifiée pour correspondre à la structure Prisma
interface Project {
  id: string; // Changé de number à string (UUID)
  titre: string; // Changé de title à titre
  details: string; // Changé de description à details
  duree: string; // DateTime string
  media: string | null; // URL de l'image ou vidéo
  status: string;
  categorie: string | null;
  createdAt: string;
}

interface ProjectsTabProps {
  professional: ProfessionalProfile;
}

const ProjectsTab: React.FC<ProjectsTabProps> = ({ professional }) => {
 const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'photos' | 'videos'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);

  // Charger les projets depuis l'API
useEffect(() => {
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      if (!isAuthenticated || !user) {
        throw new Error("Vous devez être connecté pour voir les projets");
      }

      const response = await api.get(
        `/projets/pro/${professional.id}`
      );

      if (response.data.success) {
        setProjects(response.data.data);
      } else {
        throw new Error("Erreur lors du chargement des projets");
      }
    } catch (err: any) {
      console.error("Erreur API:", err);
      setError(err.response?.data?.message || err.message);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  if (professional?.id) {
    fetchProjects();
  }
}, [professional?.id, isAuthenticated, user]);


  // Fonction pour déterminer si un média est une vidéo
  const isVideo = (mediaUrl: string | null): boolean => {
    if (!mediaUrl) return false;
    const videoExtensions = ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.ogg'];
    return videoExtensions.some(ext => mediaUrl.toLowerCase().endsWith(ext));
  };

  // Fonction pour déterminer le type de contenu
  const getProjectType = (project: Project): "photo" | "video" => {
    return isVideo(project.media) ? "video" : "photo";
  };

  const filteredProjects = projects.filter(project => {
    if (activeTab === 'all') return true;
    if (activeTab === 'photos') return !isVideo(project.media);
    if (activeTab === 'videos') return isVideo(project.media);
    return true;
  });

  const openProjectModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  // Formatage de la date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // Afficher un extrait des détails
  const getShortDescription = (details: string) => {
    return details.length > 100 ? details.substring(0, 100) + "..." : details;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-[#6B8E23]/10 rounded-lg">
          <ImageIcon className="w-5 h-5 text-[#556B2F]" />
        </div>
        <h2 className="text-lg font-bold text-gray-900">
          Portfolio
        </h2>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 border-b border-[#D3D3D3] pb-1">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 text-xs font-medium transition-colors rounded-t-lg ${activeTab === 'all' ? 'text-[#556B2F] bg-[#6B8E23]/10' : 'text-[#8B4513] hover:bg-[#6B8E23]/5'}`}
        >
          Tous ({projects.length})
        </button>
        <button
          onClick={() => setActiveTab('photos')}
          className={`px-3 py-1.5 text-xs font-medium transition-colors rounded-t-lg ${activeTab === 'photos' ? 'text-[#556B2F] bg-[#6B8E23]/10' : 'text-[#8B4513] hover:bg-[#6B8E23]/5'}`}
        >
          <ImageIcon className="w-3 h-3 inline mr-1.5" />
          Photos ({projects.filter(p => !isVideo(p.media)).length})
        </button>
        <button
          onClick={() => setActiveTab('videos')}
          className={`px-3 py-1.5 text-xs font-medium transition-colors rounded-t-lg ${activeTab === 'videos' ? 'text-[#556B2F] bg-[#6B8E23]/10' : 'text-[#8B4513] hover:bg-[#6B8E23]/5'}`}
        >
          <VideoIcon className="w-3 h-3 inline mr-1.5" />
          Vidéos ({projects.filter(p => isVideo(p.media)).length})
        </button>
      </div>

      {/* État de chargement */}
      {loading && (
        <Card className="p-6 bg-[#FFFFFF] border border-[#D3D3D3] text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#556B2F] mx-auto mb-2"></div>
          <p className="text-[#8B4513] text-sm">Chargement des projets...</p>
        </Card>
      )}

      {/* Erreur */}
      {error && !loading && (
        <Card className="p-6 bg-[#FFFFFF] border border-[#D3D3D3] text-center">
          <div className="text-red-500 mb-2">
            <X className="w-8 h-8 mx-auto" />
          </div>
          <p className="text-red-600 text-sm">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            className="mt-2 bg-[#556B2F] hover:bg-[#6B8E23] text-white text-xs"
          >
            Réessayer
          </Button>
        </Card>
      )}

      {/* Projets */}
      {!loading && !error && filteredProjects.length === 0 ? (
        <Card className="p-6 bg-[#FFFFFF] border border-[#D3D3D3] text-center">
          <ImageIcon className="w-10 h-10 text-[#8B4513] mx-auto mb-2" />
          <p className="text-[#8B4513] text-sm">Aucun projet disponible</p>
        </Card>
      ) : (
        !loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {filteredProjects.map((project) => {
              const isVideoContent = isVideo(project.media);
              
              return (
                <Card
                  key={project.id}
                  className="overflow-hidden hover:shadow transition-all duration-200 bg-[#FFFFFF] border border-[#D3D3D3] cursor-pointer group"
                  onClick={() => openProjectModal(project)}
                  onMouseEnter={() => isVideoContent && setHoveredVideo(project.id)}
                  onMouseLeave={() => isVideoContent && setHoveredVideo(null)}
                >
                  <div className="h-48 w-full p-2 relative aspect-square bg-gray-100">
                    {project.media ? (
                      <>
                        {/* Vidéo en mode pause avec overlay */}
                        {isVideoContent ? (
                          <div className="relative w-full h-44 rounded-md overflow-hidden">
                            <video
                              muted
                              className="w-full h-full object-cover"
                              src={project.media}
                              title={project.titre}
                              preload="metadata"
                              playsInline
                              onMouseEnter={(e) => {
                                e.currentTarget.play().catch(e => {
                                 // console.log("Autoplay blocked:", e);
                                });
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.pause();
                                e.currentTarget.currentTime = 0;
                              }}
                            />
                            {/* Overlay semi-transparent avec titre */}
                            <div className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent flex flex-col justify-end p-3 transition-opacity duration-300 ${hoveredVideo === project.id ? 'opacity-90' : 'opacity-100'}`}>
                              <div className="flex items-center justify-center mb-2">
                                <div className={`w-10 h-10 ${hoveredVideo === project.id ? 'bg-[#6B8E23]/90' : 'bg-black/70'} rounded-full flex items-center justify-center transition-all duration-300`}>
                                  {hoveredVideo === project.id ? (
                                    <div className="flex items-center">
                                      <div className="w-2 h-2 bg-white ml-0.5"></div>
                                      <div className="w-2 h-2 bg-white mx-0.5"></div>
                                      <div className="w-2 h-2 bg-white mr-0.5"></div>
                                    </div>
                                  ) : (
                                    <Play className="w-5 h-5 text-white" />
                                  )}
                                </div>
                              </div>
                              <h4 className="text-white text-xs font-semibold text-center line-clamp-2">
                                {project.titre}
                              </h4>
                              <div className="flex items-center justify-center mt-1">
                                <VideoIcon className="w-3 h-3 text-white/80 mr-1" />
                                <span className="text-white/80 text-[10px]">Vidéo</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Image normale pour les photos */
                          <div className="relative w-full h-44 rounded-md overflow-hidden">
                            <img
                              src={project.media}
                              alt={project.titre}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                              <h4 className="text-white text-xs font-semibold text-center line-clamp-2">
                                {project.titre}
                              </h4>
                              <div className="flex items-center justify-center mt-1">
                                <ImageIcon className="w-3 h-3 text-white/80 mr-1" />
                                <span className="text-white/80 text-[10px]">Photo</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-44 rounded-md bg-gray-200 flex flex-col items-center justify-center">
                        <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />
                        <span className="text-xs text-gray-600 text-center px-2 line-clamp-2">
                          {project.titre}
                        </span>
                      </div>
                    )}
                    {project.categorie && (
                      <span className="absolute top-3 left-3 text-[10px] bg-logo text-white py-1 px-2 font-bold rounded-full">
                        {project.categorie}
                      </span>
                    )}
                  </div>

                  <div className="p-2">
                    <h3 className="text-xs font-bold text-gray-900 mb-1 line-clamp-1">
                      {project.titre} 
                    </h3>
                    <p className="text-[#8B4513] text-[10px] mb-2 line-clamp-2">
                      {getShortDescription(project.details)} 
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-[#D3D3D3]/50">
                      <div className="flex items-center gap-1 text-[#8B4513] text-[10px]">
                        <Calendar className="w-2.5 h-2.5" />
                        <span>{formatDate(project.createdAt)}</span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${isVideoContent ? 'bg-[#6B8E23]/20 text-[#556B2F]' : 'bg-[#8B4513]/20 text-[#8B4513]'}`}>
                        {isVideoContent ? 'Vidéo' : 'Photo'}
                      </span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )
      )}

      {/* Modal Détails du Projet */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">{selectedProject?.titre}</span>
            </DialogTitle>
          </DialogHeader>

          {selectedProject && (
            <div className="space-y-6">
              {/* Media Principal */}
              <div className="relative h-64 md:h-80 rounded-lg overflow-hidden bg-gray-100">
                {selectedProject.media ? (
                  isVideo(selectedProject.media) ? (
                    <video
                      controls
                      autoPlay
                      className="w-full h-full object-cover"
                      src={selectedProject.media}
                      title={selectedProject.titre}
                    />
                  ) : (
                    <img
                      src={selectedProject.media}
                      alt={selectedProject.titre}
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <ImageIcon className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Informations Principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2 p-3 bg-[#6B8E23]/5 rounded-lg">
                  <Calendar className="w-4 h-4 text-[#556B2F]" />
                  <div>
                    <p className="text-xs text-gray-500">Date de création</p>
                    <p className="text-sm font-medium">{formatDate(selectedProject.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-[#6B8E23]/5 rounded-lg">
                  <Clock className="w-4 h-4 text-[#556B2F]" />
                  <div>
                    <p className="text-xs text-gray-500">Durée du projet</p>
                    <p className="text-sm font-medium">{formatDate(selectedProject.duree)}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">Description</h4>
                <p className="text-[#8B4513] text-sm whitespace-pre-line">{selectedProject.details}</p>
              </div>

              {/* Catégorie et Statut */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-2">Détails du Projet</h4>
                  <div className="space-y-3">
                    {selectedProject.categorie && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">Catégorie</span>
                        <span className="text-sm font-medium text-[#556B2F]">
                          {selectedProject.categorie}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Statut</span>
                      <span className={`text-sm font-medium ${
                        selectedProject.status === 'active' ? 'text-green-600' : 
                        selectedProject.status === 'completed' ? 'text-blue-600' : 
                        'text-gray-600'
                      }`}>
                        {selectedProject.status === 'active' ? 'Actif' : 
                         selectedProject.status === 'completed' ? 'Terminé' : 
                         selectedProject.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Type de média */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-2">Type de contenu</h4>
                  <div className="flex items-center gap-2">
                    {isVideo(selectedProject.media) ? (
                      <>
                        <VideoIcon className="w-5 h-5 text-[#556B2F]" />
                        <span className="text-sm text-[#8B4513]">Vidéo</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-5 h-5 text-[#8B4513]" />
                        <span className="text-sm text-[#8B4513]">Photo</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              {user && user.role === 'user' && (
                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button className="bg-[#556B2F] hover:bg-[#6B8E23] text-white">
                    Demander un devis similaire
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectsTab;