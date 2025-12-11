import React, { useEffect, useState } from 'react';
import { demandeDevisAPI } from '@/services/demandeDevis';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

// Définition du thème
const theme = {
  logo: "#556B2F",
  primaryDark: "#6B8E23",
  lightBg: "#FFFFFF",
  separator: "#D3D3D3",
  secondaryText: "#8B4513",
};

interface DemandeDevis {
  id: string;
  type: 'demande' | 'devis';
  description: string;
  dateSouhaitee?: string;
  contactNom: string;
  contactPrenom: string;
  contactEmail: string;
  contactTel: string;
  contactAdresse?: string;
  typeBien?: string;
  lieuAdresse?: string;
  statut: string;
  date: string;
  serviceId?: number;
  service?: {
    libelle: string;
  };
  client?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  montantHT?: number;
  montantTTC?: number;
  numero?: string;
  dateValidite?: string;
}

const ListeDemandesDevis = () => {
  const [demandes, setDemandes] = useState<DemandeDevis[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  const chargerDemandes = async () => {
    try {
      if (!user?.id) return;
      
      const response = await demandeDevisAPI.getDevisUtilisateur(user.id);
      // Combiner et transformer les demandes et devis en un seul tableau
      console.log('Réponse API:', response); // Pour déboguer
      const demandesTransformees = [
        ...(response.demandes || []).map((d: any) => ({
          id: d.id,
          type: 'demande',
          description: d.description,
          dateSouhaitee: d.dateSouhaitee,
          contactNom: d.contactNom,
          contactPrenom: d.contactPrenom,
          contactEmail: d.contactEmail,
          contactTel: d.contactTel,
          contactAdresse: d.contactAdresse,
          typeBien: d.typeBien,
          lieuAdresse: d.lieuAdresse,
          statut: d.statut,
          date: d.createdAt ? new Date(d.createdAt).toISOString() : null,
          serviceId: d.serviceId,
          service: d.service
        })),
        ...(response.devis || []).map((d: any) => ({
          id: d.id,
          type: 'devis',
          description: d.description,
          client: d.client,
          statut: d.status,
          date: d.dateCreation ? new Date(d.dateCreation).toISOString() : null,
          service: d.demande?.service,
          montantHT: d.montantHT,
          montantTTC: d.montantTTC,
          numero: d.numero,
          dateValidite: d.dateValidite ? new Date(d.dateValidite).toISOString() : null
        }))
      ];
      setDemandes(demandesTransformees);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des demandes:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les demandes de devis",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerDemandes();
  }, [user]);

  const getStatutBadge = (statut: string) => {
    const statuts: Record<string, { label: string; variant: "default" | "destructive" | "outline" | "secondary" }> = {
      en_attente: { label: "En attente", variant: "secondary" },
      accepte: { label: "Accepté", variant: "default" },
      refuse: { label: "Refusé", variant: "destructive" },
      devis_envoye: { label: "Devis envoyé", variant: "outline" }
    };

    const statutInfo = statuts[statut] || { label: statut, variant: "secondary" };
    return <Badge variant={statutInfo.variant}>{statutInfo.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96" style={{ backgroundColor: theme.lightBg }}>
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: theme.primaryDark }} />
      </div>
    );
  }

  return (
    <div className="p-2 lg:p-0" style={{ backgroundColor: theme.lightBg }}>
      <Card style={{ 
        backgroundColor: theme.lightBg,
        borderColor: theme.separator 
      }}>
        <CardHeader>
          <CardTitle className='lg:text-2xl text-lg' style={{ color: theme.logo }}>
            Liste des Demandes de Devis
          </CardTitle>
          <CardDescription style={{ color: theme.secondaryText }}>
            Gérez toutes vos demandes de devis entrantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {demandes.length === 0 ? (
            <div className="text-center py-8" style={{ color: theme.secondaryText }}>
              Aucune demande de devis pour le moment
            </div>
          ) : (
            <div className="border rounded-lg overflow-hidden" style={{ borderColor: theme.separator }}>
              <Table>
                <TableHeader style={{ backgroundColor: `${theme.separator}10` }}>
                  <TableRow style={{ borderColor: theme.separator }}>
                    <TableHead style={{ color: theme.logo }}>Date</TableHead>
                    <TableHead style={{ color: theme.logo }}>Service</TableHead>
                    <TableHead style={{ color: theme.logo }}>Client</TableHead>
                    <TableHead style={{ color: theme.logo }}>Contact/Montant</TableHead>
                    <TableHead style={{ color: theme.logo }}>Statut</TableHead>
                    <TableHead style={{ color: theme.logo }}>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demandes.map((demande) => (
                    <TableRow key={demande.id} style={{ borderColor: `${theme.separator}80` }}>
                      <TableCell>
                        <div className="font-medium" style={{ color: theme.logo }}>
                          {demande.date ? formatDate(new Date(demande.date)) : "Date non disponible"}
                        </div>
                        {demande.dateSouhaitee && (
                          <div className="text-sm" style={{ color: theme.secondaryText }}>
                            Souhaité: {formatDate(new Date(demande.dateSouhaitee))}
                          </div>
                        )}
                      </TableCell>
                      <TableCell style={{ color: theme.secondaryText }}>
                        {demande.service?.libelle || "Service non spécifié"}
                      </TableCell>
                      <TableCell>
                        {demande.type === 'demande' ? (
                          <>
                            <div style={{ color: theme.logo }}>{demande.contactNom} {demande.contactPrenom}</div>
                            <div className="text-sm" style={{ color: theme.secondaryText }}>{demande.contactEmail}</div>
                          </>
                        ) : (
                          <>
                            <div style={{ color: theme.logo }}>{demande.client?.firstName} {demande.client?.lastName}</div>
                            <div className="text-sm" style={{ color: theme.secondaryText }}>{demande.client?.email}</div>
                          </>
                        )}
                      </TableCell>
                      <TableCell>
                        {demande.type === 'demande' ? (
                          <div style={{ color: theme.secondaryText }}>{demande.contactTel}</div>
                        ) : (
                          <div className="font-medium" style={{ color: theme.logo }}>
                            {demande.montantTTC ? `${demande.montantTTC.toFixed(2)}€` : '-'}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {getStatutBadge(demande.statut)}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {/* TODO: Ouvrir les détails */}}
                            style={{ 
                              borderColor: theme.separator,
                              color: theme.secondaryText,
                              backgroundColor: 'transparent'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = `${theme.separator}20`;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                            }}
                          >
                            Détails
                          </Button>
                          {demande.statut === "en_attente" && (
                            <Button 
                              size="sm"
                              onClick={() => {/* TODO: Répondre au devis */}}
                              style={{ 
                                backgroundColor: theme.primaryDark,
                                color: "white"
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = theme.logo;
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = theme.primaryDark;
                              }}
                            >
                              Répondre
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ListeDemandesDevis;