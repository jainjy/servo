import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Crown, Zap, Shield, Users, Target, TrendingUp, ArrowRight, Calendar, FileText, MessageCircle, BarChart3, Settings, Heart } from 'lucide-react';

const PacksExclusifs = () => {
  const packsSectionRef = useRef<HTMLDivElement>(null);

  const scrollToPacks = () => {
    packsSectionRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  const packsExclusifs = [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Parfait pour débuter et tester nos services',
      price: 'Gratuit',
      period: '',
      popular: false,
      icon: Target,
      color: 'gray',
      features: [
        'Gestion basique des documents',
        '5 contrats types',
        'Stockage 1GB',
        'Support par email',
        '1 utilisateur',
        'Audit basique mensuel'
      ],
      limitations: [
        'Documents limités à 50',
        'Pas de signature électronique',
        'Archivage limité à 1 an'
      ],
      buttonText: 'Commencer gratuitement',
      buttonVariant: 'outline' as const
    },
    {
      id: 'pro',
      name: 'Professionnel',
      description: 'Idéal pour les artisans et petites entreprises',
      price: '49',
      period: '/mois',
      popular: true,
      icon: Zap,
      color: 'blue',
      features: [
        'Gestion illimitée des documents',
        '50+ contrats types',
        'Stockage 10GB',
        'Support prioritaire',
        '3 utilisateurs inclus',
        'Audit complet mensuel',
        'Signature électronique',
        'Archivage 5 ans',
        'Modèles de devis personnalisables',
        'Rapports analytiques basiques'
      ],
      highlights: [
        'Plus populaire',
        'Rentable pour PME'
      ],
      buttonText: 'Essayer 30 jours',
      buttonVariant: 'default' as const
    },
    {
      id: 'business',
      name: 'Business',
      description: 'Solution complète pour les entreprises en croissance',
      price: '99',
      period: '/mois',
      popular: false,
      icon: TrendingUp,
      color: 'purple',
      features: [
        'Toutes fonctionnalités Pro',
        'Contrats types illimités',
        'Stockage 50GB',
        'Support dédié 24/7',
        '10 utilisateurs inclus',
        'Audit avancé hebdomadaire',
        'Workflows automatisés',
        'Intégrations API',
        'Analyses avancées',
        'Formation équipe',
        'Gestion multi-sociétés',
        'Backup quotidien'
      ],
      highlights: [
        'Solution complète',
        'Évolutif'
      ],
      buttonText: 'Démarrer maintenant',
      buttonVariant: 'outline' as const
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Solution sur mesure pour les grandes organisations',
      price: 'Sur mesure',
      period: '',
      popular: false,
      icon: Crown,
      color: 'amber',
      features: [
        'Toutes fonctionnalités Business',
        'Stockage illimité',
        'Support manager dédié',
        'Utilisateurs illimités',
        'Audit en temps réel',
        'Développements sur mesure',
        'SLA 99.9%',
        'Conformité RGPD avancée',
        'Formations personnalisées',
        'Migration données assistée',
        'SSO et sécurité avancée',
        'Rapports executive'
      ],
      highlights: [
        'Solution sur mesure',
        'Support premium'
      ],
      buttonText: 'Contactez-nous',
      buttonVariant: 'outline' as const
    }
  ];

  const fonctionnalitesPremium = [
    {
      icon: FileText,
      title: 'Gestion Documentaire Avancée',
      description: 'Centralisez tous vos documents avec classement intelligent et recherche avancée',
      features: ['OCR intégré', 'Workflows automatisés', 'Versioning']
    },
    {
      icon: MessageCircle,
      title: 'Communication Unifiée',
      description: 'Messagerie intégrée avec vos clients et partenaires',
      features: ['Chat en temps réel', 'Notifications push', 'Historique complet']
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reporting',
      description: 'Tableaux de bord complets pour piloter votre activité',
      features: ['KPI personnalisés', 'Rapports automatiques', 'Export Excel/PDF']
    },
    {
      icon: Shield,
      title: 'Sécurité Maximale',
      description: 'Protection de vos données avec les standards les plus élevés',
      features: ['Chiffrement AES-256', 'Sauvegardes automatiques', 'Conformité RGPD']
    },
    {
      icon: Users,
      title: 'Gestion d\'Équipe',
      description: 'Collaborez efficacement avec votre équipe et vos partenaires',
      features: ['Rôles personnalisés', 'Permissions granulaires', 'Activité en temps réel']
    },
    {
      icon: Settings,
      title: 'Intégrations Avancées',
      description: 'Connectez tous vos outils métiers favoris',
      features: ['API REST complète', 'Webhooks', 'Connecteurs prêts à l\'emploi']
    }
  ];
  const AnimatedCounter = ({ value, duration = 2 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
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
    { number: '98%', text: 'de satisfaction client' },
    { number: '24/7', text: 'support disponible' },
    { number: '5min', text: 'de mise en place' },
    { number: '10k+', text: 'utilisateurs actifs' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className='absolute inset-0 h-64 -z-10 w-full overflow-hidden'>
          <div className='absolute inset-0 w-full h-full backdrop-blur-sm bg-black/50'></div>
          <img src="https://i.pinimg.com/736x/74/43/b2/7443b23952143eede1e031cadee50689.jpg" className='h-full object-cover w-full' alt="" />
          <Badge variant="secondary" className="absolute left-2 bottom-0 mb-4 px-4 py-1 text-sm">
            <Star className="w-4 h-4 mr-1" />
            Offres Exclusives
          </Badge>
        </div>
        <div className="max-w-4xl mx-auto">

          <h1 className="text-xl lg:text-5xl py-12 font-bold text-gray-200 mb-6">
            Des Packs Sur Mesure
            <span className="text-blue-600 block">Pour Votre Réussite</span>
          </h1>
          <p className="text-md text-gray-600 mb-8 max-w-2xl mx-auto">
            Découvrez nos solutions complètes qui s'adaptent à tous vos besoins métier.
            De la gestion simple à la solution enterprise, nous avons ce qu'il vous faut.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" onClick={scrollToPacks} className="px-8">
              Voir les offres
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-5 mx-auto">
            {statistiques.map((stat, index) => (
              <div key={index} className="bg-white p-10 rounded-lg shadow-sm">
                <div className='text-4xl azonix'>
                  <AnimatedCounter value={stat.number} duration={2} />
                </div>
                <div className="text-gray-600 text-sm">{stat.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section des Packs */}
      <section ref={packsSectionRef} className="container mx-auto px-4 scroll-mt-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Choisissez Votre Pack
          </h2>
          <p className="text-md text-gray-600 max-w-2xl mx-auto">
            Des solutions évolutives qui grandissent avec vous.
            Tous nos packs incluent un essai gratuit de 30 jours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {packsExclusifs.map((pack) => (
            <Card
              key={pack.id}
              className={`relative transition-all duration-300 hover:scale-105 hover:shadow-xl ${pack.popular ? 'border-2 border-blue-500 shadow-lg' : 'border'
                }`}
            >
              {pack.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-600 text-white px-4 py-1">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Populaire
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <div className={`w-12 h-12 mx-auto mb-4 rounded-full bg-${pack.color}-100 flex items-center justify-center`}>
                  <pack.icon className={`w-6 h-6 text-${pack.color}-600`} />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">
                  {pack.name}
                </CardTitle>
                <p className="text-gray-600 text-sm mt-2">
                  {pack.description}
                </p>

                <div className="mt-6">
                  <span className="text-4xl font-bold text-gray-900">
                    {pack.price}
                  </span>
                  {pack.period && (
                    <span className="text-gray-600 text-lg">{pack.period}</span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {pack.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {pack.limitations && (
                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium text-gray-500 mb-2">Limitations :</p>
                    <div className="space-y-2">
                      {pack.limitations.map((limitation, index) => (
                        <div key={index} className="flex items-start">
                          <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-3 mt-1.5 flex-shrink-0" />
                          <span className="text-gray-500 text-sm">{limitation}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>

              <CardFooter>
                <Button
                  className="w-full"
                  variant={pack.buttonVariant}
                  size="lg"
                >
                  {pack.buttonText}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Fonctionnalités Premium */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Fonctionnalités Premium
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez toutes les fonctionnalités avancées incluses dans nos packs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {fonctionnalitesPremium.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.features.map((feat, featIndex) => (
                      <li key={featIndex} className="flex items-center text-sm text-gray-700">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <Card className="max-w-full mx-auto bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">
                Prêt à Transformer Votre Business ?
              </h2>
              <p className="text-sm lg:text-xl opacity-90 mb-8 max-w-2xl mx-auto">
                Rejoignez des milliers de professionnels qui font confiance à nos solutions
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="px-8">
                  Commencer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default PacksExclusifs;