import React, { useState, useEffect, useCallback } from 'react';
import {
    Home,
    Shield,
    TrendingUp,
    Calculator,
    Users,
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
    Clock,
    CheckCircle2,
    Building,
    Landmark,
    X,
    User,
    Mail,
    Phone,
    Loader,
    AlertTriangle,
    ArrowRight
} from 'lucide-react';
import { useAuth } from "../../hooks/useAuth";
import { toast } from "../../hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { createDemande, getDemandesByUser, initDemoData } from "@/lib/demandeStorage";

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
}

interface FormDataModal {
    nomPrenom: string;
    email: string;
    telephone: string;
    message: string;
    dateSouhaitee: string;
    heureSouhaitee: string;
}

interface FormDataSimulation {
    nom: string;
    email: string;
    telephone: string;
    situation: string;
    revenus: string;
    composition: string;
    localisation: string;
    budget: string;
}

// Composant Modal pour la demande de visite
const ModalPostuler = ({ 
    open, 
    onClose, 
    logement,
    onSuccess,
    isAlreadySent
}: { 
    open: boolean; 
    onClose: () => void; 
    logement: Logement | null;
    onSuccess?: (logementId: number) => void;
    isAlreadySent?: boolean;
}) => {
    const [formData, setFormData] = useState<FormDataModal>({
        nomPrenom: "",
        email: "",
        telephone: "",
        message: "",
        dateSouhaitee: "",
        heureSouhaitee: "",
    });
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const { user, isAuthenticated } = useAuth();

    // Réinitialiser le formulaire quand le modal se ferme
    useEffect(() => {
        if (!open) {
            setFormData({
                nomPrenom: "",
                email: "",
                telephone: "",
                message: "",
                dateSouhaitee: "",
                heureSouhaitee: "",
            });
        } else if (user && user.firstName) {
            // Pré-remplir avec les données de l'utilisateur s'il existe
            setFormData(prev => ({
                ...prev,
                nomPrenom: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
                email: user.email || "",
                telephone: user.phone || "",
            }));
        }
    }, [open, user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!logement) return;

        if (isAlreadySent) {
            toast({
                title: "Demande déjà envoyée",
                description: "Vous avez déjà envoyé une demande pour ce logement.",
            });
            return;
        }

        if (!isAuthenticated || !user) {
            toast({
                title: "Connexion requise",
                description: "Veuillez vous connecter pour postuler à ce logement.",
            });
            return;
        }

        setLoadingSubmit(true);
        try {
            // Préparer les données pour le stockage local
            const nameParts = String(formData.nomPrenom || "")
                .trim()
                .split(/\s+/)
                .filter(Boolean);
            const contactPrenom = nameParts.length > 0 ? nameParts[0] : "";
            const contactNom = nameParts.length > 1 ? nameParts.slice(1).join(" ") : nameParts[0] || "";

            const demandeData = {
                serviceId: '10', // Service fixe pour démo
                createdById: user.id,
                propertyId: String(logement.id),
                contactNom,
                contactPrenom,
                contactEmail: formData.email,
                contactTel: formData.telephone,
                description: `Postulation pour logement intermédiaire: ${logement.titre} (${logement.id}). ${formData.message || ''}`,
                lieuAdresse: logement.lieu,
                dateSouhaitee: formData.dateSouhaitee,
                heureSouhaitee: formData.heureSouhaitee,
                statut: "en attente" as const,
                nombreArtisans: 0,
                optionAssurance: false,
                property: {
                    id: logement.id,
                    title: logement.titre,
                    address: logement.lieu,
                    images: [logement.image]
                }
            };

            console.log('🔄 Création demande locale:', demandeData);

            // Utiliser le stockage local au lieu de l'API
            const nouvelleDemande = createDemande(demandeData);
            
            console.log('✅ Demande créée localement:', nouvelleDemande);

            // Émettre l'événement pour recharger les listes
            window.dispatchEvent(new CustomEvent('demande:created'));
            
            onSuccess?.(logement.id);
            toast({
                title: "Succès",
                description: "Votre candidature a été envoyée avec succès !",
                variant: "default"
            });
            onClose();
            
        } catch (error: any) {
            console.error('❌ Erreur création demande:', error);
            
            toast({
                title: "Erreur",
                description: "Une erreur est survenue lors de la création de la demande.",
                variant: "destructive"
            });
        } finally {
            setLoadingSubmit(false);
        }
    };

    const handleChange = useCallback((
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
                {/* En-tête du modal */}
                <div className="bg-blue-600 px-6 py-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-white text-xl font-bold">
                                Postuler pour ce logement
                            </h2>
                            <p className="text-white/80 text-sm mt-1">
                                {logement?.titre} - {logement?.type}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-white hover:bg-white hover:bg-opacity-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Contenu scrollable */}
                <div className="overflow-y-auto max-h-[calc(90vh-200px)] p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Informations de contact */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <User className="w-5 h-5 text-gray-700" />
                                <span className="text-gray-700 font-medium">
                                    Vos coordonnées
                                </span>
                            </div>

                            <div className="space-y-3">
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        name="nomPrenom"
                                        value={formData.nomPrenom}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Nom et Prénom"
                                    />
                                </div>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Adresse email"
                                    />
                                </div>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        name="telephone"
                                        type="tel"
                                        value={formData.telephone}
                                        onChange={handleChange}
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                        placeholder="Téléphone"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Date et heure souhaitées */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-600" />
                                <span className="text-gray-700 font-medium">
                                    Disponibilités pour une visite
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                    <input
                                        name="dateSouhaitee"
                                        type="date"
                                        value={formData.dateSouhaitee}
                                        onChange={handleChange}
                                        min={new Date().toISOString().split("T")[0]}
                                        required
                                        className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 z-10" />
                                        <select
                                            name="heureSouhaitee"
                                            value={formData.heureSouhaitee}
                                            onChange={handleChange}
                                            required
                                            className="w-full bg-gray-50 border border-gray-200 pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 appearance-none hover:bg-white"
                                        >
                                            <option value="">Sélectionnez un créneau</option>
                                            <option value="08:00">Matin : 08h00</option>
                                            <option value="10:00">Matin : 10h00</option>
                                            <option value="14:00">Après-midi : 14h00</option>
                                            <option value="16:00">Après-midi : 16h00</option>
                                            <option value="18:00">Soir : 18h00</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Message */}
                        <div className="space-y-3">
                            <label className="block text-gray-700 font-medium text-sm">
                                Message complémentaire (optionnel)
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl h-24 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                placeholder="Précisez votre situation, vos motivations ou toute information complémentaire..."
                            />
                        </div>
                    </form>
                </div>

                {/* Boutons d'action */}
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 bg-white text-gray-700 border border-gray-300 px-6 py-3 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 flex items-center justify-center gap-2"
                        >
                            <X className="w-4 h-4" />
                            Annuler
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={loadingSubmit || !!isAlreadySent}
                            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 disabled:opacity-60"
                        >
                            <FileText className="w-4 h-4" />
                            {loadingSubmit 
                                ? "Envoi en cours..." 
                                : isAlreadySent 
                                ? "Déjà postulé" 
                                : "Envoyer ma candidature"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const LogementsIntermediaires = () => {
    const [activeTab, setActiveTab] = useState('avantages');
    const [favoris, setFavoris] = useState<number[]>([]);
    const [sentRequests, setSentRequests] = useState<Record<string, boolean>>({});
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedLogement, setSelectedLogement] = useState<Logement | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [logements, setLogements] = useState<Logement[]>([]);
    
    const [formData, setFormData] = useState<FormDataSimulation>({
        nom: '',
        email: '',
        telephone: '',
        situation: '',
        revenus: '',
        composition: '',
        localisation: '',
        budget: ''
    });

    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Sample data as fallback - données d'exemple complètes
    const getSampleLogementsData = (): Logement[] => [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400",
            type: "PLUS",
            categorie: "appartement",
            prix: "1 200 €",
            titre: "Appartement T3 Neuf - Éco-quartier",
            lieu: "Lyon, 69007",
            description: "Appartement BBC avec terrasse, proche transports et commodités. Éligible Prêt Social Locatif Accessible.",
            caracteristiques: {
                chambres: 2,
                sdb: 1,
                surface: "65 m²",
                parking: 1,
                annee: 2024,
                etage: 3,
                balcon: true,
                cave: true
            },
            promoteur: "Nexity",
            dateDispo: "2024-09-01",
            vues: 89,
            favori: false,
            energyClass: "A"
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400",
            type: "PLAI",
            categorie: "appartement",
            prix: "850 €",
            titre: "Résidence sociale - T4 Familial",
            lieu: "Marseille, 13015",
            description: "Logement social familial avec jardin partagé. Accessible aux ménages modestes.",
            caracteristiques: {
                chambres: 3,
                sdb: 2,
                surface: "78 m²",
                parking: 0,
                annee: 2023,
                etage: 1,
                balcon: true,
                cave: false
            },
            promoteur: "Action Logement",
            dateDispo: "2024-08-15",
            vues: 124,
            favori: true,
            energyClass: "B"
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=400",
            type: "PLS",
            categorie: "appartement",
            prix: "1 450 €",
            titre: "Appartement standing - Quartier durable",
            lieu: "Bordeaux, 33000",
            description: "Appartement intermédiaire avec services. Proche du centre-ville et des écoles.",
            caracteristiques: {
                chambres: 3,
                sdb: 2,
                surface: "75 m²",
                parking: 1,
                annee: 2024,
                etage: 2,
                balcon: true,
                cave: true
            },
            promoteur: "Bouygues Immobilier",
            dateDispo: "2024-10-01",
            vues: 67,
            favori: false,
            energyClass: "A"
        },
        {
            id: 4,
            image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400",
            type: "PSLA",
            categorie: "maison",
            prix: "1 100 €",
            titre: "Maison T4 - Zone pavillonnaire",
            lieu: "Toulouse, 31000",
            description: "Maison individuelle avec jardin, idéale pour les familles. Dispositif PSLA.",
            caracteristiques: {
                chambres: 3,
                sdb: 2,
                surface: "95 m²",
                parking: 2,
                annee: 2022,
                etage: 0,
                balcon: false,
                cave: true
            },
            promoteur: "Kaufman & Broad",
            dateDispo: "2024-07-01",
            vues: 156,
            favori: false,
            energyClass: "C"
        },
        {
            id: 5,
            image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400",
            type: "PLUS",
            categorie: "appartement",
            prix: "980 €",
            titre: "Studio étudiant - Proche université",
            lieu: "Lille, 59000",
            description: "Studio meublé parfait pour étudiant. Quartier animé et bien desservi.",
            caracteristiques: {
                chambres: 1,
                sdb: 1,
                surface: "25 m²",
                parking: 0,
                annee: 2023,
                etage: 2,
                balcon: true,
                cave: false
            },
            promoteur: "Résidence Campus",
            dateDispo: "2024-08-20",
            vues: 203,
            favori: true,
            energyClass: "A"
        },
        {
            id: 6,
            image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=400",
            type: "PLS",
            categorie: "appartement",
            prix: "1 350 €",
            titre: "Duplex moderne - Centre-ville",
            lieu: "Nantes, 44000",
            description: "Duplex lumineux avec mezzanine. Standing haut de gamme.",
            caracteristiques: {
                chambres: 2,
                sdb: 1,
                surface: "55 m²",
                parking: 1,
                annee: 2024,
                etage: 4,
                balcon: true,
                cave: true
            },
            promoteur: "Groupe Cardinal",
            dateDispo: "2024-09-15",
            vues: 78,
            favori: false,
            energyClass: "B"
        }
    ];

    // Charger les logements intermédiaires
    const fetchLogementsIntermediaires = async () => {
        try {
            setLoading(true);
            setError(null);

            // Utilisation directe des données d'exemple sans appel API
            console.log('🔄 Chargement des données locales de démonstration');
            setLogements(getSampleLogementsData());
            
        } catch (err) {
            console.error("❌ Erreur lors du chargement des propriétés:", err);
            setError("Utilisation des données de démonstration");
            setLogements(getSampleLogementsData());
        } finally {
            setLoading(false);
        }
    };

    // Load user's demandes to persist "déjà postulé" state
    useEffect(() => {
        if (!isAuthenticated || !user?.id) return;

        let mounted = true;
        const loadUserDemandes = async () => {
            try {
                // Utiliser le stockage local au lieu de l'API
                initDemoData(); // S'assurer que les données sont initialisées
                const demandes = getDemandesByUser(user.id);
                const map: Record<string, boolean> = {};
                demandes.forEach((d: any) => {
                    if (d && d.propertyId) map[String(d.propertyId)] = true;
                });
                if (mounted) setSentRequests((prev) => ({ ...prev, ...map }));
                console.log('📋 Demandes utilisateur chargées:', demandes.length);
            } catch (err) {
                console.error("Unable to load user demandes", err);
            }
        };

        loadUserDemandes();
        return () => {
            mounted = false;
        };
    }, [isAuthenticated, user?.id]);

    useEffect(() => {
        fetchLogementsIntermediaires();
    }, []);

    // Écouter les événements de nouvelle demande
    useEffect(() => {
        const handleNewDemande = () => {
            if (user?.id) {
                const demandes = getDemandesByUser(user.id);
                const map: Record<string, boolean> = {};
                demandes.forEach((d: any) => {
                    if (d && d.propertyId) map[String(d.propertyId)] = true;
                });
                setSentRequests(map);
            }
        };

        window.addEventListener('demande:created', handleNewDemande);
        return () => {
            window.removeEventListener('demande:created', handleNewDemande);
        };
    }, [user?.id]);

    const dispositifs = [
        {
            nom: "PLUS",
            description: "Prêt Locatif à Usage Social",
            loyerMax: "Variable selon zone",
            public: "Ménages modestes",
            financement: "Action Logement",
            icon: <Home className="w-6 h-6" />
        },
        {
            nom: "PLAI",
            description: "Prêt Locatif Aidé d'Intégration",
            loyerMax: "Très encadré",
            public: "Ménages très modestes",
            financement: "État + Collectivités",
            icon: <Shield className="w-6 h-6" />
        },
        {
            nom: "PLS",
            description: "Prêt Locatif Social",
            loyerMax: "Intermédiaire",
            public: "Ménages intermédiaires",
            financement: "Action Logement",
            icon: <TrendingUp className="w-6 h-6" />
        },
        {
            nom: "PSLA",
            description: "Prêt Social Locatif Accessible",
            loyerMax: "Accessible",
            public: "Salariés en parcours résidentiel",
            financement: "Action Logement",
            icon: <Building className="w-6 h-6" />
        }
    ];

    const avantages = [
        {
            icon: <Euro className="w-8 h-8" />,
            titre: "Loyers encadrés",
            description: "Des loyers inférieurs de 15 à 40% au marché libre, selon le dispositif"
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

    const etapes = [
        {
            etape: "1",
            titre: "Simulation éligibilité",
            description: "Vérification des plafonds de ressources et situation",
            duree: "24h"
        },
        {
            etape: "2",
            titre: "Dépôt du dossier",
            description: "Composition du dossier avec pièces justificatives",
            duree: "1-2 semaines"
        },
        {
            etape: "3",
            titre: "Instruction",
            description: "Examen par le service social et la commission",
            duree: "2-4 semaines"
        },
        {
            etape: "4",
            titre: "Attribution",
            description: "Notification et signature du bail",
            duree: "1 semaine"
        }
    ];

    const stats = [
        {
            valeur: "-30%",
            label: "Économie moyenne de loyer",
            description: "Par rapport au marché libre"
        },
        {
            valeur: "12-24 mois",
            label: "Durée moyenne d'attente",
            description: "Selon la zone géographique"
        },
        {
            valeur: "85%",
            label: "Taux de satisfaction",
            description: "Des locataires en logement intermédiaire"
        },
        {
            valeur: "50K+",
            label: "Logements livrés/an",
            description: "En France"
        }
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Formulaire soumis:', formData);
        toast({
            title: "Simulation envoyée",
            description: "Notre conseiller vous contacte sous 48h pour une étude personnalisée.",
            variant: "default"
        });
    };

    const toggleFavori = (id: number) => {
        setFavoris(prev =>
            prev.includes(id)
                ? prev.filter(favId => favId !== id)
                : [...prev, id]
        );
    };

    // Fonction pour gérer le clic sur "Postuler"
    const handlePostuler = (logement: Logement) => {
        if (sentRequests?.[logement.id]) {
            toast({
                title: "Déjà postulé",
                description: "Vous avez déjà postulé à ce logement.",
            });
            return;
        }
        setSelectedLogement(logement);
        setModalOpen(true);
    };

    // Fonction appelée quand une demande est envoyée avec succès
    const handleDemandeSuccess = (logementId: number) => {
        setSentRequests(prev => ({ ...prev, [logementId]: true }));
    };

    const handleVoirDetails = (logement: Logement, e: React.MouseEvent) => {
        e.stopPropagation();
        navigate(`/immobilier/${logement.id}`);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 py-8 mt-16 flex items-center justify-center">
                <div className="text-center">
                    <Loader className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Chargement des logements intermédiaires...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen ">
            {/* Hero Section */}
            <section className=" text-white pb-8 pt-20">
                <div className='absolute inset-0 h-64 -z-10 w-full overflow-hidden'>
                    <div className='absolute inset-0 w-full h-full backdrop-blur-sm bg-black/50'></div>
                    <img src="https://i.pinimg.com/736x/e1/71/1e/e1711e4da6287dedb35a90a6523b4380.jpg" className='h-full object-cover w-full' alt="" />
                </div>
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-xl lg:text-4xl font-bold mb-6">Logements Intermédiaires</h1>
                        <p className="lg:text-md text-sm opacity-90 mb-8 max-w-2xl mx-auto">
                            Découvrez les dispositifs PLUS, PLAI, PLS et PSLA pour un parcours résidentiel
                            sécurisé avec des loyers encadrés et des aides adaptées
                        </p>
                        {error && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                                <p className="text-yellow-800 text-sm">
                                    ⚠️ {error}
                                </p>
                            </div>
                        )}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => document.getElementById('simulation')?.scrollIntoView({ behavior: 'smooth' })}
                                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 transform flex items-center justify-center"
                            >
                                <Calculator className="w-5 h-5 mr-2" />
                                Simuler mon éligibilité
                            </button>
                            <button
                                onClick={() => setActiveTab('logements')}
                                className="border-2 bg-white hover:bg-white hover:text-blue-900 text-slate-900 font-semibold py-3 px-8 rounded-lg transition-all duration-300 flex items-center justify-center"
                            >
                                <Eye className="w-5 h-5 mr-2" />
                                Voir les logements
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Navigation par onglets */}
            <section className="py-8 bg-white shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-2">
                        {[
                            { id: 'avantages', label: 'Avantages', icon: <BadgeCheck className="w-4 h-4" /> },
                            { id: 'dispositifs', label: 'Dispositifs', icon: <FileText className="w-4 h-4" /> },
                            { id: 'logements', label: 'Logements', icon: <Home className="w-4 h-4" /> },
                            { id: 'simulation', label: 'Simulation', icon: <Calculator className="w-4 h-4" /> }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${activeTab === tab.id
                                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                                    : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section Avantages */}
            {activeTab === 'avantages' && (
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
                            Les avantages du logement intermédiaire
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                            {avantages.map((avantage, index) => (
                                <div
                                    key={index}
                                    className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 text-center"
                                >
                                    <div className="bg-blue-100 text-blue-600 p-3 rounded-lg inline-flex mb-4">
                                        {avantage.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-4">
                                        {avantage.titre}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {avantage.description}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Statistiques */}
                        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-12 text-white">
                            <h3 className="text-3xl font-bold text-center mb-12">
                                Chiffres clés du logement intermédiaire
                            </h3>
                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                                {stats.map((stat, index) => (
                                    <div key={index} className="text-center">
                                        <div className="text-4xl font-bold text-orange-300 mb-2">
                                            {stat.valeur}
                                        </div>
                                        <div className="text-lg font-semibold mb-2">
                                            {stat.label}
                                        </div>
                                        <div className="text-sm opacity-90">
                                            {stat.description}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Section Dispositifs */}
            {activeTab === 'dispositifs' && (
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
                            Les différents dispositifs
                        </h2>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
                            {dispositifs.map((dispositif, index) => (
                                <div
                                    key={index}
                                    className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                                            {dispositif.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900">
                                                {dispositif.nom}
                                            </h3>
                                            <p className="text-gray-600">{dispositif.description}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3 text-sm text-gray-700">
                                        <div className="flex justify-between">
                                            <span className="font-semibold">Loyer max:</span>
                                            <span>{dispositif.loyerMax}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-semibold">Public:</span>
                                            <span>{dispositif.public}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="font-semibold">Financement:</span>
                                            <span>{dispositif.financement}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Conditions d'éligibilité */}
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
                                <CheckCircle2 className="w-6 h-6 text-green-600 mr-3" />
                                Conditions d'éligibilité principales
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {conditionsEligibilite.map((condition, index) => (
                                    <div key={index} className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
                                        <div className="bg-blue-600 text-white p-2 rounded-full mt-1">
                                            <CheckCircle2 className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 mb-1">
                                                {condition.critere}
                                            </h4>
                                            <p className="text-gray-600 text-sm">
                                                {condition.details}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Section Logements */}
            {activeTab === 'logements' && (
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
                            Logements disponibles
                        </h2>

                        {error && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8 text-center">
                                <AlertTriangle className="w-6 h-6 text-yellow-600 inline mr-2" />
                                <span className="text-yellow-800">{error}</span>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {logements.map((logement) => {
                                const isDejaPostule = sentRequests?.[logement.id];
                                
                                return (
                                    <div
                                        key={logement.id}
                                        className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
                                    >
                                        {/* Image avec badges */}
                                        <div className="relative">
                                            <img
                                                src={logement.image}
                                                alt={logement.titre}
                                                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                                            />

                                            {/* Badges superposés */}
                                            <div className="absolute top-4 left-4 flex flex-col gap-2">
                                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${logement.type === 'PLUS'
                                                    ? 'bg-green-500 text-white'
                                                    : logement.type === 'PLAI'
                                                        ? 'bg-blue-500 text-white'
                                                        : logement.type === 'PLS'
                                                            ? 'bg-purple-500 text-white'
                                                            : 'bg-orange-500 text-white'
                                                    }`}>
                                                    {logement.type}
                                                </span>
                                                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-gray-600 text-white">
                                                    {logement.categorie}
                                                </span>
                                            </div>

                                            {/* Badge prix */}
                                            <div className="absolute top-4 right-4">
                                                <span className="bg-white bg-opacity-95 backdrop-blur-sm px-3 py-2 rounded-lg font-bold text-gray-900 shadow-lg">
                                                    {logement.prix}
                                                </span>
                                            </div>

                                            {/* Badge classe énergie */}
                                            {logement.energyClass && (
                                                <div className="absolute bottom-4 left-4">
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
                                            <button
                                                onClick={() => toggleFavori(logement.id)}
                                                className={`absolute bottom-4 right-4 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${favoris.includes(logement.id)
                                                    ? 'bg-red-500 text-white'
                                                    : 'bg-white bg-opacity-90 text-gray-700 hover:bg-red-500 hover:text-white'
                                                    }`}
                                            >
                                                <Heart className="w-4 h-4" fill={favoris.includes(logement.id) ? "currentColor" : "none"} />
                                            </button>
                                        </div>

                                        {/* Contenu de la carte */}
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
                                                {logement.titre}
                                            </h3>

                                            <div className="flex items-center text-gray-600 mb-3">
                                                <MapPin className="w-4 h-4 mr-1" />
                                                <span className="text-sm">{logement.lieu}</span>
                                            </div>

                                            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                {logement.description}
                                            </p>

                                            {/* Caractéristiques */}
                                            <div className="grid grid-cols-2 gap-4 py-4 border-y border-gray-100">
                                                <div className="flex items-center gap-2">
                                                    <Bed className="w-4 h-4 text-blue-600" />
                                                    <span className="text-sm text-gray-700">
                                                        {logement.caracteristiques.chambres} chambre{logement.caracteristiques.chambres > 1 ? 's' : ''}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Bath className="w-4 h-4 text-blue-600" />
                                                    <span className="text-sm text-gray-700">
                                                        {logement.caracteristiques.sdb} salle{logement.caracteristiques.sdb > 1 ? 's' : ''} de bain
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Square className="w-4 h-4 text-blue-600" />
                                                    <span className="text-sm text-gray-700">
                                                        {logement.caracteristiques.surface}
                                                    </span>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <Car className="w-4 h-4 text-blue-600" />
                                                    <span className="text-sm text-gray-700">
                                                        {logement.caracteristiques.parking} place{logement.caracteristiques.parking > 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Informations supplémentaires */}
                                            <div className="flex justify-between items-center pt-4">
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>Dispo: {new Date(logement.dateDispo).toLocaleDateString()}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Eye className="w-4 h-4" />
                                                        <span>{logement.vues} vues</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Boutons d'action */}
                                            <div className="flex gap-3 mt-4">
                                                <button
                                                    onClick={() => handlePostuler(logement)}
                                                    disabled={isDejaPostule}
                                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-60 disabled:bg-blue-400 flex items-center justify-center gap-2"
                                                >
                                                    <FileText className="w-4 h-4" />
                                                    {isDejaPostule ? "Déjà postulé" : "Postuler"}
                                                </button>

                                                {/* <button
                                                    onClick={(e) => handleVoirDetails(logement, e)}
                                                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                    Voir détails
                                                </button> */}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Message si aucun résultat */}
                        {logements.length === 0 && (
                            <div className="text-center py-12">
                                <Home className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                    Aucun logement trouvé
                                </h3>
                                <p className="text-gray-500">
                                    Aucun logement intermédiaire ne correspond à vos critères.
                                </p>
                            </div>
                        )}

                        {/* Processus de candidature */}
                        <div className="mt-20 bg-gradient-to-r from-green-600 to-blue-700 rounded-2xl p-8 text-white">
                            <h3 className="text-3xl font-bold text-center mb-8">
                                Processus de candidature
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {etapes.map((etape, index) => (
                                    <div key={index} className="text-center">
                                        <div className="bg-white bg-opacity-20 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                                            {etape.etape}
                                        </div>
                                        <h4 className="font-bold text-lg mb-2">{etape.titre}</h4>
                                        <p className="text-sm opacity-90 mb-2">{etape.description}</p>
                                        <div className="text-xs opacity-75">{etape.duree}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Section Simulation */}
            {activeTab === 'simulation' && (
                <section id="simulation" className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                    Simulation d'éligibilité
                                </h2>
                                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                                    Vérifiez votre éligibilité aux logements intermédiaires
                                    et recevez une étude personnalisée
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                {/* Formulaire */}
                                <div className="bg-white rounded-2xl shadow-lg p-8">
                                    <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                                        <Calculator className="w-6 h-6 text-blue-600 mr-3" />
                                        Votre situation
                                    </h3>
                                    <form onSubmit={handleSubmit}>
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Nom et prénom *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="nom"
                                                    value={formData.nom}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Email *
                                                    </label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Téléphone *
                                                    </label>
                                                    <input
                                                        type="tel"
                                                        name="telephone"
                                                        value={formData.telephone}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Situation professionnelle *
                                                </label>
                                                <select
                                                    name="situation"
                                                    value={formData.situation}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                                >
                                                    <option value="">Sélectionnez...</option>
                                                    <option value="cdi">CDI</option>
                                                    <option value="cdd">CDD</option>
                                                    <option value="fonctionnaire">Fonctionnaire</option>
                                                    <option value="independant">Indépendant</option>
                                                    <option value="retraite">Retraité</option>
                                                    <option value="etudiant">Étudiant</option>
                                                </select>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Revenus mensuels nets *
                                                    </label>
                                                    <select
                                                        name="revenus"
                                                        value={formData.revenus}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                                    >
                                                        <option value="">Sélectionnez...</option>
                                                        <option value="0-1500">0 - 1 500 €</option>
                                                        <option value="1500-2500">1 500 - 2 500 €</option>
                                                        <option value="2500-3500">2 500 - 3 500 €</option>
                                                        <option value="3500+">3 500 € et plus</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                        Composition familiale *
                                                    </label>
                                                    <select
                                                        name="composition"
                                                        value={formData.composition}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                                    >
                                                        <option value="">Sélectionnez...</option>
                                                        <option value="celibataire">Célibataire</option>
                                                        <option value="couple">Couple</option>
                                                        <option value="couple_1enfant">Couple + 1 enfant</option>
                                                        <option value="couple_2enfants">Couple + 2 enfants</option>
                                                        <option value="famille_nombreuse">Famille nombreuse</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                    Zone géographique recherchée *
                                                </label>
                                                <input
                                                    type="text"
                                                    name="localisation"
                                                    value={formData.localisation}
                                                    onChange={handleChange}
                                                    required
                                                    placeholder="Ville, département..."
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                className="w-full bg-gradient-to-r from-green-600 to-blue-700 hover:from-green-700 hover:to-blue-800 text-white font-bold py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                                            >
                                                <FileText className="w-5 h-5 mr-2" />
                                                Obtenir mon étude personnalisée
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* Informations complémentaires */}
                                <div className="space-y-6">
                                    <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6">
                                        <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                                            <CheckCircle2 className="w-5 h-5 text-blue-600 mr-2" />
                                            Ce que vous recevez
                                        </h4>
                                        <ul className="space-y-2 text-gray-700">
                                            <li className="flex items-center">
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                                                Analyse d'éligibilité détaillée
                                            </li>
                                            <li className="flex items-center">
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                                                Simulation des dispositifs accessibles
                                            </li>
                                            <li className="flex items-center">
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                                                Liste des logements correspondants
                                            </li>
                                            <li className="flex items-center">
                                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                                                Accompagnement personnalisé
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
                                        <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                                            <Clock className="w-5 h-5 text-green-600 mr-2" />
                                            Délais d'instruction
                                        </h4>
                                        <p className="text-gray-700 mb-3">
                                            Temps moyen de traitement des dossiers :
                                        </p>
                                        <div className="text-2xl font-bold text-green-600">
                                            2 à 6 semaines
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2">
                                            Selon la complétude du dossier
                                        </p>
                                    </div>

                                    <div className="bg-purple-50 border border-purple-200 rounded-2xl p-6">
                                        <h4 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                                            <Users className="w-5 h-5 text-purple-600 mr-2" />
                                            Notre expertise
                                        </h4>
                                        <p className="text-gray-700">
                                            <strong>500+ dossiers</strong> accompagnés avec succès pour un
                                            taux d'obtention de <strong>92%</strong> en logement intermédiaire
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Modal de postulation */}
            <ModalPostuler
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                logement={selectedLogement}
                onSuccess={handleDemandeSuccess}
                isAlreadySent={selectedLogement ? !!sentRequests?.[selectedLogement.id] : false}
            />
        </div>
    );
};

export default LogementsIntermediaires;