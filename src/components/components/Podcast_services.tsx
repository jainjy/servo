import React, { useState } from 'react';
import { Play, Headphones, Mic, Video, BookOpen, Users, Download, Share2, Clock, Heart, MessageCircle, ArrowRight, Sparkles, TrendingUp, Lightbulb } from 'lucide-react';

interface PodcastEpisode {
  id: number;
  title: string;
  description: string;
  duration: string;
  date: string;
  category: string;
  guests?: string[];
  listens: number;
  featured: boolean;
}

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  color: string;
  cta: string;
}

interface ResourceItem {
  title: string;
  type: 'ebook' | 'template' | 'checklist' | 'worksheet';
  description: string;
  downloadCount: number;
}

const PodcastsServices: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('tous');
  
  const podcastEpisodes: PodcastEpisode[] = [
    {
      id: 1,
      title: "De l'idée à la scale-up : parcours d'un entrepreneur",
      description: "Interview exclusive avec le fondateur de TechGrowth sur les défis de la croissance rapide.",
      duration: "45 min",
      date: "15 Nov 2024",
      category: "croissance",
      guests: ["Jean Dupont - CEO TechGrowth", "Marie Martin - VC Partner"],
      listens: 2540,
      featured: true
    },
    {
      id: 2,
      title: "Les 5 erreurs à éviter en levée de fonds",
      description: "Retour d'expérience et conseils pratiques pour réussir sa première levée.",
      duration: "32 min",
      date: "8 Nov 2024",
      category: "financement",
      listens: 1870,
      featured: true
    },
    {
      id: 3,
      title: "Marketing digital : stratégies qui marchent en 2024",
      description: "Les nouvelles tendances et outils pour booster sa visibilité en ligne.",
      duration: "38 min",
      date: "1 Nov 2024",
      category: "marketing",
      listens: 3210,
      featured: false
    },
    {
      id: 4,
      title: "Gestion du temps pour entrepreneurs surchargés",
      description: "Méthodes et outils pour optimiser sa productivité au quotidien.",
      duration: "28 min",
      date: "25 Oct 2024",
      category: "productivite",
      listens: 1560,
      featured: false
    },
    {
      id: 5,
      title: "Recrutement : attirer les meilleurs talents",
      description: "Comment construire une marque employeur attractive dans un marché concurrentiel.",
      duration: "41 min",
      date: "18 Oct 2024",
      category: "rh",
      listens: 1980,
      featured: false
    },
    {
      id: 6,
      title: "Internationalisation : se développer à l'étranger",
      description: "Stratégies et pièges à éviter pour une expansion internationale réussie.",
      duration: "36 min",
      date: "11 Oct 2024",
      category: "international",
      listens: 1420,
      featured: false
    }
  ];

  const services: ServiceCardProps[] = [
    {
      icon: <Mic className="w-6 h-6" />,
      title: "Studio d'enregistrement",
      description: "Studio professionnel équipé pour vos podcasts, interviews et contenus audio.",
      features: [
        "Équipement professionnel audio/vidéo",
        "Ingénieur du son dédié",
        "Montage et post-production",
        "Plateforme de diffusion"
      ],
      color: "blue",
      cta: "Réserver le studio"
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: "Production vidéo",
      description: "Création de contenus vidéo professionnels pour vos réseaux sociaux et site web.",
      features: [
        "Tournage et réalisation",
        "Motion design et animation",
        "Sous-titrage multilingue",
        "Optimisation pour les réseaux"
      ],
      color: "purple",
      cta: "Voir les réalisations"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Formations interactives",
      description: "Modules de formation en ligne et ateliers pratiques pour développer vos compétences.",
      features: [
        "Formations certifiantes",
        "Coaching personnalisé",
        "Communauté d'entrepreneurs",
        "Ressources exclusives"
      ],
      color: "green",
      cta: "Découvrir les formations"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Réseau & Networking",
      description: "Rencontres et événements pour connecter avec d'autres entrepreneurs et experts.",
      features: [
        "Événements mensuels",
        "Mastermind groups",
        "Rencontres B2B",
        "Annuaire des membres"
      ],
      color: "orange",
      cta: "Rejoindre le réseau"
    }
  ];

  const resources: ResourceItem[] = [
    {
      title: "Guide du business plan",
      type: 'ebook',
      description: "Modèle complet et conseils pour un business plan convaincant",
      downloadCount: 2840
    },
    {
      title: "Template de pitch deck",
      type: 'template',
      description: "Structure optimale pour présenter votre projet aux investisseurs",
      downloadCount: 1950
    },
    {
      title: "Checklist création d'entreprise",
      type: 'checklist',
      description: "Toutes les étapes pour lancer votre entreprise sans rien oublier",
      downloadCount: 3120
    },
    {
      title: "Calculateur de prévisionnel",
      type: 'worksheet',
      description: "Outil Excel pour construire vos prévisions financières",
      downloadCount: 1670
    }
  ];

  const categories = [
    { id: 'tous', label: 'Tous les épisodes', count: podcastEpisodes.length },
    { id: 'croissance', label: 'Croissance', count: podcastEpisodes.filter(ep => ep.category === 'croissance').length },
    { id: 'financement', label: 'Financement', count: podcastEpisodes.filter(ep => ep.category === 'financement').length },
    { id: 'marketing', label: 'Marketing', count: podcastEpisodes.filter(ep => ep.category === 'marketing').length },
    { id: 'productivite', label: 'Productivité', count: podcastEpisodes.filter(ep => ep.category === 'productivite').length }
  ];

  const filteredEpisodes = activeCategory === 'tous' 
    ? podcastEpisodes 
    : podcastEpisodes.filter(ep => ep.category === activeCategory);

  const getCategoryColor = (category: string) => {
    const colors = {
      croissance: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      financement: 'bg-gradient-to-r from-green-500 to-emerald-500',
      marketing: 'bg-gradient-to-r from-purple-500 to-pink-500',
      productivite: 'bg-gradient-to-r from-orange-500 to-red-500',
      rh: 'bg-gradient-to-r from-indigo-500 to-blue-500',
      international: 'bg-gradient-to-r from-teal-500 to-green-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  const getServiceColor = (color: string) => {
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      purple: 'from-purple-500 to-purple-600',
      green: 'from-green-500 to-green-600',
      orange: 'from-orange-500 to-orange-600'
    };
    return colors[color as keyof typeof colors];
  };

  return (
    <section className="py-8 bg-white mt-2 rounded-lg ">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* En-tête avec animation */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-white/80 backdrop-blur-sm border border-blue-200 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Ressources & Contenus Exclusifs
          </div>
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Podcasts & Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Découvrez nos ressources gratuites et services premium pour booster 
            votre parcours entrepreneurial. De l'inspiration à l'action.
          </p>
        </div>

        {/* Podcasts Section */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                <Headphones className="w-8 h-8 mr-3 text-blue-600" />
                Podcast "Entrepreneurial Spirit"
              </h3>
              <p className="text-gray-600">Des interviews inspirantes et conseils pratiques</p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <TrendingUp className="w-4 h-4" />
              <span>+15k écoutes mensuelles</span>
            </div>
          </div>

          {/* Catégories */}
          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {category.label}
                <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                  activeCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>

          {/* Épisodes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEpisodes.map((episode) => (
              <div
                key={episode.id}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border group ${
                  episode.featured ? 'border-2 border-blue-500' : 'border-gray-200'
                }`}
              >
                {episode.featured && (
                  <div className="bg-blue-500 text-white px-4 py-1 text-sm font-semibold rounded-t-2xl">
                    ⭐ Épisode en vedette
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${getCategoryColor(episode.category)}`}>
                      {episode.category}
                    </span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Clock className="w-4 h-4 mr-1" />
                      {episode.duration}
                    </div>
                  </div>
                  
                  <h4 className="font-bold text-lg text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {episode.title}
                  </h4>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {episode.description}
                  </p>

                  {episode.guests && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 font-semibold mb-1">Avec :</p>
                      {episode.guests.map((guest, index) => (
                        <p key={index} className="text-sm text-gray-700">{guest}</p>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Headphones className="w-4 h-4 mr-1" />
                        {episode.listens.toLocaleString()}
                      </div>
                      <div>{episode.date}</div>
                    </div>
                    <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors group/btn">
                      <Play className="w-4 h-4 mr-2" />
                      Écouter
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Services Section */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Nos Services Premium
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 group"
              >
                <div className={`p-6 bg-gradient-to-br ${getServiceColor(service.color)} text-white rounded-t-2xl`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      {service.icon}
                    </div>
                    <Sparkles className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <h4 className="font-bold text-xl mb-2">{service.title}</h4>
                  <p className="text-blue-50 text-sm opacity-90">{service.description}</p>
                </div>
                <div className="p-6">
                  <ul className="space-y-3 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors group-hover:bg-blue-50 group-hover:text-blue-600 flex items-center justify-center">
                    {service.cta}
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ressources Gratuites */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                <Download className="w-8 h-8 mr-3 text-green-600" />
                Ressources Gratuites
              </h3>
              <p className="text-gray-600">Téléchargez nos outils et templates pour entrepreneurs</p>
            </div>
            <div className="text-sm text-gray-500">
              <Lightbulb className="w-5 h-5 inline mr-1" />
              Mises à jour régulières
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Download className="w-3 h-3 mr-1" />
                    {resource.downloadCount}
                  </div>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {resource.title}
                </h4>
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                  {resource.description}
                </p>
                <button className="w-full bg-gray-50 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 hover:text-blue-600 transition-colors flex items-center justify-center">
                  Télécharger gratuitement
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Rejoignez Notre Communauté
            </h3>
            <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
              Accédez à l'ensemble de nos ressources, participez aux événements exclusifs 
              et connectez-vous avec une communauté d'entrepreneurs passionnés.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg text-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Rejoindre gratuitement
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-blue-600 transition-colors text-lg flex items-center justify-center">
                <Share2 className="w-5 h-5 mr-2" />
                Découvrir tous les services
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PodcastsServices;