import { Badge, Clock, ImageIcon, Play, VideoIcon, X, MapPin, Calendar, User, DollarSign } from "lucide-react";
import { useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

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

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  video: string | null;
  date: string;
  category: string;
  type: "photo" | "video";
  details?: {
    location: string;
    budget: string;
    duration: string;
    client: string;
    status: string;
    teamSize: number;
    services: string[];
    challenges: string[];
    gallery?: string[];
  };
}

interface ProjectsTabProps {
  professional: ProfessionalProfile;
}

const ProjectsTab: React.FC<ProjectsTabProps> = ({ professional }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'photos' | 'videos'>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [projects] = useState<Project[]>([
    {
      id: 1,
      title: "Rénovation Maison Moderne",
      description: "Rénovation complète avec modernisation intérieure et extérieure",
      image: "https://i.pinimg.com/1200x/31/a3/5e/31a35e5b52746b50a2407de125d35850.jpg",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      date: "2024-01-15",
      category: "Rénovation",
      type: "video",
      details: {
        location: "Paris 16ème",
        budget: "€85,000",
        duration: "3 mois",
        client: "Famille Martin",
        status: "Terminé",
        teamSize: 4,
        services: ["Démolition", "Électricité", "Plomberie", "Peinture", "Menuiserie"],
        challenges: ["Contraintes de temps", "Préservation d'éléments historiques"],
        gallery: [
          "https://i.pinimg.com/1200x/31/a3/5e/31a35e5b52746b50a2407de125d35850.jpg",
          "https://i.pinimg.com/736x/b1/99/76/b199762f6e64a708a5f58eac07325119.jpg"
        ]
      }
    },
    {
      id: 2,
      title: "Construction Appartement",
      description: "Immeuble résidentiel de 4 étages avec 16 appartements",
      image: "https://i.pinimg.com/1200x/a6/6e/47/a66e473e8ed32bb3d153017af507f83c.jpg",
      video: null,
      date: "2023-11-20",
      category: "Construction",
      type: "photo",
      details: {
        location: "Lyon",
        budget: "€320,000",
        duration: "8 mois",
        client: "Promoteur Immobilier",
        status: "Terminé",
        teamSize: 12,
        services: ["Fondations", "Structure", "Isolation", "Finitions"],
        challenges: ["Contraintes urbaines", "Coordination des équipes"],
        gallery: [
          "https://i.pinimg.com/1200x/a6/6e/47/a66e473e8ed32bb3d153017af507f83c.jpg",
          "https://i.pinimg.com/736x/57/09/8b/57098b38d3e638fa7b8323cfd3ff4cda.jpg"
        ]
      }
    },
    {
      id: 3,
      title: "Aménagement Bureau",
      description: "Espace de bureau avec design contemporain",
      image: "https://i.pinimg.com/736x/b1/99/76/b199762f6e64a708a5f58eac07325119.jpg",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      date: "2023-09-10",
      category: "Aménagement",
      type: "video",
      details: {
        location: "Bordeaux",
        budget: "€45,000",
        duration: "6 semaines",
        client: "Startup Tech",
        status: "Terminé",
        teamSize: 3,
        services: ["Cloisons", "Éclairage", "Mobilier", "Décoration"],
        challenges: ["Optimisation de l'espace", "Acoustique"],
        gallery: [
          "https://i.pinimg.com/736x/b1/99/76/b199762f6e64a708a5f58eac07325119.jpg",
          "https://i.pinimg.com/1200x/46/bb/5d/46bb5df4d9ca65648383226b41de80ec.jpg"
        ]
      }
    },
    {
      id: 4,
      title: "Réhabilitation Bâtiment",
      description: "Restauration d'un bâtiment historique",
      image: "https://i.pinimg.com/1200x/46/bb/5d/46bb5df4d9ca65648383226b41de80ec.jpg",
      video: null,
      date: "2023-07-05",
      category: "Réhabilitation",
      type: "photo",
      details: {
        location: "Strasbourg",
        budget: "€120,000",
        duration: "5 mois",
        client: "Ville de Strasbourg",
        status: "Terminé",
        teamSize: 6,
        services: ["Maçonnerie", "Charpente", "Toiture", "Restoration"],
        challenges: ["Normes patrimoniales", "Matériaux anciens"],
        gallery: [
          "https://i.pinimg.com/1200x/46/bb/5d/46bb5df4d9ca65648383226b41de80ec.jpg",
          "https://i.pinimg.com/1200x/31/a3/5e/31a35e5b52746b50a2407de125d35850.jpg"
        ]
      }
    },
    {
      id: 5,
      title: "Extension Maison",
      description: "Extension avec nouvelle chambre et salle de bain",
      image: "https://i.pinimg.com/736x/57/09/8b/57098b38d3e638fa7b8323cfd3ff4cda.jpg",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      date: "2023-05-18",
      category: "Extension",
      type: "video",
      details: {
        location: "Marseille",
        budget: "€65,000",
        duration: "2 mois",
        client: "Famille Dubois",
        status: "Terminé",
        teamSize: 5,
        services: ["Architecture", "Construction", "Plomberie", "Électricité"],
        challenges: ["Permis de construire", "Intégration architecturale"],
        gallery: [
          "https://i.pinimg.com/736x/57/09/8b/57098b38d3e638fa7b8323cfd3ff4cda.jpg",
          "https://i.pinimg.com/1200x/a6/6e/47/a66e473e8ed32bb3d153017af507f83c.jpg"
        ]
      }
    },
    {
      id: 6,
      title: "Cuisine Design",
      description: "Cuisine équipée sur-mesure",
      image: "https://i.pinimg.com/1200x/8f/4d/bb/8f4dbb6e5db4d7b2ef5daa1c4a5c5a5e.jpg",
      video: null,
      date: "2024-02-10",
      category: "Cuisine",
      type: "photo",
      details: {
        location: "Toulouse",
        budget: "€28,000",
        duration: "3 semaines",
        client: "M. et Mme Lambert",
        status: "Terminé",
        teamSize: 2,
        services: ["Électroménager", "Éclairage", "Plan de travail", "Rangement"],
        challenges: ["Espace limité", "Ergonomie"],
        gallery: [
          "https://i.pinimg.com/1200x/8f/4d/bb/8f4dbb6e5db4d7b2ef5daa1c4a5c5a5e.jpg",
          "https://i.pinimg.com/736x/b1/99/76/b199762f6e64a708a5f58eac07325119.jpg"
        ]
      }
    },
    {
      id: 7,
      title: "Jardin Paysager",
      description: "Aménagement extérieur avec terrasse",
      image: "https://i.pinimg.com/1200x/9a/8b/9d/9a8b9d8c8f8c8f8c8f8c8f8c8f8c8f8c.jpg",
      video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      date: "2023-10-30",
      category: "Extérieur",
      type: "video",
      details: {
        location: "Nice",
        budget: "€35,000",
        duration: "1 mois",
        client: "M. Durant",
        status: "Terminé",
        teamSize: 4,
        services: ["Terrassement", "Plantation", "Éclairage", "Arrosage"],
        challenges: ["Sol rocheux", "Drainage"],
        gallery: [
          "https://i.pinimg.com/1200x/9a/8b/9d/9a8b9d8c8f8c8f8c8f8c8f8c8f8c8f8c.jpg",
          "https://i.pinimg.com/1200x/46/bb/5d/46bb5df4d9ca65648383226b41de80ec.jpg"
        ]
      }
    },
    {
      id: 8,
      title: "Salle de Bain Luxe",
      description: "Rénovation complète salle de bain",
      image: "https://i.pinimg.com/1200x/7f/8c/9d/7f8c9d8c8f8c8f8c8f8c8f8c8f8c8f8c.jpg",
      video: null,
      date: "2024-03-05",
      category: "Salle de Bain",
      type: "photo",
      details: {
        location: "Nantes",
        budget: "€22,000",
        duration: "2 semaines",
        client: "Mme Rodriguez",
        status: "En cours",
        teamSize: 3,
        services: ["Carrelage", "Plomberie", "Électricité", "Ventilation"],
        challenges: ["Humidité", "Gain de place"],
        gallery: [
          "https://i.pinimg.com/1200x/7f/8c/9d/7f8c9d8c8f8c8f8c8f8c8f8c8f8c8f8c.jpg",
          "https://i.pinimg.com/736x/57/09/8b/57098b38d3e638fa7b8323cfd3ff4cda.jpg"
        ]
      }
    }
  ]);

  const filteredProjects = projects.filter(project => {
    if (activeTab === 'all') return true;
    if (activeTab === 'photos') return !project.video;
    if (activeTab === 'videos') return project.video;
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
          Photos ({projects.filter(p => !p.video).length})
        </button>
        <button
          onClick={() => setActiveTab('videos')}
          className={`px-3 py-1.5 text-xs font-medium transition-colors rounded-t-lg ${activeTab === 'videos' ? 'text-[#556B2F] bg-[#6B8E23]/10' : 'text-[#8B4513] hover:bg-[#6B8E23]/5'}`}
        >
          <VideoIcon className="w-3 h-3 inline mr-1.5" />
          Vidéos ({projects.filter(p => p.video).length})
        </button>
      </div>

      {filteredProjects.length === 0 ? (
        <Card className="p-6 bg-[#FFFFFF] border border-[#D3D3D3] text-center">
          <ImageIcon className="w-10 h-10 text-[#8B4513] mx-auto mb-2" />
          <p className="text-[#8B4513] text-sm">Aucun projet disponible</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="overflow-hidden hover:shadow transition-all duration-200 bg-[#FFFFFF] border border-[#D3D3D3] cursor-pointer"
              onClick={() => openProjectModal(project)}
            >
              <div className="h-48 w-full p-2 relative aspect-square bg-gray-100">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-44 rounded-md object-cover hover:scale-105 transition-transform duration-300"
                />
                {project.video && (
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                )}
                <span className="absolute top-3 left-3 text-[10px] bg-logo text-white py-1 px-2 font-bold rounded-full">{project.category}</span>
              </div>

              <div className="p-2">
                <h3 className="text-xs font-bold text-gray-900 mb-1 line-clamp-1">
                  {project.title} 
                </h3>
                <p className="text-[#8B4513] text-[10px] mb-2 line-clamp-2">
                  {project.description} 
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-[#D3D3D3]/50">
                  <div className="flex items-center gap-1 text-[#8B4513] text-[10px]">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{new Date(project.date).toLocaleDateString("fr-FR", { month: 'short', year: '2-digit' })}</span>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${project.type === 'video' ? 'bg-[#6B8E23]/20 text-[#556B2F]' : 'bg-[#8B4513]/20 text-[#8B4513]'}`}>
                    {project.type === 'video' ? 'Vidéo' : 'Photo'}
                  </span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}


      {/* Modal Détails du Projet */}
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="text-lg font-bold text-gray-900">{selectedProject?.title}</span>
              
            </DialogTitle>
          </DialogHeader>

          {selectedProject && (
            <div className="space-y-6">
              {/* Image Principale */}
              <div className="relative h-64 md:h-80 rounded-lg overflow-hidden bg-gray-100">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
                {selectedProject.video && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                )}
              </div>

              {/* Informations Principales */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2 p-3 bg-[#6B8E23]/5 rounded-lg">
                  <MapPin className="w-4 h-4 text-[#556B2F]" />
                  <div>
                    <p className="text-xs text-gray-500">Localisation</p>
                    <p className="text-sm font-medium">{selectedProject.details?.location}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-[#6B8E23]/5 rounded-lg">
                  <DollarSign className="w-4 h-4 text-[#556B2F]" />
                  <div>
                    <p className="text-xs text-gray-500">Budget</p>
                    <p className="text-sm font-medium">{selectedProject.details?.budget}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-[#6B8E23]/5 rounded-lg">
                  <Clock className="w-4 h-4 text-[#556B2F]" />
                  <div>
                    <p className="text-xs text-gray-500">Durée</p>
                    <p className="text-sm font-medium">{selectedProject.details?.duration}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-[#6B8E23]/5 rounded-lg">
                  <User className="w-4 h-4 text-[#556B2F]" />
                  <div>
                    <p className="text-xs text-gray-500">Client</p>
                    <p className="text-sm font-medium">{selectedProject.details?.client}</p>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">Description</h4>
                <p className="text-[#8B4513] text-sm">{selectedProject.description}</p>
              </div>

              {/* Services */}
              <div>
                <h4 className="text-sm font-bold text-gray-900 mb-2">Services Réalisés</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.details?.services.map((service, index) => (
                    <span key={index} className="px-3 py-1 bg-[#556B2F]/10 text-[#556B2F] text-xs rounded-full">
                      {service}
                    </span>
                  ))}
                </div>
              </div>

              {/* Détails */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-2">Détails du Projet</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Statut</span>
                      <span className={`text-sm font-medium ${selectedProject.details?.status === 'Terminé' ? 'text-green-600' : 'text-amber-600'}`}>
                        {selectedProject.details?.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Équipe</span>
                      <span className="text-sm font-medium">{selectedProject.details?.teamSize} personnes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Date de réalisation</span>
                      <span className="text-sm font-medium">
                        {new Date(selectedProject.date).toLocaleDateString("fr-FR", { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Défis */}
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-2">Défis Rencontrés</h4>
                  <ul className="space-y-1">
                    {selectedProject.details?.challenges.map((challenge, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-[#8B4513]">
                        <span className="text-[#556B2F] mt-1">•</span>
                        <span>{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Galerie */}
              {selectedProject.details?.gallery && (
                <div>
                  <h4 className="text-sm font-bold text-gray-900 mb-3">Galerie</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedProject.details.gallery.map((img, index) => (
                      <div key={index} className="aspect-square rounded overflow-hidden">
                        <img
                          src={img}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button className="bg-[#556B2F] hover:bg-[#6B8E23] text-white">
                  Demander un devis similaire
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectsTab;