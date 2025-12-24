// src/pages/InvestirEtranger.tsx
import {
  BadgeDollarSign,
  Building2,
  CastleIcon,
  ChartArea,
  DollarSignIcon,
  FlagIcon,
  Globe2,
  HandshakeIcon,
  SparkleIcon,
  TreePalm
} from 'lucide-react';
import React, { useState } from 'react';
import Api from '../../lib/api.js';
import DemandeAudit from '../../components/DemandeAudit.tsx';
import AdvertisementPopup from '../AdvertisementPopup.tsx';

interface InvestFormData {
  nom: string;
  email: string;
  telephone: string;
  paysInteret: string;
  typeInvestissement: string;
  budget: string;
  message: string;
}

interface PaysData {
  nom: string;
  avantages: string[];
  opportunites: string[];
  fiscalite: string;
  rendement: string;
  image: JSX.Element;
  couleur: string;
}

interface TypeBienData {
  titre: string;
  description: string;
  avantages: string[];
  couleur: string;
}

const InvestirEtranger = () => {
  const [paysActive, setPaysActive] = useState('maurice');
  const [typeBien, setTypeBien] = useState('vente');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  const [formData, setFormData] = useState<InvestFormData>({
    nom: '',
    email: '',
    telephone: '',
    paysInteret: 'maurice',
    typeInvestissement: 'residentiel',
    budget: '',
    message: ''
  });

  const paysData: Record<string, PaysData> = {
    maurice: {
      nom: 'Île Maurice',
      avantages: [
        'Fiscalité avantageuse (0-15% IR)',
        'Stabilité politique et économique',
        'Cadre de vie exceptionnel',
        'Double imposition évitée avec la France'
      ],
      opportunites: [
        'Résidences de tourisme',
        'Villas haut de gamme',
        'Programmes IRS/RES',
        'Investissement à partir de 500K USD'
      ],
      fiscalite: 'Imposition sur les sociétés: 15%',
      rendement: 'Rendement locatif: 4-7% net',
      image: <TreePalm />,
      // Dégradé basé sur logo / primary
      couleur: 'from-[#556B2F] to-[#6B8E23]'
    },
    madagascar: {
      nom: 'Madagascar',
      avantages: [
        "Prix d'acquisition très attractifs",
        'Fort potentiel de valorisation',
        'Croissance économique soutenue',
        "Main d'œuvre compétitive"
      ],
      opportunites: [
        'Immobilier commercial',
        'Résidences services',
        'Développement hôtelier',
        'Terrains à bâtir'
      ],
      fiscalite: 'Imposition sur les sociétés: 20%',
      rendement: 'Rendement locatif: 8-12% net',
      image: <FlagIcon />,
      couleur: 'from-[#6B8E23] to-[#556B2F]'
    },
    dubai: {
      nom: 'Dubaï',
      avantages: [
        "Absence d'impôt sur le revenu",
        'Sécurité et stabilité',
        'Croissance immobilière constante',
        'Régime de propriété freehold'
      ],
      opportunites: [
        'Appartements de luxe',
        'Villas sur Palm Jumeirah',
        'Commercial (DPI, DMC)',
        'Projets hors plan'
      ],
      fiscalite: '0% impôt sur le revenu',
      rendement: 'Rendement locatif: 5-8% net',
      image: <Building2 />,
      couleur: 'from-[#556B2F] to-[#556B2F]'
    },
    portugal: {
      nom: 'Portugal',
      avantages: [
        'Golden Visa à partir de 500K€',
        'Croissance économique robuste',
        'Qualité de vie exceptionnelle',
        'Régime fiscal NHR avantageux'
      ],
      opportunites: [
        'Appartements Lisbonne/Porto',
        'Résidences de tourisme',
        'Rehabilitation urbaine',
        'Immobilier viticole'
      ],
      fiscalite: 'Régime NHR: 0-20% IR',
      rendement: 'Rendement locatif: 3-5% net',
      image: <CastleIcon />,
      couleur: 'from-[#556B2F] to-[#6B8E23]'
    }
  };

  const typesBiens: Record<string, TypeBienData> = {
    vente: {
      titre: 'Mettre en vente',
      description:
        "Vendez votre bien à l'étranger avec notre réseau d'acheteurs internationaux",
      avantages: [
        'Évaluation gratuite',
        'Visites virtuelles HD',
        "Réseau d'acheteurs qualifiés",
        'Commission optimisée'
      ],
      couleur: 'from-[#556B2F] to-[#6B8E23]'
    },
    location: {
      titre: 'Mettre en location',
      description: 'Gestion locative complète avec garantie de loyers',
      avantages: [
        'Gestion 360° à distance',
        'Garantie loyer impayé',
        'Entretien et maintenance',
        'Reporting mensuel'
      ],
      couleur: 'from-[#6B8E23] to-[#556B2F]'
    },
    gestion: {
      titre: 'Gestion de patrimoine',
      description:
        'Optimisation fiscale et gestion de votre patrimoine international',
      avantages: [
        'Audit patrimonial gratuit',
        'Stratégie fiscale optimisée',
        'Suivi personnalisé',
        'Diversification géographique'
      ],
      couleur: 'from-[#556B2F] to-[#556B2F]'
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.nom || !formData.email || !formData.telephone) {
      setError('Veuillez remplir tous les champs obligatoires');
      setLoading(false);
      return;
    }

    try {
      const response = await Api.post('/investissement/demande', {
        nom: formData.nom,
        email: formData.email,
        telephone: formData.telephone,
        paysInteret: paysActive,
        typeInvestissement: formData.typeInvestissement,
        budget: formData.budget,
        message: formData.message
      });

      if (response.data.success) {
        setFormData({
          nom: '',
          email: '',
          telephone: '',
          paysInteret: 'maurice',
          typeInvestissement: 'residentiel',
          budget: '',
          message: ''
        });

        alert('✅ ' + response.data.message);
      } else {
        throw new Error(response.data.error || 'Erreur inconnue');
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        "Erreur lors de l'envoi de la demande";

      setError(errorMessage);
      alert('❌ Erreur: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const openAuditModal = () => {
    setIsAuditModalOpen(true);
  };

  const closeAuditModal = () => {
    setIsAuditModalOpen(false);
  };

  const handleAddAudit = (audit: any) => {
    // console.log('✅ Audit ajouté avec succès:', audit);
    alert("Votre demande d'audit a été enregistrée avec succès !");
  };

  const paysActuel = paysData[paysActive];
  const bienActuel = typesBiens[typeBien];

  return (
    <div className="min-h-screen  text-[#2a2a2a]">
      {/* Hero Section */}
      <section className="text-white py-16">
        <div className='absolute inset-0 h-64 -z-10 w-full overflow-hidden'>
          <div className='absolute inset-0 w-full h-full backdrop-blur-sm bg-black/50'></div>
          <img src="https://i.pinimg.com/736x/a3/44/d8/a344d8a87a5fcf100d50161769059f48.jpg" className='h-full object-cover w-full' alt="" />
        </div>
        <div className="container mx-auto px-4 mt-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-semibold mb-4  text-gray-100 dark:text-white">
              INVESTISSEMENT
            </h1>
            <p className="text-sm lg:text-md opacity-90 mb-8 max-w-2xl mx-auto">
              Diversifiez votre patrimoine avec nos solutions clés en main
              dans les marchés porteurs à fort potentiel
            </p>
          </div>
        </div>
      </section>
      {/* Navigation Pays */}
      <section className="py-4 bg-[#FFFFFF]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:flex justify-center gap-4">
            {Object.entries(paysData).map(([key, pays]) => (
              <button
                key={key}
                onClick={() => setPaysActive(key)}
                className={`px-6 py-2 flex items-center gap-3 rounded-xl font-semibold transition-all duration-300 transform border ${paysActive === key
                  ? `bg-gradient-to-r ${pays.couleur} text-white shadow-lg border-transparent`
                  : 'bg-[#FFFFFF] text-[#556B2F] border-[#D3D3D3] hover:bg-[#F7F7F7]'
                  }`}
              >
                <div className="text-xl mb-1">{pays.image}</div>
                <span className="text-sm lg:text-base">{pays.nom}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Section Pays Active */}
      <section className="py-6">
        <div className="container mx-auto px-4">
          <div className="bg-[#FFFFFF] border border-[#D3D3D3] p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Informations Pays */}
              <div>
                <div
                  className={`inline-flex items-center text-xs lg:text-md px-3 py-1 rounded-full bg-gradient-to-r ${paysActuel.couleur} text-white font-semibold mb-6`}
                >
                  <span className="text-lg lg:text-2xl mr-2">
                    {paysActuel.image}
                  </span>
                  {paysActuel.nom}
                </div>

                <h2 className="text-xl lg:text-3xl font-bold text-[#2a2a2a] mb-6">
                  Opportunités d&apos;investissement à {paysActuel.nom}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-[#FAFAFA] border border-[#D3D3D3] p-5 rounded-xl">
                    <h3 className="font-bold flex gap-3 text-lg text-[#2a2a2a] mb-2">
                      <ChartArea className="text-[#6B8E23]" /> Fiscalité
                    </h3>
                    <p className="text-[#555555]">{paysActuel.fiscalite}</p>
                  </div>
                  <div className="bg-[#FAFAFA] border border-[#D3D3D3] p-5 rounded-xl">
                    <h3 className="font-bold flex gap-3 text-lg text-[#2a2a2a] mb-2">
                      <BadgeDollarSign className="text-[#6B8E23]" /> Rendement
                    </h3>
                    <p className="text-[#555555]">{paysActuel.rendement}</p>
                  </div>
                </div>

                <div className="mb-8">
                  <h3 className="text-xl font-bold text-[#2a2a2a] mb-3">
                    Avantages clés
                  </h3>
                  <div className="grid gap-3">
                    {paysActuel.avantages.map((avantage, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 rounded-full mr-3 bg-[#6B8E23]" />
                        <span className="text-[#555555]">{avantage}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#2a2a2a] mb-3">
                    Opportunités
                  </h3>
                  <div className="grid gap-3">
                    {paysActuel.opportunites.map((opportunite, index) => (
                      <div key={index} className="flex items-center">
                        <div className="w-2 h-2 rounded-full mr-3 bg-[#556B2F]" />
                        <span className="text-[#555555]">{opportunite}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Formulaire */}
              <div className="bg-gradient-to-br from-[#556B2F] to-[#6B8E23] rounded-2xl p-5 lg:p-8 text-white shadow-lg">
                <h3 className="text-2xl font-bold mb-4">
                  Étude de projet à {paysActuel.nom}
                </h3>
                <p className="text-sm lg:text-base mb-6 text-white/90">
                  Partagez votre projet et recevez une analyse personnalisée de
                  nos équipes spécialisées.
                </p>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        required
                        disabled={loading}
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg focus:ring-2 focus:ring-[#FFFFFF] focus:border-transparent text-white placeholder:text-white/60 disabled:opacity-50"
                        placeholder="Votre nom et prénom"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          disabled={loading}
                          className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg focus:ring-2 focus:ring-[#FFFFFF] focus:border-transparent text-white placeholder:text-white/60 disabled:opacity-50"
                          placeholder="vous@exemple.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold mb-2">
                          Téléphone *
                        </label>
                        <input
                          type="tel"
                          name="telephone"
                          value={formData.telephone}
                          onChange={handleChange}
                          required
                          disabled={loading}
                          className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg focus:ring-2 focus:ring-[#FFFFFF] focus:border-transparent text-white placeholder:text-white/60 disabled:opacity-50"
                          placeholder="+33 6 12 34 56 78"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Type d&apos;investissement
                      </label>
                      <select
                        name="typeInvestissement"
                        value={formData.typeInvestissement}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg focus:ring-2 focus:ring-[#FFFFFF] focus:border-transparent text-white disabled:opacity-50"
                      >
                        <option value="residentiel">Résidentiel</option>
                        <option value="commercial">Commercial</option>
                        <option value="touristique">Touristique</option>
                        <option value="terrain">Terrain</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Budget estimé (€)
                      </label>
                      <select
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        disabled={loading}
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg focus:ring-2 focus:ring-[#FFFFFF] focus:border-transparent text-white disabled:opacity-50"
                      >
                        <option value="">Sélectionnez...</option>
                        <option value="100-300k">100 000 - 300 000 €</option>
                        <option value="300-500k">300 000 - 500 000 €</option>
                        <option value="500k-1M">500 000 - 1 M€</option>
                        <option value="1M+">1 M€ et plus</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-2">
                        Message
                      </label>
                      <textarea
                        name="message"
                        rows={3}
                        value={formData.message}
                        onChange={handleChange}
                        disabled={loading}
                        placeholder="Décrivez votre projet..."
                        className="w-full px-4 py-3 bg-white/10 border border-white/30 rounded-lg focus:ring-2 focus:ring-[#FFFFFF] focus:border-transparent text-white placeholder:text-white/60 disabled:opacity-50"
                      />
                    </div>

                    {error && (
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-sm">
                        <strong>Erreur :</strong> {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className={`w-full bg-[#FFFFFF] text-[#556B2F] hover:bg-[#F3F3F3] font-bold py-3 px-8 rounded-lg transition-all duration-300 transform shadow-md ${loading ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105'
                        }`}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg
                            className="animate-spin h-5 w-5 text-[#556B2F]"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                          </svg>
                          Envoi en cours...
                        </span>
                      ) : (
                        `Recevoir les opportunités ${paysActuel.nom}`
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <AdvertisementPopup />

      {/* Section Vente/Location/Gestion */}
      <section className="py-8 bg-[#FAFAFA] border-t border-[#D3D3D3]">
        <div className="container mx-auto px-4">
          <h2 className="text-xl lg:text-3xl font-bold text-center text-[#2a2a2a] mb-3">
            Vous avez déjà un bien à l&apos;étranger ?
          </h2>
          <p className="text-md lg:text-lg text-center text-[#555555] mb-10 max-w-2xl mx-auto">
            Confiez-nous la gestion, la vente ou l&apos;optimisation de votre patrimoine
            international.
          </p>

          {/* Navigation Services */}
          <div className="lg:flex grid grid-cols-2 flex-wrap justify-center gap-2 lg:gap-4 mb-10">
            {Object.entries(typesBiens).map(([key, service]) => (
              <button
                key={key}
                onClick={() => setTypeBien(key)}
                className={`px-3 lg:px-6 py-3 rounded-xl font-semibold text-sm lg:text-base transition-all duration-300 transform border ${typeBien === key
                  ? `bg-gradient-to-r ${service.couleur} text-white shadow-lg border-transparent`
                  : 'bg-[#FFFFFF] text-[#556B2F] border-[#D3D3D3] hover:bg-[#F7F7F7] shadow-sm'
                  }`}
              >
                {service.titre}
              </button>
            ))}
          </div>

          {/* Contenu Service Actif */}
          <div
            className={`bg-gradient-to-r ${bienActuel.couleur} rounded-2xl p-6 lg:p-8 text-white shadow-lg`}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h3 className="text-2xl lg:text-3xl font-bold mb-3">
                  {bienActuel.titre}
                </h3>
                <p className="text-base lg:text-lg opacity-90 mb-5">
                  {bienActuel.description}
                </p>
                <div className="space-y-3">
                  {bienActuel.avantages.map((avantage, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm">✓</span>
                      </div>
                      <span>{avantage}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={openAuditModal}
                  className="mt-7 bg-[#FFFFFF] text-[#556B2F] hover:bg-[#F3F3F3] font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
                >
                  Demander un audit gratuit
                </button>
              </div>

              <div className="bg-white bg-opacity-10 rounded-xl p-5">
                <h4 className="text-xl font-bold mb-4">Processus simplifié</h4>
                <div className="space-y-4 text-sm lg:text-base">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4 font-bold">
                      1
                    </div>
                    <span>Évaluation gratuite de votre bien</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4 font-bold">
                      2
                    </div>
                    <span>Stratégie personnalisée</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4 font-bold">
                      3
                    </div>
                    <span>Mise en œuvre et suivi</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4 font-bold">
                      4
                    </div>
                    <span>Reporting régulier</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section Réseau International */}
      <section className="py-8 bg-[#FFFFFF]">
        <div className="container mx-auto px-4">
          <h2 className="text-xl lg:text-3xl font-bold text-center text-[#2a2a2a] mb-10">
            Notre réseau international
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-5 flex flex-col items-center border border-[#D3D3D3] rounded-xl">
              <div className="text-3xl mb-3 text-[#556B2F]">
                <Globe2 />
              </div>
              <div className="text-2xl font-bold text-[#6B8E23] mb-1">
                15+
              </div>
              <div className="text-[#555555] text-sm">Pays couverts</div>
            </div>
            <div className="p-5 flex flex-col items-center border border-[#D3D3D3] rounded-xl">
              <div className="text-3xl mb-3 text-[#556B2F]">
                <HandshakeIcon />
              </div>
              <div className="text-2xl font-bold text-[#6B8E23] mb-1">
                50+
              </div>
              <div className="text-[#555555] text-sm">Partenaires locaux</div>
            </div>
            <div className="p-5 flex flex-col items-center border border-[#D3D3D3] rounded-xl">
              <div className="text-3xl mb-3 text-[#556B2F]">
                <DollarSignIcon />
              </div>
              <div className="text-2xl font-bold text-[#6B8E23] mb-1">
                200M€
              </div>
              <div className="text-[#555555] text-sm">Volume transigé</div>
            </div>
            <div className="p-5 flex flex-col items-center border border-[#D3D3D3] rounded-xl">
              <div className="text-3xl mb-3 text-[#556B2F]">
                <SparkleIcon />
              </div>
              <div className="text-2xl font-bold text-[#6B8E23] mb-1">
                98%
              </div>
              <div className="text-[#555555] text-sm">Clients satisfaits</div>
            </div>
          </div>
        </div>
      </section>

      {/* Modale DemandeAudit */}
      <DemandeAudit
        isOpen={isAuditModalOpen}
        onClose={closeAuditModal}
        onAddAudit={handleAddAudit}
      />

      <AdvertisementPopup />
    </div>
  );
};

export default InvestirEtranger;
