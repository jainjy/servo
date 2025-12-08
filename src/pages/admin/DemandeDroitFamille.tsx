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
  
  // DEBUG: Log pour voir les données
  useEffect(() => {
    console.log('DEBUG - demandesOriginales:', demandesOriginales);
    console.log('DEBUG - demandes transformées:', demandes);
    console.log('DEBUG - statistiques:', statistiques);
  }, [demandesOriginales, demandes, statistiques]);

  // Fonction pour transformer les données de l'API
  const transformerDonnees = (data: DemandeDroitFamille[]): DemandeTransformee[] => {
    console.log('DEBUG - transformerDonnees appelée avec:', data);
    
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
      
      console.log('DEBUG - Item transformé:', demandeTransformee);
      return demandeTransformee;
    });
  };

  // Récupérer les données depuis l'API
  const fetchDemandes = async () => {
    try {
      setChargement(true);
      setMessage('');
      
      console.log('DEBUG - Début fetchDemandes');
      const response = await api.get('/droitFamille');
      const apiResponse: ApiResponse = response.data;

      console.log('DEBUG - Réponse API complète:', apiResponse);
      console.log('DEBUG - Données API:', apiResponse.data);
      console.log('DEBUG - Nombre de demandes:', apiResponse.data?.length);

      if (apiResponse.success && apiResponse.data) {
        setDemandesOriginales(apiResponse.data);
        const donneesTransformees = transformerDonnees(apiResponse.data);
        console.log('DEBUG - Données transformées:', donneesTransformees);
        setDemandes(donneesTransformees);
        setMessage(`${donneesTransformees.length} demandes chargées avec succès`);
      } else {
        setMessage('Erreur: Données invalides de l\'API');
      }
    } catch (error: any) {
      console.error('DEBUG - Erreur fetch:', error);
      setMessage(`Erreur: ${error.message}`);
    } finally {
      setChargement(false);
      console.log('DEBUG - Chargement terminé');
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
    
    console.log('DEBUG - Statistiques mises à jour:', { total, enAttente, validees, annulees });
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

  // Styles pour les statuts
  const getStatutStyle = (statut: string) => {
    switch (statut) {
      case 'Validée':
        return 'bg-green-100 text-green-800 border border-green-300';
      case 'Annulée':
        return 'bg-red-100 text-red-800 border border-red-300';
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-300';
    }
  };

  // Filtres de statut
  const filtresStatut = ['Tous', 'En attente', 'Validée', 'Annulée'];

  if (chargement && demandes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement des demandes...</p>
          <p className="text-sm text-gray-400">Vérification de l'API...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-8 h-8 text-green-600" />
            Toutes les Demandes de Droit de Famille
          </h1>
         
        </div>

        {/* Message de notification */}
        {message && (
          <div className={`mb-6 p-4 border rounded-lg flex items-center justify-between animate-fadeIn ${
            message.includes('succès') || message.includes('chargées')
              ? 'bg-green-50 border-green-200 text-green-700'
              : message.includes('Erreur')
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-blue-50 border-blue-200 text-blue-700'
          }`}>
            <div className="flex items-center gap-2">
              {message.includes('succès') || message.includes('chargées') ? (
                <CheckCircle className="w-5 h-5 text-green-600" />
              ) : message.includes('Erreur') ? (
                <XCircle className="w-5 h-5 text-red-600" />
              ) : (
                <Clock className="w-5 h-5 text-blue-600" />
              )}
              <span>{message}</span>
            </div>
            <button 
              onClick={() => setMessage('')} 
              className="hover:opacity-75 transition-opacity"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Section Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Demandes</p>
                <p className="text-2xl font-bold text-gray-900">{statistiques.total}</p>
                <p className="text-xs text-gray-400 mt-1">{demandesOriginales.length} données brutes</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">En attente</p>
                <p className="text-2xl font-bold text-yellow-600">{statistiques.enAttente}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Validées</p>
                <p className="text-2xl font-bold text-green-600">{statistiques.validees}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 border border-gray-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Annulées</p>
                <p className="text-2xl font-bold text-red-600">{statistiques.annulees}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>

        {/* Barre d'actions */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, numéro dossier, type ou email..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
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
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                Trier par date
                {ordreTri === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              
              <button
                onClick={() => fetchDemandes()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Loader2 className={`w-4 h-4 ${chargement ? 'animate-spin' : ''}`} />
                Rafraîchir
              </button>
            </div>
          </div>
        </div>

        {/* Tableau des demandes */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {demandesFiltrees.length > 0 ? (
            <>
              <div className="px-6 py-3 bg-gray-50 border-b border-gray-200">
                <p className="text-sm text-gray-600">
                  Affichage de {demandesFiltrees.length} demande{demandesFiltrees.length > 1 ? 's' : ''} 
                  {recherche && ` pour "${recherche}"`}
                  {filtreStatut !== 'Tous' && ` avec statut "${filtreStatut}"`}
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        N° Dossier
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Demandeur
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date dépôt
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Statut
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {demandesFiltrees.map((d) => (
                      <tr 
                        key={d.id} 
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{d.numeroDossier}</div>
                          <div className="text-xs text-gray-500">ID: {d.id}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{d.nomDemandeur}</div>
                              <div className="text-sm text-gray-500">{d.donneesOriginales.user?.email || 'Email non disponible'}</div>
                              <div className="text-xs text-gray-400">UserID: {d.donneesOriginales.userId.substring(0, 8)}...</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900">{d.typeDemande}</div>
                          {d.donneesOriginales.serviceType && (
                            <div className="text-xs text-gray-500">
                              Service: {d.donneesOriginales.serviceType}
                            </div>
                          )}
                          {d.donneesOriginales.sousType && (
                            <div className="text-xs text-gray-500">
                              Sous-type: {d.donneesOriginales.sousType}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-gray-900">{d.dateDepot}</div>
                          <div className="text-xs text-gray-500">
                            {new Date(d.donneesOriginales.createdAt).toLocaleTimeString('fr-FR')}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatutStyle(d.statut)}`}>
                            {d.statut}
                          </span>
                          <div className="text-xs text-gray-500 mt-1">
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
                                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                  : 'bg-green-600 text-white hover:bg-green-700'
                              }`}
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
                                  ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                  : 'bg-red-600 text-white hover:bg-red-700'
                              }`}
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
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucune demande trouvée</p>
              <p className="text-sm text-gray-400 mt-2">
                Vérifiez vos filtres ou essayez de rafraîchir les données
              </p>
              <button
                onClick={() => fetchDemandes()}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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