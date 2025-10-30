import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Eye, CheckCircle, XCircle, RefreshCw, Trash2, User, Mail, Phone, Clock, MessageCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const DemandeCard = ({ demande, onValidate, onRefuse, onRemove }: any) => {
    const formatMessage = (message: string) => {
        if (!message) return '—';
        // Enlever la partie automatique du message
        const parts = message.split('.');
        const userMessage = parts.find(part => !part.includes('Demande visite pour le bien'));
        return userMessage ? userMessage.trim() : '—';
    };

    return (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 hover:border-blue-200 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
    {/* Effet de fond subtil au survol */}
    <div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 to-blue-50/0 group-hover:from-blue-50/30 group-hover:to-blue-50/10 transition-all duration-500 rounded-2xl"></div>
    
    <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-start gap-6">
            {/* Image avec effet de zoom */}
            {demande.property?.images?.length > 0 ? (
                <div className="relative overflow-hidden rounded-xl">
                    <img 
                        src={demande.property.images[0]} 
                        alt={demande.property?.title || "Propriété"} 
                        className="w-36 h-28 object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 rounded-xl"></div>
                </div>
            ) : (
                <div className="w-36 h-28 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white shadow-lg">
                    <HomeIcon className="w-8 h-8" />
                </div>
            )}

            <div className="space-y-2">
                <h3 className="font-bold text-gray-900 text-xl group-hover:text-blue-700 transition-colors duration-300 leading-tight">
                    {demande.property?.title || "Demande de visite"}
                </h3>
                <p className="text-gray-600 text-sm flex items-center gap-2">
                    <span className="flex items-center gap-2 text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                        <MapPin className="w-4 h-4" />
                        {formatAddress(demande)}
                    </span>
                </p>
            </div>
        </div>
        
        <div className="flex flex-col items-end gap-3">
            <span className={`px-4 py-2 rounded-full text-sm font-semibold border-2 backdrop-blur-sm ${getStatusColor(demande.statut)} shadow-sm`}>
                {demande.statut}
            </span>
        </div>
    </div>

    {/* Grille améliorée avec séparateurs */}
    <div className="grid grid-cols-2 gap-8 mb-6 relative z-10">
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-blue-500 rounded-full"></div>
                <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Informations du demandeur</h4>
            </div>
            <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                        <span className="font-medium text-gray-800">{demande.contactPrenom} {demande.contactNom}</span>
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{demande.contactEmail}</span>
                </div>
                <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{demande.contactTel}</span>
                </div>
            </div>
        </div>
        
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <div className="w-1 h-4 bg-green-500 rounded-full"></div>
                <h4 className="text-sm font-semibold text-gray-800 uppercase tracking-wide">Détails de la visite</h4>
            </div>
            <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                        <span className="font-medium text-gray-800">
                            {new Date(demande.dateSouhaitee).toLocaleDateString('fr-FR', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                        </span>
                    </span>
                </div>
                <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{demande.heureSouhaitee}</span>
                </div>
                <div className="flex items-start gap-3">
                    <MessageCircle className="w-4 h-4 text-gray-400 mt-1" />
                    <span className="text-gray-600 leading-relaxed">{formatMessage(demande.description)}</span>
                </div>
            </div>
        </div>
    </div>

    {/* Pied de carte avec bordure élégante */}
    <div className="flex justify-between items-center pt-6 border-t border-gray-100 relative z-10">
        <div className="flex items-center gap-4 text-gray-500 text-sm">
            <span className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                <Calendar className="w-4 h-4" />
                {demande.date ? new Date(demande.date).toLocaleDateString('fr-FR') : '—'}
            </span>
        </div>

        <div className="flex gap-3 items-center">
            <Link 
                to={`/immobilier/${demande.propertyId}`} 
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl hover:scale-105"
            >
                <Eye className="w-4 h-4" />
                Voir le bien
            </Link>
            
            {['en attente', 'en cours', 'En attente', 'En cours'].includes(String(demande.statut)) ? (
                <div className="flex gap-3">
                    <button 
                        onClick={() => onValidate(demande.id)} 
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl hover:scale-105"
                    >
                        <CheckCircle className="w-4 h-4" />
                        Valider
                    </button>

                    <button 
                        onClick={() => onRefuse(demande.id)} 
                        className="bg-white hover:bg-red-50 text-red-600 border-2 border-red-200 px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl hover:scale-105"
                    >
                        <XCircle className="w-4 h-4" />
                        Refuser
                    </button>
                </div>
            ) : (/refus/i.test(String(demande.statut || '')) ? (
                <div className="flex items-center gap-3">
                    <span className={`px-4 py-2.5 rounded-full text-sm font-bold border-2 ${getStatusColor(demande.statut)} shadow-sm`}>
                        {demande.statut}
                    </span>
                    <button 
                        onClick={() => onRemove?.(demande.id)} 
                        title="Supprimer" 
                        className="p-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 transition-all duration-300 hover:scale-110 shadow-sm"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                <span className={`px-4 py-2.5 rounded-full text-sm font-bold border-2 ${getStatusColor(demande.statut)} shadow-sm`}>
                    {demande.statut}
                </span>
            ))}
        </div>
    </div>
</div>
    );
};

const formatAddress = (demande: any) => {
    if (demande.property && (demande.property.address || demande.property.city)) {
        const parts = [demande.property.address, demande.property.city].filter(Boolean);
        return parts.join(', ');
    }
    const parts = [demande.lieuAdresse, demande.lieuAdresseVille, demande.lieuAdresseCp].filter(Boolean);
    if (parts.length) return parts.join(', ');
    const contactParts = [demande.contactAdresse, demande.lieuAdresseVille].filter(Boolean);
    if (contactParts.length) return contactParts.join(', ');
    return 'Adresse non renseignée';
};

// Small placeholder icon to avoid additional imports
const HomeIcon = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4"><path d="M3 11.5L12 4l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-8.5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>

const getStatusColor = (status: string) => {
    switch ((status || '').toLowerCase()) {
        case 'en attente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'en cours': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'validée': return 'bg-green-100 text-green-800 border-green-200';
        case 'terminée': return 'bg-gray-100 text-gray-800 border-gray-200';
        case 'refusée': return 'bg-red-100 text-red-800 border-red-200';
        default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
}

// ... Reste du composant inchangé ...

const ListeDemandesImmobilier = () => {
    const { user, isAuthenticated } = useAuth();
    const [demandes, setDemandes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingIds, setUpdatingIds] = useState<number[]>([]);
    const [properties, setProperties] = useState<any[]>([]);
    const [debugVisible, setDebugVisible] = useState(false);
    const [activeTab, setActiveTab] = useState<string>("all");

    // Filter demandes based on active tab
    const filteredDemandes = React.useMemo(() => {
        if (activeTab === "all") return demandes;
        return demandes.filter(demande => {
            const status = (demande.statut || "").toLowerCase();
            switch(activeTab) {
                case "en_attente":
                    return status === "en attente" || status === "en cours";
                case "validees":
                    return status === "validée" || status === "validee" || status === "valide";
                case "refusees":
                    return status === "refusée" || status === "refusee" || status === "refus";
                case "archivees":
                    return demande.archived || status === "archivée" || status === "archivee";
                default:
                    return true;
            }
        });
    }, [demandes, activeTab]);

    useEffect(() => {
        if (!isAuthenticated || !user?.id) return;
        const load = async () => {
            setLoading(true);
            try {
                const resp = await api.get(`/demandes/immobilier/owner/${user.id}`);
                setDemandes(resp.data || []);

                try {
                    const props = await api.get('/properties', { params: { userId: user.id } });
                    setProperties(props.data || []);
                } catch (pErr) {
                    console.debug('Impossible de récupérer les propriétés du pro', pErr);
                    setProperties([]);
                }
            } catch (err) {
                console.error('Erreur en chargeant demandes immobilieres', err);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [isAuthenticated, user?.id]);

    const handleAction = async (id: number, action: 'validate' | 'refuse') => {
        let toastRef: any = null;
        toastRef = toast({
            title: action === 'validate' ? 'Confirmer la validation' : 'Confirmer le refus',
            description: action === 'validate' ? 'Valider cette demande la marquera comme validée.' : 'Refuser cette demande la marquera comme refusée.',
            action: (
                <button className="px-3 py-1 rounded bg-blue-600 text-white text-sm" onClick={async () => {
                    toastRef?.dismiss?.();
                    setUpdatingIds((s) => [...s, id]);
                    try {
                        await api.patch(`/demandes/immobilier/${id}/statut`, {
                            statut: action === 'validate' ? 'validée' : 'refusée'
                        });
                        const newStatus = action === 'validate' ? 'validée' : 'refusée';
                        setDemandes((prev) => prev.map(d => d.id === id ? { ...d, statut: newStatus } : d));
                        try {
                            window.dispatchEvent(new CustomEvent('demande:statusChanged', { detail: { demandeId: id, status: newStatus } }));
                        } catch (e) { console.debug('Could not dispatch demande:statusChanged event', e); }
                        toast({ title: 'Succès', description: `Demande ${newStatus}` });
                    } catch (err) {
                        console.error('Erreur action demande', err);
                        const msg = err?.response?.data?.error || err?.message || 'Impossible de traiter la demande pour le moment.';
                        toast({ title: 'Erreur', description: msg });
                    } finally {
                        setUpdatingIds((s) => s.filter(x => x !== id));
                    }
                }}>Confirmer</button>
            )
        });
    }

    const handleRemove = async (id: number) => {
        let toastRef: any = null;
        toastRef = toast({
            title: 'Confirmer la suppression',
            description: 'Cette action supprimera définitivement la demande.',
            action: (
                <button className="px-3 py-1 rounded bg-red-600 text-white text-sm" onClick={async () => {
                    toastRef?.dismiss?.();
                    setUpdatingIds((s) => [...s, id]);
                    try {
                        await api.delete(`/demandes/immobilier/${id}`);
                        setDemandes((prev) => prev.filter(d => d.id !== id));
                        toast({ title: 'Supprimé', description: 'La demande a été supprimée.' });
                    } catch (err) {
                        console.error('Erreur suppression demande', err);
                        toast({ title: 'Erreur', description: 'Impossible de supprimer la demande pour le moment.' });
                    } finally {
                        setUpdatingIds((s) => s.filter(x => x !== id));
                    }
                }}>Confirmer</button>
            )
        });
    }

    if (!isAuthenticated) return (
        <div className="min-h-screen mt-12 bg-gray-50 p-6 flex items-center justify-center">
            <p className="text-gray-600">Veuillez vous connecter pour voir les demandes.</p>
        </div>
    )

    if (loading) return (
        <div className="min-h-screen mt-12 bg-gray-50 p-6 flex items-center justify-center">
            <div className="text-center">
                <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600">Chargement des demandes immobilières...</p>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen  bg-gray-50 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Liste des demandes immobilières</h1>
                    <p className="text-gray-600 mt-2">Gérez les demandes de visite liées à vos biens</p>
                    <p className="text-sm text-gray-500 mt-1">Vos biens publiés: <span className="font-semibold text-gray-700">{properties.length}</span></p>
                </div>
            </div>

            {/* Tabs de filtrage */}
            <div className="flex items-center space-x-2 bg-white rounded-lg p-1 border border-gray-200 self-start mb-4">
                <button
                    onClick={() => setActiveTab("all")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === "all"
                            ? "bg-blue-500 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                    Toutes
                </button>
                <button
                    onClick={() => setActiveTab("en_attente")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === "en_attente"
                            ? "bg-blue-500 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                    En attente
                </button>
                <button
                    onClick={() => setActiveTab("validees")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === "validees"
                            ? "bg-blue-500 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                    Validées
                </button>
                <button
                    onClick={() => setActiveTab("refusees")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === "refusees"
                            ? "bg-blue-500 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                    Refusées
                </button>
                <button
                    onClick={() => setActiveTab("archivees")}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                        activeTab === "archivees"
                            ? "bg-blue-500 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                    Archivées
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {filteredDemandes.length > 0 ? filteredDemandes.map(d => (
                    <DemandeCard
                        key={d.id}
                        demande={d}
                        onValidate={(id: number) => handleAction(id, 'validate')}
                        onRefuse={(id: number) => handleAction(id, 'refuse')}
                        onRemove={(id: number) => handleRemove(id)}
                    />
                )) : (
                    <div className="col-span-full bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                        <h4 className="text-gray-700 text-lg font-medium mb-2">
                            Aucune demande {activeTab !== "all" ? "dans cette catégorie" : "immobilière"}
                        </h4>
                        {activeTab !== "all" ? (
                            <p className="text-gray-500 text-sm mb-6">
                                Essayez de sélectionner une autre catégorie
                            </p>
                        ) : (
                            <>
                                <p className="text-gray-500 text-sm mb-6">Aucune demande de visite liée à vos biens pour le moment.</p>
                                {properties.length === 0 ? (
                                    <p className="text-sm text-gray-500">Vous n'avez pas encore de biens publiés. Ajoutez un bien pour recevoir des demandes de visite.</p>
                                ) : (
                                    <p className="text-sm text-gray-500">Vos biens sont listés ({properties.length}). Il n'y a actuellement aucune demande de visite pour ces biens.</p>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ListeDemandesImmobilier;