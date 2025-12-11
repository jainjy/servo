import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Phone, Globe, TrendingUp, Calendar, Filter } from 'lucide-react';
import api from '../../lib/api.js';

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
      const response = await api.get('/investissement/admin/demandes');
      if (response.data.success) {
        setDemandes(response.data.data);
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
      const response = await api.get('/investissement/admin/statistiques');
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    }
  };

  // Mettre à jour le statut
  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const response = await api.patch(`/investissement/admin/demandes/${id}/status`, {
        status: newStatus
      });

      if (response.data.success) {
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
      en_attente: {
        label: 'En attente',
        variant: 'secondary',
        className: 'bg-[#FDF5E6] text-[#8B4513] border border-[#D3D3D3]'
      },
      en_cours: {
        label: 'En cours',
        variant: 'default',
        className: 'bg-[#556B2F] text-white'
      },
      traite: {
        label: 'Traité',
        variant: 'success',
        className: 'bg-[#2E8B57] text-white'
      },
      annule: {
        label: 'Annulé',
        variant: 'destructive',
        className: 'bg-red-600 text-white'
      }
    };

    const config =
      statusConfig[status] || {
        label: status,
        variant: 'outline',
        className: 'border-[#D3D3D3] text-[#8B4513]'
      };

    return (
      <Badge variant={config.variant} className={`text-xs px-2 py-1 rounded-full ${config.className}`}>
        {config.label}
      </Badge>
    );
  };

  const getPaysNom = (paysCode: string) => {
    const paysMap: any = {
      maurice: 'Île Maurice',
      madagascar: 'Madagascar',
      dubai: 'Dubaï',
      portugal: 'Portugal'
    };
    return paysMap[paysCode] || paysCode;
  };

  const filteredDemandes =
    filterStatus === 'tous' ? demandes : demandes.filter((d) => d.status === filterStatus);

  if (loading) {
    return (
      <div className="p-4 md:p-6 min-h-screen bg-[#F5F7F0] flex items-center justify-center">
        <div className="text-lg text-[#8B4513]">Chargement des demandes...</div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 min-h-screen bg-[#F5F7F0]">
      {/* En-tête */}
      <div className="space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#556B2F] to-[#6B8E23] bg-clip-text text-transparent">
          Demandes d&apos;Investissement
        </h1>
        <p className="text-[#8B4513] text-sm md:text-base">
          Gestion centralisée des demandes d&apos;investissement à l&apos;étranger
        </p>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow border-[#D3D3D3] bg-white/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium flex items-center gap-2 text-[#8B4513]">
                <TrendingUp className="w-4 h-4 text-[#556B2F]" />
                Total Demandes
              </CardTitle>
              <CardDescription className="text-[11px] text-[#8B4513]/70">
                Toutes périodes confondues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-[#8B4513]">{stats.total}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-[#D3D3D3] bg-white/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium flex items-center gap-2 text-[#8B4513]">
                <Calendar className="w-4 h-4 text-[#556B2F]" />
                Ce mois
              </CardTitle>
              <CardDescription className="text-[11px] text-[#8B4513]/70">
                Nouvelles demandes reçues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-[#8B4513]">{stats.ceMois}</div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-[#D3D3D3] bg-white/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium text-[#8B4513]">
                En attente
              </CardTitle>
              <CardDescription className="text-[11px] text-[#8B4513]/70">
                À traiter en priorité
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-xl md:text-2xl font-bold text-[#8B4513]">
                {stats.parStatut.find((s: any) => s.status === 'en_attente')?._count?._all || 0}
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-[#D3D3D3] bg-white/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs md:text-sm font-medium flex items-center gap-2 text-[#8B4513]">
                <Globe className="w-4 h-4 text-[#556B2F]" />
                Top pays
              </CardTitle>
              <CardDescription className="text-[11px] text-[#8B4513]/70">
                Destination la plus demandée
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-lg md:text-xl font-bold text-[#8B4513] truncate">
                {getPaysNom(stats.parPays[0]?.pays_interet) || '-'}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filtres */}
      <Card className="border-[#D3D3D3] bg-white/90">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#8B4513]" />
              <h2 className="font-semibold text-[#8B4513]">Filtres</h2>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-48 border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F] bg-white text-sm">
                <SelectValue placeholder="Tous les statuts" />
              </SelectTrigger>
              <SelectContent className="border-[#D3D3D3] bg-white">
                <SelectItem value="tous" className="text-[#8B4513] text-sm">
                  Tous les statuts
                </SelectItem>
                <SelectItem value="en_attente" className="text-[#8B4513] text-sm">
                  En attente
                </SelectItem>
                <SelectItem value="en_cours" className="text-[#8B4513] text-sm">
                  En cours
                </SelectItem>
                <SelectItem value="traite" className="text-[#8B4513] text-sm">
                  Traité
                </SelectItem>
                <SelectItem value="annule" className="text-[#8B4513] text-sm">
                  Annulé
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
      </Card>

      {/* Cartes des demandes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDemandes.map((demande) => (
          <Card
            key={demande.id}
            className="hover:shadow-lg hover:-translate-y-[1px] transition-all overflow-hidden border-[#D3D3D3] bg-white/95"
          >
            <CardHeader className="pb-3 bg-gradient-to-r from-[#6B8E23]/10 to-transparent">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-base md:text-lg truncate text-[#8B4513]">
                    {demande.nom}
                  </CardTitle>
                  <CardDescription className="text-xs md:text-sm text-[#8B4513]/80">
                    {new Date(demande.created_at).toLocaleDateString('fr-FR')}
                  </CardDescription>
                </div>
                {getStatusBadge(demande.status)}
              </div>
            </CardHeader>

            <CardContent className="space-y-3 pt-3">
              {/* Email */}
              <div className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-[#8B4513]/60 flex-shrink-0" />
                <a
                  href={`mailto:${demande.email}`}
                  className="text-[#556B2F] hover:underline truncate hover:text-[#6B8E23]"
                >
                  {demande.email}
                </a>
              </div>

              {/* Téléphone */}
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-[#8B4513]/60 flex-shrink-0" />
                <a
                  href={`tel:${demande.telephone}`}
                  className="text-[#556B2F] hover:underline hover:text-[#6B8E23]"
                >
                  {demande.telephone}
                </a>
              </div>

              {/* Localisation */}
              <div className="flex items-center gap-3 text-sm">
                <Globe className="w-4 h-4 text-[#8B4513]/60 flex-shrink-0" />
                <span className="text-[#8B4513]">{getPaysNom(demande.pays_interet)}</span>
              </div>

              {/* Détails investissement */}
              <div className="bg-[#6B8E23]/5 rounded-lg p-3 space-y-2 border border-[#D3D3D3]/40">
                <div>
                  <p className="text-[11px] font-semibold text-[#8B4513] uppercase tracking-wide">
                    Type
                  </p>
                  <p className="text-sm text-[#8B4513] line-clamp-2">
                    {demande.type_investissement}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#8B4513] uppercase tracking-wide">
                    Budget
                  </p>
                  <p className="text-sm font-bold text-[#8B4513]">{demande.budget}</p>
                </div>
              </div>

              {/* Message */}
              {demande.message && (
                <div className="bg-[#556B2F]/5 rounded-lg p-3 border border-[#556B2F]/20">
                  <p className="text-[11px] font-semibold text-[#8B4513] uppercase mb-1 tracking-wide">
                    Message
                  </p>
                  <p className="text-sm text-[#8B4513] line-clamp-3">{demande.message}</p>
                </div>
              )}

              {/* Actions */}
              <div className="pt-3 border-t border-[#D3D3D3]">
                <label className="text-[11px] font-semibold text-[#8B4513] uppercase block mb-2 tracking-wide">
                  Modifier le statut
                </label>
                <Select value={demande.status} onValueChange={(value) => updateStatus(demande.id, value)}>
                  <SelectTrigger className="w-full text-sm border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F] text-[#8B4513] bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-[#D3D3D3] bg-white">
                    <SelectItem value="en_attente" className="text-[#8B4513] text-sm">
                      En attente
                    </SelectItem>
                    <SelectItem value="en_cours" className="text-[#8B4513] text-sm">
                      En cours
                    </SelectItem>
                    <SelectItem value="traite" className="text-[#8B4513] text-sm">
                      Traité
                    </SelectItem>
                    <SelectItem value="annule" className="text-[#8B4513] text-sm">
                      Annulé
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Message vide */}
      {filteredDemandes.length === 0 && (
        <Card className="text-center py-12 border-[#D3D3D3] bg-white/90">
          <CardContent>
            <div className="space-y-2">
              <p className="text-lg font-semibold text-[#8B4513]">Aucune demande</p>
              <p className="text-sm text-[#8B4513]/80">
                {filterStatus === 'tous'
                  ? "Aucune demande d'investissement pour le moment"
                  : `Aucune demande avec le statut ${filterStatus}`}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default InvestmentDemandesPage;
