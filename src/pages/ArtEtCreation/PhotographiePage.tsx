import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  User, 
  Mountain, 
  Palette, 
  Calendar, 
  GraduationCap,
  Star,
  MapPin,
  Phone,
  Users,
  AlertCircle,
  RefreshCw,
  Briefcase,
  Building
} from 'lucide-react';

interface PhotographiePageProps {
  searchQuery?: string;
  onContactClick: (subject: string, recipientName?: string) => void;
}

const PhotographiePage: React.FC<PhotographiePageProps> = ({ searchQuery, onContactClick }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const categories = [
    { name: 'Photographes portrait', count: 45, icon: <User size={20} /> },
    { name: 'Photographes paysage', count: 28, icon: <Mountain size={20} /> },
    { name: 'Photographie artistique', count: 19, icon: <Palette size={20} /> },
    { name: 'Photographes événementiel', count: 26, icon: <Calendar size={20} /> },
    { name: 'Cours de photographie', count: 15, icon: <GraduationCap size={20} /> },
  ];

  // Fonction pour tenter de récupérer les pros via API
  const fetchProArtisans = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Appel à l'API - cette URL devrait échouer
      const response = await fetch(`/api/art-creation/products?metierId=photographe`);
      
      if (!response.ok) {
        throw new Error(`Erreur ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      if (!data || data.length === 0) {
        setError('Aucun professionnel associé trouvé pour cette catégorie');
      }
      
    } catch (err) {
      setError('Erreur de connexion à l\'API : Impossible de récupérer les professionnels associés aux photographes');
    } finally {
      setLoading(false);
    }
  };

  // Appel initial
  useEffect(() => {
    fetchProArtisans();
  }, []);

  return (
    <div>
      {/* Catégories */}
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

      

      {/* Section vide pour Photographes recommandés */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <Star size={24} className="mr-2" style={{ color: '#8B4513' }} />
            <h2 className="text-2xl font-bold" style={{ color: '#8B4513' }}>
              Photographes recommandés
            </h2>
          </div>
          <button 
            className="flex items-center px-4 py-2 rounded-md border font-medium"
            style={{ borderColor: '#556B2F', color: '#556B2F' }}
          >
            <Users size={18} className="mr-2" />
            Voir tous les photographes
          </button>
        </div>
        
        
      </div>
    </div>
  );
};

export default PhotographiePage;