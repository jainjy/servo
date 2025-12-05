import { useState, useEffect } from "react";
import { pdf } from "@react-pdf/renderer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Eye,
  Download,
  RefreshCw,
  Calendar,
  User,
  CreditCard,
  FileText,
  MapPin,
  Package,
  Zap,
  ShoppingCart,
  Repeat2,
} from "lucide-react";
import api from "@/lib/api";
import { toast } from "sonner";
import { PaymentsFilters, FilterConfig } from "./payments-filters";
import { ReceiptPDF } from "./receipt-pdf";

interface Transaction {
  id: string;
  date: string;
  customer: string;
  type: string;
  amount: string;
  method: string;
  status: "completed" | "pending" | "failed" | "refunded";
  reference: string;
  customerEmail: string;
  customerPhone: string;
  billingAddress: string;
  cardLast4: string;
  cardBrand: string;
  serviceDetails: string;
  duration: string;
  taxAmount: string;
  subtotal: string;
  fees: string;
  paymentType?: "subscription" | "product" | "demande" | "refund"; // NOUVEAU
}

export function PaymentsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterConfig>({
    type: "all",
    status: "all",
    method: "all",
    dateRange: "all",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const response = await api.get("/admin/payments/transactions", {
          params: filters !== null ? filters : {},
        });
        setTransactions(response.data);
      } catch (err) {
        console.error("Erreur lors du chargement des transactions:", err);
        setError("Impossible de charger les transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [filters]);

  const getPaymentTypeBadge = (type?: string) => {
    const variants: Record<
      string,
      { label: string; className: string; icon: React.ReactNode }
    > = {
      subscription: {
        label: "Abonnement",
        className: "bg-blue-100/20 text-blue-600 border-blue-200",
        icon: <Zap className="h-3 w-3" />,
      },
      product: {
        label: "Produit",
        className: "bg-green-100/20 text-green-600 border-green-200",
        icon: <Package className="h-3 w-3" />,
      },
      demande: {
        label: "Service",
        className: "bg-purple-100/20 text-purple-600 border-purple-200",
        icon: <ShoppingCart className="h-3 w-3" />,
      },
      refund: {
        label: "Remboursement",
        className: "bg-red-100/20 text-red-600 border-red-200",
        icon: <Repeat2 className="h-3 w-3" />,
      },
    };
    const config = variants[type || "product"] || variants.product;
    return (
      <Badge variant="outline" className={`${config.className} gap-1`}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      completed: { label: "Complété", className: "bg-success/20 text-success" },
      pending: { label: "En attente", className: "bg-warning/20 text-warning" },
      failed: {
        label: "Échoué",
        className: "bg-destructive/20 text-destructive",
      },
      refunded: {
        label: "Remboursé",
        className: "bg-muted text-muted-foreground",
      },
    };
    const config = variants[status] || variants.pending;
    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const handleViewDetails = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailModalOpen(true);
  };

  const handleDownloadReceipt = async (transaction: Transaction) => {
    try {
      const doc = <ReceiptPDF transaction={transaction} />;
      const blob = await pdf(doc).toBlob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `reçu-${transaction.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success("Reçu téléchargé avec succès");
    } catch (err) {
      console.error("Erreur lors du téléchargement du reçu:", err);
      toast.error("Erreur lors du téléchargement du reçu");
    }
  };

  const handleRefund = async (transaction: Transaction) => {
    try {
      await api.post(`/admin/payments/refund/${transaction.id}`);
      // Recharger les transactions après remboursement
      const response = await api.get("/admin/payments/transactions");
      setTransactions(response.data);
    } catch (err) {
      console.error("Erreur lors du remboursement:", err);
      toast.error("Erreur lors du remboursement");
    }
  };

  const handleExportAll = async () => {
    try {
      const response = await api.get("/admin/payments/export", {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = `transactions-${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Erreur lors de l'export:", err);
      // Fallback vers l'export simulé
      exportSimulatedData();
    }
  };

  const exportSimulatedData = () => {
    const exportData = transactions.map((txn) => ({
      ID: txn.id,
      Date: txn.date,
      Client: txn.customer,
      Type: txn.type,
      Montant: txn.amount,
      Méthode: txn.method,
      Statut: txn.status,
      Référence: txn.reference,
    }));

    const csvContent = [
      Object.keys(exportData[0]).join(","),
      ...exportData.map((row) => Object.values(row).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `transactions-${
      new Date().toISOString().split("T")[0]
    }.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const closeDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedTransaction(null);
  };

  const filteredTransactions = transactions.filter(
    (txn) =>
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.reference.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={index} className="p-6 animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </Card>
          ))}
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-center text-destructive">
          <p>{error}</p>
          <Button onClick={() => window.location.reload()} className="mt-4">
            Réessayer
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une transaction..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <PaymentsFilters
              onFilterChange={setFilters}
              isOpen={isFilterOpen}
              onToggle={() => setIsFilterOpen(!isFilterOpen)}
            />
          </div>
          <Button variant="outline" size="sm" onClick={handleExportAll}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTransactions.map((transaction) => (
            <Card
              key={transaction.id}
              className="p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">
                    {transaction.id}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {transaction.date}
                  </p>
                </div>
                {getStatusBadge(transaction.status)}
              </div>

              {/* Badge Type de paiement */}
              <div className="mb-3">
                {getPaymentTypeBadge(transaction.paymentType)}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Client:</span>
                  <span className="font-medium text-foreground">
                    {transaction.customer}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Type:</span>
                  <span className="text-sm text-foreground">
                    {transaction.type}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Méthode:
                  </span>
                  <span className="text-sm text-foreground">
                    {transaction.method}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Référence:
                  </span>
                  <span className="text-sm font-mono text-muted-foreground">
                    {transaction.reference}
                  </span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="text-sm font-medium text-muted-foreground">
                    Montant:
                  </span>
                  <span
                    className={`text-lg font-bold ${
                      transaction.amount.startsWith("-")
                        ? "text-red-500"
                        : "text-green-500"
                    }`}
                  >
                    {transaction.amount}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(transaction)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Détails
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadReceipt(transaction)}
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Reçu
                </Button>
              </div>

              {transaction.status === "completed" && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRefund(transaction)}
                  className="w-full mt-2"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Rembourser
                </Button>
              )}
            </Card>
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Aucune transaction trouvée</p>
          </div>
        )}
      </Card>

      {/* Modal de détails de transaction */}
      <Dialog open={isDetailModalOpen} onOpenChange={closeDetailModal}>
        <DialogContent className="max-w-2xl bg-card border-border overflow-y-auto max-h-[80vh]">
          {selectedTransaction && (
            <>
              <DialogHeader>
                <DialogTitle className="text-foreground flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Détails de la transaction
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {/* En-tête avec ID et statut */}
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      {selectedTransaction.id}
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Référence: {selectedTransaction.reference}
                    </p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(selectedTransaction.status)}
                    <div className="text-2xl font-bold mt-2">
                      <span
                        className={
                          selectedTransaction.amount.startsWith("-")
                            ? "text-red-500"
                            : "text-green-500"
                        }
                      >
                        {selectedTransaction.amount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Informations de base */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                        <Calendar className="h-4 w-4" />
                        Informations transaction
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Date:</span>
                          <span className="font-medium text-foreground">
                            {selectedTransaction.date}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="font-medium text-foreground">
                            {selectedTransaction.type}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            Méthode:
                          </span>
                          <span className="font-medium text-foreground">
                            {selectedTransaction.method}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Détails du service */}
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">
                        Détails du service
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedTransaction.serviceDetails}
                      </p>
                      {selectedTransaction.duration && (
                        <p className="text-sm text-muted-foreground mt-1">
                          Durée: {selectedTransaction.duration}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Informations client */}
                    <div>
                      <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                        <User className="h-4 w-4" />
                        Informations client
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Nom:</span>
                          <p className="font-medium text-foreground">
                            {selectedTransaction.customer}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Email:</span>
                          <p className="font-medium text-foreground">
                            {selectedTransaction.customerEmail}
                          </p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Téléphone:
                          </span>
                          <p className="font-medium text-foreground">
                            {selectedTransaction.customerPhone}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Adresse de facturation */}
                    <div>
                      <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                        <MapPin className="h-4 w-4" />
                        Adresse de facturation
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedTransaction.billingAddress}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Détail du montant */}
                <div className="border-t border-border pt-4">
                  <h3 className="font-semibold text-foreground mb-3">
                    Détail du montant
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sous-total:</span>
                      <span className="font-medium text-foreground">
                        {selectedTransaction.subtotal}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taxes:</span>
                      <span className="font-medium text-foreground">
                        {selectedTransaction.taxAmount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Frais:</span>
                      <span className="font-medium text-foreground">
                        {selectedTransaction.fees}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2">
                      <span className="font-semibold text-foreground">
                        Total:
                      </span>
                      <span
                        className={`font-bold ${
                          selectedTransaction.amount.startsWith("-")
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {selectedTransaction.amount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Informations de paiement */}
                {selectedTransaction.cardLast4 && (
                  <div className="border-t border-border pt-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                      <CreditCard className="h-4 w-4" />
                      Informations de paiement
                    </h3>
                    <div className="text-sm text-muted-foreground">
                      {selectedTransaction.cardBrand} ••••{" "}
                      {selectedTransaction.cardLast4}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={() => handleDownloadReceipt(selectedTransaction)}
                    className="flex-1"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger le reçu
                  </Button>

                  {selectedTransaction.status === "completed" && (
                    <Button
                      variant="destructive"
                      onClick={() => handleRefund(selectedTransaction)}
                      className="flex-1"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Rembourser
                    </Button>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
