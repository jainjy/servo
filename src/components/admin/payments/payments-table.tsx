import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Filter, Eye, Download, RefreshCw, Calendar, User, CreditCard, FileText, MapPin } from "lucide-react"

export function PaymentsTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTransaction, setSelectedTransaction] = useState<(typeof transactions)[0] | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const transactions = [
    {
      id: "TXN001234",
      date: "2024-01-15 14:32",
      customer: "Marie Dubois",
      type: "Réservation Service",
      amount: "€450.00",
      method: "Carte Bancaire",
      status: "completed",
      reference: "BKG-2024-001",
      customerEmail: "marie.dubois@email.com",
      customerPhone: "+33 1 23 45 67 89",
      billingAddress: "15 rue de la Paix, 75001 Paris, France",
      cardLast4: "4242",
      cardBrand: "Visa",
      serviceDetails: "Nettoyage complet - Appartement 3 pièces",
      duration: "4 heures",
      taxAmount: "€90.00",
      subtotal: "€360.00",
      fees: "€0.00",
    },
    {
      id: "TXN001235",
      date: "2024-01-15 13:15",
      customer: "Jean Martin",
      type: "Achat Produit",
      amount: "€89.99",
      method: "PayPal",
      status: "completed",
      reference: "ORD-2024-156",
      customerEmail: "jean.martin@email.com",
      customerPhone: "+33 6 12 34 56 78",
      billingAddress: "42 avenue Victor Hugo, 69000 Lyon, France",
      cardLast4: "",
      cardBrand: "",
      serviceDetails: "Kit de nettoyage premium",
      duration: "",
      taxAmount: "€17.99",
      subtotal: "€72.00",
      fees: "€0.00",
    },
    {
      id: "TXN001236",
      date: "2024-01-15 12:45",
      customer: "Sophie Laurent",
      type: "Expérience Tourisme",
      amount: "€120.00",
      method: "Carte Bancaire",
      status: "pending",
      reference: "TOU-2024-089",
      customerEmail: "sophie.laurent@email.com",
      customerPhone: "+33 7 89 01 23 45",
      billingAddress: "8 boulevard Gambetta, 13000 Marseille, France",
      cardLast4: "1881",
      cardBrand: "Mastercard",
      serviceDetails: "Visite guidée du Vieux Port",
      duration: "2 heures",
      taxAmount: "€24.00",
      subtotal: "€96.00",
      fees: "€0.00",
    },
    {
      id: "TXN001237",
      date: "2024-01-15 11:20",
      customer: "Pierre Durand",
      type: "Abonnement Premium",
      amount: "€29.99",
      method: "Prélèvement",
      status: "completed",
      reference: "SUB-2024-045",
      customerEmail: "pierre.durand@email.com",
      customerPhone: "+33 6 78 90 12 34",
      billingAddress: "23 rue Nationale, 33000 Bordeaux, France",
      cardLast4: "",
      cardBrand: "",
      serviceDetails: "Abonnement mensuel - Formule Premium",
      duration: "1 mois",
      taxAmount: "€6.00",
      subtotal: "€23.99",
      fees: "€0.00",
    },
    {
      id: "TXN001238",
      date: "2024-01-15 10:05",
      customer: "Claire Bernard",
      type: "Remboursement",
      amount: "-€75.00",
      method: "Carte Bancaire",
      status: "refunded",
      reference: "REF-2024-012",
      customerEmail: "claire.bernard@email.com",
      customerPhone: "+33 7 56 78 90 12",
      billingAddress: "5 place Bellecour, 69002 Lyon, France",
      cardLast4: "5252",
      cardBrand: "Mastercard",
      serviceDetails: "Remboursement - Cours de cuisine annulé",
      duration: "",
      taxAmount: "-€15.00",
      subtotal: "-€60.00",
      fees: "€0.00",
    },
  ]

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { label: string; className: string }> = {
      completed: { label: "Complété", className: "bg-success/20 text-success" },
      pending: { label: "En attente", className: "bg-warning/20 text-warning" },
      failed: { label: "Échoué", className: "bg-destructive/20 text-destructive" },
      refunded: { label: "Remboursé", className: "bg-muted text-muted-foreground" },
    }
    const config = variants[status] || variants.pending
    return <Badge className={config.className}>{config.label}</Badge>
  }

  const handleViewDetails = (transaction: (typeof transactions)[0]) => {
    setSelectedTransaction(transaction)
    setIsDetailModalOpen(true)
  }

  const handleDownloadReceipt = (transaction: (typeof transactions)[0]) => {
    // Simulation de téléchargement d'un reçu PDF
    console.log("Téléchargement du reçu:", transaction)
    
    // Création d'un contenu PDF simulé
    const receiptContent = `
      REÇU DE PAIEMENT
      =================
      
      ID Transaction: ${transaction.id}
      Date: ${transaction.date}
      Référence: ${transaction.reference}
      
      Client: ${transaction.customer}
      Email: ${transaction.customerEmail}
      Téléphone: ${transaction.customerPhone}
      
      Service: ${transaction.serviceDetails}
      Type: ${transaction.type}
      
      DÉTAIL DU MONTANT:
      Sous-total: ${transaction.subtotal}
      Taxe: ${transaction.taxAmount}
      Total: ${transaction.amount}
      
      Méthode de paiement: ${transaction.method}
      ${transaction.cardLast4 ? `Carte: ${transaction.cardBrand} ****${transaction.cardLast4}` : ''}
      
      Statut: ${getStatusBadge(transaction.status).props.children}
      
      Merci pour votre confiance !
    `
    
    // Création d'un blob et téléchargement
    const blob = new Blob([receiptContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `reçu-${transaction.id}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    // Vous pouvez remplacer cette simulation par un vrai appel API
    // pour générer un PDF côté serveur
  }

  const handleRefund = (transaction: (typeof transactions)[0]) => {
    console.log("Rembourser:", transaction)
    // Implémentez la logique de remboursement ici
  }

  const handleExportAll = () => {
    // Simulation d'export de toutes les transactions
    const exportData = transactions.map(txn => ({
      ID: txn.id,
      Date: txn.date,
      Client: txn.customer,
      Type: txn.type,
      Montant: txn.amount,
      Méthode: txn.method,
      Statut: txn.status,
      Référence: txn.reference
    }))
    
    const csvContent = [
      Object.keys(exportData[0]).join(','),
      ...exportData.map(row => Object.values(row).join(','))
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const closeDetailModal = () => {
    setIsDetailModalOpen(false)
    setSelectedTransaction(null)
  }

  const filteredTransactions = transactions.filter(
    (txn) =>
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.reference.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          </div>
          <Button variant="outline" size="sm" onClick={handleExportAll}>
            <Download className="h-4 w-4 mr-2" />
            Exporter
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredTransactions.map((transaction) => (
            <Card key={transaction.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-foreground">{transaction.id}</h3>
                  <p className="text-sm text-muted-foreground">{transaction.date}</p>
                </div>
                {getStatusBadge(transaction.status)}
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Client:</span>
                  <span className="font-medium text-foreground">{transaction.customer}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Type:</span>
                  <span className="text-sm text-foreground">{transaction.type}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Méthode:</span>
                  <span className="text-sm text-foreground">{transaction.method}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Référence:</span>
                  <span className="text-sm font-mono text-muted-foreground">{transaction.reference}</span>
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-border">
                  <span className="text-sm font-medium text-muted-foreground">Montant:</span>
                  <span
                    className={`text-lg font-bold ${
                      transaction.amount.startsWith("-") ? "text-red-500" : "text-green-500"
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
                    <h2 className="text-xl font-bold text-foreground">{selectedTransaction.id}</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Référence: {selectedTransaction.reference}
                    </p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(selectedTransaction.status)}
                    <div className="text-2xl font-bold mt-2">
                      <span className={selectedTransaction.amount.startsWith("-") ? "text-red-500" : "text-green-500"}>
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
                          <span className="font-medium text-foreground">{selectedTransaction.date}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Type:</span>
                          <span className="font-medium text-foreground">{selectedTransaction.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Méthode:</span>
                          <span className="font-medium text-foreground">{selectedTransaction.method}</span>
                        </div>
                      </div>
                    </div>

                    {/* Détails du service */}
                    <div>
                      <h3 className="font-semibold text-foreground mb-3">Détails du service</h3>
                      <p className="text-sm text-muted-foreground">{selectedTransaction.serviceDetails}</p>
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
                          <p className="font-medium text-foreground">{selectedTransaction.customer}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Email:</span>
                          <p className="font-medium text-foreground">{selectedTransaction.customerEmail}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Téléphone:</span>
                          <p className="font-medium text-foreground">{selectedTransaction.customerPhone}</p>
                        </div>
                      </div>
                    </div>

                    {/* Adresse de facturation */}
                    <div>
                      <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                        <MapPin className="h-4 w-4" />
                        Adresse de facturation
                      </h3>
                      <p className="text-sm text-muted-foreground">{selectedTransaction.billingAddress}</p>
                    </div>
                  </div>
                </div>

                {/* Détail du montant */}
                <div className="border-t border-border pt-4">
                  <h3 className="font-semibold text-foreground mb-3">Détail du montant</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sous-total:</span>
                      <span className="font-medium text-foreground">{selectedTransaction.subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Taxes:</span>
                      <span className="font-medium text-foreground">{selectedTransaction.taxAmount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Frais:</span>
                      <span className="font-medium text-foreground">{selectedTransaction.fees}</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2">
                      <span className="font-semibold text-foreground">Total:</span>
                      <span className={`font-bold ${
                        selectedTransaction.amount.startsWith("-") ? "text-red-500" : "text-green-500"
                      }`}>
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
                      {selectedTransaction.cardBrand} •••• {selectedTransaction.cardLast4}
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
  )
}