import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Plane, Hotel, Sofa, Music, MapPin, ArrowRight, Calendar, Heart, ShoppingCart, Zap, FileText } from 'lucide-react';
import { offresExclusivesAPI } from '@/lib/api';
import { useCart } from '@/components/contexts/CartContext';
import { toast } from 'sonner';
import { ModalDemandeDevisPack } from '@/components/components/ModalDemandeDevisPack';

interface Offre {
  id: string;
  title: string;
  originalPrice: number;
  price: number;
  discount: number;
  category: string;
  type: string;
  city?: string;
  rating?: number;
  reviewCount?: number;
  images: string[];
  description?: string;
  provider: string;
  features: string[];
  timeLeft?: string;
  brand?: string;
  isProduct?: boolean;
}

interface Categorie {
  id: string;
  name: string;
  description: string;
  count: number;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
}

interface Stats {
  totalOffres: number;
  reductionMoyenne: string;
  offresFlash: number;
  membresSatisfaits: number;
}

const OffresExclusives = () => {
  const offresSectionRef = useRef<HTMLDivElement>(null);
  const [offresFlash, setOffresFlash] = useState<Offre[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalOffres: 0,
    reductionMoyenne: '0%',
    offresFlash: 0,
    membresSatisfaits: 0
  });
  const [loading, setLoading] = useState(true);
  const [modalDevisOpen, setModalDevisOpen] = useState(false);
  const [selectedOffre, setSelectedOffre] = useState<Offre | null>(null);

  // Utilisation du contexte panier
  const { addToCart } = useCart();

  const scrollToOffres = () => {
    offresSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  // Fonction simplifiée pour déterminer le bouton - VERSION OPTIMISÉE
  const getButtonConfig = (category: string, type: string) => {
    const catLower = category?.toLowerCase() || '';
    const typeLower = type?.toLowerCase() || '';
    
    // console.log('getButtonConfig - Catégorie:', category, 'Type:', type);
    
    // RÈGLE SPÉCIALE : Si la catégorie contient "immobilier" (même en minuscule)
    // ALORS c'est un devis immobilier, peu importe le type
    if (catLower.includes('immobilier')) {
      return {
        text: 'Demander un Devis',
        icon: FileText,
        variant: 'default' as const,
        action: 'devis',
        badgeColor: 'bg-orange-600 hover:bg-orange-700'
      };
    }
    
    // Si c'est un produit
    if (typeLower === 'produit' || catLower === 'shopping' || catLower === 'soirees') {
      return {
        text: 'Acheter',
        icon: ShoppingCart,
        variant: 'default' as const,
        action: 'acheter',
        badgeColor: 'bg-green-600 hover:bg-green-700'
      };
    }
    
    // Si c'est de l'immobilier (par type)
    if (typeLower === 'immobilier' || typeLower === 'location' || typeLower === 'vente') {
      return {
        text: 'Demander un Devis',
        icon: FileText,
        variant: 'default' as const,
        action: 'devis',
        badgeColor: 'bg-orange-600 hover:bg-orange-700'
      };
    }
    
    // Si c'est du voyage/tourisme
    if (typeLower.includes('voyage') || catLower.includes('voyage') || 
        catLower.includes('tourisme') || catLower.includes('loisirs') ||
        catLower.includes('activité') || catLower.includes('hébergement')) {
      return {
        text: 'Réserver',
        icon: Calendar,
        variant: 'default' as const,
        action: 'reserver',
        badgeColor: 'bg-blue-600 hover:bg-blue-700'
      };
    }
    
    // Par défaut
    return {
      text: 'Contacter',
      icon: FileText,
      variant: 'default' as const,
      action: 'devis',
      badgeColor: 'bg-blue-600 hover:bg-blue-700'
    };
  };

  // Fonction pour gérer l'action du bouton
  const handleButtonAction = (offre: Offre, action: string) => {
    // console.log('Action bouton:', action, 'pour offre:', offre.title);
    
    switch (action) {
      case 'acheter':
        handleAddToCart(offre);
        break;
      case 'reserver':
        handleReservation(offre);
        break;
      case 'devis':
        handleDevis(offre);
        break;
      default:
        handleDevis(offre);
    }
  };

  // Fonction pour ajouter au panier
  const handleAddToCart = (offre: Offre) => {
    // VÉRIFICATION : Seuls les produits peuvent être ajoutés au panier
    const catLower = offre.category?.toLowerCase() || '';
    const typeLower = offre.type?.toLowerCase() || '';
    
    if (typeLower !== 'produit' && catLower !== 'shopping' && catLower !== 'soirees') {
      toast.error(`Ce ${offre.category?.toLowerCase() || 'produit/service'} ne peut pas être acheté directement. Veuillez contacter le prestataire.`);
      return;
    }

    const cartItem = {
      id: offre.id,
      name: offre.title,
      price: offre.price,
      quantity: 1,
      images: offre.images || [],
      productType: 'product',
      features: offre.features || [],
      originalPrice: offre.originalPrice,
      discount: offre.discount,
      brand: offre.brand,
      provider: offre.provider
    };

    addToCart(cartItem);
    toast.success(`${offre.title} ajouté au panier`);
  };

  // Fonction pour gérer les réservations
  const handleReservation = (offre: Offre) => {
    // console.log('Réservation pour:', offre.title);
    toast.success(`Réservation initiée pour ${offre.title}`);
    // Ici vous pouvez rediriger vers une page de réservation ou ouvrir un modal
  };

  // Fonction pour gérer les devis
  const handleDevis = (offre: Offre) => {
    // console.log('Demande de devis pour:', offre.title);
    setSelectedOffre(offre);
    setModalDevisOpen(true);
  };

  // Fonction de soumission du devis
  const handleDevisSubmit = async (formData: any) => {
    try {
      // console.log('Demande de devis pour:', selectedOffre?.title, formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success(`Votre demande de devis pour ${selectedOffre?.title} a été envoyée avec succès !`);
      setModalDevisOpen(false);
      setSelectedOffre(null);
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du devis');
    }
  };

  // Icônes pour les catégories
  const categoryIcons: { [key: string]: React.ComponentType<React.SVGProps<SVGSVGElement>> } = {
    'voyages': Plane,
    'shopping': Sofa,
    'loisirs': MapPin,
    'immobilier': Hotel,
    'soirees': Music,
    'voyage': Plane,
    'activité': MapPin,
    'hébergement': Hotel
  };

  const categoryColors: { [key: string]: string } = {
    'voyages': 'blue',
    'shopping': 'green',
    'loisirs': 'purple',
    'immobilier': 'orange',
    'soirees': 'pink',
    'voyage': 'blue',
    'activité': 'purple',
    'hébergement': 'blue'
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // console.log('🔍 Début du chargement des offres...');
        
        const [flashResponse, categoriesResponse, statsResponse] = await Promise.all([
          offresExclusivesAPI.getOffresFlash(),
          offresExclusivesAPI.getCategories(),
          offresExclusivesAPI.getStats()
        ]);

        // console.log('📦 Réponse flash:', flashResponse);
        
        if (flashResponse.data.success) {
          const data = flashResponse.data.data || [];
          // console.log('✅ Offres reçues:', data.length, 'offres');
          // console.log('📋 Détail des offres:', data.map((o: any) => ({
          //   title: o.title,
          //   category: o.category,
          //   type: o.type,
          //   price: o.price
          // })));
          
          // Compter par type
          const counts: {[key: string]: number} = {};
          data.forEach((o: any) => {
            const type = o.type || 'Non défini';
            counts[type] = (counts[type] || 0) + 1;
          });
          // console.log('📊 Distribution par type:', counts);
          
          setOffresFlash(data);
        } else {
          console.error('❌ Erreur dans la réponse flash:', flashResponse.data);
        }

        if (categoriesResponse.data.success) {
          const categoriesWithIcons = categoriesResponse.data.data.map((cat: Categorie) => ({
            ...cat,
            icon: categoryIcons[cat.id] || MapPin,
            color: categoryColors[cat.id] || 'blue'
          }));
          setCategories(categoriesWithIcons);
        }

        if (statsResponse.data.success) {
          setStats(statsResponse.data.data);
        }

      } catch (error) {
        console.error('❌ Erreur chargement données:', error);
      } finally {
        setLoading(false);
        // console.log('✅ Chargement terminé');
      }
    };

    fetchData();
  }, []);

  const AnimatedCounter = ({ value, duration = 2 }: { value: string, duration?: number }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      const numericValue = parseInt(value.replace(/[^0-9]/g, '')) || 0;
      let startTimestamp: number | null = null;

      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);

        setCount(Math.floor(progress * numericValue));

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };

      requestAnimationFrame(step);
    }, [value, duration]);

    return (
      <>
        {value.includes('%') ? `${count}%` :
          value.includes('+') ? `${count}+` :
            count}
      </>
    );
  };

  const statistiques = [
    { number: stats.reductionMoyenne, text: 'de réduction moyenne' },
    { number: `${stats.offresFlash}h`, text: 'offres flash quotidiennes' },
    { number: `${stats.membresSatisfaits}+`, text: 'membres satisfaits' },
    { number: `${stats.totalOffres}+`, text: 'nouvelles offres' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center flex flex-col items-center justify-center">
          <img src="/loading.gif" alt="" />
          <p className="mt-4 text-gray-600">Chargement des offres exclusives...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className='absolute inset-0 h-64 -z-10 w-full overflow-hidden'>
        <div className='absolute inset-0 w-full h-full backdrop-blur-sm bg-black/50'></div>
        <img src="https://i.pinimg.com/736x/d8/7c/cf/d87ccf6c788636ccb74610dfb35380b2.jpg" className='h-full object-cover w-full' alt="" />
      </div>
      
      <section className="container mx-auto px-4 py-16 text-center relative">
        <div className='absolute inset-0 h-64 -z-10 w-full overflow-hidden'>
          <div className='absolute inset-0 w-full h-full backdrop-blur-sm bg-black/50'></div>
          <img
            src="https://i.pinimg.com/736x/74/43/b2/7443b23952143eede1e031cadee50689.jpg"
            className='h-full object-cover w-full'
            alt="Offres exclusives"
          />
          <Badge variant="secondary" className="absolute left-2 bottom-0 mb-4 px-4 py-1 text-sm">
            <Star className="w-4 h-4 mr-1" />
            Offres Flash
          </Badge>
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-xl lg:text-5xl py-12 font-bold text-gray-200 mb-6">
            Offres Exclusives
            <span className="text-yellow-400 block">Soldes & Promotions</span>
          </h1>
          <p className="text-md text-gray-700 mb-8 max-w-2xl mx-auto">
            Découvrez nos deals exceptionnels : billets d'avion, meubles soldés,
            activités touristiques, hôtels et soirées électro à prix imbattables !
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" onClick={scrollToOffres} className="px-8 bg-yellow-500 hover:bg-yellow-600">
              Voir les offres
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-5 mx-auto">
            {statistiques.map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                <div className='azonix text-3xl font-bold text-slate-900'>
                  <AnimatedCounter value={stat.number} duration={2} />
                </div>
                <div className="text-gray-600 text-sm">{stat.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Catégories */}
      <section className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Nos Catégories Exclusives
          </h2>
          <p className="text-md text-gray-600 max-w-2xl mx-auto">
            Explorez nos différentes catégories d'offres et trouvez les deals qui vous correspondent
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {categories.map((categorie) => {
            const IconComponent = categorie.icon || MapPin;
            return (
              <Card key={categorie.id} className="hover:shadow-lg transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-${categorie.color}-100 flex items-center justify-center`}>
                    <IconComponent className={`w-8 h-8 text-${categorie.color}-600`} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {categorie.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {categorie.description}
                  </p>
                  <div className="text-sm text-gray-500 mb-4">
                    {categorie.count} offres disponibles
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Section Offres Flash */}
      <section ref={offresSectionRef} className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Zap className="w-6 h-6 text-yellow-500" />
              <h2 className="text-4xl font-bold text-gray-900">
                Offres Flash du Jour ({offresFlash.length} offres)
              </h2>
            </div>
            <p className="text-md text-gray-600 max-w-2xl mx-auto">
              Des deals exceptionnels qui partent vite ! Dépêchez-vous avant qu'il ne soit trop tard.
            </p>
          </div>

          {offresFlash.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Aucune offre flash disponible pour le moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {offresFlash.map((offre) => {
                // Déterminer la configuration du bouton
                const buttonConfig = getButtonConfig(offre.category, offre.type);
                const ButtonIcon = buttonConfig.icon;
                
                // Déterminer si c'est de l'immobilier
                const isImmobilier = offre.category?.toLowerCase().includes('immobilier') || 
                                   offre.type?.toLowerCase().includes('immobilier');

                return (
                  <Card key={offre.id} className="group hover:shadow-xl transition-all duration-300 border border-gray-200">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={offre.images?.[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"}
                        alt={offre.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <Badge className={`absolute top-2 right-2 ${buttonConfig.badgeColor}`}>
                        {isImmobilier ? 'Immobilier' : (offre.type || offre.category || 'Offre')}
                      </Badge>
                      <Badge variant="destructive" className="absolute top-2 left-2">
                        -{offre.discount}%
                      </Badge>
                    </div>

                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {offre.category || 'Général'}
                        </Badge>
                        {buttonConfig.action === 'acheter' && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 border-green-200">
                            ✓ Achetable
                          </Badge>
                        )}
                        {isImmobilier && (
                          <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800 border-orange-200">
                            🏠 Immobilier
                          </Badge>
                        )}
                      </div>

                      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
                        {offre.title}
                      </h3>

                      {offre.rating && offre.rating > 0 && (
                        <div className="flex items-center gap-1 mb-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600">{offre.rating.toFixed(1)}</span>
                          {offre.reviewCount && offre.reviewCount > 0 && (
                            <span className="text-sm text-gray-500">({offre.reviewCount})</span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl font-bold text-gray-900">
                          {offre.price}€
                        </span>
                        {offre.originalPrice && offre.originalPrice > offre.price && (
                          <span className="text-sm text-gray-500 line-through">
                            {offre.originalPrice}€
                          </span>
                        )}
                      </div>

                      {offre.city && offre.city !== '1' && offre.city.trim() !== '' && (
                        <div className="flex items-center gap-1 text-sm text-gray-600 mb-3">
                          <MapPin className="w-4 h-4" />
                          {offre.city}
                        </div>
                      )}

                      {offre.features && offre.features.length > 0 && (
                        <ul className="space-y-1 mb-4">
                          {offre.features.slice(0, 3).map((feature, index) => (
                            <li key={index} className="flex items-start text-xs text-gray-600">
                              <Check className="w-3 h-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                              <span className="line-clamp-1">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      <Button
                        className={`w-full ${buttonConfig.badgeColor}`}
                        size="sm"
                        onClick={() => handleButtonAction(offre, buttonConfig.action)}
                      >
                        <ButtonIcon className="w-4 h-4 mr-2" />
                        {buttonConfig.text}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Modal de demande de devis */}
      <ModalDemandeDevisPack
        open={modalDevisOpen}
        onClose={() => {
          setModalDevisOpen(false);
          setSelectedOffre(null);
        }}
        property={selectedOffre}
        onSuccess={handleDevisSubmit}
      />
    </div>
  );
};

export default OffresExclusives;