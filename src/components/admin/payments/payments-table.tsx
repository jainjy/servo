

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Eye, Download, RefreshCw } from "lucide-react"

export function PaymentsTable() {
  const [searchQuery, setSearchQuery] = useState("")

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
    console.log("Voir les détails:", transaction)
    // Implémentez la logique de visualisation ici
  }

  const handleDownloadReceipt = (transaction: (typeof transactions)[0]) => {
    console.log("Télécharger le reçu:", transaction)
    // Implémentez la logique de téléchargement ici
  }

  const handleRefund = (transaction: (typeof transactions)[0]) => {
    console.log("Rembourser:", transaction)
    // Implémentez la logique de remboursement ici
  }

  const filteredTransactions = transactions.filter(
    (txn) =>
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.reference.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
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
        <Button variant="outline" size="sm">
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
  )
}