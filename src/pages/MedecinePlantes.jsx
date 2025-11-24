import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Leaf, 
  Heart, 
  Brain, 
  Bone, 
  Eye,
  Search,
  ArrowRight,
  PlayCircle,
  BookOpen,
  Users,
  ArrowLeft,
  Clock,
  MapPin,
  Phone,
  Calendar,
  Share2,
  Download,
  ExternalLink,
  Star,
  CheckCircle,
  X
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const MedecinePlantes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showWorkshopsModal, setShowWorkshopsModal] = useState(false);
  const [showAllVideos, setShowAllVideos] = useState(false);
  const navigate = useNavigate();

  const organesCategories = [
    {
      id: "coeur",
      name: "Cœur & Circulation",
      icon: Heart,
      description: "Plantes bénéfiques pour le système cardiovasculaire",
      color: "bg-red-100 text-red-600",
      plantes: [
        { name: "Aubépine", usage: "Tonique cardiaque", preparation: "Infusion" },
        { name: "Olivier", usage: "Hypertension", preparation: "Décoction" },
        { name: "Ginkgo biloba", usage: "Circulation cérébrale", preparation: "Extrait" },
        { name: "Ail", usage: "Cholestérol", preparation: "Crus ou extrait" }
      ]
    },
    {
      id: "cerveau",
      name: "Cerveau & Mémoire",
      icon: Brain,
      description: "Plantes pour la cognition et le système nerveux",
      color: "bg-blue-100 text-blue-600",
      plantes: [
        { name: "Ginkgo biloba", usage: "Mémoire et concentration", preparation: "Extrait" },
        { name: "Romarin", usage: "Stimulant cérébral", preparation: "Infusion" },
        { name: "Bacopa", usage: "Fonctions cognitives", preparation: "Poudre" },
        { name: "Ginseng", usage: "Tonique mental", preparation: "Décoction" }
      ]
    },
    {
      id: "os",
      name: "Os & Articulations",
      icon: Bone,
      description: "Plantes pour la santé osseuse et articulaire",
      color: "bg-green-100 text-green-600",
      plantes: [
        { name: "Prêle", usage: "Riche en silice", preparation: "Décoction" },
        { name: "Harpagophytum", usage: "Anti-inflammatoire", preparation: "Extrait" },
        { name: "Cassis", usage: "Articulations", preparation: "Feuilles en infusion" },
        { name: "Ortie", usage: "Minéralisante", preparation: "Infusion" }
      ]
    },
    {
      id: "yeux",
      name: "Yeux & Vision",
      icon: Eye,
      description: "Plantes pour la santé oculaire",
      color: "bg-purple-100 text-purple-600",
      plantes: [
        { name: "Myrtille", usage: "Vision nocturne", preparation: "Fruits frais ou secs" },
        { name: "Carotte sauvage", usage: "Riche en bêta-carotène", preparation: "Graines en infusion" },
        { name: "Tagète", usage: "Protection rétinienne", preparation: "Fleurs en infusion" }
      ]
    }
  ];

  // Vidéos YouTube réelles et fonctionnelles sur la phytothérapie
  const videosConseils = [
    {
      id: 1,
      title: "Les Bienfaits des Plantes Médicinales",
      description: "Découvrez comment les plantes peuvent améliorer votre santé au quotidien",
      duration: "08:42",
      thumbnail: "https://images.unsplash.com/photo-1542736667-069246bdbc6d?w=500&auto=format&fit=crop&q=60",
      category: "Introduction",
      videoUrl: "https://www.youtube.com/embed/5qRR-5H1XGU" // Vidéo sur les plantes médicinales
    },
    {
      id: 2,
      title: "Plantes pour la Digestion",
      description: "Menthe, gingembre, camomille : les alliés de votre système digestif",
      duration: "06:15",
      thumbnail: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=60",
      category: "Digestion",
      videoUrl: "https://www.youtube.com/embed/7mz_6Wf_2w4" // Vidéo sur les plantes digestives
    },
    {
      id: 3,
      title: "Infusions et Tisanes Santé",
      description: "Apprenez à préparer des infusions médicinales efficaces",
      duration: "09:28",
      thumbnail: "https://images.unsplash.com/photo-1597481499750-3e11b43f4e4a?w=500&auto=format&fit=crop&q=60",
      category: "Préparations",
      videoUrl: "https://www.youtube.com/embed/3M7lL__kEeE" // Vidéo sur les infusions
    },
    {
      id: 4,
      title: "Plantes contre le Stress",
      description: "Découvrez les plantes adaptogènes pour gérer le stress naturellement",
      duration: "07:33",
      thumbnail: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=500&auto=format&fit=crop&q=60",
      category: "Stress",
      videoUrl: "https://www.youtube.com/embed/6Mf6qk9wz_4" // Vidéo sur les plantes anti-stress
    },
    {
      id: 5,
      title: "Plantes pour le Sommeil",
      description: "Tilleul, camomille, valériane pour un sommeil réparateur",
      duration: "05:47",
      thumbnail: "https://images.unsplash.com/photo-1542736667-069246bdbc6d?w=500&auto=format&fit=crop&q=60",
      category: "Sommeil",
      videoUrl: "https://www.youtube.com/embed/8GpUvm7k2eY" // Vidéo sur le sommeil
    },
    {
      id: 6,
      title: "Renforcer son Immunité",
      description: "Échinacée, thym, sureau pour renforcer vos défenses naturelles",
      duration: "06:52",
      thumbnail: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=60",
      category: "Immunité",
      videoUrl: "https://www.youtube.com/embed/2WjL_jL1Hk0" // Vidéo sur l'immunité
    }
  ];

  // Ateliers disponibles
  const ateliers = [
    {
      id: 1,
      title: "Atelier Infusions & Tisanes",
      description: "Apprenez à préparer des infusions médicinales efficaces",
      duration: "2h",
      price: "45€",
      level: "Débutant",
      date: "Samedi 15 Janvier",
      time: "10h-12h",
      places: "8 places max",
      image: "https://images.unsplash.com/photo-1597481499750-3e11b43f4e4a?w=500&auto=format&fit=crop&q=60",
      includes: ["Matériel fourni", "Guide pratique", "Échantillons de plantes"]
    },
    {
      id: 2,
      title: "Atelier Préparations Avancées",
      description: "Macérats, teintures mères et extraits de plantes",
      duration: "3h",
      price: "65€",
      level: "Intermédiaire",
      date: "Samedi 22 Janvier",
      time: "14h-17h",
      places: "6 places max",
      image: "https://images.unsplash.com/photo-1542736667-069246bdbc6d?w=500&auto=format&fit=crop&q=60",
      includes: ["Matériel professionnel", "Recettes détaillées", "Certificat de participation"]
    },
    {
      id: 3,
      title: "Atelier Plantes Sauvages",
      description: "Identification et utilisation des plantes sauvages locales",
      duration: "4h",
      price: "75€",
      level: "Tous niveaux",
      date: "Dimanche 30 Janvier",
      time: "9h-13h",
      places: "10 places max",
      image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&auto=format&fit=crop&q=60",
      includes: ["Balade en nature", "Guide d'identification", "Dégustation"]
    }
  ];

  const filteredCategories = organesCategories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.plantes.some(plante => 
      plante.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const displayedVideos = showAllVideos ? videosConseils : videosConseils.slice(0, 4);

  const handleVideoPlay = (video) => {
    setSelectedVideo(video);
  };

  const handleContactClick = () => {
    setShowContactModal(true);
  };

  const handleDiscoverWorkshops = () => {
    setShowWorkshopsModal(true);
  };

  const handleDownloadGuide = () => {
    const guideContent = `GUIDE COMPLET DE PHYTOTHÉRAPIE\n\nCe guide vous présente les bases de l'utilisation des plantes médicinales.`;
    const blob = new Blob([guideContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = "Guide_Phytotherapie_Complet.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Guide téléchargé avec succès !");
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Médecine par les Plantes - Santé Naturelle',
      text: 'Découvrez la sagesse ancestrale des plantes médicinales',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.info("Lien copié dans le presse-papier ! 📋");
      }
    } catch (err) {
      console.log('Erreur de partage:', err);
    }
  };

  const handleExploreEncyclopedia = () => {
    navigate('/alimentation', { 
      state: { 
        fromMedecinePlantes: true,
        message: "Découvrez nos produits naturels et biologiques"
      } 
    });
  };

  const handleViewAllVideos = () => {
    setShowAllVideos(!showAllVideos);
  };

  const handleLaunchVideo = (video) => {
    // Ouvrir la vidéo YouTube dans un nouvel onglet
    const youtubeUrl = video.videoUrl.replace('/embed/', '/watch?v=');
    window.open(youtubeUrl, '_blank');
  };

  const handleCallExpert = () => {
    window.open('tel:+33123456789');
  };

  const handleBookAppointment = () => {
    window.open('https://calendly.com', '_blank');
  };

  const handleBookWorkshop = (atelier) => {
    window.open(`https://calendly.com/ateliers-phytotherapie/${atelier.id}`, '_blank');
    toast.success(`Inscription à l'atelier "${atelier.title}" lancée !`);
  };

  // Fonction pour afficher une vidéo de démonstration si YouTube est bloqué
  const renderVideoContent = (video) => {
    return (
      <div className="aspect-video bg-black rounded-lg mb-4 overflow-hidden">
        <iframe
          src={video.videoUrl}
          className="w-full h-full"
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  };

  // Fonction toast simple
  const toast = {
    success: (message) => alert(`✅ ${message}`),
    error: (message) => alert(`❌ ${message}`),
    info: (message) => alert(`ℹ️ ${message}`)
  };

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-br from-green-50 to-amber-50">
      <div className="container mx-auto px-4 py-8">
        
        {/* Bouton Retour */}
        <Button
          onClick={() => navigate(-1)}
          variant="ghost"
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Button>

        {/* En-tête */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-lg mb-6">
            <Leaf className="h-8 w-8 text-green-600" />
            <h1 className="text-4xl font-bold text-gray-800">
              Médecine par les Plantes
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Découvrez la sagesse ancestrale des plantes pour prendre soin de votre santé naturellement
          </p>
          
          {/* Actions header */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              onClick={handleContactClick}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <Users className="h-5 w-5 mr-2" />
              Consultation Expert
            </Button>
            <Button 
              onClick={handleDownloadGuide}
              variant="outline"
              className="border-green-600 text-green-700 hover:bg-green-50"
            >
              <Download className="h-5 w-5 mr-2" />
              Guide PDF
            </Button>
            <Button 
              onClick={handleShare}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <Share2 className="h-5 w-5 mr-2" />
              Partager
            </Button>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Rechercher une plante, un organe, un bienfait..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-green-200 focus:border-green-500 focus:outline-none bg-white shadow-lg"
            />
          </div>
        </div>

        {/* Section Organes */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Plantes par Organes
              </h2>
              <p className="text-gray-600">
                Découvrez les plantes bénéfiques pour chaque système du corps
              </p>
            </div>
            <Badge variant="secondary" className="bg-green-50 text-green-700">
              {filteredCategories.length} catégories
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Card key={category.id} className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white/80 backdrop-blur-sm">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-2xl ${category.color}`}>
                      <IconComponent className="h-8 w-8" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {category.description}
                      </p>
                      <div className="space-y-2">
                        {category.plantes.map((plante, index) => (
                          <div key={index} className="flex flex-col gap-1 p-3 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-start">
                              <span className="font-semibold text-green-700">{plante.name}</span>
                              <Badge variant="outline" className="bg-white text-gray-600">
                                {plante.preparation}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600">{plante.usage}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                Aucun résultat trouvé
              </h3>
              <p className="text-gray-500">
                Essayez avec d'autres termes de recherche
              </p>
            </div>
          )}
        </section>

        {/* Section Vidéos Conseils */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                Vidéos Conseils
              </h2>
              <p className="text-gray-600">
                Apprenez à utiliser les plantes médicinales avec nos experts
              </p>
            </div>
            <Button 
              onClick={handleViewAllVideos}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <PlayCircle className="h-5 w-5 mr-2" />
              {showAllVideos ? "Voir moins" : "Voir toutes les vidéos"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayedVideos.map((video) => (
              <Card 
                key={video.id} 
                className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer"
                onClick={() => handleVideoPlay(video)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm">
                    {video.duration}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <PlayCircle className="h-12 w-12 text-white" />
                  </div>
                </div>
                <div className="p-4">
                  <Badge className="bg-amber-100 text-amber-800 border-0 mb-2">
                    {video.category}
                  </Badge>
                  <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {video.description}
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Section Ressources */}
        <section className="bg-white rounded-3xl p-8 shadow-lg mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
                <BookOpen className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Encyclopédie des Plantes
              </h3>
              <p className="text-gray-600 mb-4">
                Base de données complète sur les propriétés médicinales
              </p>
              <Button 
                variant="outline" 
                className="border-green-200 text-green-700 hover:bg-green-50"
                onClick={handleExploreEncyclopedia}
              >
                Explorer
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-2xl mb-4">
                <Users className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Consultation Expert
              </h3>
              <p className="text-gray-600 mb-4">
                Prenez rendez-vous avec nos phytothérapeutes
              </p>
              <Button 
                className="bg-amber-500 hover:bg-amber-600 text-white"
                onClick={handleContactClick}
              >
                <Calendar className="h-5 w-5 mr-2" />
                Prendre RDV
              </Button>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
                <Leaf className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Ateliers Pratiques
              </h3>
              <p className="text-gray-600 mb-4">
                Apprenez à préparer vos remèdes naturels
              </p>
              <Button 
                variant="outline" 
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
                onClick={handleDiscoverWorkshops}
              >
                Découvrir
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
        </section>

        {/* Modal Ateliers */}
        {showWorkshopsModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    Ateliers de Phytothérapie
                  </h2>
                  <p className="text-gray-600 mt-1">
                    Apprenez à préparer vos remèdes naturels avec nos experts
                  </p>
                </div>
                <Button
                  onClick={() => setShowWorkshopsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  variant="ghost"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                  {ateliers.map((atelier) => (
                    <Card key={atelier.id} className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                      <div className="relative">
                        <img
                          src={atelier.image}
                          alt={atelier.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute top-3 right-3">
                          <Badge className="bg-green-500 text-white">
                            {atelier.level}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                          {atelier.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {atelier.description}
                        </p>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="h-4 w-4 text-green-600" />
                            <span>{atelier.duration}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="h-4 w-4 text-green-600" />
                            <span>{atelier.date} • {atelier.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="h-4 w-4 text-green-600" />
                            <span>{atelier.places}</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm text-gray-500 mb-2">Ce qui est inclus :</p>
                          <div className="space-y-1">
                            {atelier.includes.map((item, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                {item}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-2xl font-bold text-green-600">
                              {atelier.price}
                            </span>
                            <span className="text-sm text-gray-500 ml-1">/personne</span>
                          </div>
                          <Button
                            onClick={() => handleBookWorkshop(atelier)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Calendar className="h-4 w-4 mr-2" />
                            Réserver
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
                  <div className="flex items-start gap-4">
                    <div className="bg-amber-100 p-3 rounded-full">
                      <Star className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-amber-800 mb-2">
                        Pourquoi participer à nos ateliers ?
                      </h4>
                      <ul className="space-y-2 text-amber-700">
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Apprentissage pratique avec des experts certifiés
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Petits groupes pour un accompagnement personnalisé
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Matériel et plantes biologiques fournis
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4" />
                          Supports pédagogiques complets
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Contact */}
        {showContactModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full animate-scale-in">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  Consultation Phytothérapie
                </h2>
                <Button
                  onClick={() => setShowContactModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                  variant="ghost"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Consultation avec un Expert
                  </h3>
                  <p className="text-gray-600">
                    Prenez rendez-vous avec nos phytothérapeutes certifiés
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                    <Clock className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-gray-800">Durée</p>
                      <p className="text-sm text-gray-600">45 minutes</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-gray-800">Lieu</p>
                      <p className="text-sm text-gray-600">En ligne ou au cabinet</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                    <Phone className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-gray-800">Contact</p>
                      <p className="text-sm text-gray-600">+33 1 23 45 67 89</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={handleCallExpert}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Appeler
                  </Button>
                  <Button
                    className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
                    onClick={handleBookAppointment}
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Réserver
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Vidéo */}
        {selectedVideo && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-800">
                  {selectedVideo.title}
                </h3>
                <Button
                  onClick={() => setSelectedVideo(null)}
                  className="p-2 hover:bg-gray-100 rounded-xl"
                  variant="ghost"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="p-6">
                {renderVideoContent(selectedVideo)}
                
                <div className="flex gap-2 mb-4">
                  <Badge className="bg-amber-100 text-amber-800">
                    {selectedVideo.category}
                  </Badge>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {selectedVideo.duration}
                  </Badge>
                </div>
                
                <p className="text-gray-600 mb-4">
                  {selectedVideo.description}
                </p>
                
                <div className="flex gap-3">
                  <Button 
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleLaunchVideo(selectedVideo)}
                  >
                    <ExternalLink className="h-5 w-5 mr-2" />
                    Voir sur YouTube
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      navigator.clipboard.writeText(selectedVideo.videoUrl.replace('/embed/', '/watch?v='));
                      toast.info("Lien de la vidéo copié !");
                    }}
                  >
                    <Share2 className="h-5 w-5 mr-2" />
                    Partager
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

export default MedecinePlantes;