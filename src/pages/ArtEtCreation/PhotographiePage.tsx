import React from 'react';
import { 
  Camera, 
  User, 
  Heart, 
  Mountain, 
  Palette, 
  Calendar, 
  GraduationCap,
  Star,
  MapPin,
  Phone,
  Mail,
  Users,
  TrendingUp
} from 'lucide-react';

interface PhotographiePageProps {
  searchQuery?: string;
  onContactClick: (subject: string, recipientName?: string) => void;
}

const PhotographiePage: React.FC<PhotographiePageProps> = ({ searchQuery, onContactClick  }) => {
  const categories = [
    { name: 'Photographes portrait', count: 45, icon: <User size={20} /> },
    { name: 'Photographes paysage', count: 28, icon: <Mountain size={20} /> },
    { name: 'Photographie artistique', count: 19, icon: <Palette size={20} /> },
    { name: 'Photographes événementiel', count: 26, icon: <Calendar size={20} /> },
    { name: 'Cours de photographie', count: 15, icon: <GraduationCap size={20} /> },
  ];

  const featuredPhotographers = [
    {
      id: 1,
      name: 'Marie Laurent',
      specialty: 'Portrait artistique',
      location: 'Paris',
      rating: 4.9,
      price: 'À partir de 150€/séance',
      image: 'https://picsum.photos/id/433/300/200',
    },
    
    {
      id: 3,
      name: 'Sophie Martin',
      specialty: 'Paysage urbain',
      location: 'Marseille',
      rating: 4.8,
      price: 'Expositions sur demande',
      image: 'https://picsum.photos/id/456/300/200',
    },
  ];

  return (
    <div>
      {/* Categories */}
      <div className="mb-12">
        <div className="flex items-center mb-6">
          <Camera size={24} className="mr-2" style={{ color: '#8B4513' }} />
          <h2 className="text-2xl font-bold" style={{ color: '#8B4513' }}>
            Catégories populaires
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category, index) => (
            <div
              key={index}
              className="p-6 rounded-lg border hover:shadow-lg transition-shadow cursor-pointer group"
              style={{
                borderColor: '#D3D3D3',
                backgroundColor: 'white',
              }}
            >
              <div className="flex items-center mb-3">
                <div className="mr-3" style={{ color: '#8B4513' }}>
                  {category.icon}
                </div>
                <h3 className="font-semibold text-lg">{category.name}</h3>
              </div>
              <div className="flex justify-between items-center">
                <p className="mt-2 text-gray-600 text-sm">
                  Découvrez nos photographes spécialisés
                </p>
                <span className="px-3 py-1 rounded-full text-sm font-medium"
                      style={{ backgroundColor: '#6B8E23', color: 'white' }}>
                  {category.count} pros
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Photographers */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Star size={24} className="mr-2" style={{ color: '#8B4513' }} />
            <h2 className="text-2xl font-bold" style={{ color: '#8B4513' }}>
              Photographes recommandés
            </h2>
          </div>
          <button className="flex items-center px-4 py-2 rounded-md border font-medium"
                  style={{ borderColor: '#556B2F', color: '#556B2F' }}>
            <Users size={18} className="mr-2" />
            Voir tous les photographes
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredPhotographers.map((photographer) => (
            <div
              key={photographer.id}
              className="rounded-lg overflow-hidden border hover:shadow-xl transition-shadow group"
              style={{ borderColor: '#D3D3D3' }}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={photographer.image}
                  alt={photographer.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-xl mb-1">{photographer.name}</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin size={16} className="mr-1" />
                      {photographer.location}
                    </div>
                  </div>
                  <div className="flex items-center" style={{ color: '#8B4513' }}>
                    <Star size={16} className="fill-current mr-1" />
                    <span className="font-bold">{photographer.rating}</span>
                  </div>
                </div>
                
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-2"
                        style={{ backgroundColor: '#F0F0F0', color: '#556B2F' }}>
                    {photographer.specialty}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                  <div className="font-semibold">{photographer.price}</div>
                </div>
                
                <div className="flex space-x-2">
                  <button 
                    className="flex-1 py-2 rounded-md border text-center font-medium flex items-center justify-center"
                    style={{ borderColor: '#556B2F', color: '#556B2F' }}
                    onClick={() => onContactClick(
                      `Contact avec ${photographer.name} - ${photographer.specialty}`,
                      photographer.name
                    )}
                  >
                    <Phone size={18} className="mr-2" />
                    Contacter
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>


    </div>
  );
};

export default PhotographiePage;