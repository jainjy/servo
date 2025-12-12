import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  Search,
  ChevronDown,
  ChevronUp,
  Loader2,
  User
} from 'lucide-react';
import api from "../../lib/api.js";

// Types TypeScript basés sur la réponse de l'API
interface Service {
  id: number;
  libelle: string;
  description: string;
  images: string[];
}

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface DemandeDroitFamille {
  id: number;
  userId: string;
  serviceId: number;
  serviceType?: string;
  sousType?: string;
  description?: string;
  status: 'pending' | 'valider' | 'Annuler';
  createdAt: string;
  service?: Service;
  user?: User;
}

interface ApiResponse {
  success: boolean;
  data: DemandeDroitFamille[];
}

// Interface pour les données transformées
interface DemandeTransformee {
  id: number;
  numeroDossier: string;
  nomDemandeur: string;
  typeDemande: string;
  dateDepot: string;
  statut: 'En attente' | 'Validée' | 'Annulée';
  priorite: 'Haute' | 'Moyenne' | 'Basse';
  piecesManquantes: number;
  derniereMiseAJour: string;
  donneesOriginales: DemandeDroitFamille;
}

const DemandeDroitFamille: React.FC = () => {
  // États
  const [demandesOriginales, setDemandesOriginales] = useState<DemandeDroitFamille[]>([]);
  const [demandes, setDemandes] = useState<DemandeTransformee[]>([]);
  const [statistiques, setStatistiques] = useState({
    total: 0,
    enAttente: 0,
    validees: 0,
    annulees: 0,
  });
  const [recherche, setRecherche] = useState('');
  const [filtreStatut, setFiltreStatut] = useState<string>('Tous');
  const [tri, setTri] = useState<'date' | 'priorite' | 'nom'>('date');
  const [ordreTri, setOrdreTri] = useState<'asc' | 'desc'>('desc');
  const [message, setMessage] = useState<string>('');
  const [chargement, setChargement] = useState(true);
  const [miseAJourEnCours, setMiseAJourEnCours] = useState<number[]>([]);
  
  // Fonction pour transformer les données de l'API
  const transformerDonnees = (data: DemandeDroitFamille[]): DemandeTransformee[] => {
    return data.map((item, index) => {
      let typeDemande = item.serviceType || item.sousType || 'Non spécifié';
      if (typeDemande.includes('divorce')) typeDemande = 'Divorce';
      else if (typeDemande.includes('garde')) typeDemande = 'Garde d\'enfants';
      else if (typeDemande.includes('pension')) typeDemande = 'Pension alimentaire';
      else if (typeDemande.includes('autorite')) typeDemande = 'Autorité parentale';
      else if (typeDemande.includes('adoption')) typeDemande = 'Adoption';

      let statut: 'En attente' | 'Validée' | 'Annulée' = 'En attente';
      if (item.status === 'valider') statut = 'Validée';
      else if (item.status === 'Annuler') statut = 'Annulée';

      const numeroDossier = `DF-${new Date(item.createdAt).getFullYear()}-${(index + 1).toString().padStart(3, '0')}`;

      const nomDemandeur = item.user 
        ? `${item.user.firstName} ${item.user.lastName}`
        : `Utilisateur ${item.userId.substring(0, 8)}...`;

      const priorites: ('Haute' | 'Moyenne' | 'Basse')[] = ['Haute', 'Moyenne', 'Basse'];
      const priorite = priorites[Math.floor(Math.random() * priorites.length)];

      const demandeTransformee: DemandeTransformee = {
        id: item.id,
        numeroDossier,
        nomDemandeur,
        typeDemande,
        dateDepot: new Date(item.createdAt).toLocaleDateString('fr-FR'),
        statut,
        priorite,
        piecesManquantes: Math.floor(Math.random() * 6),
        derniereMiseAJour: new Date(item.createdAt).toLocaleDateString('fr-FR'),
        donneesOriginales: item
      };
      
      return demandeTransformee;
    });
  };

  // Récupérer les données depuis l'API
  const fetchDemandes = async () => {
    try {
      setChargement(true);
      setMessage('');
      
      const response = await api.get('/droitFamille');
      const apiResponse: ApiResponse = response.data;

      if (apiResponse.success && apiResponse.data) {
        setDemandesOriginales(apiResponse.data);
        const donneesTransformees = transformerDonnees(apiResponse.data);
        setDemandes(donneesTransformees);
        setMessage(`${donneesTransformees.length} demandes chargées avec succès`);
      } else {
        setMessage('Erreur: Données invalides de l\'API');
      }
    } catch (error: any) {
      console.error('Erreur fetch:', error);
      setMessage(`Erreur: ${error.message}`);
    } finally {
      setChargement(false);
    }
  };

  useEffect(() => {
    fetchDemandes();
  }, []);

  // Calculer les statistiques
  useEffect(() => {
    const total = demandes.length;
    const enAttente = demandes.filter(d => d.statut === 'En attente').length;
    const validees = demandes.filter(d => d.statut === 'Validée').length;
    const annulees = demandes.filter(d => d.statut === 'Annulée').length;

    setStatistiques({
      total,
      enAttente,
      validees,
      annulees,
    });
  }, [demandes]);

  // Mettre à jour le statut via l'API
  const mettreAJourStatut = async (id: number, nouveauStatut: 'valider' | 'Annuler') => {
    try {
      setMiseAJourEnCours(prev => [...prev, id]);

      const response = await api.put(`/droitFamille/update/${id}`, {
        status: nouveauStatut
      });

      if (response.data.success) {
        setDemandes(demandes.map(d => {
          if (d.id === id) {
            return {
              ...d,
              statut: nouveauStatut === 'valider' ? 'Validée' : 'Annulée',
              derniereMiseAJour: new Date().toLocaleDateString('fr-FR')
            };
          }
          return d;
        }));

        setDemandesOriginales(demandesOriginales.map(d => {
          if (d.id === id) {
            return { ...d, status: nouveauStatut };
          }
          return d;
        }));

        setMessage(`Demande ${nouveauStatut === 'valider' ? 'validée' : 'annulée'} avec succès`);
        setTimeout(() => setMessage(''), 3000);
        return true;
      } else {
        setMessage('Erreur lors de la mise à jour');
        return false;
      }
    } catch (error: any) {
      console.error('Erreur update:', error);
      setMessage('Erreur de connexion au serveur');
      return false;
    } finally {
      setTimeout(() => {
        setMiseAJourEnCours(prev => prev.filter(itemId => itemId !== id));
      }, 500);
    }
  };

  // Fonctions de gestion
  const validerDemande = async (id: number) => {
    await mettreAJourStatut(id, 'valider');
  };

  const annulerDemande = async (id: number) => {
    await mettreAJourStatut(id, 'Annuler');
  };

  // Filtrage et tri
  const demandesFiltrees = demandes
    .filter(d => {
      const matchRecherche = 
        d.nomDemandeur.toLowerCase().includes(recherche.toLowerCase()) ||
        d.numeroDossier.toLowerCase().includes(recherche.toLowerCase()) ||
        d.typeDemande.toLowerCase().includes(recherche.toLowerCase()) ||
        d.donneesOriginales.user?.email?.toLowerCase().includes(recherche.toLowerCase());
      
      const matchStatut = filtreStatut === 'Tous' || d.statut === filtreStatut;

      return matchRecherche && matchStatut;
    })
    .sort((a, b) => {
      if (tri === 'date') {
        const dateA = new Date(a.donneesOriginales.createdAt);
        const dateB = new Date(b.donneesOriginales.createdAt);
        return ordreTri === 'asc' 
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }
      if (tri === 'nom') {
        return ordreTri === 'asc'
          ? a.nomDemandeur.localeCompare(b.nomDemandeur)
          : b.nomDemandeur.localeCompare(a.nomDemandeur);
      }
      if (tri === 'priorite') {
        const prioriteOrder = { 'Haute': 3, 'Moyenne': 2, 'Basse': 1 };
        return ordreTri === 'asc'
          ? prioriteOrder[a.priorite] - prioriteOrder[b.priorite]
          : prioriteOrder[b.priorite] - prioriteOrder[a.priorite];
      }
      return 0;
    });

  // Styles pour les statuts avec la nouvelle palette
  const getStatutStyle = (statut: string) => {
    switch (statut) {
      case 'Validée':
        return 'bg-[#556B2F]/20 text-[#556B2F] border border-[#556B2F]/30';
      case 'Annulée':
        return 'bg-[#8B4513]/10 text-[#8B4513] border border-[#8B4513]/30';
      case 'En attente':
        return 'bg-[#D3D3D3]/30 text-gray-800 border border-[#D3D3D3]';
      default:
        return 'bg-[#D3D3D3]/20 text-gray-800 border border-[#D3D3D3]';
    }
  };

  // Filtres de statut
  const filtresStatut = ['Tous', 'En attente', 'Validée', 'Annulée'];

  if (chargement && demandes.length === 0) {
    return (
      <div style={{ backgroundColor: '#FFFFFF0' }} className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4" style={{ color: '#6B8E23' }} />
          <p className="text-gray-800">Chargement des demandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FFFFFF0' }} className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2" style={{ color: '#556B2F' }}>
            <FileText className="w-8 h-8" style={{ color: '#6B8E23' }} />
            Toutes les Demandes de Droit de Famille
          </h1>
        </div>

        {/* Message de notification */}
        {message && (
          <div className={`mb-6 p-4 border rounded-lg flex items-center justify-between animate-fadeIn ${
            message.includes('succès') || message.includes('chargées')
              ? 'border-[#556B2F]/30 bg-[#556B2F]/10'
              : message.includes('Erreur')
              ? 'border-[#8B4513]/30 bg-[#8B4513]/10'
              : 'border-[#6B8E23]/30 bg-[#6B8E23]/10'
          }`}
          style={{
            color: message.includes('succès') || message.includes('chargées') 
              ? '#556B2F' 
              : message.includes('Erreur')
              ? '#8B4513'
              : '#6B8E23'
          }}>
            <div className="flex items-center gap-2">
              {message.includes('succès') || message.includes('chargées') ? (
                <CheckCircle className="w-5 h-5" style={{ color: '#556B2F' }} />
              ) : message.includes('Erreur') ? (
                <XCircle className="w-5 h-5" style={{ color: '#8B4513' }} />
              ) : (
                <Clock className="w-5 h-5" style={{ color: '#6B8E23' }} />
              )}
              <span>{message}</span>
            </div>
            <button 
              onClick={() => setMessage('')} 
              className="hover:opacity-75 transition-opacity"
              style={{ color: message.includes('succès') || message.includes('chargées') 
                ? '#556B2F' 
                : message.includes('Erreur')
                ? '#8B4513'
                : '#6B8E23'
              }}
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Section Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="rounded-lg shadow p-4 border border-[#D3D3D3] hover:shadow-md transition-shadow" style={{ backgroundColor: '#FFFFFF0' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-800">Total Demandes</p>
                <p className="text-2xl font-bold" style={{ color: '#556B2F' }}>{statistiques.total}</p>
                <p className="text-xs text-gray-800 mt-1">{demandesOriginales.length} données brutes</p>
              </div>
              <FileText className="w-8 h-8" style={{ color: '#6B8E23' }} />
            </div>
          </div>

          <div className="rounded-lg shadow p-4 border border-[#D3D3D3] hover:shadow-md transition-shadow" style={{ backgroundColor: '#FFFFFF0' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-800">En attente</p>
                <p className="text-2xl font-bold" style={{ color: '#8B4513' }}>{statistiques.enAttente}</p>
              </div>
              <Clock className="w-8 h-8" style={{ color: '#8B4513' }} />
            </div>
          </div>

          <div className="rounded-lg shadow p-4 border border-[#D3D3D3] hover:shadow-md transition-shadow" style={{ backgroundColor: '#FFFFFF0' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-800">Validées</p>
                <p className="text-2xl font-bold" style={{ color: '#556B2F' }}>{statistiques.validees}</p>
              </div>
              <CheckCircle className="w-8 h-8" style={{ color: '#556B2F' }} />
            </div>
          </div>

          <div className="rounded-lg shadow p-4 border border-[#D3D3D3] hover:shadow-md transition-shadow" style={{ backgroundColor: '#FFFFFF0' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-800">Annulées</p>
                <p className="text-2xl font-bold" style={{ color: '#8B4513' }}>{statistiques.annulees}</p>
              </div>
              <XCircle className="w-8 h-8" style={{ color: '#8B4513' }} />
            </div>
          </div>
        </div>

        {/* Barre d'actions */}
        <div className="rounded-lg shadow p-4 mb-6" style={{ backgroundColor: '#FFFFFF0', border: '1px solid #D3D3D3' }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" style={{ color: '#8B4513' }} />
                <input
                  type="text"
                  placeholder="Rechercher par nom, numéro dossier, type ou email..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 transition-all"
                  style={{ 
                    borderColor: '#D3D3D3',
                    color: '#556B2F',
                    backgroundColor: '#FFFFFF0'
                  }}
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                className="px-4 py-2 border rounded-lg focus:ring-2 transition-all"
                style={{ 
                  borderColor: '#D3D3D3',
                  color: '#556B2F',
                  backgroundColor: '#FFFFFF0'
                }}
                value={filtreStatut}
                onChange={(e) => setFiltreStatut(e.target.value)}
              >
                {filtresStatut.map(statut => (
                  <option key={statut} value={statut}>
                    Statut: {statut}
                  </option>
                ))}
              </select>
              
              <button
                onClick={() => {
                  setTri('date');
                  setOrdreTri(ordreTri === 'asc' ? 'desc' : 'asc');
                }}
                className="px-4 py-2 border rounded-lg hover:bg-[#D3D3D3]/10 transition-colors flex items-center gap-2"
                style={{ 
                  borderColor: '#D3D3D3',
                  color: '#6B8E23'
                }}
              >
                Trier par date
                {ordreTri === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              <button
                onClick={() => fetchDemandes()}
                className="px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors flex items-center gap-2"
                style={{ 
                  backgroundColor: '#6B8E23'
                }}
              >
                <Loader2 className={`w-4 h-4 ${chargement ? 'animate-spin' : ''}`} />
                Rafraîchir
              </button>
            </div>
          </div>
        </div>

        {/* Tableau des demandes */}
        <div className="rounded-lg shadow overflow-hidden" style={{ backgroundColor: '#FFFFFF0', border: '1px solid #D3D3D3' }}>
          {demandesFiltrees.length > 0 ? (
            <>
              <div className="px-6 py-3 border-b" style={{ borderColor: '#D3D3D3', backgroundColor: '#D3D3D3/10' }}>
                <p className="text-sm text-gray-800">
                  Affichage de {demandesFiltrees.length} demande{demandesFiltrees.length > 1 ? 's' : ''} 
                  {recherche && ` pour "${recherche}"`}
                  {filtreStatut !== 'Tous' && ` avec statut "${filtreStatut}"`}
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y" style={{ borderColor: '#D3D3D3' }}>
                  <thead style={{ backgroundColor: '#D3D3D3/10' }}>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#556B2F' }}>
                        N° Dossier
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#556B2F' }}>
                        Demandeur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#556B2F' }}>
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#556B2F' }}>
                        Date dépôt
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#556B2F' }}>
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: '#556B2F' }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: '#D3D3D3/30' }}>
                    {demandesFiltrees.map((d) => (
                      <tr 
                        key={d.id} 
                        className="hover:bg-[#D3D3D3]/10 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium" style={{ color: '#556B2F' }}>{d.numeroDossier}</div>
                          <div className="text-xs text-gray-800">ID: {d.id}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: '#6B8E23/20' }}>
                              <User className="w-4 h-4" style={{ color: '#6B8E23' }} />
                            </div>
                            <div>
                              <div className="font-medium" style={{ color: '#556B2F' }}>{d.nomDemandeur}</div>
                              <div className="text-sm text-gray-800">{d.donneesOriginales.user?.email || 'Email non disponible'}</div>
                              <div className="text-xs text-gray-800">UserID: {d.donneesOriginales.userId.substring(0, 8)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium" style={{ color: '#556B2F' }}>{d.typeDemande}</div>
                          {d.donneesOriginales.serviceType && (
                            <div className="text-xs text-gray-800">
                              Service: {d.donneesOriginales.serviceType}
                            </div>
                          )}
                          {d.donneesOriginales.sousType && (
                            <div className="text-xs text-gray-800">
                              Sous-type: {d.donneesOriginales.sousType}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div style={{ color: '#556B2F' }}>{d.dateDepot}</div>
                          <div className="text-xs text-gray-800">
                            {new Date(d.donneesOriginales.createdAt).toLocaleTimeString('fr-FR')}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatutStyle(d.statut)}`}>
                            {d.statut}
                          </span>
                          <div className="text-xs text-gray-800 mt-1">
                            Origine: {d.donneesOriginales.status}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => validerDemande(d.id)}
                              disabled={miseAJourEnCours.includes(d.id) || d.statut === 'Validée'}
                              className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
                                miseAJourEnCours.includes(d.id) || d.statut === 'Validée'
                                  ? 'bg-[#D3D3D3]/20 text-gray-800 cursor-not-allowed'
                                  : 'hover:opacity-90'
                              }`}
                              style={{ 
                                backgroundColor: miseAJourEnCours.includes(d.id) || d.statut === 'Validée'
                                  ? '#D3D3D3/20'
                                  : '#556B2F',
                                color: miseAJourEnCours.includes(d.id) || d.statut === 'Validée'
                                  ? 'gray-800'
                                  : 'white'
                              }}
                            >
                              {miseAJourEnCours.includes(d.id) ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Traitement...
                                </>
                              ) : d.statut === 'Validée' ? (
                                <>
                                  <CheckCircle className="w-4 h-4" />
                                  Validée
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="w-4 h-4" />
                                  Valider
                                </>
                              )}
                            </button>
                            
                            <button
                              onClick={() => annulerDemande(d.id)}
                              disabled={miseAJourEnCours.includes(d.id) || d.statut === 'Annulée'}
                              className={`px-4 py-2 rounded-md transition-colors flex items-center gap-2 ${
                                miseAJourEnCours.includes(d.id) || d.statut === 'Annulée'
                                  ? 'bg-[#D3D3D3]/20 text-gray-800 cursor-not-allowed'
                                  : 'hover:opacity-90'
                              }`}
                              style={{ 
                                backgroundColor: miseAJourEnCours.includes(d.id) || d.statut === 'Annulée'
                                  ? '#D3D3D3/20'
                                  : '#8B4513',
                                color: miseAJourEnCours.includes(d.id) || d.statut === 'Annulée'
                                  ? 'gray-800'
                                  : 'white'
                              }}
                            >
                              {miseAJourEnCours.includes(d.id) ? (
                                <>
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                  Traitement...
                                </>
                              ) : d.statut === 'Annulée' ? (
                                <>
                                  <XCircle className="w-4 h-4" />
                                  Annulée
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-4 h-4" />
                                  Annuler
                                </>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 mx-auto mb-4" style={{ color: '#D3D3D3' }} />
              <p className="text-gray-800">Aucune demande trouvée</p>
              <p className="text-sm text-gray-800 mt-2">
                Vérifiez vos filtres ou essayez de rafraîchir les données
              </p>
              <button
                onClick={() => fetchDemandes()}
                className="mt-4 px-4 py-2 text-white rounded-lg hover:opacity-90 transition-colors"
                style={{ backgroundColor: '#6B8E23' }}
              >
                Rafraîchir les données
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemandeDroitFamille;