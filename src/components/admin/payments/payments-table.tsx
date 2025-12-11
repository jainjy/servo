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
  Filter,
  ChevronRight,
  BarChart3,
  MoreVertical,
  ExternalLink,
  Shield,
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
  paymentType?: "subscription" | "product" | "demande" | "refund";
}

export function PaymentsTable() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
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

  const colorTheme = {
    logo: "#556B2F",
    primaryDark: "#6B8E23",
    lightBg: "#FFFFFF",
    separator: "#D3D3D3",
    secondaryText: "#8B4513",
  };

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
      { label: string; className: string; icon: React.ReactNode; color: string }
    > = {
      subscription: {
        label: "Abonnement",
        className: "bg-gradient-to-r from-blue-500/20 to-blue-600/20 text-blue-700 border-blue-200/50",
        icon: <Zap className="h-3 w-3" />,
        color: "blue",
      },
      product: {
        label: "Produit",
        className: "bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-700 border-emerald-200/50",
        icon: <Package className="h-3 w-3" />,
        color: "emerald",
      },
      demande: {
        label: "Service",
        className: "bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-purple-700 border-purple-200/50",
        icon: <ShoppingCart className="h-3 w-3" />,
        color: "purple",
      },
      refund: {
        label: "Remboursement",
        className: "bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-700 border-red-200/50",
        icon: <Repeat2 className="h-3 w-3" />,
        color: "red",
      },
    };
    const config = variants[type || "product"] || variants.product;
    return (
      <Badge variant="outline" className={`${config.className} gap-1.5 px-2.5 py-1`}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { 
      label: string; 
      className: string; 
      icon?: React.ReactNode 
    }> = {
      completed: { 
        label: "Complété", 
        className: "bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 text-emerald-700 border-emerald-200/50",
        icon: <Shield className="h-3 w-3" />
      },
      pending: { 
        label: "En attente", 
        className: "bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-700 border-amber-200/50" 
      },
      failed: {
        label: "Échoué",
        className: "bg-gradient-to-r from-red-500/20 to-red-600/20 text-red-700 border-red-200/50",
      },
      refunded: {
        label: "Remboursé",
        className: "bg-gradient-to-r from-gray-500/20 to-gray-600/20 text-gray-700 border-gray-200/50",
      },
    };
    const config = variants[status] || variants.pending;
    return (
      <Badge className={`${config.className} gap-1 px-3 py-1.5 border`}>
        {config.icon}
        {config.label}
      </Badge>
    );
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

      toast.success("Reçu téléchargé avec succès", {
        style: { 
          background: colorTheme.primaryDark, 
          color: 'white',
          border: `1px solid ${colorTheme.separator}`
        }
      });
    } catch (err) {
      console.error("Erreur lors du téléchargement du reçu:", err);
      toast.error("Erreur lors du téléchargement du reçu", {
        style: { 
          background: '#EF4444', 
          color: 'white',
          border: `1px solid ${colorTheme.separator}`
        }
      });
    }
  };

  const handleRefund = async (transaction: Transaction) => {
    try {
      await api.post(`/admin/payments/refund/${transaction.id}`);
      const response = await api.get("/admin/payments/transactions");
      setTransactions(response.data);
      
      toast.success("Remboursement effectué avec succès", {
        style: { 
          background: colorTheme.primaryDark, 
          color: 'white',
          border: `1px solid ${colorTheme.separator}`
        }
      });
    } catch (err) {
      console.error("Erreur lors du remboursement:", err);
      toast.error("Erreur lors du remboursement", {
        style: { 
          background: '#EF4444', 
          color: 'white',
          border: `1px solid ${colorTheme.separator}`
        }
      });
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
      link.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Export réussi", {
        style: { 
          background: colorTheme.primaryDark, 
          color: 'white',
          border: `1px solid ${colorTheme.separator}`
        }
      });
    } catch (err) {
      console.error("Erreur lors de l'export:", err);
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
    link.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
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
      <Card className="p-6 border border-gray-100 bg-white rounded-xl shadow-sm">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <Card key={index} className="p-6 border border-gray-100 animate-pulse">
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
      <Card className="p-6 border border-gray-100 bg-white rounded-xl shadow-sm">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" 
            style={{ backgroundColor: `${colorTheme.logo}15` }}>
            <BarChart3 className="h-8 w-8" style={{ color: colorTheme.logo }} />
          </div>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            style={{ backgroundColor: colorTheme.logo }}
            className="text-white hover:opacity-90 transition-opacity"
          >
            Réessayer
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card className="p-6 border border-gray-100 bg-white rounded-xl shadow-sm">
        {/* Header avec recherche et filtres */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
          <div className="flex-1 w-full">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 rounded-lg" style={{ backgroundColor: `${colorTheme.logo}15` }}>
                <CreditCard className="h-5 w-5" style={{ color: colorTheme.logo }} />
              </div>
              <h2 
                className="text-xl font-bold"
                style={{ color: colorTheme.secondaryText }}
              >
                Transactions de paiement
              </h2>
            </div>
            <div 
              className="h-1 w-16 rounded-full"
              style={{ backgroundColor: colorTheme.primaryDark }}
            ></div>
          </div>
          
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:flex-none">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher une transaction..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />
            </div>
            
            <PaymentsFilters
              onFilterChange={setFilters}
              isOpen={isFilterOpen}
              onToggle={() => setIsFilterOpen(!isFilterOpen)}
            />
            
            <Button 
              variant="outline"
              size="sm"
              onClick={handleExportAll}
              className="border-gray-200 hover:border-gray-300 hover:bg-gray-50"
            >
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Grille des transactions */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTransactions.map((transaction) => (
            <Card
              key={transaction.id}
              className="p-5 border border-gray-100 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden"
            >
              {/* Barre verticale colorée */}
              <div 
                className="absolute left-0 top-0 bottom-0 w-1"
                style={{ 
                  backgroundColor: transaction.status === 'completed' ? colorTheme.primaryDark : 
                    transaction.status === 'pending' ? '#F59E0B' : 
                    transaction.status === 'failed' ? '#EF4444' : '#6B7280'
                }}
              ></div>

              {/* En-tête de la carte */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-[#6B8E23] transition-colors duration-200 truncate">
                      {transaction.id}
                    </h3>
                    <ExternalLink className="h-3 w-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-sm text-gray-500">
                    {transaction.date}
                  </p>
                </div>
                {getStatusBadge(transaction.status)}
              </div>

              {/* Badge Type de paiement */}
              <div className="mb-3">
                {getPaymentTypeBadge(transaction.paymentType)}
              </div>

              {/* Informations transaction */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Client:</span>
                  <span className="font-medium text-gray-900">
                    {transaction.customer}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Méthode:</span>
                  <span className="text-sm text-gray-700">
                    {transaction.method}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Référence:</span>
                  <span className="text-sm font-mono text-gray-500">
                    {transaction.reference.slice(0, 8)}...
                  </span>
                </div>

                {/* Montant avec effet visuel */}
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">
                      Montant:
                    </span>
                    <span
                      className={`text-xl font-bold ${
                        transaction.amount.startsWith("-")
                          ? "text-red-600"
                          : "text-emerald-600"
                      }`}
                    >
                      {transaction.amount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleViewDetails(transaction)}
                  className="flex-1 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Détails
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDownloadReceipt(transaction)}
                  className="flex-1 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
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
                  className="w-full mt-3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-red-600"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Rembourser
                </Button>
              )}
            </Card>
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4" 
              style={{ backgroundColor: `${colorTheme.logo}10` }}>
              <Search className="h-10 w-10" style={{ color: colorTheme.logo }} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Aucune transaction trouvée
            </h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              Aucune transaction ne correspond à vos critères de recherche.
              Essayez d'ajuster vos filtres ou votre recherche.
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setFilters({
                  type: "all",
                  status: "all",
                  method: "all",
                  dateRange: "all",
                });
              }}
              style={{ backgroundColor: colorTheme.logo }}
              className="text-white hover:opacity-90 transition-opacity"
            >
              <Filter className="h-4 w-4 mr-2" />
              Réinitialiser les filtres
            </Button>
          </div>
        )}
      </Card>

      {/* Modal de détails de transaction */}
      <Dialog open={isDetailModalOpen} onOpenChange={closeDetailModal}>
        <DialogContent 
          className="max-w-2xl bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden"
          style={{ borderColor: colorTheme.separator }}
        >
          {selectedTransaction && (
            <>
              {/* Header modal avec gradient */}
              <DialogHeader className="pb-4 border-b border-gray-100">
                <div 
                  className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
                  style={{ 
                    background: `linear-gradient(90deg, ${colorTheme.primaryDark}, ${colorTheme.logo})`
                  }}
                ></div>
                
                <DialogTitle className="text-gray-900 flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ backgroundColor: `${colorTheme.logo}15` }}>
                    <FileText className="h-5 w-5" style={{ color: colorTheme.logo }} />
                  </div>
                  <div>
                    <div className="text-lg font-bold">Détails de la transaction</div>
                    <div className="text-sm text-gray-500 font-normal mt-1">
                      ID: {selectedTransaction.id}
                    </div>
                  </div>
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* En-tête avec montant */}
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusBadge(selectedTransaction.status)}
                      {getPaymentTypeBadge(selectedTransaction.paymentType)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Référence: {selectedTransaction.reference}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">
                      <span
                        className={
                          selectedTransaction.amount.startsWith("-")
                            ? "text-red-600"
                            : "text-emerald-600"
                        }
                      >
                        {selectedTransaction.amount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Grid informations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Informations transaction */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border border-gray-100 bg-gray-50/50">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                        <Calendar className="h-4 w-4" />
                        Informations transaction
                      </h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Date:</span>
                          <span className="font-medium text-gray-900">
                            {selectedTransaction.date}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Type:</span>
                          <span className="font-medium text-gray-900">
                            {selectedTransaction.type}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Méthode:</span>
                          <span className="font-medium text-gray-900">
                            {selectedTransaction.method}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Détails du service */}
                    <div className="p-4 rounded-lg border border-gray-100 bg-gray-50/50">
                      <h3 className="font-semibold text-gray-900 mb-3">
                        Détails du service
                      </h3>
                      <p className="text-sm text-gray-600">
                        {selectedTransaction.serviceDetails}
                      </p>
                      {selectedTransaction.duration && (
                        <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs">
                          <Clock className="h-3 w-3" />
                          Durée: {selectedTransaction.duration}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Informations client */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg border border-gray-100 bg-gray-50/50">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                        <User className="h-4 w-4" />
                        Informations client
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div>
                          <div className="text-gray-500 mb-1">Nom:</div>
                          <div className="font-medium text-gray-900">
                            {selectedTransaction.customer}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500 mb-1">Email:</div>
                          <div className="font-medium text-gray-900">
                            {selectedTransaction.customerEmail}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-500 mb-1">Téléphone:</div>
                          <div className="font-medium text-gray-900">
                            {selectedTransaction.customerPhone}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Adresse de facturation */}
                    <div className="p-4 rounded-lg border border-gray-100 bg-gray-50/50">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                        <MapPin className="h-4 w-4" />
                        Adresse de facturation
                      </h3>
                      <p className="text-sm text-gray-600">
                        {selectedTransaction.billingAddress}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Détail du montant */}
                <div className="p-4 rounded-lg border border-gray-100 bg-gradient-to-r from-gray-50 to-gray-50/50">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Détail du montant
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between py-2">
                      <span className="text-gray-500">Sous-total:</span>
                      <span className="font-medium text-gray-900">
                        {selectedTransaction.subtotal}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-t border-gray-100">
                      <span className="text-gray-500">Taxes:</span>
                      <span className="font-medium text-gray-900">
                        {selectedTransaction.taxAmount}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 border-t border-gray-100">
                      <span className="text-gray-500">Frais:</span>
                      <span className="font-medium text-gray-900">
                        {selectedTransaction.fees}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-t border-gray-200 mt-2">
                      <span className="font-semibold text-gray-900 text-base">
                        Total:
                      </span>
                      <span
                        className={`font-bold text-xl ${
                          selectedTransaction.amount.startsWith("-")
                            ? "text-red-600"
                            : "text-emerald-600"
                        }`}
                      >
                        {selectedTransaction.amount}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Informations de paiement */}
                {selectedTransaction.cardLast4 && (
                  <div className="p-4 rounded-lg border border-gray-100 bg-gray-50/50">
                    <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
                      <CreditCard className="h-4 w-4" />
                      Informations de paiement
                    </h3>
                    <div className="text-sm text-gray-600">
                      {selectedTransaction.cardBrand} •••• {selectedTransaction.cardLast4}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <Button
                    variant="outline"
                    onClick={() => handleDownloadReceipt(selectedTransaction)}
                    className="flex-1 border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger le reçu
                  </Button>

                  {selectedTransaction.status === "completed" && (
                    <Button
                      variant="destructive"
                      onClick={() => handleRefund(selectedTransaction)}
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-red-600"
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