import { useState } from "react";
import { Scale, Heart, Users, Home, Shield, FileText, X, ArrowRight, Calendar, Clock, CheckCircle, Loader2 } from 'lucide-react';
import api from "@/lib/api";
import { useAuth } from "@/hooks/useAuth"; // Import comme dans votre exemple
import { toast } from "sonner"; // Pour les notifications

export default function DroitFamille() {
    const [openModal, setOpenModal] = useState<string | null>(null);
    const [sousType, setSousType] = useState("");
    const [description, setDescription] = useState("");
    const [formErrors, setFormErrors] = useState({
        sousType: false,
        description: false
    });
    const [isLoading, setIsLoading] = useState(false); // État de chargement
    
    // Utilisation du hook useAuth pour récupérer les informations d'authentification
    const { user, isAuthenticated } = useAuth();

    const closeModal = () => {
        if (isLoading) return; // Empêche la fermeture pendant le chargement
        setOpenModal(null);
        setSousType("");
        setDescription("");
        setFormErrors({ sousType: false, description: false });
        setIsLoading(false);
    };

    const interventionDomains = [
        {
            icon: <Heart className="w-6 h-6" />,
            title: "Divorce et séparation",
            description: "Accompagnement personnalisé dans toutes les procédures de divorce et séparation.",
            features: ["Consentement mutuel", "Divorce contentieux", "Garde des enfants", "Pension alimentaire"]
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "Succession et héritage",
            description: "Gestion complète des successions et transmission du patrimoine familial.",
            features: ["Testament", "Donation", "Partage successoral", "Règlement de succession"]
        },
        {
            icon: <Shield className="w-6 h-6" />,
            title: "Protection du patrimoine",
            description: "Stratégies de protection et transmission de votre patrimoine familial.",
            features: ["SCI familiale", "Assurance-vie", "Démembrement", "Protection du conjoint"]
        }
    ];

    const services = [
        {
            id: "conseil-notaire",
            title: "Consultation avec un notaire",
            description: "Conseil personnalisé pour la protection de votre famille",
            icon: <Scale className="w-5 h-5" />,
            color: "blue"
        },
        {
            id: "avocat-divorce",
            title: "Accompagnement par un avocat pour divorce",
            description: "Expertise juridique pour toutes les procédures de divorce",
            icon: <FileText className="w-5 h-5" />,
            color: "purple"
        },
        {
            id: "huissier",
            title: "Intervention d'un commissaire de justice",
            description: "Actes d'huissier pour la mise en œuvre des décisions",
            icon: <Users className="w-5 h-5" />,
            color: "green"
        },
        {
            id: "succession",
            title: "Ouverture et gestion de succession",
            description: "Gestion complète des démarches successorales",
            icon: <Home className="w-5 h-5" />,
            color: "orange"
        },
        {
            id: "societe-familiale",
            title: "Création de société familiale",
            description: "SCI ou SARL pour organiser votre patrimoine",
            icon: <Shield className="w-5 h-5" />,
            color: "red"
        },
        {
            id: "protection-patrimoine",
            title: "Protection du patrimoine familial",
            description: "Stratégies de protection sur mesure",
            icon: <Heart className="w-5 h-5" />,
            color: "indigo"
        }
    ];

    const getServiceColor = (color: string) => {
        const colors = {
            blue: 'from-slate-500 to-black',
            purple: 'from-purple-900 to-slate-900',
            green: 'from-green-900 to-emerald-900',
            orange: 'from-orange-900 to-red-950',
            red: 'from-red-900 to-pink-950',
            indigo: 'from-indigo-950 to-blue-950'
        };
        return colors[color as keyof typeof colors] || 'from-gray-500 to-gray-600';
    };

    const handleOpenModal = (serviceId: string) => {
        if (!isAuthenticated) {
            toast.error("Veuillez vous connecter pour accéder à ce service.");
            return;
        }
        setOpenModal(serviceId);
    };

    const handleSend = async () => {
        // Validation
        if (!sousType) {
            setFormErrors(prev => ({ ...prev, sousType: true }));
            toast.error("Veuillez sélectionner un type de demande.");
            return;
        }
        
        if (!description.trim()) {
            setFormErrors(prev => ({ ...prev, description: true }));
            toast.error("Veuillez décrire votre situation.");
            return;
        }

        setIsLoading(true); // Activer le chargement

        try {
            const token = localStorage.getItem("auth-token");
            if (!token || !isAuthenticated) {
                toast.error("Vous devez être connecté pour envoyer une demande.");
                setIsLoading(false);
                return;
            }

            const payload = {
                serviceType: openModal,
                sousType,
                description
            };

            console.log("📤 Sending data:", payload);

            const response = await api.post(
                "/droitFamille",
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log("✅ Demande envoyée:", response.data);
            toast.success("Votre demande a été envoyée !");
            closeModal();

        } catch (error: any) {
            console.error("❌ Erreur:", error);
            toast.error(error?.response?.data?.error || "Erreur lors de l'envoi de la demande");
            setIsLoading(false); // Désactiver le chargement en cas d'erreur
        }
    };

    // Fonction pour récupérer le nom complet de l'utilisateur
    const getUserFullName = () => {
        if (!user) return "";
        return `${user.firstName || ''} ${user.lastName || ''}`.trim();
    };

    // Fonction pour gérer les changements dans les champs
    const handleSousTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSousType(e.target.value);
        if (formErrors.sousType) {
            setFormErrors(prev => ({ ...prev, sousType: false }));
        }
    };

    const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(e.target.value);
        if (formErrors.description) {
            setFormErrors(prev => ({ ...prev, description: false }));
        }
    };

    // Obtenir le service actuellement sélectionné
    const currentService = services.find(s => s.id === openModal);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 text-gray-900">
            {/* HEADER HERO */}
            <div className="relative h-80 bg-black/50 overflow-hidden">
                <div className="absolute inset-0 bg-black/90"></div>
                <div className="absolute inset-0 bg-[url('/fam.jfif')] bg-cover bg-center mix-blend-overlay"></div>

                <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
                    <div className="max-w-4xl">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                            Droit de la Famille
                        </h1>
                        <p className="text-md text-blue-100 max-w-2xl mx-auto leading-relaxed">
                            Accompagnement juridique et notarial complet pour protéger votre famille
                            et organiser la transmission de votre patrimoine en toute sérénité.
                        </p>
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <main className="max-w-6xl mx-auto px-4 py-8 space-y-20">
                {/* Section Domaines d'intervention */}
                <section>
                    <div className="text-center mb-8">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Nos Domaines d'Intervention
                        </h2>
                        <p className="text-md text-gray-600 max-w-2xl mx-auto">
                            Une expertise complète pour accompagner votre famille à chaque étape de la vie
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {interventionDomains.map((domain, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 group p-6"
                            >
                                <div className="flex items-center mb-4">
                                    <div className="p-3 bg-blue-100 rounded-xl text-slate-600 mr-4 group-hover:scale-110 transition-transform">
                                        {domain.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900">{domain.title}</h3>
                                </div>
                                <p className="text-gray-600 mb-4 leading-relaxed">
                                    {domain.description}
                                </p>
                                <ul className="space-y-2">
                                    {domain.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-center text-sm text-gray-700">
                                            <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Section Services principaux */}
                <section>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                            Services Spécialisés
                        </h2>
                        <p className="text-md text-gray-600 max-w-2xl mx-auto">
                            Des solutions sur mesure adaptées à chaque situation familiale
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {services.map((service) => (
                            <button
                                key={service.id}
                                onClick={() => handleOpenModal(service.id)}
                                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 p-6 text-left group hover:scale-105"
                            >
                                <div className={`w-12 h-12 bg-gradient-to-r ${getServiceColor(service.color)} rounded-lg flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                                    {service.icon}
                                </div>
                                <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    {service.title}
                                </h3>
                                <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                                    {service.description}
                                </p>
                                <div className="flex items-center text-blue-600 font-semibold text-sm">
                                    En savoir plus
                                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </button>
                        ))}
                    </div>
                </section>

                {/* Section Avantages */}
                <section className="bg-white rounded-2xl shadow-lg py-4 px-8">
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="flex gap-2">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mx-auto mb-4">
                                <Clock className="w-8 h-8" />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="font-bold text-lg text-gray-900 mb-2">Réactivité</h3>
                                <p className="text-gray-600 text-xs">
                                    Réponse sous 24h pour les situations urgentes
                                </p>
                            </div>
                        </div>
                        <div className=" flex">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto mb-4">
                                <Shield className="w-8 h-8" />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="font-bold text-lg text-gray-900 mb-2">Confidentialité</h3>
                                <p className="text-gray-600 text-xs">
                                    Secret professionnel et discrétion absolue
                                </p>
                            </div>
                        </div>
                        <div className=" flex">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mx-auto mb-4">
                                <Scale className="w-8 h-8" />
                            </div>
                            <div className="flex flex-col">
                                <h3 className="font-bold text-lg text-gray-900 mb-2">Expertise</h3>
                                <p className="text-gray-600 text-xs">
                                    Notaires et avocats spécialisés en droit familial
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* MODALES MODERNES */}
            {openModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" style={{scrollbarWidth: "none"}}>
                        {/* Overlay de chargement */}
                        {isLoading && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex items-center justify-center rounded-2xl">
                                <div className="flex flex-col items-center">
                                    <Loader2 className="w-10 h-10 animate-spin text-slate-900 mb-3" />
                                    <p className="text-slate-800 font-medium">Envoi en cours...</p>
                                    <p className="text-slate-600 text-sm mt-1">Veuillez patienter</p>
                                </div>
                            </div>
                        )}

                        {/* Header Modal */}
                        <div className="bg-slate-800 rounded-t-2xl px-6 py-4 text-white">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-bold">
                                    {currentService?.title}
                                </h3>
                                <button
                                    onClick={closeModal}
                                    disabled={isLoading}
                                    className={`p-1 rounded-lg transition-colors ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/20'}`}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <p className="text-blue-100 text-xs">
                                {currentService?.description}
                            </p>
                            <div className="absolute right-1 top-12 flex underline items-center justify-center mt-4 text-[10px] text-gray-500">
                                <Calendar className="w-2.5 h-2.5 mr-1" />
                                Réponse sous 24 heures
                            </div>
                        </div>

                        {/* Formulaire */}
                        <div className="px-6 py-4">
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Nom complet
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Votre nom et prénom"
                                        value={getUserFullName()}
                                        readOnly
                                        className="w-full border border-gray-300 rounded-lg p-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Adresse e-mail
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="votre@email.com"
                                        value={user?.email || ""}
                                        readOnly
                                        className="w-full border border-gray-300 rounded-lg p-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Téléphone
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="+33 1 23 45 67 89"
                                        value={user?.phone || ""}
                                        readOnly
                                        className="w-full border border-gray-300 rounded-lg p-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                {/* Champs spécifiques selon le service */}
                                {openModal === "conseil-notaire" && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Type de conseil
                                        </label>
                                        <select 
                                            className={`w-full border ${formErrors.sousType ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 text-sm ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                            value={sousType}
                                            onChange={handleSousTypeChange}
                                            disabled={isLoading}
                                        >
                                            <option value="">Sélectionnez le type de conseil</option>
                                            <option value="patrimoine">Protection patrimoniale</option>
                                            <option value="succession">Succession et donation</option>
                                            <option value="contrat">Contrat de mariage</option>
                                            <option value="autre">Autre</option>
                                        </select>
                                    </div>
                                )}

                                {openModal === "avocat-divorce" && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Type de divorce
                                        </label>
                                        <select 
                                            className={`w-full border ${formErrors.sousType ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 text-sm ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                            value={sousType}
                                            onChange={handleSousTypeChange}
                                            disabled={isLoading}
                                        >
                                            <option value="">Type de divorce</option>
                                            <option value="consentement">Divorce par consentement mutuel</option>
                                            <option value="contentieux">Divorce contentieux</option>
                                            <option value="acceptation">Divorce accepté</option>
                                            <option value="alteration">Divorce pour altération du lien conjugal</option>
                                        </select>
                                    </div>
                                )}

                                {openModal === "huissier" && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Type d'intervention
                                        </label>
                                       <select 
                                            className={`w-full border ${formErrors.sousType ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 text-sm ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                            value={sousType}
                                            onChange={handleSousTypeChange}
                                            disabled={isLoading}
                                        >
                                            <option value="">Type d'intervention</option>
                                            <option value="signification">Signification d'acte</option>
                                            <option value="paiement">Sommation de payer</option>
                                            <option value="injonction">Injonction de faire</option>
                                            <option value="constat">Constat d'huissier</option>
                                            <option value="expulsion">Expulsion</option>
                                        </select>
                                    </div>
                                )}

                                {/* Champs pour les autres services */}
                                {!["conseil-notaire", "avocat-divorce", "huissier"].includes(openModal) && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Type de demande
                                        </label>
                                        <select 
                                            className={`w-full border ${formErrors.sousType ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 text-sm ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                            value={sousType}
                                            onChange={handleSousTypeChange}
                                            disabled={isLoading}
                                        >
                                            <option value="">Sélectionnez le type de demande</option>
                                            <option value="information">Demande d'information</option>
                                            <option value="devis">Demande de devis</option>
                                            <option value="urgence">Situation urgente</option>
                                            <option value="autre">Autre</option>
                                        </select>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description de votre situation
                                    </label>
                                   <textarea
                                        placeholder="Décrivez votre situation..."
                                        rows={4}
                                        className={`w-full border ${formErrors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg p-3 text-sm ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        value={description}
                                        onChange={handleDescriptionChange}
                                        disabled={isLoading}
                                    ></textarea>
                                </div>

                                <button
                                    type="button"
                                    onClick={handleSend}
                                    disabled={isLoading}
                                    className={`w-full flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-colors ${
                                        isLoading 
                                            ? 'bg-slate-700 cursor-not-allowed opacity-90' 
                                            : 'bg-slate-900 hover:bg-slate-800'
                                    } text-white`}
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Envoi en cours...
                                        </>
                                    ) : (
                                        'Envoyer la demande'
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}