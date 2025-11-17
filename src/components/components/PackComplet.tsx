import React, { useState } from 'react';
import { Check, X, Star, Zap, Shield, Clock, Users, Award } from 'lucide-react';

interface PackFeature {
  id: string;
  name: string;
  included: boolean;
  description?: string;
}

interface PricingPack {
  id: string;
  name: string;
  description: string;
  price: number;
  billingPeriod: 'monthly' | 'yearly';
  popular: boolean;
  features: PackFeature[];
  ctaText: string;
  colorScheme: 'basic' | 'professional' | 'premium';
}

const PricingPacksDisplay: React.FC = () => {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const pricingPacks: PricingPack[] = [
    {
      id: 'basic',
      name: 'Essentiel',
      description: 'Parfait pour débuter et découvrir nos services',
      price: 19,
      billingPeriod: 'monthly',
      popular: false,
      ctaText: 'Commencer maintenant',
      colorScheme: 'basic',
      features: [
        { id: 'f1', name: 'Accès base de données', included: true },
        { id: 'f2', name: 'Support email', included: true },
        { id: 'f3', name: 'Analyses basiques', included: true },
        { id: 'f4', name: 'Rapports standards', included: true },
        { id: 'f5', name: 'Support prioritaire', included: false },
        { id: 'f6', name: 'Formations avancées', included: false },
        { id: 'f7', name: 'API complète', included: false },
        { id: 'f8', name: 'Accès illimité', included: false }
      ]
    },
    {
      id: 'professional',
      name: 'Professionnel',
      description: 'Idéal pour les professionnels et petites entreprises',
      price: 49,
      billingPeriod: 'monthly',
      popular: true,
      ctaText: 'Essai gratuit 30 jours',
      colorScheme: 'professional',
      features: [
        { id: 'f1', name: 'Accès base de données', included: true },
        { id: 'f2', name: 'Support email', included: true },
        { id: 'f3', name: 'Analyses basiques', included: true },
        { id: 'f4', name: 'Rapports standards', included: true },
        { id: 'f5', name: 'Support prioritaire', included: true },
        { id: 'f6', name: 'Formations avancées', included: true },
        { id: 'f7', name: 'API complète', included: false },
        { id: 'f8', name: 'Accès illimité', included: false }
      ]
    },
    {
      id: 'premium',
      name: 'Premium',
      description: 'Solution complète pour les entreprises exigeantes',
      price: 99,
      billingPeriod: 'monthly',
      popular: false,
      ctaText: 'Choisir ce pack',
      colorScheme: 'premium',
      features: [
        { id: 'f1', name: 'Accès base de données', included: true },
        { id: 'f2', name: 'Support email', included: true },
        { id: 'f3', name: 'Analyses basiques', included: true },
        { id: 'f4', name: 'Rapports standards', included: true },
        { id: 'f5', name: 'Support prioritaire', included: true },
        { id: 'f6', name: 'Formations avancées', included: true },
        { id: 'f7', name: 'API complète', included: true },
        { id: 'f8', name: 'Accès illimité', included: true }
      ]
    }
  ];

  const getColorClasses = (scheme: string) => {
    switch (scheme) {
      case 'basic':
        return {
          bg: 'bg-white',
          border: 'border-gray-200',
          text: 'text-gray-900',
          button: 'bg-gray-900 text-white hover:bg-gray-800',
          popular: 'bg-gray-100 text-gray-700'
        };
      case 'professional':
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-300',
          text: 'text-blue-900',
          button: 'bg-blue-600 text-white hover:bg-blue-700',
          popular: 'bg-blue-600 text-white'
        };
      case 'premium':
        return {
          bg: 'bg-purple-50',
          border: 'border-purple-300',
          text: 'text-purple-900',
          button: 'bg-purple-600 text-white hover:bg-purple-700',
          popular: 'bg-purple-600 text-white'
        };
      default:
        return {
          bg: 'bg-white',
          border: 'border-gray-200',
          text: 'text-gray-900',
          button: 'bg-gray-900 text-white hover:bg-gray-800',
          popular: 'bg-gray-100 text-gray-700'
        };
    }
  };

  const getPrice = (pack: PricingPack) => {
    if (billingPeriod === 'yearly') {
      return pack.price * 10; // 2 mois gratuits
    }
    return pack.price;
  };

  const getBillingText = (pack: PricingPack) => {
    return billingPeriod === 'yearly' ? 'an' : 'mois';
  };

  return (
    <div className="min-h-screen mt-10 bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* En-tête */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choisissez Votre Pack
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Sélectionnez la formule qui correspond le mieux à vos besoins et objectifs
          </p>
          
          {/* Sélecteur de période de facturation */}
          <div className="inline-flex items-center bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                billingPeriod === 'monthly'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-md font-medium transition-all ${
                billingPeriod === 'yearly'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annuel
            </button>
          </div>
          
          {billingPeriod === 'yearly' && (
            <div className="mt-4 text-green-600 font-medium">
              Economisez 2 mois en choisissant la facturation annuelle
            </div>
          )}
        </div>

        {/* Grille des packs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {pricingPacks.map((pack) => {
            const colors = getColorClasses(pack.colorScheme);
            const displayPrice = getPrice(pack);
            const billingText = getBillingText(pack);

            return (
              <div
                key={pack.id}
                className={`relative rounded-2xl border-2 ${colors.border} ${colors.bg} shadow-lg transition-all duration-300 hover:shadow-xl ${
                  pack.popular ? 'transform scale-105' : ''
                }`}
              >
                {/* Badge populaire */}
                {pack.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className={`inline-flex items-center px-4 py-2 rounded-full ${colors.popular} font-semibold text-sm`}>
                      <Star className="w-4 h-4 mr-1" />
                      Le plus populaire
                    </div>
                  </div>
                )}

                <div className="p-8">
                  {/* En-tête du pack */}
                  <div className="text-center mb-6">
                    <h3 className={`text-2xl font-bold ${colors.text} mb-2`}>
                      {pack.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {pack.description}
                    </p>
                  </div>

                  {/* Prix */}
                  <div className="text-center mb-6">
                    <div className="flex items-baseline justify-center">
                      <span className={`text-5xl font-bold ${colors.text}`}>
                        {displayPrice}€
                      </span>
                      <span className="text-gray-500 ml-2">/{billingText}</span>
                    </div>
                    {billingPeriod === 'yearly' && (
                      <div className="text-gray-500 text-sm mt-1">
                        Soit {(displayPrice / 12).toFixed(2)}€/mois
                      </div>
                    )}
                  </div>

                  {/* Bouton d'action */}
                  <button
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-200 ${colors.button} shadow-sm hover:shadow-md mb-8`}
                  >
                    {pack.ctaText}
                  </button>

                  {/* Liste des fonctionnalités */}
                  <div className="space-y-4">
                    <h4 className={`font-semibold ${colors.text} text-lg mb-4`}>
                      Ce pack inclut :
                    </h4>
                    {pack.features.map((feature) => (
                      <div
                        key={feature.id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          {feature.included ? (
                            <Check className="w-5 h-5 text-green-500 mr-3" />
                          ) : (
                            <X className="w-5 h-5 text-gray-300 mr-3" />
                          )}
                          <span
                            className={
                              feature.included ? 'text-gray-900' : 'text-gray-400'
                            }
                          >
                            {feature.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Section informations complémentaires */}
        <div className="mt-16 bg-white rounded-2xl border border-gray-200 p-8 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Pourquoi Choisir Nos Packs ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Sécurité Maximale</h3>
              <p className="text-gray-600 text-sm">
                Vos données sont protégées avec les standards les plus élevés
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Performance</h3>
              <p className="text-gray-600 text-sm">
                Temps de chargement optimisés pour une expérience fluide
              </p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Support Expert</h3>
              <p className="text-gray-600 text-sm">
                Notre équipe vous accompagne dans votre réussite
              </p>
            </div>
            <div className="text-center">
              <div className="bg-orange-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Reconnaissance</h3>
              <p className="text-gray-600 text-sm">
                Solution primée par les professionnels du secteur
              </p>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Questions Fréquentes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Puis-je changer de pack à tout moment ?
              </h3>
              <p className="text-gray-600 text-sm">
                Oui, vous pouvez mettre à niveau ou rétrograder votre pack à tout moment. 
                Les changements prennent effet immédiatement.
              </p>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Y a-t-il un engagement minimum ?
              </h3>
              <p className="text-gray-600 text-sm">
                Aucun engagement n'est requis. Vous pouvez résilier votre abonnement 
                à tout moment sans frais supplémentaires.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPacksDisplay;