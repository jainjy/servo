import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  FileText,
  DollarSign,
  TrendingUp,
  RefreshCcw,
  Download,
  ChevronRight,
  Users,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { professionalBillingAPI } from "@/lib/api/professional-billing";

export default function BillingSection() {
  const [tab, setTab] = useState("payments");
  const [loading, setLoading] = useState({
    payments: false,
    invoices: false,
    analytics: false,
  });
  const [payments, setPayments] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState({
    totalPayments: "0 €",
    avgPayment: "0 €",
    refundRate: "0%",
  });
  const { toast } = useToast();

  // Charger les données
  useEffect(() => {
    loadPayments();
    loadInvoices();
    loadAnalytics();
  }, []);

  const loadPayments = async () => {
    setLoading((prev) => ({ ...prev, payments: true }));
    try {
      const response = await professionalBillingAPI.getPayments();
      setPayments(response.data);
    } catch (error) {
      console.error("Erreur chargement paiements:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les paiements",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, payments: false }));
    }
  };

  const loadInvoices = async () => {
    setLoading((prev) => ({ ...prev, invoices: true }));
    try {
      const response = await professionalBillingAPI.getInvoices();
      setInvoices(response.data);
    } catch (error) {
      console.error("Erreur chargement factures:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les factures",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, invoices: false }));
    }
  };

  const loadAnalytics = async () => {
    setLoading((prev) => ({ ...prev, analytics: true }));
    try {
      const response = await professionalBillingAPI.getAnalytics();
      setStats(response.data);
    } catch (error) {
      console.error("Erreur chargement statistiques:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les statistiques",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, analytics: false }));
    }
  };

  const handleRefresh = async () => {
    try {
      await Promise.all([loadPayments(), loadInvoices(), loadAnalytics()]);
      toast({
        title: "Données actualisées",
        description: "Les données ont été mises à jour",
      });
    } catch (error) {
      console.error("Erreur actualisation:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'actualiser les données",
        variant: "destructive",
      });
    }
  };

  const handleDownloadInvoice = async (invoiceId) => {
    try {
      const response = await professionalBillingAPI.downloadInvoice(invoiceId);
      console.log("Facture téléchargée:", response.data);
      toast({
        title: "Facture téléchargée",
        description: "Le PDF a été généré avec succès",
      });
    } catch (error) {
      console.error("Erreur téléchargement facture:", error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger la facture",
        variant: "destructive",
      });
    }
  };

  const tabMotion = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
  };

  const getStatusBadge = (status) => {
    const variants = {
      succeeded: { variant: "default", label: "Succès" },
      pending: { variant: "secondary", label: "En attente" },
      failed: { variant: "destructive", label: "Échoué" },
      paid: { variant: "default", label: "Payée" },
      unpaid: { variant: "secondary", label: "En attente" },
      refunded: { variant: "outline", label: "Remboursé" },
    };

    const config = variants[status] || { variant: "secondary", label: status };

    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <section className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-8"
      >
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#556B2F]">
              <div className="h-1 w-6 bg-[#556B2F] rounded-full"></div>
              <span className="text-sm font-medium uppercase tracking-wider">
                Facturation
              </span>
            </div>
            <h1 className="text-2xl lg:text-4xl font-bold text-[#8B4513] tracking-tight">
              Gestion des paiements
            </h1>
            <p className="text-muted-foreground max-w-2xl">
              Suivez vos transactions, gérez vos factures et analysez vos revenus SERVO en temps réel.
            </p>
          </div>
          <Button
            variant="default"
            className="gap-2 bg-[#6B8E23] hover:bg-[#556B2F] transition-colors"
            onClick={handleRefresh}
            disabled={loading.payments || loading.invoices || loading.analytics}
          >
            <RefreshCcw
              className={`w-4 h-4 ${loading.payments ? "animate-spin" : ""}`}
            />
            Actualiser
          </Button>
        </div>

        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-[#D3D3D3] bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total reçu</p>
                  <p className="text-2xl font-bold text-[#8B4513] mt-1">
                    {stats.totalPayments}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-[#6B8E23]/10">
                  <DollarSign className="w-6 h-6 text-[#6B8E23]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#D3D3D3] bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Montant moyen</p>
                  <p className="text-2xl font-bold text-[#8B4513] mt-1">
                    {stats.avgPayment}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-[#6B8E23]/10">
                  <TrendingUp className="w-6 h-6 text-[#6B8E23]" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#D3D3D3] bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Remboursements</p>
                  <p className="text-2xl font-bold text-[#8B4513] mt-1">
                    {stats.refundRate}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-[#6B8E23]/10">
                  <RefreshCcw className="w-6 h-6 text-[#6B8E23]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* TABS */}
        <Tabs defaultValue="payments" value={tab} onValueChange={setTab}>
          <div className="border-b border-[#D3D3D3]">
            <TabsList className="bg-transparent h-12">
              <TabsTrigger
                value="payments"
                className="gap-2 data-[state=active]:text-[#6B8E23] data-[state=active]:border-b-2 data-[state=active]:border-[#6B8E23] rounded-none px-4 py-2"
              >
                <CreditCard className="w-4 h-4" />
                Paiements
                {payments.length > 0 && (
                  <Badge variant="outline" className="ml-2 bg-[#6B8E23]/10 text-[#6B8E23] border-[#6B8E23]/20">
                    {payments.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="invoices"
                className="gap-2 data-[state=active]:text-[#6B8E23] data-[state=active]:border-b-2 data-[state=active]:border-[#6B8E23] rounded-none px-4 py-2"
              >
                <FileText className="w-4 h-4" />
                Factures
                {invoices.length > 0 && (
                  <Badge variant="outline" className="ml-2 bg-[#6B8E23]/10 text-[#6B8E23] border-[#6B8E23]/20">
                    {invoices.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="analytics"
                className="gap-2 data-[state=active]:text-[#6B8E23] data-[state=active]:border-b-2 data-[state=active]:border-[#6B8E23] rounded-none px-4 py-2"
              >
                <TrendingUp className="w-4 h-4" />
                Statistiques
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="mt-6 relative">
            <AnimatePresence mode="wait">
              {/* ----------- PAYMENTS TAB ----------- */}
              {tab === "payments" && (
                <motion.div key="payments" {...tabMotion}>
                  <Card className="border-[#D3D3D3] bg-white shadow-sm">
                    <CardHeader className="border-b border-[#D3D3D3]">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-[#8B4513]">
                          Transactions récentes
                        </CardTitle>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-[#6B8E23] hover:text-[#556B2F] hover:bg-[#6B8E23]/10"
                        >
                          Voir tout
                          <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader className="bg-[#6B8E23]/5">
                          <TableRow className="hover:bg-transparent">
                            <TableHead className="font-semibold text-[#8B4513]">
                              ID Transaction
                            </TableHead>
                            <TableHead className="font-semibold text-[#8B4513]">
                              Client
                            </TableHead>
                            <TableHead className="font-semibold text-[#8B4513]">
                              Montant
                            </TableHead>
                            <TableHead className="font-semibold text-[#8B4513]">
                              Statut
                            </TableHead>
                            <TableHead className="font-semibold text-[#8B4513]">
                              Date
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {loading.payments ? (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-8">
                                <div className="flex flex-col items-center gap-2">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6B8E23]"></div>
                                  <p className="text-sm text-muted-foreground">
                                    Chargement des paiements...
                                  </p>
                                </div>
                              </TableCell>
                            </TableRow>
                          ) : payments.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-8">
                                <div className="flex flex-col items-center gap-2">
                                  <CreditCard className="w-12 h-12 text-[#D3D3D3]" />
                                  <p className="text-muted-foreground">
                                    Aucun paiement trouvé
                                  </p>
                                  <Button
                                    variant="outline"
                                    className="mt-2 border-[#6B8E23] text-[#6B8E23] hover:bg-[#6B8E23]/10"
                                  >
                                    Créer un paiement
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ) : (
                            payments.map((payment) => (
                              <TableRow
                                key={payment.id}
                                className="hover:bg-[#6B8E23]/5 border-b border-[#D3D3D3]/50"
                              >
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-[#6B8E23]"></div>
                                    {payment.id.slice(-8)}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Users className="w-4 h-4 text-muted-foreground" />
                                    {payment.client || "Client"}
                                  </div>
                                </TableCell>
                                <TableCell className="font-semibold">
                                  {payment.amount} {payment.currency}
                                </TableCell>
                                <TableCell>
                                  {getStatusBadge(payment.status)}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    {new Date(payment.date).toLocaleDateString("fr-FR")}
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* ----------- INVOICES TAB ----------- */}
              {tab === "invoices" && (
                <motion.div key="invoices" {...tabMotion}>
                  <Card className="border-[#D3D3D3] bg-white shadow-sm">
                    <CardHeader className="border-b border-[#D3D3D3]">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-[#8B4513]">
                          Factures générées
                        </CardTitle>
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-[#6B8E23] hover:bg-[#556B2F]"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Nouvelle facture
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader className="bg-[#6B8E23]/5">
                          <TableRow className="hover:bg-transparent">
                            <TableHead className="font-semibold text-[#8B4513]">
                              Numéro
                            </TableHead>
                            <TableHead className="font-semibold text-[#8B4513]">
                              Client
                            </TableHead>
                            <TableHead className="font-semibold text-[#8B4513]">
                              Total
                            </TableHead>
                            <TableHead className="font-semibold text-[#8B4513]">
                              TVA
                            </TableHead>
                            <TableHead className="font-semibold text-[#8B4513]">
                              Statut
                            </TableHead>
                            <TableHead className="font-semibold text-[#8B4513]">
                              Date
                            </TableHead>
                            <TableHead className="font-semibold text-[#8B4513]">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {loading.invoices ? (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center py-8">
                                <div className="flex flex-col items-center gap-2">
                                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#6B8E23]"></div>
                                  <p className="text-sm text-muted-foreground">
                                    Chargement des factures...
                                  </p>
                                </div>
                              </TableCell>
                            </TableRow>
                          ) : invoices.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center py-8">
                                <div className="flex flex-col items-center gap-2">
                                  <FileText className="w-12 h-12 text-[#D3D3D3]" />
                                  <p className="text-muted-foreground">
                                    Aucune facture trouvée
                                  </p>
                                </div>
                              </TableCell>
                            </TableRow>
                          ) : (
                            invoices.map((invoice) => (
                              <TableRow
                                key={invoice.id}
                                className="hover:bg-[#6B8E23]/5 border-b border-[#D3D3D3]/50"
                              >
                                <TableCell className="font-medium">
                                  <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-[#6B8E23]"></div>
                                    {invoice.number}
                                  </div>
                                </TableCell>
                                <TableCell>{invoice.client}</TableCell>
                                <TableCell className="font-semibold">
                                  {invoice.total} €
                                </TableCell>
                                <TableCell>{invoice.vat} %</TableCell>
                                <TableCell>
                                  {getStatusBadge(invoice.status)}
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                    {new Date(invoice.issued).toLocaleDateString("fr-FR")}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDownloadInvoice(invoice.id)}
                                    className="gap-2 border-[#6B8E23] text-[#6B8E23] hover:bg-[#6B8E23]/10"
                                  >
                                    <Download className="w-3 h-3" />
                                    Télécharger
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* ----------- ANALYTICS TAB ----------- */}
              {tab === "analytics" && (
                <motion.div key="analytics" {...tabMotion}>
                  <div className="space-y-6">
                    {/* Main Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="border-[#D3D3D3] bg-white">
                        <CardHeader>
                          <CardTitle className="text-[#8B4513] flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-[#6B8E23]" />
                            Total des paiements
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-3xl font-bold text-[#8B4513]">
                            {stats.totalPayments}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <CheckCircle className="w-4 h-4 text-[#6B8E23]" />
                            <p className="text-sm text-muted-foreground">
                              {stats.totalTransactions || 0} transactions
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-[#D3D3D3] bg-white">
                        <CardHeader>
                          <CardTitle className="text-[#8B4513]">
                            Montant moyen
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-3xl font-bold text-[#8B4513]">
                            {stats.avgPayment}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <TrendingUp className="w-4 h-4 text-[#6B8E23]" />
                            <p className="text-sm text-muted-foreground">
                              Taux de réussite: {stats.successRate || "100%"}
                            </p>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-[#D3D3D3] bg-white">
                        <CardHeader>
                          <CardTitle className="text-[#8B4513]">
                            Taux de remboursement
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-3xl font-bold text-[#8B4513]">
                            {stats.refundRate}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <RefreshCcw className="w-4 h-4 text-[#6B8E23]" />
                            <p className="text-sm text-muted-foreground">
                              Sur l'ensemble des transactions
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Additional Analytics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="border-[#D3D3D3] bg-white">
                        <CardHeader className="border-b border-[#D3D3D3]">
                          <CardTitle className="text-[#8B4513]">
                            Répartition des statuts
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 rounded-lg border border-[#D3D3D3]">
                              <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-[#6B8E23]"></div>
                                <span>Payées</span>
                              </div>
                              <Badge className="bg-[#6B8E23]">75%</Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg border border-[#D3D3D3]">
                              <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-[#D3D3D3]"></div>
                                <span>En attente</span>
                              </div>
                              <Badge variant="outline" className="border-[#D3D3D3]">
                                20%
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg border border-[#D3D3D3]">
                              <div className="flex items-center gap-3">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <span>Échouées</span>
                              </div>
                              <Badge variant="destructive">5%</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-[#D3D3D3] bg-white">
                        <CardHeader className="border-b border-[#D3D3D3]">
                          <CardTitle className="text-[#8B4513]">
                            Performance mensuelle
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="h-48 flex items-center justify-center">
                            <div className="text-center space-y-2">
                              <div className="w-16 h-16 mx-auto rounded-full border-4 border-[#D3D3D3] border-t-[#6B8E23] animate-spin"></div>
                              <p className="text-[#8B4513] font-medium">
                                Graphique en cours de chargement
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Visualisation des revenus mensuels
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Tabs>
      </motion.div>
    </section>
  );
}