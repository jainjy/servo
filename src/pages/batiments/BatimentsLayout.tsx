import React, { useState, useEffect } from 'react';
import { Tab } from '@headlessui/react';
import { useLocation } from 'react-router-dom';

const BatimentsLayout = () => {
  const location = useLocation();
  const [selectedIndex, setSelectedIndex] = useState(0);

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
      title: "Rénovation & Chantiers",
      description: "Experts en rénovation de bâtiments",
      items: [
        { title: "Rénovation Complète", price: "Sur devis", image: "https://i.pinimg.com/736x/7a/f7/95/7af795aa69261731feae01375ad824df.jpg", description: "Transformation totale de votre espace" },
        { title: "Rénovation Énergétique", price: "150€/m²", image: "https://i.pinimg.com/1200x/75/d5/84/75d5848fde7b30cac973164b34836730.jpg", description: "Amélioration performance énergétique" },
        { title: "Ravalement Façade", price: "80€/m²", image: "https://i.pinimg.com/1200x/fb/9a/69/fb9a69b6c23d01e5aab93dabb5533de7.jpg", description: "Restauration extérieure" },
        { title: "Rénovation Toiture", price: "100€/m²", image: "https://i.pinimg.com/1200x/67/fe/59/67fe591357a9c5d9d5175476cc28d20a.jpg", description: "Travaux de couverture" },
        { title: "Isolation", price: "45€/m²", image: "https://i.pinimg.com/736x/e8/75/71/e87571a444014476b09293a6ca790b26.jpg", description: "Isolation thermique et phonique" },
        { title: "Rénovation Salle de Bain", price: "À partir de 5000€", image: "https://i.pinimg.com/736x/8f/dc/36/8fdc36d9a41f8aee52f10fb511f25d91.jpg", description: "Modernisation salle d'eau" },
        { title: "Rénovation Cuisine", price: "À partir de 8000€", image: "https://i.pinimg.com/736x/57/09/8b/57098b38d3e638fa7b8323cfd3ff4cda.jpg", description: "Aménagement cuisine" },
        { title: "Extension", price: "1200€/m²", image: "https://i.pinimg.com/736x/b1/99/76/b199762f6e64a708a5f58eac07325119.jpg", description: "Agrandissement maison" }
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
    },
    {
      title: "Matériaux & Viabilisations",
      description: "Solutions durables pour vos projets",
      items: [
        { title: "Gros Œuvre", price: "Prix variables", image: "https://i.pinimg.com/736x/2d/db/f5/2ddbf5d2f6316db5454bee1c028f5cdf.jpg", description: "Matériaux de structure" },
        { title: "Second Œuvre", price: "Prix variables", image: "https://i.pinimg.com/736x/75/69/97/75699783760fa330cd3fdb2de372cbb3.jpg", description: "Finitions et aménagements" },
        { title: "Éco-matériaux", price: "Sur devis", image: "https://i.pinimg.com/736x/8c/9d/8b/8c9d8bbff5f660b4a78119e3c9f58a4c.jpg", description: "Matériaux écologiques" },
        { title: "Raccordements", price: "À partir de 5000€", image: "https://i.pinimg.com/736x/2f/04/36/2f043687cb9218af9a19da972b52ead5.jpg", description: "Connexions réseaux" },
        { title: "Assainissement", price: "À partir de 8000€", image: "https://i.pinimg.com/736x/e8/75/71/e87571a444014476b09293a6ca790b26.jpg", description: "Système d'épuration" },
        { title: "VRD", price: "Sur devis", image: "https://i.pinimg.com/736x/8f/dc/36/8fdc36d9a41f8aee52f10fb511f25d91.jpg", description: "Voirie et réseaux" },
        { title: "Isolation", price: "30-80€/m²", image: "https://i.pinimg.com/736x/57/09/8b/57098b38d3e638fa7b8323cfd3ff4cda.jpg", description: "Matériaux isolants" },
        { title: "Toiture", price: "40-120€/m²", image: "https://i.pinimg.com/736x/b1/99/76/b199762f6e64a708a5f58eac07325119.jpg", description: "Matériaux couverture" }
      ]
    },
    {
      title: "Division Parcellaire",
      description: "Optimisation de l'espace foncier",
      items: [
        { title: "Étude Faisabilité", price: "À partir de 800€", image: "https://i.pinimg.com/736x/2d/db/f5/2ddbf5d2f6316db5454bee1c028f5cdf.jpg", description: "Analyse du terrain" },
        { title: "Bornage", price: "À partir de 1500€", image: "https://i.pinimg.com/736x/75/69/97/75699783760fa330cd3fdb2de372cbb3.jpg", description: "Délimitation parcelles" },
        { title: "Plan Topographique", price: "À partir de 1000€", image: "https://i.pinimg.com/736x/8c/9d/8b/8c9d8bbff5f660b4a78119e3c9f58a4c.jpg", description: "Relevé terrain" },
        { title: "Déclaration Préalable", price: "À partir de 1200€", image: "https://i.pinimg.com/736x/2f/04/36/2f043687cb9218af9a19da972b52ead5.jpg", description: "Dossier administratif" },
        { title: "Viabilisation", price: "Sur devis", image: "https://i.pinimg.com/736x/e8/75/71/e87571a444014476b09293a6ca790b26.jpg", description: "Raccordements réseaux" },
        { title: "Conseil Juridique", price: "150€/heure", image: "https://i.pinimg.com/736x/8f/dc/36/8fdc36d9a41f8aee52f10fb511f25d91.jpg", description: "Accompagnement légal" },
        { title: "Optimisation Fiscale", price: "Sur devis", image: "https://i.pinimg.com/736x/57/09/8b/57098b38d3e638fa7b8323cfd3ff4cda.jpg", description: "Conseil fiscal" },
        { title: "Commercialisation", price: "% du prix de vente", image: "https://i.pinimg.com/736x/b1/99/76/b199762f6e64a708a5f58eac07325119.jpg", description: "Vente terrains" }
      ]
    },
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
    }
  ];

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
                      <div className="absolute inset-0 bg-black bg-opacity-20"></div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-600">{item.price}</span>
                        <button className="text-sm bg-black text-white px-3 py-1 rounded-lg hover:bg-gray-800 transition-colors">
                          Contacter
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};

export default BatimentsLayout;