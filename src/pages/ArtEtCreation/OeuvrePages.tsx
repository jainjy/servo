import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ImageIcon, Calendar, ShoppingCart, Euro } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/components/contexts/CartContext';
import api from '@/lib/api';
import { toast } from 'sonner';

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
  quantity?: number;
  vendor?: {
    companyName?: string;
  };
}

const OeuvrePages: React.FC = () => {
  const { professionalId } = useParams<{ professionalId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToCart } = useCart();

  const professionalName = (location.state as any)?.professionalName;

  const [loading, setLoading] = useState<boolean>(true);
  const [oeuvres, setOeuvres] = useState<Oeuvre[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [addingOeuvreId, setAddingOeuvreId] = useState<string | null>(null);

  useEffect(() => {
    if (!professionalId) {
      setError('Identifiant du professionnel manquant');
      setLoading(false);
      return;
    }

    const fetchOeuvres = async () => {
      try {
        setLoading(true);
        setError(null);

        console.log('🔄 Fetching œuvres for professionalId:', professionalId);

        const response = await api.get(`/art-creation/products/professional/${professionalId}`);

        console.log('✅ Response data:', {
          success: response.data.success,
          count: response.data.count,
          dataLength: response.data.data?.length,
          data: response.data.data
        });

        if (response.data?.success) {
          const oeuvresData = response.data.data || [];
          
          // S'assurer que chaque œuvre a une quantité par défaut si non définie
          const oeuvresWithQuantity = oeuvresData.map((oeuvre: Oeuvre) => ({
            ...oeuvre,
            quantity: oeuvre.quantity || 1, // Par défaut en stock
            name: oeuvre.title // Pour la compatibilité avec addToCart
          }));
          
          setOeuvres(oeuvresWithQuantity);
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

  const handleAcheter = async (oeuvre: Oeuvre) => {
    // Vérifier si l'utilisateur est connecté
    if (!user) {
      toast.warning(
        "Veuillez vous connecter pour ajouter des œuvres au panier"
      );
      return;
    }

    // Vérifier si l'œuvre est en stock
    if (oeuvre.quantity === 0) {
      toast.error("Cette œuvre n'est plus disponible");
      return;
    }

    try {
      setAddingOeuvreId(oeuvre.id);

      // Préparer l'objet produit pour le panier
      const productToAdd = {
        id: oeuvre.id,
        name: oeuvre.title,
        description: oeuvre.description,
        price: oeuvre.price || 0,
        image: oeuvre.image,
        images: oeuvre.images || [oeuvre.image],
        quantity: 1, // Quantité à ajouter au panier
        maxQuantity: oeuvre.quantity || 1, // Stock disponible
        vendor: {
          companyName: professionalName || oeuvre.artist || 'Artiste',
          id: professionalId
        },
        category: oeuvre.category || 'art',
        type: 'oeuvre'
      };

      // Ajouter l'œuvre au panier
      addToCart(productToAdd);

      // Petit délai pour laisser le temps à l'état de se mettre à jour
      await new Promise(resolve => setTimeout(resolve, 100));

      // Afficher une confirmation
      toast.success(`"${oeuvre.title}" ajoutée au panier !`, {
        description: `Prix : ${oeuvre.price?.toFixed(2) || '0.00'}€`,
        action: {
          label: 'Voir le panier',
          onClick: () => navigate('/panier')
        }
      });

    } catch (error) {
      console.error('Erreur lors de l\'ajout au panier:', error);
      toast.error("Erreur lors de l'ajout au panier");
    } finally {
      setAddingOeuvreId(null);
    }
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
                        {oeuvre.price.toFixed(2)}€
                      </span>
                    </div>
                  )}
                  {/* Badge de disponibilité */}
                  {oeuvre.quantity === 0 && (
                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full shadow-md">
                      <span className="text-sm font-medium">Vendu</span>
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
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
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

                    {/* Info vendeur */}
                    {professionalName && (
                      <div className="flex items-center text-gray-500 text-sm">
                        <ShoppingCart size={16} className="mr-2" />
                        <span>{professionalName}</span>
                      </div>
                    )}

                    {/* Bouton Acheter */}
                    <button
                      onClick={() => handleAcheter(oeuvre)}
                      disabled={oeuvre.quantity === 0 || addingOeuvreId === oeuvre.id}
                      className={`w-full font-semibold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center ${
                        oeuvre.quantity === 0
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : addingOeuvreId === oeuvre.id
                          ? 'bg-[#6B3410] text-white'
                          : 'bg-[#8B4513] hover:bg-[#6B3410] text-white'
                      }`}
                    >
                      {addingOeuvreId === oeuvre.id ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Ajout...
                        </div>
                      ) : oeuvre.quantity === 0 ? (
                        <>
                          <ShoppingCart size={18} className="mr-2" />
                          Vendu
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={18} className="mr-2" />
                          Ajouter au panier
                        </>
                      )}
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