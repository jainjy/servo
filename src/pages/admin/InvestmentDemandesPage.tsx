import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
  const [hoveredCell, setHoveredCell] = useState<{rowId: string, column: string} | null>(null);

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

  // Fonction pour tronquer le texte
  const truncateText = (text: string, maxLength: number = 20) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Chargement des demandes...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div>
        <h1 className="text-3xl font-bold">Demandes d'Investissement International</h1>
        <p className="text-muted-foreground">
          Gestion des demandes d'investissement à l'étranger
        </p>
      </div>

      {/* Statistiques */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Demandes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Ce Mois</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.ceMois}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">En Attente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.parStatut.find((s: any) => s.status === 'en_attente')?._count?._all || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pays Populaire</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {getPaysNom(stats.parPays[0]?.pays_interet) || '-'}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tableau des demandes */}
      <Card className="w-[1090px] ml-[-45px] bg-red-100/50">
        <CardHeader>
          <CardTitle>Liste des Demandes</CardTitle>
          <CardDescription>
            {demandes.length} demande(s) d'investissement
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {/* Supprimer complètement le overflow-x-auto */}
          <div className="ml-[5px] w-[1080px]">
            <div className="inline-block align-middle w-[1070px]">
              <div className="border rounded-lg w-[1080px]">
                <Table className="w-[1070px]">
                  <TableHeader className="bg-gray-200">
                    <TableRow>
                      <TableHead className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</TableHead>
                      <TableHead className="w-40 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</TableHead>
                      <TableHead className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Téléphone</TableHead>
                      <TableHead className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pays</TableHead>
                      <TableHead className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</TableHead>
                      <TableHead className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</TableHead>
                      <TableHead className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</TableHead>
                      <TableHead className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</TableHead>
                      <TableHead className="w-40 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="bg-white divide-y divide-gray-200">
                    {demandes.map((demande) => (
                      <TableRow key={demande.id} className="hover:bg-gray-50">
                        {/* Nom */}
                        <TableCell className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 w-25">
                          <div 
                            className="relative"
                            onMouseEnter={() => setHoveredCell({rowId: demande.id, column: 'nom'})}
                            onMouseLeave={() => setHoveredCell(null)}
                          >
                            <span className="block truncate">
                              {truncateText(demande.nom, 15)}
                            </span>
                            {hoveredCell?.rowId === demande.id && hoveredCell?.column === 'nom' && (
                              <div className="absolute z-10 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg bottom-full left-1/2 transform -translate-x-1/2 mb-2 whitespace-nowrap">
                                {demande.nom}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                              </div>
                            )}
                          </div>
                        </TableCell>

                        {/* Email */}
                        <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 w-25">
                          <div 
                            className="relative"
                            onMouseEnter={() => setHoveredCell({rowId: demande.id, column: 'email'})}
                            onMouseLeave={() => setHoveredCell(null)}
                          >
                            <span className="block truncate">
                              {truncateText(demande.email, 20)}
                            </span>
                            {hoveredCell?.rowId === demande.id && hoveredCell?.column === 'email' && (
                              <div className="absolute z-10 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg bottom-full left-1/2 transform -translate-x-1/2 mb-2 whitespace-nowrap">
                                {demande.email}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                              </div>
                            )}
                          </div>
                        </TableCell>

                        {/* Téléphone */}
                        <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 w-25">
                          <div 
                            className="relative"
                            onMouseEnter={() => setHoveredCell({rowId: demande.id, column: 'telephone'})}
                            onMouseLeave={() => setHoveredCell(null)}
                          >
                            <span className="block truncate">
                              {truncateText(demande.telephone, 12)}
                            </span>
                            {hoveredCell?.rowId === demande.id && hoveredCell?.column === 'telephone' && (
                              <div className="absolute z-10 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg bottom-full left-1/2 transform -translate-x-1/2 mb-2 whitespace-nowrap">
                                {demande.telephone}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                              </div>
                            )}
                          </div>
                        </TableCell>

                        {/* Pays */}
                        <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 w-25">
                          {getPaysNom(demande.pays_interet)}
                        </TableCell>

                        {/* Type */}
                        <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 w-25">
                          <div 
                            className="relative"
                            onMouseEnter={() => setHoveredCell({rowId: demande.id, column: 'type'})}
                            onMouseLeave={() => setHoveredCell(null)}
                          >
                            <span className="block truncate">
                              {truncateText(demande.type_investissement, 15)}
                            </span>
                            {hoveredCell?.rowId === demande.id && hoveredCell?.column === 'type' && (
                              <div className="absolute z-10 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg bottom-full left-1/2 transform -translate-x-1/2 mb-2 whitespace-nowrap">
                                {demande.type_investissement}
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                              </div>
                            )}
                          </div>
                        </TableCell>

                        {/* Budget */}
                        <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 w-25">
                          {demande.budget}
                        </TableCell>

                        {/* Statut */}
                        <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 w-25">
                          {getStatusBadge(demande.status)}
                        </TableCell>

                        {/* Date */}
                        <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 w-25">
                          {new Date(demande.created_at).toLocaleDateString('fr-FR')}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 w-25">
                          <Select
                            value={demande.status}
                            onValueChange={(value) => updateStatus(demande.id, value)}
                          >
                            <SelectTrigger className="w-25">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en_attente">En attente</SelectItem>
                              <SelectItem value="en_cours">En cours</SelectItem>
                              <SelectItem value="traite">Traité</SelectItem>
                              <SelectItem value="annule">Annulé</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>

          {demandes.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Aucune demande d'investissement pour le moment
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvestmentDemandesPage;