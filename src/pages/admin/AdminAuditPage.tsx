import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DemandeAudit from "@/components/DemandeAudit";
 // Import de la modale
import { 
  Search, 
  Eye, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Loader2,
  Filter,
  Calendar,
  User,
  Building,
  Phone,
  Mail,
  MapPin,
  Clock,
  TrendingUp,
  FileText,
  ShieldCheck,
  Target
} from "lucide-react";
import api from "@/lib/api";

// Types et statuts pour les audits
const STATUT_AUDIT = {
  pending: { label: "En attente", color: "bg-yellow-100 text-yellow-800" },
  in_progress: { label: "En cours", color: "bg-blue-100 text-blue-800" },
  completed: { label: "Terminé", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Annulé", color: "bg-red-100 text-red-800" }
};

const TYPE_AUDIT = {
  financier: "Audit Financier",
  compliance: "Audit Compliance",
  interne: "Audit Interne",
  externe: "Audit Externe",
  autre: "Autre"
};

// Interface Audit basée sur votre backend
interface Audit {
  id: string;
  titre: string;
  description?: string;
  type: string;
  responsable: string;
  statut: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    phone: string | null;
    companyName: string | null;
    role: string;
  };
}

// Page principale des audits
const AuditsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [audits, setAudits] = useState<Audit[]>([]);

  // Fonction pour ajouter un nouvel audit à la liste
  const handleAddAudit = (newAudit: any) => {
    setAudits(prevAudits => [newAudit, ...prevAudits]);
  };

  // Fonction pour fermer la modale
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Demandes d'audit
          </h1>
          <p className="text-muted-foreground">
            Gérer toutes les demandes d'audit de la plateforme
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
        >
          <ShieldCheck className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
          Nouvel audit
        </Button>
      </div>

      <AuditsStats />
      <AuditsTable audits={audits} setAudits={setAudits} />

      {/* Modale de demande d'audit */}
      <DemandeAudit 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddAudit={handleAddAudit}
      />
    </div>
  );
};

// Composant pour les statistiques des audits
export function AuditsStats() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    completed: 0,
    cancelled: 0
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/add_audit/all');
        
        if (response.data.success && Array.isArray(response.data.data)) {
          const audits = response.data.data;
          
          const calculatedStats = {
            total: audits.length,
            pending: audits.filter(audit => audit.statut === 'pending').length,
            in_progress: audits.filter(audit => audit.statut === 'in_progress').length,
            completed: audits.filter(audit => audit.statut === 'completed').length,
            cancelled: audits.filter(audit => audit.statut === 'cancelled').length
          };
          
          setStats(calculatedStats);
        }
        
      } catch (error) {
        console.error("Error fetching audit stats:", error);
        setStats({
          total: 0,
          pending: 0,
          in_progress: 0,
          completed: 0,
          cancelled: 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatNumber = (value: number | undefined | null): string => {
    if (value === undefined || value === null) return "0";
    return value.toLocaleString('fr-FR');
  };

  if (loading) {
    return (
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {[...Array(5)].map((_, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold mb-2">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-16"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
              </div>
              <div className="p-3 rounded-full bg-gray-200 animate-pulse">
                <div className="h-6 w-6"></div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

}

// Composant principal pour le tableau des audits
interface AuditsTableProps {
  audits: Audit[];
  setAudits: React.Dispatch<React.SetStateAction<Audit[]>>;
}

export function AuditsTable({ audits, setAudits }: AuditsTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedAudit, setSelectedAudit] = useState<Audit | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  
  useEffect(() => {
    fetchAudits();
  }, []);

  const fetchAudits = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/add_audit/all');
      if (response.data.success) {
        setAudits(response.data.data);
      } else {
        setError("Erreur lors du chargement des audits");
      }
    } catch (error: any) {
      console.error("Error fetching audits:", error);
      setError(`Erreur lors du chargement des audits: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  }

  const filteredAudits = audits.filter((audit) => {
    const matchRecherche = !searchQuery || 
      audit.titre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.responsable?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.user?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.user?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      audit.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchStatut = !statusFilter || audit.statut === statusFilter;
    const matchType = !typeFilter || audit.type === typeFilter;
    
    return matchRecherche && matchStatut && matchType;
  });

  const handleView = (audit: Audit) => {
    setSelectedAudit(audit);
    // Ouvrir modal de détails
  }

  const handleStatusUpdate = async (audit: Audit, newStatus: string) => {
    try {
      setActionLoading(audit.id);
      
      await api.patch(`/add_audit/${audit.id}`, { 
        statut: newStatus
      });

      await fetchAudits(); 
    } catch (error: any) {
      console.error("Error updating audit:", error);
      setError(`Erreur lors de la mise à jour: ${error.response?.data?.message || error.message}`);
    } finally {
      setActionLoading(null);
    }
  }

  const handleDelete = async (audit: Audit) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette demande d'audit ?")) {
      return;
    }

    try {
      setActionLoading(audit.id);
      
      // Correction de l'URL de suppression
      await api.delete(`/add_audit/delete/${audit.id}`);

      // Mettre à jour la liste localement
      setAudits(prev => prev.filter(a => a.id !== audit.id));
    } catch (error: any) {
      console.error("Error deleting audit:", error);
      setError(`Erreur lors de la suppression: ${error.response?.data?.message || error.message}`);
    } finally {
      setActionLoading(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-[400px] bg-gray-50 flex items-center justify-center rounded-lg">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Chargement des audits...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={fetchAudits}>Réessayer</Button>
      </Card>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Barre de filtres */}
          <Card className="p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  placeholder="Rechercher par titre, responsable, client..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="outline" className="border-border bg-transparent">
                <Search className="mr-2" size={16} />
                
              </Button>
            </div>
            
            {error && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}
          </Card>

          {/* Liste des audits */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAudits.map((audit) => (
              <Card key={audit.id} className="overflow-hidden hover:shadow-xl transition-all duration-300">
                {/* En-tête avec statut */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge className="bg-white/20 text-white border-0">
                        {TYPE_AUDIT[audit.type as keyof typeof TYPE_AUDIT] || audit.type}
                      </Badge>
                    </div>
                    <Badge className={STATUT_AUDIT[audit.statut as keyof typeof STATUT_AUDIT]?.color}>
                      {STATUT_AUDIT[audit.statut as keyof typeof STATUT_AUDIT]?.label}
                    </Badge>
                  </div>
                  <div className="text-xl font-bold mt-2 line-clamp-1">
                    {audit.titre}
                  </div>
                  <div className="flex items-center gap-1 text-sm opacity-90 mt-1">
                    <User size={14} />
                    <span>Resp: {audit.responsable}</span>
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-6">
                  {/* Informations client */}
                  <div className="mb-4">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <User size={16} />
                      Client
                    </h3>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Nom:</span>
                        <span className="font-medium">
                          {audit.user?.firstName} {audit.user?.lastName}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium truncate ml-2">
                          {audit.user?.email}
                        </span>
                      </div>
                      {audit.user?.companyName && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Entreprise:</span>
                          <span className="font-medium">{audit.user.companyName}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  {audit.description && (
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <FileText size={16} />
                        Description
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {audit.description}
                      </p>
                    </div>
                  )}

                  {/* Date de création */}
                  <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
                    <Calendar size={14} />
                    <span>
                      Créé le {new Date(audit.createdAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
            
                    
                    {audit.statut === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(audit, 'in_progress')}
                        disabled={actionLoading === audit.id}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {actionLoading === audit.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                        Démarrer
                      </Button>
                    )}

                    {audit.statut === 'in_progress' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(audit, 'completed')}
                        disabled={actionLoading === audit.id}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        {actionLoading === audit.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                        Terminer
                      </Button>
                    )}

                    {(audit.statut === 'pending' || audit.statut === 'in_progress') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStatusUpdate(audit, 'cancelled')}
                        disabled={actionLoading === audit.id}
                        className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
                      >
                        {actionLoading === audit.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <XCircle className="h-4 w-4" />
                        )}
                        Annuler
                      </Button>
                    )}

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(audit)}
                      disabled={actionLoading === audit.id}
                      className="flex-1"
                    >
                      {actionLoading === audit.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filteredAudits.length === 0 && (
            <Card className="p-12 text-center">
              <ShieldCheck className="mx-auto mb-4 text-gray-400" size={48} />
              <h3 className="text-xl font-semibold mb-2">
                Aucun audit trouvé
              </h3>
              <p className="text-gray-600">
                {searchQuery || statusFilter || typeFilter 
                  ? "Essayez de modifier vos critères de recherche"
                  : "Aucune demande d'audit n'a été créée pour le moment"
                }
              </p>
            </Card>
          )}
        </div>
      </div>

      <style>{`
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </>
  );
}

export default AuditsPage;