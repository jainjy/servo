import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, Globe, TrendingUp, Calendar, Filter } from 'lucide-react';

interface InvestmentRequest {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  pays_interet: string;
  type_investissement: string;
  budget: string;
  message: string;
  status: string;
  created_at: string;
  user: any;
}

const InvestmentDemandesPage = () => {
  const [demandes, setDemandes] = useState<InvestmentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [filterStatus, setFilterStatus] = useState<string>('tous');

  // Charger les demandes
  const fetchDemandes = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/investissement/admin/demandes');
      const result = await response.json();
      if (result.success) {
        setDemandes(result.data);
      }
    } catch (error) {
      console.error('Erreur chargement demandes:', error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les statistiques
  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/investissement/admin/statistiques');
      const result = await response.json();
      if (result.success) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  // Mettre à jour le statut
  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/investissement/admin/demandes/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      const result = await response.json();
      if (result.success) {
        // Recharger les demandes
        fetchDemandes();
      }
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
    }
  };

  useEffect(() => {
    fetchDemandes();
    fetchStats();
  }, []);

  const getStatusBadge = (status: string) => {
    const statusConfig: any = {
      'en_attente': { label: 'En attente', variant: 'secondary' },
      'en_cours': { label: 'En cours', variant: 'default' },
      'traite': { label: 'Traité', variant: 'success' },
      'annule': { label: 'Annulé', variant: 'destructive' }
    };

    const config = statusConfig[status] || { label: status, variant: 'outline' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getPaysNom = (paysCode: string) => {
    const paysMap: any = {
      'maurice': 'Île Maurice',
      'madagascar': 'Madagascar',
      'dubai': 'Dubaï',
      'portugal': 'Portugal'
    };
    return paysMap[paysCode] || paysCode;
  };

  const filteredDemandes = filterStatus === 'tous' 
    ? demandes 
    : demandes.filter(d => d.status === filterStatus);

  if (loading) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement des demandes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* En-tête */}
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold">Demandes d'Investissement</h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Gestion des demandes d'investissement à l'étranger
        </p>
      </div>

      {/* Statistiques - Grid responsive */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Total Demandes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Ce Mois
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">{stats.ceMois}</div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium">En Attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold">
                {stats.parStatut.find((s: any) => s.status === 'en_attente')?._count?._all || 0}
              </div>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Top Pays
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-xl font-bold truncate">
                {getPaysNom(stats.parPays[0]?.pays_interet) || '-'}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtres */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              <h2 className="font-semibold">Filtres</h2>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tous">Tous les statuts</SelectItem>
                <SelectItem value="en_attente">En attente</SelectItem>
                <SelectItem value="en_cours">En cours</SelectItem>
                <SelectItem value="traite">Traité</SelectItem>
                <SelectItem value="annule">Annulé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Cartes des demandes - Grid responsive */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDemandes.map((demande) => (
          <Card key={demande.id} className="hover:shadow-lg transition-shadow overflow-hidden">
            <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-transparent">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base md:text-lg truncate">{demande.nom}</CardTitle>
                  <CardDescription className="text-xs md:text-sm">
                    {new Date(demande.created_at).toLocaleDateString('fr-FR')}
                  </CardDescription>
                </div>
                {getStatusBadge(demande.status)}
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              {/* Email */}
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <a href={`mailto:${demande.email}`} className="text-blue-600 hover:underline truncate">
                  {demande.email}
                </a>
              </div>

              {/* Téléphone */}
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <a href={`tel:${demande.telephone}`} className="text-blue-600 hover:underline">
                  {demande.telephone}
                </a>
              </div>

              {/* Localisation */}
              <div className="flex items-center gap-3 text-sm">
                <Globe className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-700">{getPaysNom(demande.pays_interet)}</span>
              </div>

              {/* Détails investissement */}
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Type</p>
                  <p className="text-sm text-gray-900 line-clamp-2">{demande.type_investissement}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600 uppercase">Budget</p>
                  <p className="text-sm font-bold text-gray-900">{demande.budget}</p>
                </div>
              </div>

              {/* Message */}
              {demande.message && (
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs font-semibold text-gray-600 uppercase mb-1">Message</p>
                  <p className="text-sm text-gray-700 line-clamp-2">{demande.message}</p>
                </div>
              )}

              {/* Actions */}
              <div className="pt-3 border-t">
                <label className="text-xs font-semibold text-gray-600 uppercase block mb-2">
                  Modifier le statut
                </label>
                <Select
                  value={demande.status}
                  onValueChange={(value) => updateStatus(demande.id, value)}
                >
                  <SelectTrigger className="w-full text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en_attente">En attente</SelectItem>
                    <SelectItem value="en_cours">En cours</SelectItem>
                    <SelectItem value="traite">Traité</SelectItem>
                    <SelectItem value="annule">Annulé</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Message vide */}
      {filteredDemandes.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-gray-900">Aucune demande</p>
              <p className="text-sm text-muted-foreground">
                {filterStatus === 'tous' 
                  ? 'Aucune demande d\'investissement pour le moment'
                  : `Aucune demande avec le statut ${filterStatus}`
                }
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InvestmentDemandesPage;