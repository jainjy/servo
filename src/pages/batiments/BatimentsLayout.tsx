import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { useLocation } from 'react-router-dom';
import api from '../../lib/api.js'; // Adjust the path according to your project structure
import { DemandeDevisModal } from '@/components/DemandeDevisModal.js'; // Import du modal
import { Loader2 } from 'lucide-react';
import PodcastsBatiment from '@/components/PodcastsBatiment'; // Ajout de l'import du composant Podcasts

const BatimentsLayout = () => {
  const location = useLocation();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageErrors, setImageErrors] = useState({}); // État pour suivre les images en erreur

  // Ajout de l'état pour le modal
  const [devisModal, setDevisModal] = useState({
    isOpen: false,
    prestation: null
  });

  // Fonction pour gérer les erreurs d'image
  const handleImageError = (itemId) => {
    setImageErrors(prev => ({
      ...prev,
      [itemId]: true
    }));
  };

  // Fonction pour générer les initiales d'un titre
  const getInitials = (title) => {
    if (!title) return '??';
    
    const words = title.split(' ');
    if (words.length === 1) {
      return title.substring(0, 2).toUpperCase();
    }
    
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  // Fonction pour générer une couleur de fond basée sur les initiales
  const getBackgroundColor = (initials) => {
    let hash = 0;
    for (let i = 0; i < initials.length; i++) {
      hash = initials.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = [
      'bg-blue-200', 'bg-green-200', 'bg-purple-200', 
      'bg-orange-200', 'bg-brown-200', 'bg-teal-200',
      'bg-pink-200', 'bg-indigo-200', 'bg-amber-200'
    ];
    
    return colors[Math.abs(hash) % colors.length];
  };

  // Fonctions pour gérer le modal
  const openDevisModal = (prestation) => {
    setDevisModal({ isOpen: true, prestation });
  };

  const closeDevisModal = () => {
    setDevisModal({ isOpen: false, prestation: null });
  };

  // Fetch data from API
  useEffect(() => {
    const fetchBatimentData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/batiment');
        
        if (response.data.success) {
          // Transform API data to match frontend structure
          const apiSections = response.data.data.map(section => ({
            title: section.category,
            description: getSectionDescription(section.category),
            items: section.services.map(service => ({
              id: service.id,
              title: service.title,
              price: service.price,
              image: service.images && service.images.length > 0 
                ? service.images[0] 
                : getDefaultImage(service.title),
              description: service.description,
              metiers: service.metiers,
              reviews: service.reviews
            }))
          }));

          // Add static sections for Formation & Podcasts and Construction & Plans
          const staticSections = [
            {
              title: "Formation & Podcasts",
              description: "Formation continue et actualités",
              items: [
                { title: "Formation Rénovation", price: "490€/session", image: "https://i.pinimg.com/736x/2d/db/f5/2ddbf5d2f6316db5454bee1c028f5cdf.jpg", description: "Techniques rénovation" },
                { title: "Cours Construction", price: "590€/session", image: "https://i.pinimg.com/736x/75/69/97/75699783760fa330cd3fdb2de372cbb3.jpg", description: "Bases construction" },
                { title: "Podcast Immobilier", price: "Gratuit", image: "https://i.pinimg.com/736x/8c/9d/8b/8c9d8bbff5f660b4a78119e3c9f58a4c.jpg", description: "Actualités secteur" },
                { title: "Workshop Matériaux", price: "290€/jour", image: "https://i.pinimg.com/736x/2f/04/36/2f043687cb9218af9a19da972b52ead5.jpg", description: "Choix matériaux" },
                { title: "Formation Durable", price: "690€/session", image: "https://i.pinimg.com/736x/e8/75/71/e87571a444014476b09293a6ca790b26.jpg", description: "Construction écologique" },
                { title: "Webinaires Pro", price: "90€/session", image: "https://i.pinimg.com/736x/8f/dc/36/8fdc36d9a41f8aee52f10fb511f25d91.jpg", description: "Sessions en ligne" },
                { title: "Certification", price: "À partir de 1200€", image: "https://i.pinimg.com/736x/57/09/8b/57098b38d3e638fa7b8323cfd3ff4cda.jpg", description: "Diplômes professionnels" },
                { title: "E-learning", price: "À partir de 299€", image: "https://i.pinimg.com/736x/b1/99/76/b199762f6e64a708a5f58eac07325119.jpg", description: "Formation à distance" }
              ]
            },
            // {
            //   title: "Construction & Plans",
            //   description: "De la conception à la réalisation",
            //   items: [
            //     { title: "Maison Individuelle", price: "À partir de 1500€/m²", image: "https://i.pinimg.com/736x/2d/db/f5/2ddbf5d2f6316db5454bee1c028f5cdf.jpg", description: "Construction sur mesure" },
            //     { title: "Maison Écologique", price: "À partir de 2000€/m²", image: "https://i.pinimg.com/736x/75/69/97/75699783760fa330cd3fdb2de372cbb3.jpg", description: "Construction durable" },
            //     { title: "Plans Architecte", price: "80€/m²", image: "https://i.pinimg.com/736x/8c/9d/8b/8c9d8bbff5f660b4a78119e3c9f58a4c.jpg", description: "Conception détaillée" },
            //     { title: "Immeuble Collectif", price: "Sur devis", image: "https://i.pinimg.com/736x/2f/04/36/2f043687cb9218af9a19da972b52ead5.jpg", description: "Construction multi-logements" },
            //     { title: "Local Commercial", price: "Sur devis", image: "https://i.pinimg.com/736x/e8/75/71/e87571a444014476b09293a6ca790b26.jpg", description: "Espaces professionnels" },
            //     { title: "Modélisation 3D", price: "À partir de 500€", image: "https://i.pinimg.com/736x/8f/dc/36/8fdc36d9a41f8aee52f10fb511f25d91.jpg", description: "Visualisation projet" },
            //     { title: "Étude de Sol", price: "À partir de 1500€", image: "https://i.pinimg.com/736x/57/09/8b/57098b38d3e638fa7b8323cfd3ff4cda.jpg", description: "Analyse géotechnique" },
            //     { title: "Permis de Construire", price: "À partir de 2000€", image: "https://i.pinimg.com/736x/b1/99/76/b199762f6e64a708a5f58eac07325119.jpg", description: "Dossier administratif" }
            //   ]
            // }
          ];

          // Combine API sections with static sections
          const allSections = [...apiSections, ...staticSections];
          setSections(allSections);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Erreur lors du chargement des données');
        // Fallback to static data for non-commented sections only
        setSections(getStaticFallback());
      } finally {
        setLoading(false);
      }
    };

    fetchBatimentData();
  }, []);

  // Helper function to get section descriptions
  const getSectionDescription = (categoryName) => {
    const descriptions = {
      "Rénovation & Chantiers": "Experts en rénovation de bâtiments",
      "Matériaux & Viabilisations": "Solutions durables pour vos projets", 
      "Division Parcellaire": "Optimisation de l'espace foncier",
      "Formation & Podcasts": "Formation continue et actualités",
      "Construction & Plans": "De la conception à la réalisation"
    };
    return descriptions[categoryName] || "Services professionnels de qualité";
  };

  // Helper function for default images
  const getDefaultImage = (serviceTitle) => {
    const defaultImages = {
      "Rénovation Complète": "https://i.pinimg.com/736x/7a/f7/95/7af795aa69261731feae01375ad824df.jpg",
      "Rénovation Énergétique": "https://i.pinimg.com/1200x/75/d5/84/75d5848fde7b30cac973164b34836730.jpg",
      "Ravalement Façade": "https://i.pinimg.com/1200x/fb/9a/69/fb9a69b6c23d01e5aab93dabb5533de7.jpg",
      "Rénovation Toiture": "https://i.pinimg.com/1200x/67/fe/59/67fe591357a9c5d9d5175476cc28d20a.jpg",
      "Isolation": "https://i.pinimg.com/736x/e8/75/71/e87571a444014476b09293a6ca790b26.jpg",
      "Gros Œuvre": "https://i.pinimg.com/736x/2d/db/f5/2ddbf5d2f6316db5454bee1c028f5cdf.jpg",
      "Second Œuvre": "https://i.pinimg.com/736x/75/69/97/75699783760fa330cd3fdb2de372cbb3.jpg",
      "Étude Faisabilité": "https://i.pinimg.com/736x/2d/db/f5/2ddbf5d2f6316db5454bee1c028f5cdf.jpg",
      "Bornage": "https://i.pinimg.com/736x/75/69/97/75699783760fa330cd3fdb2de372cbb3.jpg",
      "Plan Topographique": "https://i.pinimg.com/736x/8c/9d/8b/8c9d8bbff5f660b4a78119e3c9f58a4c.jpg"
    };
    return defaultImages[serviceTitle] || "https://i.pinimg.com/736x/7a/f7/95/7af795aa69261731feae01375ad824df.jpg";
  };

  // Static data fallback for when API fails
  const getStaticFallback = () => [
    {
      title: "Formation & Podcasts",
      description: "Formation continue et actualités",
      items: [
        { title: "Formation Rénovation", price: "490€/session", image: "https://i.pinimg.com/736x/2d/db/f5/2ddbf5d2f6316db5454bee1c028f5cdf.jpg", description: "Techniques rénovation" },
        { title: "Cours Construction", price: "590€/session", image: "https://i.pinimg.com/736x/75/69/97/75699783760fa330cd3fdb2de372cbb3.jpg", description: "Bases construction" },
        { title: "Podcast Immobilier", price: "Gratuit", image: "https://i.pinimg.com/736x/8c/9d/8b/8c9d8bbff5f660b4a78119e3c9f58a4c.jpg", description: "Actualités secteur" },
        { title: "Workshop Matériaux", price: "290€/jour", image: "https://i.pinimg.com/736x/2f/04/36/2f043687cb9218af9a19da972b52ead5.jpg", description: "Choix matériaux" },
        { title: "Formation Durable", price: "690€/session", image: "https://i.pinimg.com/736x/e8/75/71/e87571a444014476b09293a6ca790b26.jpg", description: "Construction écologique" },
        { title: "Webinaires Pro", price: "90€/session", image: "https://i.pinimg.com/736x/8f/dc/36/8fdc36d9a41f8aee52f10fb511f25d91.jpg", description: "Sessions en ligne" },
        { title: "Certification", price: "À partir de 1200€", image: "https://i.pinimg.com/736x/57/09/8b/57098b38d3e638fa7b8323cfd3ff4cda.jpg", description: "Diplômes professionnels" },
        { title: "E-learning", price: "À partir de 299€", image: "https://i.pinimg.com/736x/b1/99/76/b199762f6e64a708a5f58eac07325119.jpg", description: "Formation à distance" }
      ]
    },
    {
      title: "Construction & Plans",
      description: "De la conception à la réalisation",
      items: [
        { title: "Maison Individuelle", price: "À partir de 1500€/m²", image: "https://i.pinimg.com/736x/2d/db/f5/2ddbf5d2f6316db5454bee1c028f5cdf.jpg", description: "Construction sur mesure" },
        { title: "Maison Écologique", price: "À partir de 2000€/m²", image: "https://i.pinimg.com/736x/75/69/97/75699783760fa330cd3fdb2de372cbb3.jpg", description: "Construction durable" },
        { title: "Plans Architecte", price: "80€/m²", image: "https://i.pinimg.com/736x/8c/9d/8b/8c9d8bbff5f660b4a78119e3c9f58a4c.jpg", description: "Conception détaillée" },
        { title: "Immeuble Collectif", price: "Sur devis", image: "https://i.pinimg.com/736x/2f/04/36/2f043687cb9218af9a19da972b52ead5.jpg", description: "Construction multi-logements" },
        { title: "Local Commercial", price: "Sur devis", image: "https://i.pinimg.com/736x/e8/75/71/e87571a444014476b09293a6ca790b26.jpg", description: "Espaces professionnels" },
        { title: "Modélisation 3D", price: "À partir de 500€", image: "https://i.pinimg.com/736x/8f/dc/36/8fdc36d9a41f8aee52f10fb511f25d91.jpg", description: "Visualisation projet" },
        { title: "Étude de Sol", price: "À partir de 1500€", image: "https://i.pinimg.com/736x/57/09/8b/57098b38d3e638fa7b8323cfd3ff4cda.jpg", description: "Analyse géotechnique" },
        { title: "Permis de Construire", price: "À partir de 2000€", image: "https://i.pinimg.com/736x/b1/99/76/b199762f6e64a708a5f58eac07325119.jpg", description: "Dossier administratif" }
      ]
    }
  ];

  useEffect(() => {
    if (location.hash && sections.length > 0) {
      const hash = location.hash.replace('#', '');
      const index = sections.findIndex(
        section => section.title.toLowerCase().replace(/ & | /g, '-').replace(/[()]/g, '') === hash
      );
      if (index !== -1) {
        setSelectedIndex(index);
      }
    }
  }, [location, sections]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="flex flex-col justify-center items-center h-64">
          <img src="/loading.gif" alt="" className='w-24 h-24'/>
          <div className="text-md">Chargement des services...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Erreur:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className='absolute inset-0 -z-20 overflow-hidden h-80 w-full'>
        <div className='bg-black/50 absolute w-full h-full backdrop-blur-sm '></div>
        <img
          className='h-full w-full object-cover'
          src="https://i.pinimg.com/736x/75/69/97/75699783760fa330cd3fdb2de372cbb3.jpg" alt="" />
      </div>
      <h1 className="text-5xl text-white font-bold  text-center">Bâtiments & Construction</h1>

      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex flex-wrap gap-2 mb-4 mt-16">
          {sections.map((section) => (
            <Tab
              key={section.title}
              className={({ selected }) =>
                `${selected
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-gray-100'
                } px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black text-sm`
              }
            >
              {section.title}
            </Tab>
          ))}
        </Tab.List>

        <Tab.Panels>
          {sections.map((section) => (
            <Tab.Panel
              key={section.title}
              className="bg-white rounded-lg p-6 shadow-lg"
              id={section.title.toLowerCase().replace(/ & | /g, '-').replace(/[()]/g, '')}
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">{section.title}</h2>
                <p className="text-gray-600">{section.description}</p>
              </div>

              {/* Affichage conditionnel du composant PodcastsBatiment pour la section Formation & Podcasts */}
              {section.title === "Formation & Podcasts" ? (
                <PodcastsBatiment />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {section.items.map((item, index) => {
                    const itemId = item.id || `${section.title}-${index}`;
                    const hasImageError = imageErrors[itemId];
                    const initials = getInitials(item.title);
                    const bgColor = getBackgroundColor(initials);

                    return (
                      <div
                        key={itemId}
                        className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                      >
                        <div className="relative h-48">
                          {!hasImageError ? (
                            <img
                              src={item.image}
                              alt={item.title}
                              className="w-full h-full object-cover"
                              onError={() => handleImageError(itemId)}
                            />
                          ) : (
                            <div className={`w-full h-full flex items-center justify-center ${bgColor} text-white`}>
                              <span className="text-5xl color-white font-bold">{initials}</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-green-600">{item.price}</span>
                            <button 
                              className="text-sm bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                              onClick={() => openDevisModal(item)}
                            >
                              Demander un devis
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>

      {/* Modal de demande de devis */}
      <DemandeDevisModal
        isOpen={devisModal.isOpen}
        onClose={closeDevisModal}
        prestation={devisModal.prestation}
      />
    </div>
  );
};

export default BatimentsLayout;