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
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader>
          <CardTitle>Liste des Demandes de Devis</CardTitle>
          <CardDescription>
            Gérez toutes vos demandes de devis entrantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {demandes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Aucune demande de devis pour le moment
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Service</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Contact/Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {demandes.map((demande) => (
                  <TableRow key={demande.id}>
                    <TableCell>
                      <div className="font-medium">
                        {demande.date ? formatDate(new Date(demande.date)) : "Date non disponible"}
                      </div>
                      {demande.dateSouhaitee && (
                        <div className="text-sm text-muted-foreground">
                          Souhaité: {formatDate(new Date(demande.dateSouhaitee))}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{demande.service?.libelle || "Service non spécifié"}</TableCell>
                    <TableCell>
                      {demande.type === 'demande' ? (
                        <>
                          <div>{demande.contactNom} {demande.contactPrenom}</div>
                          <div className="text-sm text-muted-foreground">{demande.contactEmail}</div>
                        </>
                      ) : (
                        <>
                          <div>{demande.client?.firstName} {demande.client?.lastName}</div>
                          <div className="text-sm text-muted-foreground">{demande.client?.email}</div>
                        </>
                      )}
                    </TableCell>
                    <TableCell>
                      {demande.type === 'demande' ? demande.contactTel : (
                        <div className="font-medium">
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
                        >
                          Détails
                        </Button>
                        {demande.statut === "en_attente" && (
                          <Button 
                            size="sm"
                            onClick={() => {/* TODO: Répondre au devis */}}
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
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ListeDemandesDevis;