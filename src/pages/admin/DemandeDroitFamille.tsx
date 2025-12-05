import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  FileText, 
  AlertCircle,
  Calendar,
  Search,
  ChevronDown,
  ChevronUp,
  Loader2
} from 'lucide-react';
import api from "../../lib/api.js";

// Types TypeScript basés sur le schéma Prisma
interface DemandeDroitFamille {
  id: number;
  userId: string;
  serviceId: number;
  serviceType?: string;
  sousType?: string;
  description?: string;
  status: 'pending' | 'valider' | 'Annuler';
  createdAt: string;
  user?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  service?: {
    id: number;
    name: string;
  };
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
  const [selection, setSelection] = useState<number[]>([]);
  const [message, setMessage] = useState<string>('');
  const [chargement, setChargement] = useState(true);
  const [miseAJourEnCours, setMiseAJourEnCours] = useState<number[]>([]);
  const [miseAJourSelectionEnCours, setMiseAJourSelectionEnCours] = useState(false);

  // Fonction pour transformer les données de l'API
  const transformerDonnees = (data: DemandeDroitFamille[]): DemandeTransformee[] => {
    return data.map((item, index) => {
      // Déterminer le type de demande
      let typeDemande = item.serviceType || item.sousType || 'Non spécifié';
      if (typeDemande.includes('divorce')) typeDemande = 'Divorce';
      else if (typeDemande.includes('garde')) typeDemande = 'Garde d\'enfants';
      else if (typeDemande.includes('pension')) typeDemande = 'Pension alimentaire';
      else if (typeDemande.includes('autorite')) typeDemande = 'Autorité parentale';
      else if (typeDemande.includes('adoption')) typeDemande = 'Adoption';

      // Transformer le statut
      let statut: 'En attente' | 'Validée' | 'Annulée' = 'En attente';
      if (item.status === 'valider') statut = 'Validée';
      else if (item.status === 'Annuler') statut = 'Annulée';

      // Générer un numéro de dossier
      const numeroDossier = `DF-${new Date(item.createdAt).getFullYear()}-${(index + 1).toString().padStart(3, '0')}`;

      // Nom du demandeur
      const nomDemandeur = item.user 
        ? `${item.user.firstName} ${item.user.lastName}`
        : 'Demandeur inconnu';

      // Priorité aléatoire (pour démo - à adapter selon vos règles)
      const priorites: ('Haute' | 'Moyenne' | 'Basse')[] = ['Haute', 'Moyenne', 'Basse'];
      const priorite = priorites[Math.floor(Math.random() * priorites.length)];

      return {
        id: item.id,
        numeroDossier,
        nomDemandeur,
        typeDemande,
        dateDepot: new Date(item.createdAt).toISOString().split('T')[0],
        statut,
        priorite,
        piecesManquantes: Math.floor(Math.random() * 6), // Pour démo
        derniereMiseAJour: new Date(item.createdAt).toISOString().split('T')[0],
        donneesOriginales: item
      };
    });
  };

  // Récupérer les données depuis l'API
  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        setChargement(true);
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage('Veuillez vous connecter');
          return;
        }

        const response = await api.get('/droitFamille', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.data.success) {
          setDemandesOriginales(response.data.data);
          const donneesTransformees = transformerDonnees(response.data.data);
          setDemandes(donneesTransformees);
        } else {
          setMessage('Erreur lors du chargement des données');
        }
      } catch (error) {
        console.error('Erreur fetch:', error);
        setMessage('Erreur de connexion au serveur');
      } finally {
        setChargement(false);
      }
    };

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
      
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('Veuillez vous reconnecter');
        return false;
      }

      const response = await api.put(`/droitFamille/update/${id}`, {
        status: nouveauStatut
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        // Mettre à jour l'état local
        setDemandes(demandes.map(d => {
          if (d.id === id) {
            return {
              ...d,
              statut: nouveauStatut === 'valider' ? 'Validée' : 'Annulée',
              derniereMiseAJour: new Date().toISOString().split('T')[0]
            };
          }
          return d;
        }));

        // Mettre à jour les données originales
        setDemandesOriginales(demandesOriginales.map(d => {
          if (d.id === id) {
            return { ...d, status: nouveauStatut };
          }
          return d;
        }));

        setMessage(`Demande ${id} ${nouveauStatut === 'valider' ? 'validée' : 'annulée'} avec succès`);
        setTimeout(() => setMessage(''), 3000);
        return true;
      } else {
        setMessage('Erreur lors de la mise à jour');
        return false;
      }
    } catch (error) {
      console.error('Erreur update:', error);
      setMessage('Erreur de connexion au serveur');
      return false;
    } finally {
      setMiseAJourEnCours(prev => prev.filter(itemId => itemId !== id));
    }
  };

  // Fonctions de gestion avec animation
  const validerDemande = async (id: number) => {
    const success = await mettreAJourStatut(id, 'valider');
    if (success) {
      // Animation visuelle supplémentaire
      const element = document.getElementById(`demande-${id}`);
      if (element) {
        element.classList.add('bg-green-50', 'transition-colors', 'duration-500');
        setTimeout(() => {
          element.classList.remove('bg-green-50');
        }, 1000);
      }
    }
  };

  const annulerDemande = async (id: number) => {
    const success = await mettreAJourStatut(id, 'Annuler');
    if (success) {
      // Animation visuelle supplémentaire
      const element = document.getElementById(`demande-${id}`);
      if (element) {
        element.classList.add('bg-red-50', 'transition-colors', 'duration-500');
        setTimeout(() => {
          element.classList.remove('bg-red-50');
        }, 1000);
      }
    }
  };

  const validerSelection = async () => {
    if (selection.length === 0) return;
    
    setMiseAJourSelectionEnCours(true);
    
    // Animer le bouton
    const bouton = document.getElementById('btn-valider-selection');
    if (bouton) {
      bouton.classList.add('animate-pulse');
    }
    
    try {
      const promises = selection.map(id => mettreAJourStatut(id, 'valider'));
      const results = await Promise.all(promises);
      
      const successCount = results.filter(r => r).length;
      setMessage(`${successCount} demande(s) validée(s) avec succès`);
      
      // Animation de confirmation
      const section = document.querySelector('.bg-blue-50');
      if (section) {
        section.classList.add('bg-green-50', 'border-green-200', 'transition-all', 'duration-700');
        setTimeout(() => {
          if (section) {
            section.classList.remove('bg-green-50', 'border-green-200');
          }
        }, 2000);
      }
      
    } catch (error) {
      setMessage('Erreur lors de la validation de la sélection');
    } finally {
      setSelection([]);
      setMiseAJourSelectionEnCours(false);
      
      if (bouton) {
        bouton.classList.remove('animate-pulse');
      }
      
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const annulerSelection = async () => {
    if (selection.length === 0) return;
    
    setMiseAJourSelectionEnCours(true);
    
    // Animer le bouton
    const bouton = document.getElementById('btn-annuler-selection');
    if (bouton) {
      bouton.classList.add('animate-pulse');
    }
    
    try {
      const promises = selection.map(id => mettreAJourStatut(id, 'Annuler'));
      const results = await Promise.all(promises);
      
      const successCount = results.filter(r => r).length;
      setMessage(`${successCount} demande(s) annulée(s)`);
      
      // Animation de confirmation
      const section = document.querySelector('.bg-blue-50');
      if (section) {
        section.classList.add('bg-red-50', 'border-red-200', 'transition-all', 'duration-700');
        setTimeout(() => {
          if (section) {
            section.classList.remove('bg-red-50', 'border-red-200');
          }
        }, 2000);
      }
      
    } catch (error) {
      setMessage('Erreur lors de l\'annulation de la sélection');
    } finally {
      setSelection([]);
      setMiseAJourSelectionEnCours(false);
      
      if (bouton) {
        bouton.classList.remove('animate-pulse');
      }
      
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const toggleSelection = (id: number) => {
    setSelection(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
    
    // Animation sur la ligne sélectionnée
    const element = document.getElementById(`demande-${id}`);
    if (element) {
      element.classList.add('scale-[1.02]', 'transition-transform', 'duration-300');
      setTimeout(() => {
        element.classList.remove('scale-[1.02]');
      }, 300);
    }
  };

  const toggleSelectionTout = () => {
    if (selection.length === demandesFiltrees.length) {
      setSelection([]);
    } else {
      setSelection(demandesFiltrees.map(d => d.id));
      
      // Animation sur toutes les lignes
      demandesFiltrees.forEach(d => {
        const element = document.getElementById(`demande-${d.id}`);
        if (element) {
          element.classList.add('scale-[1.01]', 'transition-transform', 'duration-200');
          setTimeout(() => {
            element.classList.remove('scale-[1.01]');
          }, 200);
        }
      });
    }
  };

  // Filtrage et tri
  const demandesFiltrees = demandes
    .filter(d => {
      const matchRecherche = 
        d.nomDemandeur.toLowerCase().includes(recherche.toLowerCase()) ||
        d.numeroDossier.toLowerCase().includes(recherche.toLowerCase());
      
      const matchStatut = filtreStatut === 'Tous' || d.statut === filtreStatut;

      return matchRecherche && matchStatut;
    })
    .sort((a, b) => {
      if (tri === 'date') {
        return ordreTri === 'asc' 
          ? new Date(a.dateDepot).getTime() - new Date(b.dateDepot).getTime()
          : new Date(b.dateDepot).getTime() - new Date(a.dateDepot).getTime();
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
        return 'bg-green-100 text-green-800 border-green-300';
      case 'Annulée':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'En attente':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Filtres de statut
  const filtresStatut = ['Tous', 'En attente', 'Validée', 'Annulée'];

  if (chargement) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement des demandes...</p>
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
            Gestion des Demandes de Droit de Famille
          </h1>
          <p className="text-gray-600 mt-2">
            Consultez, gérez et traitez les demandes de droit de famille
          </p>
        </div>

        {/* Message de notification */}
        {message && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <span className="text-green-700">{message}</span>
            </div>
            <button 
              onClick={() => setMessage('')} 
              className="text-green-700 hover:text-green-900 transition-colors"
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
                  placeholder="Rechercher par nom ou numéro de dossier..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={recherche}
                  onChange={(e) => setRecherche(e.target.value)}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={filtreStatut}
                onChange={(e) => setFiltreStatut(e.target.value)}
              >
                {filtresStatut.map(statut => (
                  <option key={statut} value={statut}>
                    {statut}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Actions de sélection */}
        {selection.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-blue-600" />
              <span className="text-blue-700 font-medium">
                {selection.length} demande(s) sélectionnée(s)
              </span>
            </div>
            <div className="flex gap-2">
              <button
                id="btn-valider-selection"
                onClick={validerSelection}
                disabled={miseAJourSelectionEnCours}
                className={`flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all ${miseAJourSelectionEnCours ? 'opacity-75' : ''}`}
              >
                {miseAJourSelectionEnCours ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4" />
                )}
                Valider la sélection
              </button>
              <button
                id="btn-annuler-selection"
                onClick={annulerSelection}
                disabled={miseAJourSelectionEnCours}
                className={`flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all ${miseAJourSelectionEnCours ? 'opacity-75' : ''}`}
              >
                {miseAJourSelectionEnCours ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                Annuler la sélection
              </button>
              <button
                onClick={() => setSelection([])}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Désélectionner
              </button>
            </div>
          </div>
        )}

        {/* Tableau des demandes */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selection.length === demandesFiltrees.length && demandesFiltrees.length > 0}
                        onChange={toggleSelectionTout}
                        className="rounded border-gray-300 focus:ring-blue-500 transition-all"
                      />
                      <span className="text-xs font-medium text-gray-500 uppercase">Sélection</span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    <button
                      className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                      onClick={() => {
                        setTri('numeroDossier');
                        setOrdreTri(ordreTri === 'asc' ? 'desc' : 'asc');
                      }}
                    >
                      N° Dossier
                      {tri === 'numeroDossier' && (
                        ordreTri === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    <button
                      className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                      onClick={() => {
                        setTri('nom');
                        setOrdreTri(ordreTri === 'asc' ? 'desc' : 'asc');
                      }}
                    >
                      Demandeur
                      {tri === 'nom' && (
                        ordreTri === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    <button
                      className="flex items-center gap-1 hover:text-gray-700 transition-colors"
                      onClick={() => {
                        setTri('date');
                        setOrdreTri(ordreTri === 'asc' ? 'desc' : 'asc');
                      }}
                    >
                      Date dépôt
                      {tri === 'date' && (
                        ordreTri === 'asc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {demandesFiltrees.map((demande) => (
                  <tr 
                    key={demande.id}
                    id={`demande-${demande.id}`}
                    className={`hover:bg-gray-50 transition-all ${selection.includes(demande.id) ? 'bg-blue-50' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selection.includes(demande.id)}
                        onChange={() => toggleSelection(demande.id)}
                        className="rounded border-gray-300 focus:ring-blue-500 transition-all"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {demande.numeroDossier}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {demande.nomDemandeur}
                          </div>
                          <div className="text-xs text-gray-500">
                            Dernière maj: {demande.derniereMiseAJour}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{demande.typeDemande}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div className="text-sm text-gray-900">{demande.dateDepot}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatutStyle(demande.statut)}`}>
                        {demande.statut}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => validerDemande(demande.id)}
                          disabled={demande.statut === 'Validée' || demande.statut === 'Annulée' || miseAJourEnCours.includes(demande.id)}
                          className={`flex items-center gap-1 px-3 py-1 rounded text-sm transition-all ${demande.statut === 'Validée' || demande.statut === 'Annulée' 
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-green-100 text-green-700 hover:bg-green-200 hover:scale-105'} ${miseAJourEnCours.includes(demande.id) ? 'animate-pulse' : ''}`}
                        >
                          {miseAJourEnCours.includes(demande.id) ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          Valider
                        </button>
                        <button
                          onClick={() => annulerDemande(demande.id)}
                          disabled={demande.statut === 'Annulée' || demande.statut === 'Validée' || miseAJourEnCours.includes(demande.id)}
                          className={`flex items-center gap-1 px-3 py-1 rounded text-sm transition-all ${demande.statut === 'Annulée' || demande.statut === 'Validée'
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                            : 'bg-red-100 text-red-700 hover:bg-red-200 hover:scale-105'} ${miseAJourEnCours.includes(demande.id) ? 'animate-pulse' : ''}`}
                        >
                          {miseAJourEnCours.includes(demande.id) ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                          Annuler
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pied de tableau */}
          {demandesFiltrees.length === 0 ? (
            <div className="p-8 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Aucune demande trouvée</p>
            </div>
          ) : (
            <div className="px-6 py-4 border-t border-gray-200 flex flex-col md:flex-row md:items-center justify-between">
              <div className="text-sm text-gray-500 mb-2 md:mb-0">
                Affichage de <span className="font-medium">{demandesFiltrees.length}</span> demandes
              </div>
              <div className="flex items-center gap-4">
                <div className="text-sm text-gray-500">
                  <span className="font-medium">{statistiques.enAttente}</span> en attente de validation
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Styles d'animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DemandeDroitFamille;