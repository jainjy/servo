import React, { useEffect, useState } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import { RefreshCw, MapPin, Calendar, ArrowRight } from 'lucide-react';

const DemandeImmoCard = ({ demande, onDeleted, onStatusChange }: any) => {
    // Helpers for safe display
    const formatDate = (d: any) => {
        const dateStr = d?.createdAt || d?.date;
        if (!dateStr) return '—';
        const dt = new Date(dateStr);
        if (isNaN(dt.getTime())) return String(dateStr);
        return dt.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
    };

    const contactPhone = () => demande?.contactTel || '—';

    const formatLieu = () => {
        // prefer composed adresse fields, then lieu, then fallback
        const parts = [demande?.lieuAdresse, demande?.lieuAdresseVille, demande?.lieuAdresseCp].filter(Boolean);
        const joined = parts.join(', ');
        if (joined) return joined;
        if (demande?.lieu && typeof demande.lieu === 'string' && !/null/i.test(demande.lieu)) return demande.lieu;
        return 'Adresse non renseignée';
    };

    const statutColor = (statut: string) => {
        switch ((statut || '').toLowerCase()) {
            case 'en attente': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'en cours': return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'devis reçus': return 'bg-green-100 text-green-800 border-green-200';
            case 'terminé': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };
    // Fonction pour les styles de statut version sombre
const getStatutStyles = (statut) => {
  const baseStyles = "backdrop-blur-sm border";
  
  switch(statut?.toLowerCase()) {
    case 'en cours':
    case 'pending':
      return `${baseStyles} bg-orange-500/10 text-orange-300 border-orange-500/30`;
    case 'terminé':
    case 'completed':
      return `${baseStyles} bg-green-500/10 text-green-300 border-green-500/30`;
    case 'annulé':
    case 'cancelled':
      return `${baseStyles} bg-red-500/10 text-red-300 border-red-500/30`;
    case 'confirmé':
    case 'confirmed':
      return `${baseStyles} bg-blue-500/10 text-blue-300 border-blue-500/30`;
    default:
      return `${baseStyles} bg-gray-500/10 text-gray-300 border-gray-500/30`;
  }
};
    return (
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border border-gray-700 p-6 hover:border-blue-500/50 hover:shadow-2xl transition-all duration-500 group">
            <div className="flex flex-col space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div className="flex-1 pr-4">
                        <h3 className="font-bold text-white text-xl group-hover:text-blue-400 transition-colors duration-300">
                            {demande.titre || 'Demande'}
                        </h3>

                        {/* Localisation */}
                        <div className="mt-3 flex items-center gap-2 text-gray-300">
                            <MapPin className="w-4 h-4 text-blue-400" />
                            <span className="text-sm">{formatLieu()}</span>
                        </div>

                        {/* Description */}
                        <p className="text-gray-400 mt-4 mb-3 line-clamp-3 leading-relaxed text-sm">
                            {demande.description || 'Aucune description fournie.'}
                        </p>
                    </div>

                    {/* Statut et Date */}
                    <div className="text-right min-w-[120px]">
                        <div className="flex items-center justify-end gap-2 text-gray-400 text-sm mb-3">
                            <Calendar className="w-4 h-4 text-blue-400" />
                            <span>{formatDate(demande)}</span>
                        </div>
                        <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm ${statutColor(demande.statut)}`}>
                            <div className="w-2 h-2 rounded-full mr-2 bg-current opacity-80"></div>
                            {demande.statut || '—'}
                        </div>
                    </div>
                </div>

                {/* Separator */}
                <div className="border-t border-gray-700/50 pt-4 flex items-center justify-between gap-4">
                    {/* Action Button */}
                    <Link
                        to={
                            (demande.propertyId || demande.property?.id)
                                ? `/immobilier/${demande.propertyId || demande.property?.id}`
                                : '#'
                        }
                        className="group/btn bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-5 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 border border-blue-500/30 hover:border-blue-400/50 hover:shadow-lg hover:shadow-blue-500/20"
                    >
                        <span>Voir le bien</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" />
                    </Link>

                        {/* Actions: pending -> allow cancel. If refused -> allow resend + cancel. Otherwise show badge */}
                        {['en attente', 'en cours', 'En attente', 'En cours'].includes(String(demande.statut)) ? (
                            <CancelButton demande={demande} onDeleted={onDeleted} />
                        ) : (/refus/i.test(String(demande.statut || '')) ? (
                            <div className="flex items-center gap-2">
                                <ResendButton demande={demande} onStatusChange={onStatusChange} />
                                <CancelButton demande={demande} onDeleted={onDeleted} />
                            </div>
                        ) : (
                            <div className="px-4 py-2">
                                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold border ${statutColor(demande.statut)}`}>
                                    {demande.statut}
                                </span>
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

const ResendButton = ({ demande, onStatusChange }: any) => {
    const [sending, setSending] = React.useState(false);

    const handleResend = async () => {
        if (!confirm("Voulez-vous renvoyer cette demande ?")) return;
        setSending(true);
        try {
            // Build a minimal payload reusing available demande fields.
            const payload: any = {
                propertyId: demande.propertyId,
                titre: demande.titre,
                description: demande.description,
                serviceId: demande.serviceId || demande.service?.id,
            };
            await api.post('/demandes', payload);
            // update local status to pending so user sees it again
            onStatusChange?.(demande.id, 'en attente');
            alert('Demande renvoyée — elle apparaît maintenant comme en attente.');
        } catch (err) {
            console.error('Erreur en renvoyant la demande', err);
            const msg = err?.response?.data?.error || err?.message || 'Impossible de renvoyer la demande.';
            alert(msg);
        } finally {
            setSending(false);
        }
    };

    return (
        <button onClick={handleResend} disabled={sending} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200">
            {sending ? 'Envoi...' : 'Renvoyer'}
        </button>
    );
};

const CancelButton = ({ demande, onDeleted }: any) => {
    const [deleting, setDeleting] = React.useState(false);

    const handleCancel = async () => {
        if (!confirm("Confirmez-vous l'annulation de cette demande ?")) return;
        setDeleting(true);
        try {
            await api.delete(`/demandes/${demande.id}`);
            // inform parent to remove from list
            onDeleted?.(demande.id);
        } catch (err) {
            console.error('Erreur lors de la suppression de la demande', err);
            alert("Impossible d'annuler la demande. Réessayez plus tard.");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <button
            onClick={handleCancel}
            disabled={deleting}
            className="bg-transparent text-red-400 border border-red-500/20 hover:bg-red-500/5 px-4 py-2 rounded-lg text-sm font-semibold transition"
        >
            {deleting ? 'Annulation...' : 'Annuler'}
        </button>
    );
};

const MesDemandesImmobilier = () => {
    const { user, isAuthenticated } = useAuth();
    const [demandes, setDemandes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isAuthenticated || !user?.id) return;

        const load = async () => {
            setLoading(true);
            try {
                const resp = await api.get(`/demandes/user/${user.id}`);
                const all = resp.data || [];
                // Filter demandes that are linked to a property
                const immo = all.filter((d: any) => d.propertyId);
                setDemandes(immo);
            } catch (err) {
                console.error('Erreur en chargeant demandes immobilières', err);
            } finally {
                setLoading(false);
            }
        };

        load();

        const handler = (e: any) => {
            const detail = e?.detail || {};
            // support both shapes: { id, statut } and { demandeId, status }
            const id = detail.id || detail.demandeId;
            const statut = detail.statut || detail.status;
            if (!id) return;
            setDemandes((prev) => prev.map(d => d.id === id ? { ...d, statut } : d));
        };
        window.addEventListener('demande:statusChanged', handler as EventListener);
        return () => window.removeEventListener('demande:statusChanged', handler as EventListener);
    }, [isAuthenticated, user?.id]);

    const handleDeleted = (id: string) => {
        setDemandes((prev) => prev.filter((d) => d.id !== id));
    };

    const handleStatusChange = (id: string, statut: string) => {
        setDemandes((prev) => prev.map(d => d.id === id ? { ...d, statut } : d));
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen mt-12 bg-gray-50 p-6 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Veuillez vous connecter pour voir vos demandes immobilières.</p>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen mt-12 bg-gray-50 p-6 flex items-center justify-center">
                <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className="text-gray-600">Chargement des demandes immobilières...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen mt-12 bg-gray-50 p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Mes demandes immobilières</h1>
                    <p className="text-gray-600 mt-2">Toutes les demandes de visite et demandes liées à vos biens</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                {demandes.length > 0 ? (
                    demandes.map((d) => <DemandeImmoCard key={d.id} demande={d} onDeleted={handleDeleted} onStatusChange={handleStatusChange} />)
                ) : (
                    <div className="col-span-full bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
                        <h4 className="text-gray-700 text-lg font-medium mb-2">Aucune demande immobilière</h4>
                        <p className="text-gray-500 text-sm mb-6">Vous n'avez pas encore envoyé de demande liée à un bien.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MesDemandesImmobilier;
