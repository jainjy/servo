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

      {/* Section Artisans sélectionnés avec erreur */}
      <div className="mb-12">
        <div className="flex items-center mb-6">
          <Briefcase size={24} className="mr-2" style={{ color: '#8B4513' }} />
          <h2 className="text-2xl font-bold" style={{ color: '#8B4513' }}>
            Professionnels associés aux photographes
          </h2>
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
            <div className="flex flex-col items-center justify-center">
              <AlertCircle size={48} className="text-red-500 mb-4" />
              <h3 className="text-xl font-bold text-red-700 mb-2">
                Erreur de chargement
              </h3>
              <p className="text-red-600 mb-4">
                {error}
              </p>
              <div className="text-sm text-gray-500 mb-6">
                <p>Les professionnels suivants ne peuvent pas être affichés :</p>
                <ul className="mt-2 space-y-1">
                  <li>• Galeristes spécialisés photo</li>
                  <li>• Agents artistiques</li>
                  <li>• Éditeurs d'art</li>
                  <li>• Marchands de photographie</li>
                </ul>
              </div>
              <button
                onClick={fetchProArtisans}
                disabled={loading}
                className="flex items-center px-6 py-3 bg-[#8B4513] text-white rounded-lg hover:bg-[#6B3410] transition-colors disabled:opacity-50"
              >
                <RefreshCw size={18} className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Tentative de connexion...' : 'Réessayer la connexion'}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B4513] mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des professionnels associés...</p>
          </div>
        )}

        {/* Message d'information */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <Building size={20} className="text-blue-500 mr-3 mt-1" />
            <div>
              <p className="text-sm text-blue-800">
                <strong>Information :</strong> Cette section affiche les professionnels (galeristes, agents, éditeurs) 
                qui sont associés au métier de photographe via l'API. Actuellement, l'API ne répond pas correctement.
              </p>
            </div>
          </div>
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
        
        <div className="text-center p-8 border border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">
            Les données des photographes ne peuvent pas être chargées en raison de l'erreur API
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhotographiePage;