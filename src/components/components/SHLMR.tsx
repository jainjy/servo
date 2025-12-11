import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    Home,
    Shield,
    BadgeCheck,
    MapPin,
    Bed,
    Bath,
    Square,
    Car,
    Heart,
    Eye,
    Calendar,
    Euro,
    Target,
    FileText,
    CheckCircle2,
    Landmark,
    Loader,
    AlertTriangle,
    ArrowRight
} from 'lucide-react';
import api from "../../lib/api";
import { useAuth } from "../../hooks/useAuth";
import { toast } from "../../hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { ModalDemandeVisite } from '@/components/ModalDemandeVisite';
import { Card } from "@/components/ui/card"; 
import { Ruler } from "lucide-react";

// Couleurs fournies
const COLORS = {
  logo: "#556B2F",
  "primary-dark": "#6B8E23",
  "light-bg": "#FFFFFF",
  "separator": "#D3D3D3",
  "secondary-text": "#000000",
};

gsap.registerPlugin(ScrollTrigger);

// Types TypeScript
interface Caracteristiques {
    chambres: number;
    sdb: number;
    surface: string;
    parking: number;
    annee: number;
    etage: number;
    balcon: boolean;
    cave: boolean;
}

interface Logement {
    id: number;
    image: string;
    type: string;
    categorie: string;
    prix: string;
    titre: string;
    lieu: string;
    description: string;
    caracteristiques: Caracteristiques;
    promoteur: string;
    dateDispo: string;
    vues: number;
    favori: boolean;
    address?: string;
    energyClass?: string;
    isPSLA?: boolean;
    images?: string[];
    city?: string;
    bedrooms?: number;
    bathrooms?: number;
    surface?: number;
    price?: number;
    rooms?: number;
}

const LogementsSHLMR = () => {
    const [activeTab, setActiveTab] = useState('logements');
    const [favoris, setFavoris] = useState<number[]>([]);
    const [sentRequests, setSentRequests] = useState<Record<string, boolean>>({});
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedProperty, setSelectedProperty] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [logements, setLogements] = useState<Logement[]>([]);
    
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Refs pour animations
    const heroRef = React.useRef(null);
    const statsRef = React.useRef(null);
    const advantagesRef = React.useRef(null);
    const dispositifsRef = React.useRef(null);
    const propertiesRef = React.useRef([]);

    const mapPropertyTypeToCategory = (type) => {
      const typeMap = {
        house: "maison",
        apartment: "appartement",
        villa: "villa",
        studio: "appartement",
      };
      return typeMap[type] || "maison";
    };

    // Initialisation des animations GSAP
    useEffect(() => {
        // Animation des statistiques
        if (statsRef.current) {
            gsap.from(statsRef.current.children, {
                scrollTrigger: {
                    trigger: statsRef.current,
                    start: "top 80%",
                    toggleActions: "play none none reverse",
                },
                y: 50,
                opacity: 0,
                stagger: 0.2,
                duration: 0.8,
                ease: "power2.out",
            });
        }

        // Animation des avantages
        if (advantagesRef.current) {
            gsap.from(advantagesRef.current.children, {
                scrollTrigger: {
                    trigger: advantagesRef.current,
                    start: "top 70%",
                    toggleActions: "play none none reverse",
                },
                y: 40,
                opacity: 0,
                stagger: 0.15,
                duration: 0.7,
                ease: "back.out(1.7)",
            });
        }

        // Animation des dispositifs
        if (dispositifsRef.current) {
            gsap.from(dispositifsRef.current.children, {
                scrollTrigger: {
                    trigger: dispositifsRef.current,
                    start: "top 75%",
                    toggleActions: "play none none reverse",
                },
                x: -30,
                opacity: 0,
                stagger: 0.1,
                duration: 0.6,
                ease: "power2.out",
            });
        }

        // Animation des propriétés
        propertiesRef.current.forEach((card, index) => {
            if (card) {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                        toggleActions: "play none none reverse",
                    },
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    delay: index * 0.1,
                    ease: "power2.out",
                });
            }
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, [logements]);

    const fetchSHLMRProperties = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await api.get("/properties/shlmr");
            console.log("Réponse API SHLMR:", response.data);

            if (response.data.success) {
                const transformedProperties = response.data.data.map((property) => ({
                    id: property.id,
                    image: property.images?.[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400",
                    type: property.listingType === "rent" ? "location" : "achat",
                    categorie: mapPropertyTypeToCategory(property.type),
                    prix: property.listingType === "rent" 
                        ? `${property.price?.toLocaleString("fr-FR")} €/mois`
                        : `${property.price?.toLocaleString("fr-FR")} €`,
                    titre: property.title,
                    lieu: `${property.city}${property.zipCode ? `, ${property.zipCode}` : ""}`,
                    description: property.description || "Logement SHLMR disponible",
                    caracteristiques: {
                        chambres: property.bedrooms || 0,
                        sdb: property.bathrooms || 0,
                        surface: `${property.surface || 0} m²`,
                        parking: 0,
                        annee: new Date().getFullYear(),
                        etage: 0,
                        balcon: true,
                        cave: false
                    },
                    promoteur: property.owner ? `${property.owner.firstName} ${property.owner.lastName}` : "Propriétaire SHLMR",
                    dateDispo: new Date().toISOString().split('T')[0],
                    vues: property.views || 0,
                    favori: false,
                    energyClass: property.energyClass,
                    address: property.address,
                    isSHLMR: property.isSHLMR,
                    images: property.images || [],
                    city: property.city,
                    bedrooms: property.bedrooms,
                    bathrooms: property.bathrooms,
                    surface: property.surface,
                    price: property.price,
                    rooms: property.rooms
                }));

                setLogements(transformedProperties);
            }
        } catch (err) {
            console.error("Error fetching SHLMR properties:", err);
            setError("Erreur lors du chargement des propriétés SHLMR");
        } finally {
            setLoading(false);
        }
    };

    const dispositifs = [
        {
            nom: "SHLMR",
            description: "Sociétés d'Habitation à Loyer Modéré de Réinsertion",
            loyerMax: "Loyers encadrés par l'État",
            public: "Ménages en réinsertion et situations spécifiques",
            financement: "État + Collectivités locales",
            icon: <Home className="w-6 h-6" />
        }
    ];

    const avantages = [
        {
            icon: <Euro className="w-8 h-8" />,
            titre: "Loyers encadrés",
            description: "Des loyers inférieurs de 20 à 50% au marché libre, spécifiques au SHLMR"
        },
        {
            icon: <Shield className="w-8 h-8" />,
            titre: "Sécurité locative",
            description: "Contrats stables avec des garanties pour locataires et bailleurs"
        },
        {
            icon: <Target className="w-8 h-8" />,
            titre: "Public ciblé",
            description: "Accès réservé aux ménages éligibles selon des plafonds de ressources"
        },
        {
            icon: <Landmark className="w-8 h-8" />,
            titre: "Aides financières",
            description: "Éligibilité aux APL et autres aides au logement"
        }
    ];

    const conditionsEligibilite = [
        {
            critere: "Ressources mensuelles",
            details: "Plafonds variables selon composition familiale et zone géographique"
        },
        {
            critere: "Situation professionnelle",
            details: "CDI, CDD, fonctionnaire, indépendant, retraité, étudiant..."
        },
        {
            critere: "Résidence principale",
            details: "Destiné exclusivement à la résidence principale"
        },
        {
            critere: "Ancienneté dans la région",
            details: "Variable selon les dispositifs et collectivités"
        }
    ];

    const stats = [
        {
            valeur: "-40%",
            label: "Économie moyenne de loyer",
            description: "Par rapport au marché libre"
        },
        {
            valeur: "6-18 mois",
            label: "Durée moyenne d'attente",
            description: "Selon la zone géographique"
        },
        {
            valeur: "90%",
            label: "Taux de satisfaction",
            description: "Des locataires en logement SHLMR"
        },
        {
            valeur: "10K+",
            label: "Logements SHLMR",
            description: "Disponibles en France"
        }
    ];

    useEffect(() => {
        fetchSHLMRProperties();
    }, []);

    const toggleFavori = (id: number) => {
        setFavoris(prev =>
            prev.includes(id)
                ? prev.filter(favId => favId !== id)
                : [...prev, id]
        );
    };

    const handlePostuler = (logement: Logement) => {
        if (sentRequests?.[logement.id]) {
            toast({
                title: "Visite déjà demandée",
                description: "Vous avez déjà demandé une visite pour ce logement.",
            });
            return;
        }
        
        const propertyForModal = {
            id: String(logement.id),
            title: logement.titre,
            description: logement.description,
            address: logement.lieu,
            city: logement.city || logement.lieu,
            images: logement.images || [logement.image],
            price: logement.price || 0,
            surface: logement.surface || 0,
            bedrooms: logement.caracteristiques?.chambres || 0,
            bathrooms: logement.caracteristiques?.sdb || 0,
            type: logement.type,
            listingType: "rent",
            owner: {
                firstName: logement.promoteur?.split(' ')[0] || "Propriétaire",
                lastName: logement.promoteur?.split(' ')[1] || "SHLMR",
                email: "contact@shlmr.fr",
                phone: "01 23 45 67 89"
            }
        };
        
        setSelectedProperty(propertyForModal);
        setModalOpen(true);
    };

    const handleVoirDetails = (property: any, e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/immobilier/${property.id}`);
    };

    const handleDemandeSuccess = (propertyId: string) => {
        setSentRequests(prev => ({ 
            ...prev, 
            [parseInt(propertyId)]: true 
        }));
    };

    if (loading) {
        return (
            <div style={{ backgroundColor: COLORS["light-bg"] }} className="min-h-screen py-8 mt-16 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <Loader className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: COLORS.logo }} />
                    <p className="text-gray-600">Chargement des logements SHLMR...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" style={{ backgroundColor: COLORS["light-bg"] }}>
            {/* Hero Section avec image */}
            <motion.section 
                ref={heroRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="relative pt-24 overflow-hidden"
            >
                {/* Image de fond avec overlay */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" 
                        alt="Logements SHLMR"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>
                </div>

                {/* Contenu */}
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.h1 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6"
                        >
                            Logements SHLMR
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4, duration: 0.6 }}
                            className="text-sm lg:text-md text-white mb-8 max-w-2xl mx-auto leading-relaxed"
                        >
                            Découvrez les logements SHLMR (Sociétés d'Habitation à Loyer Modéré de Réinsertion) 
                            pour un parcours résidentiel sécurisé avec des loyers encadrés
                        </motion.p>
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-4 mb-4 max-w-2xl mx-auto"
                            >
                                <p className="text-white text-sm">
                                    ⚠️ {error}
                                </p>
                            </motion.div>
                        )}
                    </div>
                </div>
            </motion.section>

            {/* Navigation par onglets */}
            <section className="py-8 -mt-10 relative z-20">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-2">
                        {[
                            { id: 'logements', label: 'Logements', icon: <Home className="w-4 h-4" /> },
                            { id: 'avantages', label: 'Avantages', icon: <BadgeCheck className="w-4 h-4" /> },
                            { id: 'dispositifs', label: 'Dispositifs', icon: <FileText className="w-4 h-4" /> }
                        ].map((tab) => (
                            <motion.button
                                key={tab.id}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${activeTab === tab.id
                                    ? 'text-white shadow-lg'
                                    : 'text-gray-700 hover:bg-opacity-10 bg-white/80 backdrop-blur-sm'
                                    }`}
                                style={activeTab === tab.id ? 
                                    { 
                                        backgroundColor: COLORS.logo,
                                        borderColor: COLORS.logo
                                    } : 
                                    { 
                                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                        border: `1px solid ${COLORS.separator}`,
                                        color: COLORS["secondary-text"]
                                    }
                                }
                            >
                                {tab.icon}
                                {tab.label}
                            </motion.button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section Avantages */}
            <AnimatePresence mode="wait">
                {activeTab === 'avantages' && (
                    <motion.section 
                        key="avantages"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="py-2"
                        style={{ backgroundColor: COLORS["light-bg"] }}
                    >
                        <div className="container mx-auto px-4">
                            <h2 className="lg:text-2xl text-lg font-bold text-center mb-16"
                                style={{ color: COLORS["secondary-text"] }}>
                                Les avantages du logement SHLMR
                            </h2>

                            <div ref={advantagesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                                {avantages.map((avantage, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                        className="p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border"
                                        style={{ 
                                            backgroundColor: COLORS["light-bg"],
                                            borderColor: COLORS.separator
                                        }}
                                    >
                                        <div className="p-3 rounded-lg inline-flex mb-4"
                                             style={{ backgroundColor: `${COLORS.logo}15` }}>
                                            {React.cloneElement(avantage.icon, { 
                                                style: { color: COLORS.logo } 
                                            })}
                                        </div>
                                        <h3 className="text-xl font-bold mb-4"
                                            style={{ color: COLORS["secondary-text"] }}>
                                            {avantage.titre}
                                        </h3>
                                        <p className="leading-relaxed"
                                           style={{ color: COLORS["secondary-text"] }}>
                                            {avantage.description}
                                        </p>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Statistiques */}
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8 }}
                                className="rounded-2xl p-12 text-white"
                                style={{ 
                                    backgroundImage: 'linear-gradient(135deg, #556B2F 0%, #6B8E23 100%)'
                                }}
                            >
                                <h3 className="text-3xl font-bold text-center mb-12">
                                    Chiffres clés du logement SHLMR
                                </h3>
                                <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                                    {stats.map((stat, index) => (
                                        <motion.div 
                                            key={index}
                                            whileHover={{ scale: 1.05 }}
                                            className="text-center"
                                        >
                                            <div className="text-4xl font-bold mb-2"
                                                 style={{ color: '#FFFFFF' }}>
                                                {stat.valeur}
                                            </div>
                                            <div className="text-lg font-semibold mb-2">
                                                {stat.label}
                                            </div>
                                            <div className="text-sm opacity-90">
                                                {stat.description}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>

            {/* Section Dispositifs */}
            <AnimatePresence mode="wait">
                {activeTab === 'dispositifs' && (
                    <motion.section 
                        key="dispositifs"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="py-2"
                        style={{ backgroundColor: `${COLORS.logo}05` }}
                    >
                        <div className="container mx-auto px-4">
                            <h2 className="text-4xl font-bold text-center mb-16"
                                style={{ color: COLORS["secondary-text"] }}>
                                Le dispositif SHLMR
                            </h2>

                            <div className="max-w-2xl mx-auto mb-16">
                                {dispositifs.map((dispositif, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ scale: 1.02 }}
                                        className="rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300 border"
                                        style={{ 
                                            backgroundColor: COLORS["light-bg"],
                                            borderColor: COLORS.separator
                                        }}
                                    >
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="p-3 rounded-lg"
                                                 style={{ backgroundColor: `${COLORS.logo}15` }}>
                                                {React.cloneElement(dispositif.icon, { 
                                                    style: { color: COLORS.logo } 
                                                })}
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-bold"
                                                    style={{ color: COLORS["secondary-text"] }}>
                                                    {dispositif.nom}
                                                </h3>
                                                <p style={{ color: COLORS["secondary-text"] }}>{dispositif.description}</p>
                                            </div>
                                        </div>

                                        <div ref={dispositifsRef} className="space-y-3 text-sm">
                                            <div className="flex justify-between">
                                                <span className="font-semibold"
                                                      style={{ color: COLORS["secondary-text"] }}>Loyer max:</span>
                                                <span style={{ color: COLORS["secondary-text"] }}>{dispositif.loyerMax}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-semibold"
                                                      style={{ color: COLORS["secondary-text"] }}>Public:</span>
                                                <span style={{ color: COLORS["secondary-text"] }}>{dispositif.public}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="font-semibold"
                                                      style={{ color: COLORS["secondary-text"] }}>Financement:</span>
                                                <span style={{ color: COLORS["secondary-text"] }}>{dispositif.financement}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            {/* Conditions d'éligibilité */}
                            <div className="rounded-2xl shadow-lg p-8 border"
                                 style={{ 
                                     backgroundColor: COLORS["light-bg"],
                                     borderColor: COLORS.separator
                                 }}>
                                <h3 className="text-2xl font-bold mb-8 flex items-center"
                                    style={{ color: COLORS["secondary-text"] }}>
                                    <CheckCircle2 className="w-6 h-6 mr-3" style={{ color: COLORS.logo }} />
                                    Conditions d'éligibilité principales
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {conditionsEligibilite.map((condition, index) => (
                                        <motion.div 
                                            key={index}
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                            className="flex items-start gap-4 p-4 rounded-lg"
                                            style={{ backgroundColor: `${COLORS.logo}10` }}
                                        >
                                            <div className="p-2 rounded-full mt-1"
                                                 style={{ backgroundColor: COLORS.logo }}>
                                                <CheckCircle2 className="w-4 h-4 text-white" />
                                            </div>
                                            <div>
                                                <h4 className="font-semibold mb-1"
                                                    style={{ color: COLORS["secondary-text"] }}>
                                                    {condition.critere}
                                                </h4>
                                                <p className="text-sm"
                                                   style={{ color: COLORS["secondary-text"] }}>
                                                    {condition.details}
                                                </p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>

            {/* Section Logements */}
            <AnimatePresence mode="wait">
                {activeTab === 'logements' && (
                    <motion.section 
                        key="logements"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="py-2"
                        style={{ backgroundColor: COLORS["light-bg"] }}
                    >
                        <div className="container mx-auto px-4">
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="border rounded-lg p-4 mb-8 text-center"
                                    style={{ 
                                        backgroundColor: `${COLORS.logo}10`,
                                        borderColor: COLORS.logo
                                    }}
                                >
                                    <AlertTriangle className="w-6 h-6 inline mr-2" style={{ color: COLORS.logo }} />
                                    <span style={{ color: COLORS["secondary-text"] }}>{error}</span>
                                </motion.div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {logements.map((logement, index) => {
                                    const isDejaPostule = sentRequests?.[logement.id];
                                    
                                    return (
                                        <motion.div
                                            key={logement.id}
                                            ref={el => propertiesRef.current[index] = el}
                                            whileHover={{ y: -8, transition: { duration: 0.2 } }}
                                            className="overflow-hidden hover:shadow-2xl transition-all duration-300 bg-white rounded-2xl group cursor-pointer"
                                            style={{ borderColor: COLORS.separator }}
                                        >
                                            {/* Image avec badges */}
                                            <div className="relative">
                                                <div className="relative h-48 w-11/12 rounded-lg mx-3 shadow-lg my-2 overflow-hidden">
                                                    <img
                                                        src={logement.image}
                                                        alt={logement.titre}
                                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    />

                                                    {/* Badges superposés */}
                                                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold"
                                                         style={{ color: COLORS.logo }}>
                                                        SHLMR
                                                    </div>

                                                    {/* Badge prix */}
                                                    <div className="absolute top-3 right-3 backdrop-blur-sm rounded-full px-3 py-1 text-xs font-semibold"
                                                         style={{ backgroundColor: `${COLORS.logo}20`, color: COLORS.logo }}>
                                                        {logement.prix}
                                                    </div>

                                                    {/* Badge classe énergie */}
                                                    {logement.energyClass && (
                                                        <div className="absolute bottom-3 left-3">
                                                            <span
                                                                className={`px-2 py-1 rounded text-xs font-semibold ${
                                                                    logement.energyClass === "A"
                                                                        ? "bg-green-500 text-white"
                                                                        : logement.energyClass === "B"
                                                                        ? "bg-lime-500 text-white"
                                                                        : logement.energyClass === "C"
                                                                        ? "bg-yellow-500 text-white"
                                                                        : "bg-gray-500 text-white"
                                                                }`}
                                                            >
                                                                Classe {logement.energyClass}
                                                            </span>
                                                        </div>
                                                    )}

                                                    {/* Bouton favori */}
                                                    <motion.button
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            toggleFavori(logement.id);
                                                        }}
                                                        className={`absolute bottom-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                                                            favoris.includes(logement.id)
                                                                ? 'bg-red-500 text-white'
                                                                : 'bg-white bg-opacity-90 text-gray-700 hover:bg-red-500 hover:text-white'
                                                        }`}
                                                    >
                                                        <Heart className="w-4 h-4" fill={favoris.includes(logement.id) ? "currentColor" : "none"} />
                                                    </motion.button>
                                                </div>
                                            </div>

                                            {/* Contenu de la carte */}
                                            <div className="p-4">
                                                <h3 className="font-semibold text-sm line-clamp-2 leading-tight mb-2"
                                                    style={{ color: COLORS["secondary-text"] }}>
                                                    {logement.titre}
                                                </h3>

                                                {/* Localisation */}
                                                <div className="flex items-center text-xs mb-3"
                                                     style={{ color: COLORS["secondary-text"] }}>
                                                    <MapPin className="h-3 w-3 mr-1" />
                                                    {logement.lieu}
                                                </div>

                                                <p className="text-sm mb-4 line-clamp-2"
                                                   style={{ color: COLORS["secondary-text"] }}>
                                                    {logement.description}
                                                </p>

                                                {/* Caractéristiques */}
                                                <div className="flex items-center gap-4 text-xs mb-3"
                                                     style={{ color: COLORS["secondary-text"] }}>
                                                    {logement.surface && (
                                                        <div className="flex items-center gap-2">
                                                            <Ruler className="h-3 w-3" style={{ color: COLORS.logo }} />
                                                            <span className="font-medium">{logement.surface} m²</span>
                                                        </div>
                                                    )}
                                                    {logement.bedrooms && (
                                                        <div className="flex items-center gap-2">
                                                            <Bed className="h-3 w-3" style={{ color: COLORS.logo }} />
                                                            <span className="font-medium">{logement.bedrooms} ch.</span>
                                                        </div>
                                                    )}
                                                    {logement.bathrooms && (
                                                        <div className="flex items-center gap-2">
                                                            <Bath className="h-3 w-3" style={{ color: COLORS.logo }} />
                                                            <span className="font-medium">{logement.bathrooms} sdb</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Features */}
                                                <div className="flex flex-wrap gap-1 mb-3">
                                                    {/* Badge Achat/Location */}
                                                    {logement.type && (
                                                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                                                            logement.type === "location" 
                                                                ? "bg-green-50 text-green-700" 
                                                                : "bg-blue-50 text-blue-700"
                                                        }`}>
                                                            <div className={`w-1 h-1 rounded-full ${
                                                                logement.type === "location" 
                                                                    ? "bg-green-600" 
                                                                    : "bg-blue-600"
                                                            }`} />
                                                            {logement.type === "location" ? "Location" : "À vendre"}
                                                        </span>
                                                    )}
                                                    {logement.categorie && (
                                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                                                              style={{ backgroundColor: `${COLORS.logo}15`, color: COLORS.logo }}>
                                                            <div className="w-1 h-1 rounded-full" style={{ backgroundColor: COLORS.logo }} />
                                                            {logement.categorie}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Informations supplémentaires */}
                                                <div className="flex justify-between items-center pt-4 text-sm"
                                                     style={{ color: COLORS["secondary-text"] }}>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" style={{ color: COLORS.logo }} />
                                                        <span>Dispo: {new Date(logement.dateDispo).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Eye className="w-4 h-4" style={{ color: COLORS.logo }} />
                                                        <span>{logement.vues} vues</span>
                                                    </div>
                                                </div>

                                                {/* Boutons d'action */}
                                                <div className="flex gap-2 mt-4">
                                                    <motion.button
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handlePostuler(logement);
                                                        }}
                                                        disabled={isDejaPostule}
                                                        className="flex-1 text-white px-4 py-2 rounded-lg font-semibold transition disabled:opacity-60"
                                                        style={{ 
                                                            backgroundColor: isDejaPostule ? `${COLORS.logo}60` : COLORS.logo,
                                                            borderColor: COLORS.logo
                                                        }}
                                                    >
                                                        {isDejaPostule ? "Visite déjà demandée" : "Demander une visite"}
                                                    </motion.button>
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={(e) => handleVoirDetails(logement, e)}
                                                        className="p-2 rounded-md transition"
                                                        style={{ 
                                                            border: `1px solid ${COLORS.separator}`,
                                                            color: COLORS.logo
                                                        }}
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>

                            {/* Message si aucun résultat */}
                            {logements.length === 0 && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-center py-12"
                                >
                                    <Home className="w-16 h-16 mx-auto mb-4" style={{ color: COLORS.separator }} />
                                    <h3 className="text-xl font-semibold mb-2"
                                        style={{ color: COLORS["secondary-text"] }}>
                                        Aucun logement SHLMR disponible
                                    </h3>
                                    <p style={{ color: COLORS["secondary-text"] }}>
                                        Aucun logement SHLMR ne correspond à vos critères pour le moment.
                                    </p>
                                </motion.div>
                            )}
                        </div>
                    </motion.section>
                )}
            </AnimatePresence>

            <ModalDemandeVisite
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                property={selectedProperty}
                onSuccess={handleDemandeSuccess}
                isAlreadySent={selectedProperty ? !!sentRequests?.[parseInt(selectedProperty.id)] : false}
            />
        </div>
    );
};

export default LogementsSHLMR;