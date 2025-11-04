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
      // Ici vous géreriez le téléchargement du PDF
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
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
    transition: { duration: 0.4 },
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
    <section className="container mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-10"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Gestion de la facturation
            </h1>
            <p className="text-muted-foreground">
              Suivi des paiements, factures et revenus SERVO.
            </p>
          </div>
          <Button
            variant="default"
            className="gap-2"
            onClick={handleRefresh}
            disabled={loading.payments || loading.invoices || loading.analytics}
          >
            <RefreshCcw
              className={`w-4 h-4 ${loading.payments ? "animate-spin" : ""}`}
            />
            Actualiser
          </Button>
        </div>

        {/* TABS */}
        <Tabs defaultValue="payments" value={tab} onValueChange={setTab}>
          <TabsList>
            <TabsTrigger value="payments" className="gap-2">
              <CreditCard className="w-4 h-4" /> Paiements
            </TabsTrigger>
            <TabsTrigger value="invoices" className="gap-2">
              <FileText className="w-4 h-4" /> Factures
            </TabsTrigger>
            <TabsTrigger value="analytics" className="gap-2">
              <TrendingUp className="w-4 h-4" /> Statistiques
            </TabsTrigger>
          </TabsList>

          <div className="mt-8 relative overflow-hidden">
            <AnimatePresence mode="wait">
              {/* ----------- PAYMENTS TAB ----------- */}
              {tab === "payments" && (
                <motion.div key="payments" {...tabMotion}>
                  <Card className="rounded-2xl shadow-sm border border-gray-200">
                    <CardHeader>
                      <CardTitle>Transactions récentes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Montant</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {loading.payments ? (
                            <TableRow>
                              <TableCell
                                colSpan={5}
                                className="text-center py-4"
                              >
                                Chargement des paiements...
                              </TableCell>
                            </TableRow>
                          ) : payments.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={5}
                                className="text-center py-4"
                              >
                                Aucun paiement trouvé
                              </TableCell>
                            </TableRow>
                          ) : (
                            payments.map((payment) => (
                              <TableRow key={payment.id}>
                                <TableCell className="font-medium">
                                  {payment.id.slice(-6)}
                                </TableCell>
                                <TableCell>
                                  {payment.client || "Client"}
                                </TableCell>
                                <TableCell>
                                  {payment.amount} {payment.currency}
                                </TableCell>
                                <TableCell>
                                  {getStatusBadge(payment.status)}
                                </TableCell>
                                <TableCell>
                                  {new Date(payment.date).toLocaleDateString(
                                    "fr-FR"
                                  )}
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
                  <Card className="rounded-2xl shadow-sm border border-gray-200">
                    <CardHeader>
                      <CardTitle>Factures générées</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Numéro</TableHead>
                            <TableHead>Client</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>TVA</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Date d'émission</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {loading.invoices ? (
                            <TableRow>
                              <TableCell
                                colSpan={7}
                                className="text-center py-4"
                              >
                                Chargement des factures...
                              </TableCell>
                            </TableRow>
                          ) : invoices.length === 0 ? (
                            <TableRow>
                              <TableCell
                                colSpan={7}
                                className="text-center py-4"
                              >
                                Aucune facture trouvée
                              </TableCell>
                            </TableRow>
                          ) : (
                            invoices.map((invoice) => (
                              <TableRow key={invoice.id}>
                                <TableCell className="font-medium">
                                  {invoice.number}
                                </TableCell>
                                <TableCell>{invoice.client}</TableCell>
                                <TableCell>{invoice.total} €</TableCell>
                                <TableCell>{invoice.vat} %</TableCell>
                                <TableCell>
                                  {getStatusBadge(invoice.status)}
                                </TableCell>
                                <TableCell>
                                  {new Date(invoice.issued).toLocaleDateString(
                                    "fr-FR"
                                  )}
                                </TableCell>
                                <TableCell>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleDownloadInvoice(invoice.id)
                                    }
                                    className="gap-2"
                                  >
                                    <Download className="w-3 h-3" />
                                    PDF
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="rounded-2xl shadow-sm border border-gray-200 bg-gradient-to-br from-indigo-500/10 to-purple-500/10">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-indigo-600" />
                          Total des paiements
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-semibold">
                          {stats.totalPayments}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {stats.totalTransactions || 0} transactions
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="rounded-2xl shadow-sm border border-gray-200 bg-gradient-to-br from-emerald-500/10 to-teal-500/10">
                      <CardHeader>
                        <CardTitle>Montant moyen</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-semibold">
                          {stats.avgPayment}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Taux de réussite: {stats.successRate || "100%"}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="rounded-2xl shadow-sm border border-gray-200 bg-gradient-to-br from-red-500/10 to-orange-500/10">
                      <CardHeader>
                        <CardTitle>Taux de remboursement</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-semibold">
                          {stats.refundRate}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Sur l'ensemble des transactions
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Graphiques supplémentaires */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <Card className="rounded-2xl shadow-sm border border-gray-200">
                      <CardHeader>
                        <CardTitle>Répartition des statuts</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span>Payées</span>
                            <Badge variant="default">75%</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>En attente</span>
                            <Badge variant="secondary">20%</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>Échouées</span>
                            <Badge variant="destructive">5%</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="rounded-2xl shadow-sm border border-gray-200">
                      <CardHeader>
                        <CardTitle>Performance mensuelle</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">
                            Graphique des revenus mensuels
                          </p>
                          <p className="text-sm text-muted-foreground mt-2">
                            (Intégration graphique à venir)
                          </p>
                        </div>
                      </CardContent>
                    </Card>
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
