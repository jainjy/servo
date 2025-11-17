import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { useLocation, useNavigate } from 'react-router-dom';
import EquipementSection from '@/components/produits/EquipementSection';
import MateriauxSection from '@/components/produits/MateriauxSection';
import DesignSection from '@/components/produits/DesignSection';
import ProduitsGeneraux from '@/components/produits/ProduitsGeneraux';
import ServicesMaison from '@/components/produits/ServiceMaison';
import UtilitiesProduits from '@/components/produits/UtilitiesProduits';
import Modal from '@/components/ui/modal';

interface ItemDetails {
  title: string;
  price: string;
  image: string;
  description: string;
}

const DomicileLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{item: ItemDetails; section: string} | null>(null);

  const handleDetailsClick = (item: ItemDetails, section: string) => {
    setSelectedItem({ item, section });
    setIsModalOpen(true);
  };

  // Fonction pour gérer le clic sur "Service & Maison"

  useEffect(() => {
    if (location.hash) {
      const hash = location.hash.replace('#', '');
      const index = sections.findIndex(
        section => section.title.toLowerCase().replace(/ & | /g, '-').replace(/[()]/g, '') === hash
      );
      if (index !== -1) {
        setSelectedIndex(index);
      }
    }
  }, [location]);

  const sections = [
    {
      title: "Produits & Commerces",
      description: "Trouvez tout pour votre maison",
      items: [
        { title: "Électroménager", price: "299€ - 1299€", image: "https://i.pinimg.com/736x/8f/dc/36/8fdc36d9a41f8aee52f10fb511f25d91.jpg", description: "Large gamme d'appareils électroménagers" },
        { title: "Mobilier", price: "199€ - 999€", image: "https://i.pinimg.com/736x/57/09/8b/57098b38d3e638fa7b8323cfd3ff4cda.jpg", description: "Meubles design et fonctionnels" },
        { title: "Literie", price: "399€ - 1499€", image: "https://i.pinimg.com/736x/b1/99/76/b199762f6e64a708a5f58eac07325119.jpg", description: "Matelas et sommiers de qualité" },
        { title: "Décoration", price: "29€ - 299€", image: "https://i.pinimg.com/736x/2d/db/f5/2ddbf5d2f6316db5454bee1c028f5cdf.jpg", description: "Accessoires décoratifs" },
        { title: "Ustensiles Cuisine", price: "19€ - 199€", image: "https://i.pinimg.com/736x/75/69/97/75699783760fa330cd3fdb2de372cbb3.jpg", description: "Équipement de cuisine" },
        { title: "Linge de Maison", price: "39€ - 199€", image: "https://i.pinimg.com/736x/8c/9d/8b/8c9d8bbff5f660b4a78119e3c9f58a4c.jpg", description: "Textiles et linges" },
        { title: "Luminaires", price: "49€ - 399€", image: "https://i.pinimg.com/736x/2f/04/36/2f043687cb9218af9a19da972b52ead5.jpg", description: "Éclairage design" },
        { title: "Rangement", price: "79€ - 599€", image: "https://i.pinimg.com/736x/e8/75/71/e87571a444014476b09293a6ca790b26.jpg", description: "Solutions de rangement" }
      ]
    },
    {
      title: "Service & Maison",
      description: "Services à domicile de qualité",
      items: [
        { title: "Ménage", price: "25€/h", image: "https://i.pinimg.com/736x/a1/7f/6d/a17f6d0d7e4a0dd16e01f84d41b51da3.jpg", description: "Service de nettoyage professionnel" },
        { title: "Jardinage", price: "35€/h", image: "https://i.pinimg.com/736x/2d/db/f5/2ddbf5d2f6316db5454bee1c028f5cdf.jpg", description: "Entretien espaces verts" },
        { title: "Plomberie", price: "80€/h", image: "https://i.pinimg.com/736x/75/69/97/75699783760fa330cd3fdb2de372cbb3.jpg", description: "Réparation et installation" },
        { title: "Électricité", price: "75€/h", image: "https://i.pinimg.com/736x/8c/9d/8b/8c9d8bbff5f660b4a78119e3c9f58a4c.jpg", description: "Installation et dépannage" },
        { title: "Peinture", price: "45€/m²", image: "https://i.pinimg.com/736x/2f/04/36/2f043687cb9218af9a19da972b52ead5.jpg", description: "Travaux de peinture" },
        { title: "Bricolage", price: "45€/h", image: "https://i.pinimg.com/736x/e8/75/71/e87571a444014476b09293a6ca790b26.jpg", description: "Petits travaux" },
        { title: "Serrurerie", price: "90€/intervention", image: "https://i.pinimg.com/736x/8f/dc/36/8fdc36d9a41f8aee52f10fb511f25d91.jpg", description: "Dépannage serrures" },
        { title: "Climatisation", price: "120€/intervention", image: "https://i.pinimg.com/736x/57/09/8b/57098b38d3e638fa7b8323cfd3ff4cda.jpg", description: "Installation et entretien" }
      ]
    },
    {
      title: "Équipements & Livraison",
      description: "Solutions pour un domicile moderne",
      items: [
        { title: "Smart Home", price: "199€ - 999€", image: "https://i.pinimg.com/736x/b1/99/76/b199762f6e64a708a5f58eac07325119.jpg", description: "Équipements connectés" },
        { title: "Sécurité", price: "299€ - 1499€", image: "https://i.pinimg.com/736x/2d/db/f5/2ddbf5d2f6316db5454bee1c028f5cdf.jpg", description: "Systèmes de surveillance" },
        { title: "Chauffage", price: "499€ - 2999€", image: "https://i.pinimg.com/736x/75/69/97/75699783760fa330cd3fdb2de372cbb3.jpg", description: "Solutions de chauffage" },
        { title: "Purification Air", price: "199€ - 799€", image: "https://i.pinimg.com/736x/8c/9d/8b/8c9d8bbff5f660b4a78119e3c9f58a4c.jpg", description: "Purificateurs d'air" },
        { title: "Domotique", price: "399€ - 1999€", image: "https://i.pinimg.com/736x/2f/04/36/2f043687cb9218af9a19da972b52ead5.jpg", description: "Automatisation maison" },
        { title: "Audio/Vidéo", price: "299€ - 2499€", image: "https://i.pinimg.com/736x/e8/75/71/e87571a444014476b09293a6ca790b26.jpg", description: "Systèmes multimédia" },
        { title: "Fitness", price: "399€ - 1999€", image: "https://i.pinimg.com/736x/8f/dc/36/8fdc36d9a41f8aee52f10fb511f25d91.jpg", description: "Équipement sportif" },
        { title: "Extérieur", price: "199€ - 999€", image: "https://i.pinimg.com/736x/57/09/8b/57098b38d3e638fa7b8323cfd3ff4cda.jpg", description: "Équipement jardin" }
      ]
    },
    {
      title: "Design & Décoration",
      description: "Inspirez-vous pour votre intérieur",
      items: [
        { title: "Design Salon", price: "Service sur mesure", image: "https://i.pinimg.com/736x/b1/99/76/b199762f6e64a708a5f58eac07325119.jpg", description: "Conception salon" },
        { title: "Cuisine", price: "Service sur mesure", image: "https://i.pinimg.com/736x/2d/db/f5/2ddbf5d2f6316db5454bee1c028f5cdf.jpg", description: "Design cuisine" },
        { title: "Chambres", price: "Service sur mesure", image: "https://i.pinimg.com/736x/75/69/97/75699783760fa330cd3fdb2de372cbb3.jpg", description: "Aménagement chambre" },
        { title: "Salle de bain", price: "Service sur mesure", image: "https://i.pinimg.com/736x/8c/9d/8b/8c9d8bbff5f660b4a78119e3c9f58a4c.jpg", description: "Design salle de bain" },
        { title: "Bureau", price: "Service sur mesure", image: "https://i.pinimg.com/736x/2f/04/36/2f043687cb9218af9a19da972b52ead5.jpg", description: "Espace travail" },
        { title: "Extérieur", price: "Service sur mesure", image: "https://i.pinimg.com/736x/e8/75/71/e87571a444014476b09293a6ca790b26.jpg", description: "Design jardin" },
        { title: "Art & Déco", price: "Sur devis", image: "https://i.pinimg.com/736x/8f/dc/36/8fdc36d9a41f8aee52f10fb511f25d91.jpg", description: "Œuvres d'art" },
        { title: "Lighting Design", price: "Sur devis", image: "https://i.pinimg.com/736x/57/09/8b/57098b38d3e638fa7b8323cfd3ff4cda.jpg", description: "Conception éclairage" }
      ]
    },
    {
      title: "Cours & Formations",
      description: "Apprenez de nouvelles compétences",
      items: [
        { title: "Décoration", price: "99€/session", image: "https://i.pinimg.com/736x/b1/99/76/b199762f6e64a708a5f58eac07325119.jpg", description: "Cours de décoration" },
        { title: "Bricolage", price: "79€/session", image: "https://i.pinimg.com/736x/2d/db/f5/2ddbf5d2f6316db5454bee1c028f5cdf.jpg", description: "Ateliers bricolage" },
        { title: "Jardinage", price: "89€/session", image: "https://i.pinimg.com/736x/75/69/97/75699783760fa330cd3fdb2de372cbb3.jpg", description: "Formation jardinage" },
        { title: "Home Staging", price: "149€/session", image: "https://i.pinimg.com/736x/8c/9d/8b/8c9d8bbff5f660b4a78119e3c9f58a4c.jpg", description: "Mise en valeur" },
        { title: "Cuisine", price: "129€/session", image: "https://i.pinimg.com/736x/2f/04/36/2f043687cb9218af9a19da972b52ead5.jpg", description: "Cours de cuisine" },
        { title: "Domotique", price: "199€/session", image: "https://i.pinimg.com/736x/e8/75/71/e87571a444014476b09293a6ca790b26.jpg", description: "Formation tech" },
        { title: "Feng Shui", price: "159€/session", image: "https://i.pinimg.com/736x/8f/dc/36/8fdc36d9a41f8aee52f10fb511f25d91.jpg", description: "Harmonie maison" },
        { title: "Upcycling", price: "89€/session", image: "https://i.pinimg.com/736x/57/09/8b/57098b38d3e638fa7b8323cfd3ff4cda.jpg", description: "Recyclage créatif" }
      ]
    },
    {
      title: "Utilities",
      description: "Gestion efficace de votre domicile",
      items: [
        { title: "Électricité", price: "Tarifs variables", image: "https://i.pinimg.com/736x/b1/99/76/b199762f6e64a708a5f58eac07325119.jpg", description: "Fournisseurs énergie" },
        { title: "Eau", price: "Tarifs variables", image: "https://i.pinimg.com/736x/2d/db/f5/2ddbf5d2f6316db5454bee1c028f5cdf.jpg", description: "Services eau" },
        { title: "Internet", price: "29€ - 89€/mois", image: "https://i.pinimg.com/736x/75/69/97/75699783760fa330cd3fdb2de372cbb3.jpg", description: "Connexion fibre" },
        { title: "Gaz", price: "Tarifs variables", image: "https://i.pinimg.com/736x/8c/9d/8b/8c9d8bbff5f660b4a78119e3c9f58a4c.jpg", description: "Fournisseurs gaz" },
        { title: "Smart Meter", price: "199€ - 399€", image: "https://i.pinimg.com/736x/2f/04/36/2f043687cb9218af9a19da972b52ead5.jpg", description: "Compteurs intelligents" },
        { title: "Solar Energy", price: "Sur devis", image: "https://i.pinimg.com/736x/e8/75/71/e87571a444014476b09293a6ca790b26.jpg", description: "Énergie solaire" },
        { title: "Waste Management", price: "Tarifs variables", image: "https://i.pinimg.com/736x/8f/dc/36/8fdc36d9a41f8aee52f10fb511f25d91.jpg", description: "Gestion déchets" },
        { title: "Home Battery", price: "4999€ - 9999€", image: "https://i.pinimg.com/736x/57/09/8b/57098b38d3e638fa7b8323cfd3ff4cda.jpg", description: "Stockage énergie" }
      ]
    },
    // {
    //   title: "Matériaux",
    //   description: " Fournitures de construction et rénovation",
    //   items: [
    //     { title: "Électricité", price: "Tarifs variables", image: "https://i.pinimg.com/736x/b1/99/76/b199762f6e64a708a5f58eac07325119.jpg", description: "Fournisseurs énergie" },
    //     { title: "Eau", price: "Tarifs variables", image: "https://i.pinimg.com/736x/2d/db/f5/2ddbf5d2f6316db5454bee1c028f5cdf.jpg", description: "Services eau" },
    //     { title: "Internet", price: "29€ - 89€/mois", image: "https://i.pinimg.com/736x/75/69/97/75699783760fa330cd3fdb2de372cbb3.jpg", description: "Connexion fibre" },
    //     { title: "Gaz", price: "Tarifs variables", image: "https://i.pinimg.com/736x/8c/9d/8b/8c9d8bbff5f660b4a78119e3c9f58a4c.jpg", description: "Fournisseurs gaz" },
    //     { title: "Smart Meter", price: "199€ - 399€", image: "https://i.pinimg.com/736x/2f/04/36/2f043687cb9218af9a19da972b52ead5.jpg", description: "Compteurs intelligents" },
    //     { title: "Solar Energy", price: "Sur devis", image: "https://i.pinimg.com/736x/e8/75/71/e87571a444014476b09293a6ca790b26.jpg", description: "Énergie solaire" },
    //     { title: "Waste Management", price: "Tarifs variables", image: "https://i.pinimg.com/736x/8f/dc/36/8fdc36d9a41f8aee52f10fb511f25d91.jpg", description: "Gestion déchets" },
    //     { title: "Home Battery", price: "4999€ - 9999€", image: "https://i.pinimg.com/736x/57/09/8b/57098b38d3e638fa7b8323cfd3ff4cda.jpg", description: "Stockage énergie" }
    //   ]
    // }
  ];

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
        <div className='absolute inset-0 -z-20 overflow-hidden h-80 w-full'>
           <div className='bg-black/50 absolute w-full h-full backdrop-blur-sm '></div>
            <img
            className='h-full w-full object-cover'
            src="https://i.pinimg.com/736x/75/69/97/75699783760fa330cd3fdb2de372cbb3.jpg" alt="" />
        </div>
      <h1 className="text-5xl font-bold mb-6 text-white text-center">Services à Domicile</h1>
      
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex flex-wrap gap-2 mb-4 mt-20 ">
          {sections.map((section) => (
            <Tab
              key={section.title}
              className={({ selected }) =>
                `${
                  selected
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
              {section.title === "Équipements & Livraison" ? (
                <EquipementSection searchQuery="" />
              ) 
              : section.title === "Matériaux" ? (
                <MateriauxSection searchQuery="" />
              )
               : section.title === "Produits & Commerces" ? (
                <ProduitsGeneraux />
              ) : section.title === "Design & Décoration" ? (
                <DesignSection searchQuery="" />
              ) :
              section.title === "Service & Maison" ? (
                <ServicesMaison />
              ) 
              :
              section.title === "Utilities" ? (
                <UtilitiesProduits />
              ) :section.title === "Produits & Commerces" ? (
                <ProduitsGeneraux />
              ) : (
                <>
                  <div className="mb-6">
                    <h2 className="text-2xl font-bold mb-2">{section.title}</h2>
                    <p className="text-gray-600">{section.description}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {section.items.map((item, index) => (
                      <div
                        key={index}
                        className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                      >
                        <div className="relative h-48">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                          <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-green-600">{item.price}</span>
                            <button 
                              onClick={() => handleDetailsClick(item, section.title)}
                              className="text-sm bg-black text-white px-3 py-1 rounded-lg hover:bg-gray-800 transition-colors"
                            >
                              En savoir plus
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {selectedItem && (
          <div className='grid h-[500px] grid-cols-2'>
            <div className="relative h-full rounded-sm overflow-hidden w-full">
              <img
                src={selectedItem.item.image}
                alt={selectedItem.item.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="px-6 py-0">
              <div className="mb-4">
                <h1 className="text-3xl font-bold mb-2">{selectedItem.item.title}</h1>
                <p className="text-gray-600">{selectedItem.section}</p>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2 underline">Description</h2>
                <p className="text-gray-700">{selectedItem.item.description}</p>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold text-green-600">
                  <span className='text-gray-800 underline text-md'> Prix : &nbsp;</span>
                 {selectedItem.item.price}</div>
                <button className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors">
                  Contacter
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default DomicileLayout;