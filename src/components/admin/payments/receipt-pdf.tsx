import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

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

interface ReceiptPDFProps {
  transaction: Transaction;
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },
  header: {
    marginBottom: 30,
    borderBottomWidth: 2,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: "#6b7280",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 5,
  },
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 10,
    color: "#6b7280",
    flex: 1,
  },
  value: {
    fontSize: 10,
    color: "#1f2937",
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
  amount: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#16a34a",
  },
  negativeAmount: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#dc2626",
  },
  divider: {
    marginVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
  },
  totalRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 10,
    borderTopWidth: 2,
    borderTopColor: "#e5e7eb",
  },
  totalLabel: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1f2937",
  },
  totalValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#16a34a",
  },
  grid: {
    display: "flex",
    flexDirection: "row",
    gap: 20,
  },
  column: {
    flex: 1,
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    textAlign: "center",
    color: "#6b7280",
    fontSize: 10,
  },
  badge: {
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: 4,
    backgroundColor: "#dbeafe",
    color: "#1e40af",
    fontSize: 9,
    fontWeight: "bold",
    marginBottom: 10,
  },
  statusBadge: {
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: 4,
    backgroundColor: "#dcfce7",
    color: "#166534",
    fontSize: 9,
    fontWeight: "bold",
  },
});

export function ReceiptPDF({ transaction }: ReceiptPDFProps) {
  const isRefund = transaction.amount.startsWith("-");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête */}
        <View style={styles.header}>
          <Text style={styles.title}>REÇU DE PAIEMENT</Text>
          <Text style={styles.subtitle}>
            ID Transaction: {transaction.id}
          </Text>
        </View>

        {/* Informations de base */}
        <View style={styles.section}>
          <View style={styles.row}>
            <View style={styles.column}>
              <Text style={styles.sectionTitle}>Informations Transaction</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Date:</Text>
                <Text style={styles.value}>{transaction.date}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Référence:</Text>
                <Text style={styles.value}>{transaction.reference}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Type:</Text>
                <Text style={styles.value}>{transaction.type}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Méthode:</Text>
                <Text style={styles.value}>{transaction.method}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Statut:</Text>
                <Text style={styles.statusBadge}>
                  {transaction.status === "completed"
                    ? "Complété"
                    : transaction.status === "pending"
                      ? "En attente"
                      : transaction.status === "failed"
                        ? "Échoué"
                        : "Remboursé"}
                </Text>
              </View>
            </View>

            <View style={styles.column}>
              <Text style={styles.sectionTitle}>Client</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Nom:</Text>
                <Text style={styles.value}>{transaction.customer}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Email:</Text>
                <Text style={styles.value}>{transaction.customerEmail}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Téléphone:</Text>
                <Text style={styles.value}>{transaction.customerPhone}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.label}>Adresse:</Text>
                <Text style={styles.value}>{transaction.billingAddress}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Détails du service */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Service</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Détails:</Text>
            <Text style={styles.value}>{transaction.serviceDetails}</Text>
          </View>
          {transaction.duration && (
            <View style={styles.row}>
              <Text style={styles.label}>Durée:</Text>
              <Text style={styles.value}>{transaction.duration}</Text>
            </View>
          )}
        </View>

        <View style={styles.divider} />

        {/* Détail du montant */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Détail du Montant</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Sous-total:</Text>
            <Text style={styles.value}>{transaction.subtotal}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Taxes:</Text>
            <Text style={styles.value}>{transaction.taxAmount}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Frais:</Text>
            <Text style={styles.value}>{transaction.fees}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text
              style={[
                styles.totalValue,
                isRefund ? styles.negativeAmount : styles.amount,
              ]}
            >
              {transaction.amount}
            </Text>
          </View>
        </View>

        {/* Informations de paiement */}
        {transaction.cardLast4 && (
          <>
            <View style={styles.divider} />
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Méthode de Paiement</Text>
              <View style={styles.row}>
                <Text style={styles.label}>Carte:</Text>
                <Text style={styles.value}>
                  {transaction.cardBrand} •••• {transaction.cardLast4}
                </Text>
              </View>
            </View>
          </>
        )}

        {/* Pied de page */}
        <View style={styles.footer}>
          <Text>Merci pour votre confiance !</Text>
          <Text>Pour toute question, veuillez contacter notre support.</Text>
          <Text style={{ marginTop: 10 }}>
            Généré le {new Date().toLocaleDateString("fr-FR")}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
