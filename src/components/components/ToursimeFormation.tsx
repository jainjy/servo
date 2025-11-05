import React, { useState } from 'react';
import { MapPin, Calendar, Users, Star, Clock, Award, Play, ChevronDown, ChevronUp, BookOpen, GraduationCap, Coffee, Camera, Utensils } from 'lucide-react';

interface Formation {
  id: number;
  title: string;
  description: string;
  category: string;
  duration: string;
  price: number;
  originalPrice?: number;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  rating: number;
  participants: number;
  location: string;
  date: string;
  instructor: {
    name: string;
    specialty: string;
    avatar: string;
  };
  includes: string[];
  image: string;
  featured: boolean;
}

interface FAQ {
  question: string;
  answer: string;
  category: string;
}

const FormationsTourisme: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('tous');
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null);

  const formations: Formation[] = [
    {
      id: 1,
      title: "Atelier Photo : Capturer l'Essence de la Ville",
      description: "Apprenez les techniques de photographie urbaine avec un photographe local. Parcours dans les ruelles historiques.",
      category: "Photographie",
      duration: "3h",
      price: 45,
      originalPrice: 60,
      level: "Débutant",
      rating: 4.9,
      participants: 12,
      location: "Vieux Port",
      date: "15 Déc 2024",
      instructor: {
        name: "Marie Lambert",
        specialty: "Photographe professionnelle",
        avatar: "/api/placeholder/100/100"
      },
      includes: ["Matériel fourni", "Guide PDF", "Certificat"],
      image: "/api/placeholder/400/250",
      featured: true
    },
    {
      id: 2,
      title: "Cours de Cuisine Méditerranéenne",
      description: "Découvrez les secrets de la cuisine locale avec des produits frais du marché. Déjeuner inclus.",
      category: "Cuisine",
      duration: "4h",
      price: 75,
      level: "Intermédiaire",
      rating: 4.8,
      participants: 8,
      location: "Atelier Culinaire",
      date: "18 Déc 2024",
      instructor: {
        name: "Chef Antoine",
        specialty: "Cuisinier étoilé",
        avatar: "/api/placeholder/100/100"
      },
      includes: ["Ingrédients", "Recettes", "Repas", "Tablier"],
      image: "/api/placeholder/400/250",
      featured: true
    },
    {
      id: 3,
      title: "Visite Guidée Historique Privée",
      description: "Plongez dans l'histoire de la ville avec un guide passionné. Accès à des sites exclusifs.",
      category: "Histoire",
      duration: "2h30",
      price: 35,
      level: "Débutant",
      rating: 4.7,
      participants: 15,
      location: "Centre Historique",
      date: "20 Déc 2024",
      instructor: {
        name: "Pierre Dubois",
        specialty: "Historien local",
        avatar: "/api/placeholder/100/100"
      },
      includes: ["Casque audio", "Plan détaillé", "Guide numérique"],
      image: "/api/placeholder/400/250",
      featured: false
    },
    {
      id: 4,
      title: "Atelier Poterie Traditionnelle",
      description: "Initiation aux techniques ancestrales de poterie. Créez votre propre pièce à ramener.",
      category: "Artisanat",
      duration: "3h30",
      price: 55,
      level: "Débutant",
      rating: 4.6,
      participants: 6,
      location: "Atelier d'Art",
      date: "22 Déc 2024",
      instructor: {
        name: "Sophie Martin",
        specialty: "Artisane céramiste",
        avatar: "/api/placeholder/100/100"
      },
      includes: ["Argile", "Outils", "Cuisson", "Emballage"],
      image: "/api/placeholder/400/250",
      featured: false
    },
    {
      id: 5,
      title: "Cours de Mixologie Cocktails Locaux",
      description: "Apprenez à créer des cocktails signature avec des produits régionaux. Dégustation incluse.",
      category: "Mixologie",
      duration: "2h",
      price: 65,
      level: "Intermédiaire",
      rating: 4.9,
      participants: 10,
      location: "Bar École",
      date: "25 Déc 2024",
      instructor: {
        name: "Luc Bernard",
        specialty: "Barman expert",
        avatar: "/api/placeholder/100/100"
      },
      includes: ["Alcools", "Matériel", "Dégustation", "Recettes"],
      image: "/api/placeholder/400/250",
      featured: true
    },
    {
      id: 6,
      title: "Randonnée Naturaliste",
      description: "Découverte de la flore et faune locale avec un guide naturaliste. Matériel d'observation fourni.",
      category: "Nature",
      duration: "4h",
      price: 40,
      level: "Débutant",
      rating: 4.8,
      participants: 12,
      location: "Parc Naturel",
      date: "28 Déc 2024",
      instructor: {
        name: "Nathalie Petit",
        specialty: "Guide naturaliste",
        avatar: "/api/placeholder/100/100"
      },
      includes: ["Jumelles", "Guide naturaliste", "Collation"],
      image: "/api/placeholder/400/250",
      featured: false
    }
  ];

  const categories = [
    { id: 'tous', name: 'Toutes les formations', icon: <BookOpen className="w-4 h-4" />, count: formations.length },
    { id: 'Photographie', name: 'Photographie', icon: <Camera className="w-4 h-4" />, count: formations.filter(f => f.category === 'Photographie').length },
    { id: 'Cuisine', name: 'Cuisine', icon: <Utensils className="w-4 h-4" />, count: formations.filter(f => f.category === 'Cuisine').length },
    { id: 'Histoire', name: 'Histoire', icon: <GraduationCap className="w-4 h-4" />, count: formations.filter(f => f.category === 'Histoire').length },
    { id: 'Artisanat', name: 'Artisanat', icon: <Award className="w-4 h-4" />, count: formations.filter(f => f.category === 'Artisanat').length },
    { id: 'Mixologie', name: 'Mixologie', icon: <Coffee className="w-4 h-4" />, count: formations.filter(f => f.category === 'Mixologie').length },
    { id: 'Nature', name: 'Nature', icon: <MapPin className="w-4 h-4" />, count: formations.filter(f => f.category === 'Nature').length }
  ];

  const faqs: FAQ[] = [
    {
      question: "Dois-je avoir de l'expérience préalable ?",
      answer: "Non ! La plupart de nos formations sont adaptées aux débutants. Nos instructeurs s'adaptent à votre niveau.",
      category: "Général"
    },
    {
      question: "Que se passe-t-il en cas de mauvais temps ?",
      answer: "Les activités en extérieur sont maintenues en cas de pluie légère. En cas d'intempéries, nous reportons ou remboursons.",
      category: "Pratique"
    },
    {
      question: "Puis-je obtenir un remboursement ?",
      answer: "Oui, annulation gratuite jusqu'à 48h avant. Après ce délai, des frais d'annulation peuvent s'appliquer.",
      category: "Réservation"
    },
    {
      question: "Le matériel est-il fourni ?",
      answer: "Oui, tout le matériel nécessaire est inclus dans le prix, sauf indication contraire.",
      category: "Équipement"
    },
    {
      question: "Les formations sont-elles accessibles aux enfants ?",
      answer: "Certaines formations sont adaptées aux familles. Vérifiez les restrictions d'âge sur chaque activité.",
      category: "Famille"
    },
    {
      question: "Comment puis-je modifier ma réservation ?",
      answer: "Contactez-nous par email ou téléphone jusqu'à 24h avant l'activité pour modifier votre réservation.",
      category: "Réservation"
    }
  ];

  const filteredFormations = selectedCategory === 'tous' 
    ? formations 
    : formations.filter(formation => formation.category === selectedCategory);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const getLevelColor = (level: string) => {
    const colors = {
      'Débutant': 'bg-green-100 text-green-800',
      'Intermédiaire': 'bg-blue-100 text-blue-800',
      'Avancé': 'bg-purple-100 text-purple-800'
    };
    return colors[level as keyof typeof colors];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50/30">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-20">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="inline-flex items-center bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold mb-4">
            <GraduationCap className="w-4 h-4 mr-2" />
            Expériences Locales Authentiques
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Formations & Ateliers
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8 leading-relaxed">
            Découvrez la culture locale à travers nos cours et ateliers uniques. 
            Des expériences immersives animées par des passionnés et experts locaux.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-lg">
              Voir les Prochaines Dates
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-blue-600 transition-colors">
              Cadeaux & Cartes
            </button>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
              <MapPin className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-2">Locaux & Authentiques</h3>
            <p className="text-gray-600">Des expériences uniques créées par des passionnés de la région</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
              <Users className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-2">Petits Groupes</h3>
            <p className="text-gray-600">Effectifs limités pour une expérience personnalisée et conviviale</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mx-auto mb-4">
              <Award className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-xl text-gray-900 mb-2">Experts Locaux</h3>
            <p className="text-gray-600">Encadrement par des professionnels reconnus dans leur domaine</p>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Catégories d'Ateliers
          </h2>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
                <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Formations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredFormations.map((formation) => (
            <div
              key={formation.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group overflow-hidden"
            >
              {formation.featured && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold z-10">
                  ⭐ Populaire
                </div>
              )}
              
              <div className="relative overflow-hidden">
                <img 
                  src={formation.image} 
                  alt={formation.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    {formation.category}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${getLevelColor(formation.level)}`}>
                    {formation.level}
                  </span>
                </div>

                <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {formation.title}
                </h3>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {formation.description}
                </p>

                {/* Instructor */}
                <div className="flex items-center mb-4">
                  <img 
                    src={formation.instructor.avatar} 
                    alt={formation.instructor.name}
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{formation.instructor.name}</p>
                    <p className="text-xs text-gray-500">{formation.instructor.specialty}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {formation.location}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {formation.duration}
                  </div>
                </div>

                {/* Rating & Participants */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(formation.rating) ? 'fill-current' : ''}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-1">({formation.rating})</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-1" />
                    {formation.participants} max
                  </div>
                </div>

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-blue-600">
                      {formation.price}€
                    </span>
                    {formation.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">
                        {formation.originalPrice}€
                      </span>
                    )}
                  </div>
                  
                  <button 
                    onClick={() => setSelectedFormation(formation)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-semibold"
                  >
                    Réserver
                  </button>
                </div>

                {/* Date */}
                <div className="flex items-center justify-center mt-3 text-sm text-gray-500">
                  <Calendar className="w-4 h-4 mr-1" />
                  {formation.date}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Questions Fréquentes
          </h2>
          <div className="space-y-4 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900">{faq.question}</span>
                  {openFAQ === index ? (
                    <ChevronUp className="w-5 h-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-500" />
                  )}
                </button>
                {openFAQ === index && (
                  <div className="p-6 bg-gray-50 border-t">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA Final */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-2xl p-8 text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Prêt à Vivre une Expérience Unique ?
            </h3>
            <p className="text-blue-100 text-lg mb-6 max-w-2xl mx-auto">
              Réservez votre place dès maintenant et offrez-vous un souvenir inoubliable 
              de votre séjour. Cadeaux et forfaits groupe disponibles.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-lg">
                Voir le Calendrier Complet
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-blue-600 transition-colors">
                Nous Contacter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Formation Detail Modal */}
      {selectedFormation && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="grid md:grid-cols-2 gap-8 p-6">
              {/* Image & Basic Info */}
              <div className="space-y-4">
                <img 
                  src={selectedFormation.image} 
                  alt={selectedFormation.title}
                  className="w-full h-64 object-cover rounded-2xl"
                />
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    {selectedFormation.category}
                  </span>
                  <span className={`text-sm px-3 py-1 rounded-full ${getLevelColor(selectedFormation.level)}`}>
                    {selectedFormation.level}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-gray-900">{selectedFormation.title}</h3>
                  <p className="text-gray-600">{selectedFormation.description}</p>
                </div>

                {/* Instructor */}
                <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                  <img 
                    src={selectedFormation.instructor.avatar} 
                    alt={selectedFormation.instructor.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{selectedFormation.instructor.name}</p>
                    <p className="text-sm text-gray-600">{selectedFormation.instructor.specialty}</p>
                  </div>
                </div>
              </div>

              {/* Details & Booking */}
              <div className="space-y-6">
                <button 
                  onClick={() => setSelectedFormation(null)}
                  className="ml-auto block text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>

                {/* Details */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {selectedFormation.location}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-2" />
                      {selectedFormation.duration}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {selectedFormation.date}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      {selectedFormation.participants} participants max
                    </div>
                  </div>
                </div>

                {/* Includes */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Ce qui est inclus :</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedFormation.includes.map((item, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center">
                  <div className="flex text-amber-500 mr-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${i < Math.floor(selectedFormation.rating) ? 'fill-current' : ''}`} 
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-gray-900">{selectedFormation.rating}</span>
                  <span className="text-gray-500 ml-1">/5</span>
                </div>

                {/* Price & Booking */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-3xl font-bold text-blue-600">
                        {selectedFormation.price}€
                      </span>
                      {selectedFormation.originalPrice && (
                        <span className="text-lg text-gray-400 line-through ml-2">
                          {selectedFormation.originalPrice}€
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      par personne
                    </div>
                  </div>
                  
                  <button className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors text-lg">
                    Réserver Maintenant
                  </button>
                  
                  <p className="text-center text-sm text-gray-500 mt-3">
                    Annulation gratuite jusqu'à 48h avant
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormationsTourisme;