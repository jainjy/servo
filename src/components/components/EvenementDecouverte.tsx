import { features } from 'process';
import React, { useState } from 'react';

const EventsDiscoveries = () => {
  const [activeTab, setActiveTab] = useState('events');

  // Données des événements
  const events = [
    {
      id: 1,
      title: "Atelier Culinaire",
      date: "15 Mars 2024",
      time: "14:00 - 17:00",
      location: "Saint-Denis, Réunion",
      category: "Cuisine",
      description: "Découvrez les secrets de la cuisine réunionnaise avec des chefs locaux.",
      image: "https://i.pinimg.com/736x/d8/7c/cf/d87ccf6c788636ccb74610dfb35380b2.jpg",
      featured: true,
      spots: 12,
      booked: 8
    },
    {
      id: 2,
      title: "Randonnée Piton de la Fournaise",
      date: "22 Mars 2024",
      time: "06:00 - 16:00",
      location: "Volcan, Réunion",
      category: "Nature",
      description: "Excursion guidée au cœur du volcan actif avec un géologue expert.",
      image: "https://i.pinimg.com/736x/d8/7c/cf/d87ccf6c788636ccb74610dfb35380b2.jpg",
      featured: true,
      spots: 20,
      booked: 15
    },
    {
      id: 3,
      title: "Atelier Culinaire",
      date: "15 Mars 2024",
      time: "14:00 - 17:00",
      location: "Saint-Denis, Réunion",
      category: "Cuisine",
      description: "Découvrez les secrets de la cuisine réunionnaise avec des chefs locaux.",
      image: "https://i.pinimg.com/736x/d8/7c/cf/d87ccf6c788636ccb74610dfb35380b2.jpg",
      featured: false,
      spots: 12,
      booked: 8
    },
    {
      id: 4,
      title: "Randonnée Piton de la Fournaise",
      date: "22 Mars 2024",
      time: "06:00 - 16:00",
      location: "Volcan, Réunion",
      category: "Nature",
      description: "Excursion guidée au cœur du volcan actif avec un géologue expert.",
      image: "https://i.pinimg.com/736x/d8/7c/cf/d87ccf6c788636ccb74610dfb35380b2.jpg",
      featured: false,
      spots: 20,
      booked: 15
    },
    {
      id: 3,
      title: "Concert Jazz Tropical",
      date: "28 Mars 2024",
      time: "19:30 - 23:00",
      location: "Saint-Pierre, Réunion",
      category: "Musique",
      description: "Soirée jazz avec des influences tropicales et maloya.",
      image: "https://i.pinimg.com/736x/d8/7c/cf/d87ccf6c788636ccb74610dfb35380b2.jpg",
      featured: false,
      spots: 150,
      booked: 120
    },
    {
      id: 4,
      title: "Marché Artisanal Nocturne",
      date: "5 Avril 2024",
      time: "18:00 - 22:00",
      location: "Hell-Bourg, Réunion",
      category: "Artisanat",
      description: "Découverte des artisans locaux et de leurs créations uniques.",
      image: "https://i.pinimg.com/736x/d8/7c/cf/d87ccf6c788636ccb74610dfb35380b2.jpg",
      featured: false,
      spots: null,
      booked: null
    }
  ];

  // Données des découvertes
  const discoveries = [
    {
      id: 1,
      title: "Les Jardins de la Vanille",
      type: "Lieu secret",
      location: "Saint-Philippe, Réunion",
      description: "Un jardin privé abritant plus de 50 variétés de vanille et d'épices rares.",
      image: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800",
      difficulty: "Facile",
      duration: "2 heures",
      rating: 4.8
    },
    {
      id: 2,
      title: "Recette Secrète du Rougail Saucisse",
      type: "Gastronomie",
      location: "Salazie, Réunion",
      description: "Apprenez la recette authentique transmise depuis trois générations.",
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=800",
      difficulty: "Moyen",
      duration: "3 heures",
      rating: 4.9
    },
    {
      id: 3,
      title: "Cascade du Trou de Fer",
      type: "Aventure",
      location: "Salazie, Réunion",
      description: "Accès à un point de vue exceptionnel sur l'une des plus hautes cascades de l'île.",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800",
      difficulty: "Difficile",
      duration: "6 heures",
      rating: 4.7
    },
    {
      id: 4,
      title: "Atelier Tissage de Vacoa",
      type: "Artisanat",
      location: "Saint-Benoît, Réunion",
      description: "Initiation au tissage traditionnel avec les feuilles de vacoa.",
      image: "https://images.unsplash.com/photo-1605001011156-cbf0a0b7a88f?auto=format&fit=crop&w=800",
      difficulty: "Facile",
      duration: "4 heures",
      rating: 4.6
    }
  ];

  // Statistiques
  const stats = [
    { label: "Événements à venir", value: "24+" },
    { label: "Découvertes uniques", value: "48" },
    { label: "Participants actifs", value: "1.2k" },
    { label: "Taux de satisfaction", value: "96%" }
  ];

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl pt-10 mx-auto">
        <div
          className='absolute inset-0 h-64 -z-10 w-full overflow-hidden'>
          <div
            className='absolute inset-0 w-full h-full backdrop-blur-sm bg-black/70'
          />
          <img
            src="https://i.pinimg.com/736x/62/9d/2e/629d2e7b375223b81bcfa104e1f40c43.jpg"
            className='h-full object-cover w-full'
            alt="Background"
          />
        </div>
        {/* En-tête */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-4xl font-bold text-gray-100 mb-4">
            Événements & découvertes
          </h1>
          <p className="text-sm text-gray-200 max-w-3xl mx-auto">
            Vivez des événements uniques et faites de nouvelles découvertes dans votre région.
            Des expériences mémorables vous attendent.
          </p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 text-center transform transition-transform cursor-pointer"
            >
              <div className="text-3xl font-bold text-secondary-text mb-2">{stat.value}</div>
              <div className="text-gray-700 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Navigation par onglets */}
        <div className="flex justify-center mb-12">
          <div className="inline-flex rounded-xl bg-gray-100 p-1">
            <button
              onClick={() => setActiveTab('events')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${activeTab === 'events'
                ? 'bg-secondary-text text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Événements à venir
            </button>
            <button
              onClick={() => setActiveTab('discoveries')}
              className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${activeTab === 'discoveries'
                ? 'bg-secondary-text text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              Découvertes
            </button>
          </div>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'events' ? (
          <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {events.map((event) => (
              <div
                key={event.id}
                className={`bg-white relative rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${event.featured ? 'md:col-span-2 lg:col-span-2' : ''
                  }`}
              >
                {/* Image */}
                <div className="relative p-2 z-10 h-96 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full rounded-sm object-cover transition-transform duration-500"
                  />
                  {event.featured && (
                    <div className="absolute top-4 left-4 bg-logo text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Événement spécial
                    </div>
                  )}
                  <div className="absolute top-4 right-4 border-t border-l border-white backdrop-blur-md px-3 py-1 rounded-lg">
                    <span className="font-semibold text-gray-900">{event.category}</span>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-6 absolute bottom-0 z-30 w-full ">
                  <div className="absolute inset-0 backdrop-blur-sm -z-10 m-2 rounded-sm bg-gradient-to-r from-black via-transparent to-black "></div>

                  <h3 className={`${!event.featured && 'text-sm'} text-lg font-bold text-gray-100 mb-2`}>{event.title}</h3>
                  <p className={`${!event.featured && 'text-xs w-full'} text-gray-300 text-sm mb-4`}>{event.description}</p>

                  {/* Informations */}
                  <div className={`${!event.featured && 'grid'} flex items-center justify-between mb-6`}>
                    <div className={`flex items-center text-xs text-gray-300`}>
                      <svg className="w-5 h-5 mr-2 text-logo" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                      <span>{event.date} • {event.time}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-300">
                      <svg className="w-5 h-5 mr-2 text-xs text-logo" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span>{event.location}</span>
                    </div>
                  </div>

                  {/* Places disponibles */}
                  {event.spots !== null && (
                    <div className="mb-6">
                      <div className="flex justify-between text-xs text-gray-400 mb-2">
                        <span>Places disponibles</span>
                        <span>{event.booked}/{event.spots} réservées</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-secondary-text h-2 rounded-full"
                          style={{ width: `${(event.booked / event.spots) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Bouton */}
                  <button className="w-full bg-logo text-white font-semibold py-3 px-4 rounded-xl hover:bg-logo/70 transition-all duration-300 transform hover:-translate-y-0.5">
                    S'inscrire à l'événement
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {discoveries.map((discovery) => (
              <div
                key={discovery.id}
                className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-48 p-2 overflow-hidden">
                  <img
                    src={discovery.image}
                    alt={discovery.title}
                    className="w-full h-full object-cover rounded-sm transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-logo text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {discovery.type}
                  </div>
                  <div className="absolute top-4 right-4 bg-white/40 backdrop-blur-md  px-3 py-1 rounded-lg flex items-center">
                    <svg className="w-4 h-4 text-yellow-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="font-semibold text-slate-900">{discovery.rating}</span>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-4">
                  <h3 className="text-md font-bold text-gray-900 mb-2">{discovery.title}</h3>
                  <p className="text-gray-600 text-xs mb-4">{discovery.description}</p>

                  {/* Informations */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex text-xs items-center text-gray-700">
                      <svg className="w-5 h-5 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      <span>{discovery.duration}</span>
                    </div>
                    <div className="flex text-xs items-center text-gray-700">
                      <svg className="w-5 h-5 mr-2 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                      </svg>
                      <span>{discovery.difficulty}</span>
                    </div>
                    <div className="col-span-2 text-xs flex items-center text-gray-700">
                      <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span>{discovery.location}</span>
                    </div>
                  </div>

                  {/* Bouton */}
                  <button className="w-full bg-logo text-white font-semibold py-3 px-4 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 transform hover:-translate-y-0.5">
                    Découvrir cette expérience
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Section newsletter */}
        <div className="mt-20 bg-gradient-to-r from-secondary-text to-secondary-text/50 rounded-3xl p-8 md:p-12 text-white">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ne manquez aucune découverte
            </h2>
            <p className="text-blue-100 mb-8">
              Inscrivez-vous à notre newsletter pour recevoir en avant-première les nouveaux événements et découvertes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Votre adresse email"
                className="flex-grow px-6 py-3 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button className="bg-white text-secondary-text font-semibold px-8 py-3 rounded-xl hover:bg-gray-100 transition-colors duration-300">
                S'abonner
              </button>
            </div>
          </div>
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Vous organisez un événement ou avez une découverte à partager ?
          </h3>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Rejoignez notre communauté de passionnés et faites découvrir vos expériences uniques.
          </p>
          <button className="inline-flex items-center bg-secondary-text text-white font-semibold py-3 px-8 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:-translate-y-0.5">
            Proposer une expérience
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventsDiscoveries;