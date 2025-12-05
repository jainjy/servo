import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import {
  Home,
  Calendar,
  MapPin,
  Euro,
  Users,
  Filter,
  Search,
  Download,
  Plus,
  RefreshCw,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Check,
  DoorOpen,
  Info,
  AlertCircle,
  Bell,
  BarChart3,
  PieChart,
  CreditCard,
  Wallet,
  FileText,
  Settings,
  ChevronRight,
  TrendingDown,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  Building,
  User,
  FileDown,
  Printer
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import LoadingSpinner from "@/components/Loading/LoadingSpinner";
import api from "@/lib/api";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

const ClientReservationsDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [simulatingPayment, setSimulatingPayment] = useState<number | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("carte");
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [showReservationDetails, setShowReservationDetails] = useState(false);
  const [generatingReport, setGeneratingReport] = useState(false);

  // Détecter la taille de l'écran
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fonction de création de dashboard minimal (fallback)
  const createMinimalDashboard = (reservations: any[], user: any) => {
    const totalReservations = reservations.length;
    const reservationsActives = reservations.filter(r => 
      r.statut && ['en_attente', 'confirmee', 'en_cours'].includes(r.statut)
    ).length;
    
    const montantTotalDepense = reservations.reduce((sum, r) => sum + (Number(r.prixTotal) || 0), 0);
    
    // Calculer les prochaines réservations
    const prochainesReservations = reservations
      .filter(r => {
        try {
          if (!r.dateDebut || !r.statut) return false;
          const dateDebut = new Date(r.dateDebut);
          const septJours = new Date();
          septJours.setDate(septJours.getDate() + 7);
          return dateDebut >= new Date() && 
                 dateDebut <= septJours && 
                 ['confirmee', 'en_attente'].includes(r.statut);
        } catch (e) {
          return false;
        }
      })
      .slice(0, 5)
      .map(r => ({
        id: r.id,
        titre: r.property?.title || 'Propriété non disponible',
        ville: r.property?.city || 'Ville inconnue',
        dateDebut: r.dateDebut,
        dateFin: r.dateFin,
        statut: r.statut || 'inconnu',
        prixTotal: Number(r.prixTotal) || 0,
        image: r.property?.images?.[0] || null
      }));

    // Répartition par statut
    const repartitionStatut = {
      en_attente: reservations.filter(r => r.statut === 'en_attente').length,
      confirmee: reservations.filter(r => r.statut === 'confirmee').length,
      en_cours: reservations.filter(r => r.statut === 'en_cours').length,
      terminee: reservations.filter(r => r.statut === 'terminee').length,
      annulee: reservations.filter(r => r.statut === 'annulee').length
    };

    return {
      resume: {
        totalReservations,
        reservationsActives,
        montantTotalDepense,
        montantTotalPaye: 0,
        montantRestantAPayer: montantTotalDepense,
        depenseMois: 0,
        reservationsMois: 0
      },
      prochainesReservations,
      statistiques: {
        repartitionStatut,
        evolutionDepenses: [],
        topDestinations: []
      },
      paiements: {
        enAttente: [],
        totalEnAttente: 0
      },
      reservations: reservations.map(r => {
        const paiements = r.paiements || [];
        const montantPaye = paiements
          .filter(p => p.statut === 'paye')
          .reduce((sum, p) => sum + (Number(p.montant) || 0), 0);
        
        return {
          ...r,
          montantPaye,
          montantRestant: Math.max(0, (Number(r.prixTotal) || 0) - montantPaye),
          nuits: r.nuits || 1
        };
      })
    };
  };

  // Charger le dashboard avec fallback
  const loadDashboard = async () => {
    if (!isAuthenticated || !user?.id) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const response = await api.get(
        `/locations-saisonnieres/client/${user.id}/dashboard?month=${selectedMonth}&year=${selectedYear}`
      );
      
      // Si l'API retourne des données de dashboard
      if (response.data?.success && response.data?.dashboard) {
        setDashboardData(response.data.dashboard);
      } 
      // Si l'API retourne directement le dashboard sans wrapper success
      else if (response.data?.dashboard) {
        setDashboardData(response.data.dashboard);
      }
      // Si l'API retourne juste des données
      else if (response.data) {
        setDashboardData(response.data);
      }
      else {
        // Fallback: charger les réservations de base
        try {
          const fallbackResponse = await api.get(`/locations-saisonnieres/client/${user.id}`);
          if (fallbackResponse.data) {
            const minimalDashboard = createMinimalDashboard(fallbackResponse.data, user);
            setDashboardData(minimalDashboard);
            toast({
              title: "Mode dégradé",
              description: "Dashboard chargé avec certaines limitations",
              variant: "default"
            });
          } else {
            throw new Error("Aucune donnée disponible");
          }
        } catch (fallbackError) {
          console.error("Fallback error:", fallbackError);
          toast({
            title: "Erreur",
            description: "Impossible de charger vos données",
            variant: "destructive"
          });
        }
      }
    } catch (err: any) {
      console.error("Erreur chargement dashboard:", err);
      
      // Fallback ultime: créer un dashboard vide
      const emptyDashboard = {
        resume: {
          totalReservations: 0,
          reservationsActives: 0,
          montantTotalDepense: 0,
          montantTotalPaye: 0,
          montantRestantAPayer: 0,
          depenseMois: 0,
          reservationsMois: 0
        },
        prochainesReservations: [],
        statistiques: {
          repartitionStatut: {},
          evolutionDepenses: [],
          topDestinations: []
        },
        paiements: {
          enAttente: [],
          totalEnAttente: 0
        },
        reservations: []
      };
      
      setDashboardData(emptyDashboard);
      
      toast({
        title: "Erreur de connexion",
        description: "Les données sont limitées. Veuillez réessayer plus tard.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Charger au montage
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadDashboard();
    }
  }, [isAuthenticated, user?.id, selectedMonth, selectedYear]);

  // Gérer le paiement
  const handlePayment = async (reservationId: number, simulate = true) => {
    if (!paymentAmount || isNaN(parseFloat(paymentAmount))) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un montant valide",
        variant: "destructive"
      });
      return;
    }

    setSimulatingPayment(reservationId);
    try {
      const response = await api.post(`/locations-saisonnieres/${reservationId}/simuler-paiement`, {
        montant: parseFloat(paymentAmount),
        methode: paymentMethod,
        simulate
      });

      if (simulate) {
        // Afficher la simulation
        toast({
          title: "Simulation de paiement",
          description: (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>Montant proposé:</span>
                <span className="font-bold">{response.data.montantPropose} €</span>
              </div>
              {response.data.details?.frais > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Frais ({paymentMethod}):</span>
                  <span>{response.data.details.frais.toFixed(2)} €</span>
                </div>
              )}
              <div className="flex justify-between font-bold border-t pt-2">
                <span>Total à payer:</span>
                <span>{response.data.details?.totalAPayer?.toFixed(2) || paymentAmount} €</span>
              </div>
            </div>
          ),
          variant: "default",
          duration: 10000,
          action: simulate ? (
            <Button
              size="sm"
              onClick={() => handlePayment(reservationId, false)}
              className="mt-2"
            >
              Confirmer le paiement
            </Button>
          ) : null
        });
      } else {
        // Paiement réel
        toast({
          title: "Paiement effectué",
          description: `Paiement de ${paymentAmount}€ enregistré avec succès`,
          variant: "default"
        });
        loadDashboard(); // Recharger les données
        setPaymentAmount("");
        setSimulatingPayment(null);
      }
    } catch (err: any) {
      console.error("Erreur paiement:", err);
      toast({
        title: "Erreur",
        description: err.response?.data?.error || "Impossible de traiter le paiement",
        variant: "destructive"
      });
    } finally {
      if (!simulate) {
        setSimulatingPayment(null);
      }
    }
  };

  // Afficher les détails d'une réservation
  const showReservationDetail = (reservation: any) => {
    setSelectedReservation(reservation);
    setShowReservationDetails(true);
  };

  // Générer un rapport financier PDF
  const generateFinancialReportPDF = async () => {
    if (!user?.id) return;
    
    setGeneratingReport(true);
    try {
      const response = await api.get(`/locations-saisonnieres/client/${user.id}/rapport-financier?format=pdf`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `rapport-financier-${user.id}-${new Date().toISOString().split('T')[0]}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast({
        title: "Rapport PDF généré",
        description: "Le rapport financier a été téléchargé",
        variant: "default"
      });
    } catch (err: any) {
      console.error("Erreur génération rapport PDF:", err);
      
      // Fallback: générer un PDF côté client
      toast({
        title: "Génération du rapport PDF",
        description: "Génération du rapport en cours...",
        variant: "default"
      });
      
      generateClientSidePDF();
    } finally {
      setGeneratingReport(false);
    }
  };

  // Générer un PDF côté client (fallback)
  const generateClientSidePDF = () => {
    try {
      // Créer un contenu HTML pour le PDF
      const resume = dashboardData?.resume || {
        montantTotalDepense: 0,
        montantTotalPaye: 0,
        montantRestantAPayer: 0,
        depenseMois: 0
      };
      
      const reservations = dashboardData?.reservations || [];
      
      const content = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Rapport Financier - Locations Saisonnières</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #333; padding-bottom: 20px; }
            .header h1 { color: #1e40af; margin-bottom: 10px; }
            .user-info { background: #f3f4f6; padding: 15px; border-radius: 5px; margin-bottom: 30px; }
            .section { margin-bottom: 30px; }
            .section-title { color: #374151; border-bottom: 1px solid #d1d5db; padding-bottom: 10px; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th { background: #1e40af; color: white; padding: 12px; text-align: left; }
            td { padding: 10px; border: 1px solid #d1d5db; }
            .total-row { background: #f3f4f6; font-weight: bold; }
            .footer { text-align: center; margin-top: 50px; color: #6b7280; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Rapport Financier - Locations Saisonnières</h1>
            <p>Généré le ${new Date().toLocaleDateString('fr-FR')}</p>
          </div>
          
          <div class="user-info">
            <p><strong>Client:</strong> ${user?.firstName || ''} ${user?.lastName || ''}</p>
            <p><strong>Email:</strong> ${user?.email || ''}</p>
            <p><strong>ID Client:</strong> ${user?.id || ''}</p>
            <p><strong>Période:</strong> ${selectedMonth}/${selectedYear}</p>
          </div>
          
          <div class="section">
            <h2 class="section-title">Résumé Financier</h2>
            <table>
              <tr>
                <td>Total dépensé</td>
                <td>${resume.montantTotalDepense?.toLocaleString() || '0'} €</td>
              </tr>
              <tr>
                <td>Montant payé</td>
                <td>${resume.montantTotalPaye?.toLocaleString() || '0'} €</td>
              </tr>
              <tr>
                <td>Restant à payer</td>
                <td>${resume.montantRestantAPayer?.toLocaleString() || '0'} €</td>
              </tr>
              <tr class="total-row">
                <td>Dépenses ce mois</td>
                <td>${resume.depenseMois?.toLocaleString() || '0'} €</td>
              </tr>
            </table>
          </div>
          
          <div class="section">
            <h2 class="section-title">Statistiques</h2>
            <table>
              <tr>
                <td>Total réservations</td>
                <td>${resume.totalReservations || '0'}</td>
              </tr>
              <tr>
                <td>Réservations actives</td>
                <td>${resume.reservationsActives || '0'}</td>
              </tr>
              <tr>
                <td>Réservations ce mois</td>
                <td>${resume.reservationsMois || '0'}</td>
              </tr>
            </table>
          </div>
          
          ${reservations.length > 0 ? `
          <div class="section">
            <h2 class="section-title">Détails des Réservations</h2>
            <table>
              <thead>
                <tr>
                  <th>Référence</th>
                  <th>Date</th>
                  <th>Montant</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                ${reservations.slice(0, 10).map((res: any) => `
                  <tr>
                    <td>${res.id}</td>
                    <td>${new Date(res.dateDebut).toLocaleDateString('fr-FR')} - ${new Date(res.dateFin).toLocaleDateString('fr-FR')}</td>
                    <td>${res.prixTotal || 0} €</td>
                    <td>${res.statut || 'inconnu'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          ` : ''}
          
          <div class="footer">
            <p>© ${new Date().getFullYear()} Plateforme Locations Saisonnières - Document généré automatiquement</p>
            <p>Ce document est confidentiel et destiné uniquement à l'usage personnel du client.</p>
          </div>
        </body>
        </html>
      `;

      // Ouvrir une nouvelle fenêtre pour l'impression
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(content);
        printWindow.document.close();
        printWindow.focus();
        
        // Attendre que le contenu soit chargé avant d'imprimer
        printWindow.onload = () => {
          printWindow.print();
          printWindow.close();
        };
      }

      toast({
        title: "Rapport généré",
        description: "Le rapport PDF a été préparé pour l'impression",
        variant: "default"
      });
    } catch (error) {
      console.error("Erreur génération PDF côté client:", error);
      toast({
        title: "Erreur",
        description: "Impossible de générer le PDF. Veuillez réessayer.",
        variant: "destructive"
      });
    }
  };

  // Générer un rapport CSV
  const generateFinancialReportCSV = async () => {
    if (!user?.id) return;

    try {
      const response = await api.get(`/locations-saisonnieres/client/${user.id}/rapport-financier?format=csv`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `rapport-financier-${user.id}-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();

      toast({
        title: "Rapport CSV généré",
        description: "Le rapport financier a été téléchargé",
        variant: "default"
      });
    } catch (err: any) {
      console.error("Erreur génération rapport CSV:", err);
      toast({
        title: "Erreur",
        description: "Impossible de générer le rapport CSV",
        variant: "destructive"
      });
    }
  };

  // Fonction helper pour sécuriser les données
  const getSafeDashboardData = () => {
    if (!dashboardData) {
      return {
        resume: {
          totalReservations: 0,
          reservationsActives: 0,
          montantTotalDepense: 0,
          montantTotalPaye: 0,
          montantRestantAPayer: 0,
          depenseMois: 0,
          reservationsMois: 0
        },
        prochainesReservations: [],
        statistiques: {
          repartitionStatut: {},
          evolutionDepenses: [],
          topDestinations: []
        },
        paiements: {
          enAttente: [],
          totalEnAttente: 0
        },
        reservations: []
      };
    }
    return dashboardData;
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen mt-12 bg-gray-50 p-4 md:p-6 flex items-center justify-center">
        <p className="text-gray-600">Veuillez vous connecter pour voir vos réservations.</p>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner text="Chargement de votre dashboard..." />;
  }

  const safeData = getSafeDashboardData();
  const { resume, prochainesReservations, statistiques, paiements, reservations } = safeData;

  // Données sécurisées pour les graphiques
  const evolutionData = Array.isArray(statistiques?.evolutionDepenses) ? statistiques.evolutionDepenses : [];
  const statusData = statistiques?.repartitionStatut ? 
    Object.entries(statistiques.repartitionStatut).map(([name, value]) => ({
      name: name.replace('_', ' ').toUpperCase(),
      value: Number(value) || 0
    })).filter(item => item.value > 0) : [];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="min-h-screen bg-gray-50 mt-10 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 md:mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
              <h1 className="text-xl md:text-3xl font-bold text-gray-900">
                Tableau de bord des locations
              </h1>
            </div>
            <p className="text-gray-600 text-sm md:text-base">
              Gérez vos réservations et suivez vos dépenses
            </p>
            <p className="text-xs md:text-sm text-gray-500 mt-1">
              <span className="font-semibold text-gray-700">
                {resume.totalReservations || 0} réservations • {resume.reservationsActives || 0} actives
              </span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2 md:gap-3">
            <div className="relative group">
              <Button
                onClick={() => generateFinancialReportPDF()}
                variant="outline"
                className="flex items-center gap-2"
                disabled={generatingReport}
              >
                {generatingReport ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <FileDown className="w-4 h-4" />
                )}
                <span className="hidden md:inline">
                  {generatingReport ? 'Génération...' : 'Rapport PDF'}
                </span>
              </Button>
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-50">
                <div className="py-1">
                  <button
                    onClick={generateFinancialReportPDF}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                  >
                    <Printer className="w-4 h-4" />
                    Télécharger PDF
                  </button>
                  <button
                    onClick={generateFinancialReportCSV}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 flex items-center gap-2"
                  >
                    <FileText className="w-4 h-4" />
                    Télécharger CSV
                  </button>
                </div>
              </div>
            </div>
            <Button
              onClick={loadDashboard}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Actualiser
            </Button>
            <Link
              to="/immobilier?type=location&saisonnier=true"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium text-sm md:text-base flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nouvelle réservation
            </Link>
          </div>
        </div>

        {/* Résumé financier */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Total dépensé
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resume.montantTotalDepense?.toLocaleString() || '0'} €</div>
              <div className="text-xs text-gray-500 mt-1">
                {resume.depenseMois?.toLocaleString() || '0'} € ce mois
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Montant payé
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {resume.montantTotalPaye?.toLocaleString() || '0'} €
              </div>
              <Progress 
                value={resume.montantTotalDepense > 0 ? (resume.montantTotalPaye / resume.montantTotalDepense) * 100 : 0} 
                className="h-2 mt-2"
              />
              <div className="text-xs text-gray-500 mt-1">
                {Math.round((resume.montantTotalPaye / resume.montantTotalDepense) * 100) || 0}% payé
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Restant à payer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {resume.montantRestantAPayer?.toLocaleString() || '0'} €
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {paiements?.enAttente?.length || 0} paiements en attente
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Dépenses ce mois
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{resume.depenseMois?.toLocaleString() || '0'} €</div>
              <div className="text-xs text-gray-500 mt-1">
                {resume.reservationsMois || 0} réservations
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs principaux */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="reservations">Réservations</TabsTrigger>
            <TabsTrigger value="paiements">Paiements</TabsTrigger>
            <TabsTrigger value="statistiques">Statistiques</TabsTrigger>
          </TabsList>

          {/* Tab Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution des dépenses</CardTitle>
                  <CardDescription>6 derniers mois</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {evolutionData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={evolutionData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="mois" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} €`, 'Dépense']} />
                        <Legend />
                        <Line type="monotone" dataKey="depense" stroke="#8884d8" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      <p>Aucune donnée disponible</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Répartition par statut</CardTitle>
                </CardHeader>
                <CardContent className="h-80">
                  {statusData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} réservations`, 'Nombre']} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      <p>Aucune donnée disponible</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Prochaines réservations */}
            <Card>
              <CardHeader>
                <CardTitle>Prochaines réservations</CardTitle>
                <CardDescription>Dans les 7 prochains jours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {prochainesReservations && prochainesReservations.length > 0 ? (
                    prochainesReservations.map((res: any) => (
                      <div key={res.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                        <div className="flex items-center gap-4">
                          {res.image ? (
                            <img src={res.image} alt={res.titre} className="w-16 h-16 rounded-lg object-cover" />
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center">
                              <Home className="w-8 h-8 text-gray-400" />
                            </div>
                          )}
                          <div>
                            <h4 className="font-semibold">{res.titre}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <MapPin className="w-3 h-3" />
                              {res.ville}
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-3 h-3" />
                              {new Date(res.dateDebut).toLocaleDateString('fr-FR')} - {new Date(res.dateFin).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge className={
                            res.statut === 'confirmee' ? 'bg-green-100 text-green-800' :
                            res.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }>
                            {res.statut}
                          </Badge>
                          <div className="text-right">
                            <div className="font-bold">{res.prixTotal} €</div>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="mt-2"
                              onClick={() => showReservationDetail(res)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              Détails
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>Aucune réservation prévue dans les 7 prochains jours</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Réservations */}
          <TabsContent value="reservations">
            <Card>
              <CardHeader>
                <CardTitle>Toutes mes réservations</CardTitle>
                <CardDescription>Gérez vos locations saisonnières</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reservations && reservations.length > 0 ? (
                    reservations.map((res: any) => (
                      <div key={res.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            {res.image ? (
                              <img src={res.image} alt={res.titre} className="w-20 h-20 rounded-lg object-cover" />
                            ) : (
                              <div className="w-20 h-20 rounded-lg bg-gray-200 flex items-center justify-center">
                                <Home className="w-10 h-10 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <h4 className="font-semibold text-lg">{res.titre}</h4>
                              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                <MapPin className="w-3 h-3" />
                                {res.ville}
                              </div>
                              <div className="flex items-center gap-4 text-sm mt-2">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {new Date(res.dateDebut).toLocaleDateString('fr-FR')} - {new Date(res.dateFin).toLocaleDateString('fr-FR')}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Euro className="w-3 h-3" />
                                  {res.nuits || 1} nuits • {res.prixTotal || 0} €
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Badge className={
                              res.statut === 'confirmee' ? 'bg-green-100 text-green-800' :
                              res.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-800' :
                              res.statut === 'en_cours' ? 'bg-blue-100 text-blue-800' :
                              res.statut === 'terminee' ? 'bg-purple-100 text-purple-800' :
                              'bg-red-100 text-red-800'
                            }>
                              {res.statut || 'inconnu'}
                            </Badge>
                            
                            <div className="text-sm">
                              <div className="flex justify-between">
                                <span>Payé:</span>
                                <span className="font-semibold">{res.montantPaye || 0} €</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Restant:</span>
                                <span className="font-semibold text-orange-600">{res.montantRestant || 0} €</span>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="flex-1"
                                onClick={() => showReservationDetail(res)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Détails
                              </Button>
                              {(res.montantRestant || 0) > 0 && (
                                <Button 
                                  size="sm" 
                                  className="flex-1" 
                                  onClick={() => {
                                    setSimulatingPayment(res.id);
                                    setPaymentAmount(res.montantRestant?.toString() || "0");
                                  }}
                                >
                                  Payer
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {/* Section paiements */}
                        {res.paiements?.length > 0 && (
                          <div className="mt-4 pt-4 border-t">
                            <h5 className="font-medium mb-2">Historique des paiements</h5>
                            <div className="space-y-2">
                              {res.paiements.map((p: any) => (
                                <div key={p.id} className="flex items-center justify-between text-sm p-2 bg-gray-50 rounded">
                                  <div className="flex items-center gap-2">
                                    <CreditCard className="w-3 h-3" />
                                    <span className="font-medium">{p.methode || 'inconnue'}</span>
                                    <span className="text-gray-500">{p.reference || ''}</span>
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <span className="font-semibold">{p.montant || 0} €</span>
                                    <Badge variant={p.statut === 'paye' ? 'default' : 'secondary'}>
                                      {p.statut || 'inconnu'}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Home className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <p>Aucune réservation trouvée</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Paiements */}
          <TabsContent value="paiements">
            <Card>
              <CardHeader>
                <CardTitle>Gestion des paiements</CardTitle>
                <CardDescription>Payez vos réservations en attente</CardDescription>
              </CardHeader>
              <CardContent>
                {paiements?.enAttente && paiements.enAttente.length > 0 ? (
                  <div className="space-y-4">
                    {paiements.enAttente.map((p: any) => (
                      <Card key={p.id}>
                        <CardContent className="p-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <CreditCard className="w-4 h-4" />
                                <span className="font-semibold">Paiement #{p.reference}</span>
                              </div>
                              <div className="text-sm text-gray-600">
                                Date d'échéance: {new Date(p.dateEcheance).toLocaleDateString('fr-FR')}
                              </div>
                              <div className="text-sm text-gray-600">
                                Méthode: {p.methode}
                              </div>
                              {p.reservationId && (
                                <Button 
                                  variant="link" 
                                  size="sm" 
                                  onClick={() => {
                                    const reservation = reservations.find((r: any) => r.id === p.reservationId);
                                    if (reservation) showReservationDetail(reservation);
                                  }}
                                >
                                  Voir la réservation
                                </Button>
                              )}
                            </div>
                            
                            <div className="text-right">
                              <div className="text-2xl font-bold text-orange-600 mb-2">
                                {p.montant} €
                              </div>
                              <div className="space-y-2">
                                <input
                                  type="number"
                                  value={paymentAmount}
                                  onChange={(e) => setPaymentAmount(e.target.value)}
                                  placeholder="Montant à payer"
                                  className="w-full px-3 py-2 border rounded"
                                />
                                <select
                                  value={paymentMethod}
                                  onChange={(e) => setPaymentMethod(e.target.value)}
                                  className="w-full px-3 py-2 border rounded"
                                >
                                  <option value="carte">Carte bancaire</option>
                                  <option value="virement">Virement</option>
                                  <option value="paypal">PayPal</option>
                                  <option value="especes">Espèces</option>
                                </select>
                                <Button 
                                  onClick={() => handlePayment(p.id, true)}
                                  disabled={simulatingPayment === p.id}
                                  className="w-full"
                                >
                                  {simulatingPayment === p.id ? 'Traitement...' : 'Simuler le paiement'}
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    <Card className="bg-gray-50">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-semibold">Total des paiements en attente</h4>
                            <p className="text-sm text-gray-600">
                              {paiements.enAttente.length} paiement(s) à régler
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-3xl font-bold text-red-600">
                              {paiements.totalEnAttente} €
                            </div>
                            <Button 
                              onClick={generateFinancialReportPDF}
                              variant="outline"
                              className="mt-2"
                              disabled={generatingReport}
                            >
                              {generatingReport ? (
                                <>
                                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                  Génération...
                                </>
                              ) : (
                                <>
                                  <FileDown className="w-4 h-4 mr-2" />
                                  Télécharger rapport
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Aucun paiement en attente</h3>
                    <p className="text-gray-600">Tous vos paiements sont à jour</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab Statistiques */}
          <TabsContent value="statistiques">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Top destinations</CardTitle>
                  <CardDescription>Vos villes les plus visitées</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  {statistiques?.topDestinations?.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={statistiques.topDestinations}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="ville" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`${value} €`, 'Dépense']} />
                        <Legend />
                        <Bar dataKey="montant" fill="#8884d8" name="Dépense totale" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      <p>Aucune donnée disponible</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Métriques clés</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Prix moyen par nuit</div>
                    <div className="text-2xl font-bold">
                      {reservations.length > 0 
                        ? Math.round(resume.montantTotalDepense / reservations.reduce((sum: number, r: any) => sum + (r.nuits || 1), 0))
                        : 0} €
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Durée moyenne</div>
                    <div className="text-2xl font-bold">
                      {reservations.length > 0 
                        ? Math.round(reservations.reduce((sum: number, r: any) => sum + (r.nuits || 1), 0) / reservations.length)
                        : 0} nuits
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Taux de confirmation</div>
                    <div className="text-2xl font-bold">
                      {resume.totalReservations > 0
                        ? Math.round(((statistiques?.repartitionStatut?.confirmee || 0) / resume.totalReservations) * 100)
                        : 0}%
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Taux d'annulation</div>
                    <div className="text-2xl font-bold text-red-600">
                      {resume.totalReservations > 0
                        ? Math.round(((statistiques?.repartitionStatut?.annulee || 0) / resume.totalReservations) * 100)
                        : 0}%
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Section conseils */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              Conseils pour optimiser vos locations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <Euro className="w-3 h-3 text-blue-600" />
                  </div>
                  <h4 className="font-semibold">Économisez sur les paiements</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Payer en avance peut vous faire bénéficier de réductions. Certains propriétaires offrent jusqu'à 10% de réduction pour les paiements anticipés.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-3 h-3 text-green-600" />
                  </div>
                  <h4 className="font-semibold">Réservez hors saison</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Les prix peuvent être jusqu'à 30% moins chers en basse saison. Planifiez vos vacances en dehors des périodes de pointe.
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-3 h-3 text-purple-600" />
                  </div>
                  <h4 className="font-semibold">Suivez vos dépenses</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Utilisez notre tableau de bord pour analyser vos dépenses et identifier des opportunités d'économies.
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              Voir plus de conseils
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Modal de simulation de paiement */}
      {simulatingPayment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Simulation de paiement</CardTitle>
              <CardDescription>Vérifiez les détails avant de confirmer</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Montant à payer</label>
                <input
                  type="number"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                  placeholder="Entrez le montant"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Méthode de paiement</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="carte">Carte bancaire (+1.5% frais)</option>
                  <option value="virement">Virement bancaire (sans frais)</option>
                  <option value="paypal">PayPal (+2.9% frais)</option>
                  <option value="especes">Espèces</option>
                </select>
              </div>
              
              <div className="p-4 bg-gray-50 rounded">
                <h4 className="font-semibold mb-2">Récapitulatif</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Montant:</span>
                    <span>{paymentAmount || 0} €</span>
                  </div>
                  {paymentMethod === 'carte' && (
                    <div className="flex justify-between">
                      <span>Frais carte (1.5%):</span>
                      <span>{(parseFloat(paymentAmount || '0') * 0.015).toFixed(2)} €</span>
                    </div>
                  )}
                  {paymentMethod === 'paypal' && (
                    <div className="flex justify-between">
                      <span>Frais PayPal (2.9%):</span>
                      <span>{(parseFloat(paymentAmount || '0') * 0.029).toFixed(2)} €</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold border-t pt-2 mt-2">
                    <span>Total:</span>
                    <span>
                      {paymentMethod === 'carte' 
                        ? (parseFloat(paymentAmount || '0') * 1.015).toFixed(2)
                        : paymentMethod === 'paypal'
                        ? (parseFloat(paymentAmount || '0') * 1.029).toFixed(2)
                        : parseFloat(paymentAmount || '0').toFixed(2)} €
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex gap-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setSimulatingPayment(null)}
              >
                Annuler
              </Button>
              <Button 
                className="flex-1"
                onClick={() => handlePayment(simulatingPayment, false)}
                disabled={!paymentAmount}
              >
                Confirmer le paiement
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Modal de détails de réservation */}
      {showReservationDetails && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Détails de la réservation</CardTitle>
                  <CardDescription>Référence: {selectedReservation.reference || selectedReservation.id}</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReservationDetails(false)}
                >
                  ✕
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Informations générales */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Informations générales</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Titre:</span>
                      <span className="font-medium">{selectedReservation.titre}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Ville:</span>
                      <span className="font-medium">{selectedReservation.ville}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Statut:</span>
                      <Badge className={
                        selectedReservation.statut === 'confirmee' ? 'bg-green-100 text-green-800' :
                        selectedReservation.statut === 'en_attente' ? 'bg-yellow-100 text-yellow-800' :
                        selectedReservation.statut === 'en_cours' ? 'bg-blue-100 text-blue-800' :
                        selectedReservation.statut === 'terminee' ? 'bg-purple-100 text-purple-800' :
                        'bg-red-100 text-red-800'
                      }>
                        {selectedReservation.statut}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Nombre de nuits:</span>
                      <span className="font-medium">{selectedReservation.nuits || 1}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Dates</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date de début:</span>
                      <span className="font-medium">
                        {new Date(selectedReservation.dateDebut).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date de fin:</span>
                      <span className="font-medium">
                        {new Date(selectedReservation.dateFin).toLocaleDateString('fr-FR')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Durée totale:</span>
                      <span className="font-medium">{selectedReservation.nuits || 1} nuits</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations financières */}
              <div>
                <h4 className="font-semibold mb-3">Informations financières</h4>
                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Prix total:</span>
                    <span className="text-xl font-bold">{selectedReservation.prixTotal || 0} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Montant payé:</span>
                    <span className="font-semibold text-green-600">{selectedReservation.montantPaye || 0} €</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Restant à payer:</span>
                    <span className="font-semibold text-orange-600">{selectedReservation.montantRestant || 0} €</span>
                  </div>
                  <div className="pt-3 border-t">
                    <div className="flex justify-between font-semibold">
                      <span>Pourcentage payé:</span>
                      <span>
                        {selectedReservation.prixTotal > 0 
                          ? Math.round(((selectedReservation.montantPaye || 0) / selectedReservation.prixTotal) * 100)
                          : 0}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Paiements */}
              {selectedReservation.paiements && selectedReservation.paiements.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-3">Historique des paiements</h4>
                  <div className="space-y-2">
                    {selectedReservation.paiements.map((p: any, index: number) => (
                      <div key={p.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                          </div>
                          <div>
                            <div className="font-medium">Paiement #{p.reference}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(p.datePaiement || new Date()).toLocaleDateString('fr-FR')} • {p.methode || 'inconnue'}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{p.montant || 0} €</div>
                          <Badge variant={p.statut === 'paye' ? 'default' : 'secondary'} className="text-xs">
                            {p.statut || 'inconnu'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Image de la propriété */}
              {selectedReservation.image && (
                <div>
                  <h4 className="font-semibold mb-2">Propriété</h4>
                  <div className="rounded-lg overflow-hidden">
                    <img 
                      src={selectedReservation.image} 
                      alt={selectedReservation.titre} 
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowReservationDetails(false)}
              >
                Fermer
              </Button>
              {(selectedReservation.montantRestant || 0) > 0 && (
                <Button
                  onClick={() => {
                    setShowReservationDetails(false);
                    setSimulatingPayment(selectedReservation.id);
                    setPaymentAmount(selectedReservation.montantRestant?.toString() || "0");
                  }}
                >
                  Effectuer un paiement
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ClientReservationsDashboard;