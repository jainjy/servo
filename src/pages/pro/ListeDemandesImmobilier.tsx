import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Eye, CheckCircle, XCircle, RefreshCw, Trash2 } from 'lucide-react';

const DemandeCard = ({ demande, onValidate, onRefuse, onRemove }: any) => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group relative">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white">
                        <HomeIcon />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors duration-200">
                            {demande.titre}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1 flex items-center gap-2">
                            <span className="flex items-center gap-1 text-gray-500">
                                <MapPin className="w-3 h-3" />
                                {formatAddress(demande)}
                            </span>
                        </p>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(demande.statut)}`}>
                        {demande.statut}
                    </span>
                </div>
            </div>

            <p className="text-gray-700 mb-4 line-clamp-2 leading-relaxed">{demande.description || '—'}</p>

            <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4 text-gray-500 text-sm">
                    <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {demande.date ? new Date(demande.date).toLocaleDateString('fr-FR') : '—'}
                    </span>
                    <span className="flex items-center gap-1">
                        <span className="text-sm font-medium">{demande.createdBy?.firstName || ''} {demande.createdBy?.lastName || ''}</span>
                    </span>
                </div>

                <div className="flex gap-2 items-center">
                    <Link to={`/immobilier/${demande.propertyId}`} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Voir bien
                    </Link>
                    {/* show action buttons only when demande is pending or en cours */}
                            {['en attente', 'en cours', 'En attente', 'En cours'].includes(String(demande.statut)) ? (
                        <>
                            <button onClick={() => onValidate(demande.id)} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                Valider
                            </button>

                            <button onClick={() => onRefuse(demande.id)} className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center gap-2">
                                <XCircle className="w-4 h-4" />
                                Refuser
                            </button>
                        </>
                            ) : (/refus/i.test(String(demande.statut || '')) ? (
                                <div className="flex items-center gap-2">
                                    <span className={`px-3 py-2 rounded-full text-sm font-semibold border ${getStatusColor(demande.statut)}`}>{demande.statut}</span>
                                    <button onClick={() => onRemove?.(demande.id)} title="Supprimer" className="p-2 rounded-md bg-red-50 hover:bg-red-100 text-red-600">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ) : (
                                <span className={`px-3 py-2 rounded-full text-sm font-semibold border ${getStatusColor(demande.statut)}`}>{demande.statut}</span>
                            ))}
                </div>
            </div>
        </div>
    );
};

const formatAddress = (demande: any) => {
    // prefer property address
    if (demande.property && (demande.property.address || demande.property.city)) {
        const parts = [demande.property.address, demande.property.city].filter(Boolean);
        return parts.join(', ');
    }
    // then composed lieu fields
    const parts = [demande.lieuAdresse, demande.lieuAdresseVille, demande.lieuAdresseCp].filter(Boolean);
    if (parts.length) return parts.join(', ');
    // fallback to contact address
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

const ListeDemandesImmobilier = () => {
    const { user, isAuthenticated } = useAuth();
    const [demandes, setDemandes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingIds, setUpdatingIds] = useState<number[]>([]);
    const [properties, setProperties] = useState<any[]>([]);
    const [debugVisible, setDebugVisible] = useState(false);

    useEffect(() => {
        if (!isAuthenticated || !user?.id) return;
        const load = async () => {
            setLoading(true);
            try {
                // load all demandes for now (show every visit request)
                // const resp = await api.get(`/demandes/all`);
                const resp = await api.get(`/demandes/owner/${user.id}`);

                setDemandes(resp.data || []);

                // also fetch properties for this owner to help diagnose empty lists
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
        if (!confirm(`Confirmez-vous ${action === 'validate' ? 'la validation' : "l'annulation"} de cette demande ?`)) return;
        setUpdatingIds((s) => [...s, id]);
        try {
            await api.patch(`/demandes/${id}/status`, { action });
            const newStatus = action === 'validate' ? 'Validée' : 'Refusée';
            setDemandes((prev) => prev.map(d => d.id === id ? { ...d, statut: newStatus } : d));
            // notify other parts of the app (user's demandes page) that a demande changed
            try {
                window.dispatchEvent(new CustomEvent('demande:statusChanged', { detail: { demandeId: id, status: newStatus } }));
            } catch (e) {
                // ignore if CustomEvent isn't supported in this env
                console.debug('Could not dispatch demande:statusChanged event', e);
            }
            // if refused, keep it in list but allow deletion via trash button (handled by onRemove)
        } catch (err) {
            console.error('Erreur action demande', err);
            const msg = err?.response?.data?.error || err?.message || 'Impossible de traiter la demande pour le moment.';
            alert(msg);
        } finally {
            setUpdatingIds((s) => s.filter(x => x !== id));
        }
    }

    const handleRemove = async (id: number) => {
        if (!confirm('Confirmez-vous la suppression de cette demande ?')) return;
        setUpdatingIds((s) => [...s, id]);
        try {
            await api.delete(`/demandes/${id}`);
            setDemandes((prev) => prev.filter(d => d.id !== id));
        } catch (err) {
            console.error('Erreur suppression demande', err);
            alert('Impossible de supprimer la demande pour le moment.');
        } finally {
            setUpdatingIds((s) => s.filter(x => x !== id));
        }
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
        <div className="min-h-screen mt-12 bg-gray-50 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Liste des demandes immobilières</h1>
                    <p className="text-gray-600 mt-2">Gérez les demandes de visite liées à vos biens</p>
                    <p className="text-sm text-gray-500 mt-1">Vos biens publiés: <span className="font-semibold text-gray-700">{properties.length}</span></p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {demandes.length > 0 ? demandes.map(d => (
                    <DemandeCard
                        key={d.id}
                        demande={d}
                        onValidate={(id: number) => handleAction(id, 'validate')}
                        onRefuse={(id: number) => handleAction(id, 'refuse')}
                        onRemove={(id: number) => handleRemove(id)}
                    />
                )) : (
                    <div className="col-span-full bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                        <h4 className="text-gray-700 text-lg font-medium mb-2">Aucune demande immobilière</h4>
                        <p className="text-gray-500 text-sm mb-6">Aucune demande de visite liée à vos biens pour le moment.</p>
                        {properties.length === 0 ? (
                            <p className="text-sm text-gray-500">Vous n'avez pas encore de biens publiés. Ajoutez un bien pour recevoir des demandes de visite.</p>
                        ) : (
                            <p className="text-sm text-gray-500">Vos biens sont listés ({properties.length}). Il n'y a actuellement aucune demande de visite pour ces biens.</p>
                        )}

                        <div className="mt-4 flex items-center justify-center gap-3">
                            <button onClick={() => { setDebugVisible(v => !v); }} className="px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200">{debugVisible ? 'Masquer debug' : 'Afficher debug'}</button>
                            <button onClick={() => { setLoading(true); setDemandes([]); setProperties([]); (async () => { try { const resp = await api.get(`/demandes/owner/${user.id}`); setDemandes(resp.data || []); const props = await api.get('/properties', { params: { userId: user.id } }); setProperties(props.data || []); } catch (e) { console.error(e) } finally { setLoading(false) } })() }} className="px-4 py-2 rounded-md bg-blue-600 text-white">Réessayer</button>
                        </div>

                        {debugVisible && (
                            <div className="mt-6 text-left bg-gray-50 p-4 rounded border border-gray-100">
                                <h5 className="font-semibold mb-2">Debug — Réponses brutes</h5>
                                <div className="text-xs text-gray-700 mb-2">
                                    <strong>Demandes (count):</strong> {demandes.length}
                                </div>
                                <pre className="text-xs overflow-auto max-h-48 bg-white p-2 rounded border">{JSON.stringify(demandes, null, 2)}</pre>
                                <div className="text-xs text-gray-700 mt-3 mb-2">
                                    <strong>Propriétés (count):</strong> {properties.length}
                                </div>
                                <pre className="text-xs overflow-auto max-h-48 bg-white p-2 rounded border">{JSON.stringify(properties, null, 2)}</pre>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default ListeDemandesImmobilier;
