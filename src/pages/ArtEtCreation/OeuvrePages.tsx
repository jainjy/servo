import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ImageIcon, Calendar, ShoppingCart, Euro} from 'lucide-react';
import api from '@/lib/api';

interface Oeuvre {
  id: string;
  title: string;
  description?: string;
  image: string;  
  images?: string[]; 
  createdAt?: string;
  publishedAt?: string;
  price?: number;
  artist?: string;
  category?: string;
  type?: string;
  userId?: string;
}

const OeuvrePages: React.FC = () => {
  const { professionalId } = useParams<{ professionalId: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const professionalName = (location.state as any)?.professionalName;

  const [loading, setLoading] = useState<boolean>(true);
  const [oeuvres, setOeuvres] = useState<Oeuvre[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!professionalId) {
      setError('Identifiant du professionnel manquant');
      setLoading(false);
      return;
    }

    // Dans OeuvrePages.js
  const fetchOeuvres = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('🔄 Fetching œuvres for professionalId:', professionalId);

      // UTILISEZ LA NOUVELLE ROUTE PUBLIQUE
      const response = await api.get(`/art-creation/products/professional/${professionalId}`);
      
      // Vérifiez la structure de réponse
      console.log('✅ Response data:', {
        success: response.data.success,
        count: response.data.count,
        dataLength: response.data.data?.length,
        data: response.data.data
      });

      if (response.data?.success) {
        // La donnée est dans response.data.data
        setOeuvres(response.data.data || []);
      } else {
        setError(response.data.error || 'Impossible de charger les œuvres');
      }
    } catch (err: any) {
      console.error('❌ Erreur chargement œuvres :', err);
      console.error('❌ Status:', err.response?.status);
      console.error('❌ Response data:', err.response?.data);
      
      if (err.response?.status === 404) {
        setError('Aucune œuvre trouvée pour ce professionnel');
      } else if (err.response?.status === 500) {
        setError('Erreur serveur, veuillez réessayer plus tard');
      } else {
        setError('Erreur de connexion : ' + (err.message || 'Erreur inconnue'));
      }
    } finally {
      setLoading(false);
    }
  };

    fetchOeuvres();
  }, [professionalId]);

  const handleAcheter = (oeuvreId: string) => {
    console.log('Achat de l\'œuvre:', oeuvreId);
    // Ajoutez ici la logique d'achat
    alert(`Achat de l'œuvre ${oeuvreId} en cours...`);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-[#556B2F] hover:underline font-medium"
          >
            <ArrowLeft size={20} className="mr-2" />
            Retour
          </button>
        </div>

        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[#8B4513] mb-2 flex items-center">
            <ImageIcon className="mr-3" size={28} />
            Œuvres {professionalName && `de ${professionalName}`}
          </h1>
          <div className="h-1 w-20 bg-[#8B4513] rounded-full"></div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B4513] mx-auto"></div>
            <p className="text-gray-500 mt-4">Chargement des œuvres...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Grid */}
        {!loading && !error && oeuvres.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {oeuvres.map((oeuvre) => (
              <div
                key={oeuvre.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Image Container */}
                <div className="relative h-64 bg-gray-100 overflow-hidden">
                  <img
                    src={oeuvre.image}
                    alt={oeuvre.title || 'Œuvre'}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://via.placeholder.com/400x300?text=Image+indisponible';
                    }}
                  />
                  {oeuvre.price && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md">
                      <span className="text-[#8B4513] font-bold flex items-center">
                        <Euro size={16} className="mr-1" />
                        {oeuvre.price.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Titre et Description */}
                  <div className="mb-6">
                    {oeuvre.title && (
                      <h3 className="text-xl font-bold text-gray-800 mb-3">
                        {oeuvre.title}
                      </h3>
                    )}
                    {oeuvre.description && (
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {oeuvre.description}
                      </p>
                    )}
                  </div>

                  {/* Info Bas */}
                  <div className="flex flex-col space-y-4">
                    {/* Date */}
                    {oeuvre.createdAt && (
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar size={16} className="mr-2" />
                        <span>{formatDate(oeuvre.createdAt)}</span>
                      </div>
                    )}

                    {/* Bouton Acheter */}
                    <button
                      onClick={() => handleAcheter(oeuvre.id)}
                      className="w-full bg-[#8B4513] hover:bg-[#6B3410] text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
                    >
                      <ShoppingCart size={18} className="mr-2" />
                      Acheter
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && !error && oeuvres.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
              <ImageIcon size={48} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Aucune œuvre disponible
            </h3>
            <p className="text-gray-500">
              Ce professionnel n'a pas encore publié d'œuvres
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OeuvrePages;