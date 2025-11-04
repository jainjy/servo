import React, { useMemo, useState, useCallback, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { paymentsAPI } from "@/lib/api/payments";

// --- Types ---
interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  status: "payee" | "en_attente" | "echoue" | "rembourse";
  receiptUrl?: string;
}

interface Invoice {
  id: string;
  number: string;
  date: string;
  total: number;
  pdfUrl?: string;
}

interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  holder: string;
  isDefault?: boolean;
}

interface BillingAddress {
  name: string;
  address: string;
  addressComplement?: string;
  city: string;
  zipCode: string;
  country: string;
}

// --- Utility ---
function formatCurrency(amount: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

// --- Sub-components ---
function StatusBadge({ status }: { status: Transaction["status"] }) {
  const variant =
    status === "payee"
      ? "default"
      : status === "en_attente"
      ? "secondary"
      : status === "rembourse"
      ? "outline"
      : "destructive";
  const label =
    status === "payee"
      ? "Payée"
      : status === "en_attente"
      ? "En attente"
      : status === "rembourse"
      ? "Remboursée"
      : "Échouée";

  return <Badge variant={variant as any}>{label}</Badge>;
}

function AddCardDialog({ onAdd }: { onAdd: (method: PaymentMethod) => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);

      try {
        const form = new FormData(e.currentTarget);
        const holder = String(form.get("holder") || "");
        const number = String(form.get("number") || "");
        const exp = String(form.get("exp") || "");
        const cvc = String(form.get("cvc") || "");

        if (!holder || !number || !exp || !cvc) {
          toast({
            title: "Champs manquants",
            description: "Veuillez compléter le formulaire",
            variant: "destructive",
          });
          return;
        }

        const last4 = number.replace(/\s+/g, "").slice(-4);
        const [mm, yy] = exp.split("/");

        // Appel API pour ajouter la carte
        const response = await paymentsAPI.addPaymentMethod({
          holder,
          number,
          expMonth: Number(mm),
          expYear: 2000 + Number(yy),
          brand: number.startsWith("4") ? "Visa" : "Mastercard",
          last4,
        });

        onAdd(response.data);
        setOpen(false);
        toast({
          title: "Carte ajoutée",
          description: `**** **** **** ${last4}`,
        });
      } catch (error) {
        console.error("Erreur ajout carte:", error);
        toast({
          title: "Erreur",
          description: "Impossible d'ajouter la carte",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [onAdd, toast]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Ajouter une carte</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une méthode de paiement</DialogTitle>
          <DialogDescription>
            Saisissez les informations de votre carte
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="holder">Titulaire de la carte</Label>
            <Input
              id="holder"
              name="holder"
              placeholder="Jean Dupont"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="number">Numéro de carte</Label>
            <Input
              id="number"
              name="number"
              inputMode="numeric"
              placeholder="4242 4242 4242 4242"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="exp">Expiration (MM/AA)</Label>
              <Input id="exp" name="exp" placeholder="12/26" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input
                id="cvc"
                name="cvc"
                inputMode="numeric"
                placeholder="123"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Ajout en cours..." : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// --- Main Component ---
export default function PaiementPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState({
    transactions: false,
    invoices: false,
    paymentMethods: false,
  });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [billingAddress, setBillingAddress] = useState<BillingAddress | null>(
    null
  );
  const [selectedPeriod, setSelectedPeriod] = useState("3m");

  // Charger les données
  useEffect(() => {
    loadTransactions();
    loadInvoices();
    loadPaymentMethods();
    loadBillingAddress();
  }, []);

  const loadTransactions = async (period = selectedPeriod) => {
    setLoading((prev) => ({ ...prev, transactions: true }));
    try {
      const response = await paymentsAPI.getTransactions(period);
      setTransactions(response.data);
    } catch (error) {
      console.error("Erreur chargement transactions:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'historique",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, transactions: false }));
    }
  };

  const loadInvoices = async () => {
    setLoading((prev) => ({ ...prev, invoices: true }));
    try {
      const response = await paymentsAPI.getInvoices();
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

  const loadPaymentMethods = async () => {
    setLoading((prev) => ({ ...prev, paymentMethods: true }));
    try {
      const response = await paymentsAPI.getPaymentMethods();
      setPaymentMethods(response.data);
    } catch (error) {
      console.error("Erreur chargement méthodes paiement:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les méthodes de paiement",
        variant: "destructive",
      });
    } finally {
      setLoading((prev) => ({ ...prev, paymentMethods: false }));
    }
  };

  const loadBillingAddress = async () => {
    try {
      const response = await paymentsAPI.getBillingAddress();
      setBillingAddress(response.data);
    } catch (error) {
      console.error("Erreur chargement adresse facturation:", error);
    }
  };

  const setDefaultMethod = useCallback(
    async (id: string) => {
      try {
        await paymentsAPI.setDefaultPaymentMethod(id);
        setPaymentMethods((prev) =>
          prev.map((m) => ({ ...m, isDefault: m.id === id }))
        );
        toast({ title: "Méthode par défaut mise à jour" });
      } catch (error) {
        console.error("Erreur mise à jour méthode par défaut:", error);
        toast({
          title: "Erreur",
          description: "Impossible de définir comme méthode par défaut",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  const removeMethod = useCallback(
    async (id: string) => {
      try {
        await paymentsAPI.removePaymentMethod(id);
        setPaymentMethods((prev) => prev.filter((m) => m.id !== id));
        toast({ title: "Méthode de paiement supprimée" });
      } catch (error) {
        console.error("Erreur suppression méthode paiement:", error);
        toast({
          title: "Erreur",
          description: "Impossible de supprimer la méthode de paiement",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  const addMethod = useCallback((method: PaymentMethod) => {
    setPaymentMethods((prev) => [...prev, method]);
  }, []);

  const updateBillingAddress = async (data: BillingAddress) => {
    try {
      await paymentsAPI.updateBillingAddress(data);
      setBillingAddress(data);
      toast({ title: "Adresse mise à jour" });
    } catch (error) {
      console.error("Erreur mise à jour adresse:", error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour l'adresse",
        variant: "destructive",
      });
    }
  };

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
    loadTransactions(value);
  };

  const handleDownloadReceipt = async (transactionId: string) => {
    try {
      const response = await paymentsAPI.downloadReceipt(transactionId);
      // Ici vous pouvez gérer le téléchargement du fichier
      console.log("Reçu téléchargé:", response.data);
      toast({ title: "Reçu téléchargé" });
    } catch (error) {
      console.error("Erreur téléchargement reçu:", error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger le reçu",
        variant: "destructive",
      });
    }
  };

  const handleDownloadInvoice = async (invoiceId: string) => {
    try {
      const response = await paymentsAPI.downloadInvoice(invoiceId);
      // Ici vous pouvez gérer le téléchargement du fichier PDF
      console.log("Facture téléchargée:", response.data);
      toast({ title: "Facture téléchargée" });
    } catch (error) {
      console.error("Erreur téléchargement facture:", error);
      toast({
        title: "Erreur",
        description: "Impossible de télécharger la facture",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="container mx-auto max-w-6xl py-8 mt-12">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Paiement</h1>
          <p className="text-muted-foreground">
            Gérez vos paiements, factures et méthodes de paiement.
          </p>
        </div>

        <Tabs defaultValue="historique" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="historique">Historique</TabsTrigger>
            <TabsTrigger value="factures">Factures</TabsTrigger>
            <TabsTrigger value="methods">Moyens de paiement</TabsTrigger>
          </TabsList>

          {/* Transactions */}
          <TabsContent value="historique" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historique des transactions</CardTitle>
                <CardDescription>
                  Vos derniers paiements et remboursements
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 pb-4">
                  <div className="w-48">
                    <Select
                      value={selectedPeriod}
                      onValueChange={handlePeriodChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Période" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1m">Dernier mois</SelectItem>
                        <SelectItem value="3m">3 derniers mois</SelectItem>
                        <SelectItem value="12m">12 derniers mois</SelectItem>
                        <SelectItem value="all">Tout</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Montant</TableHead>
                        <TableHead>Statut</TableHead>
                        <TableHead className="w-[1%]">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading.transactions ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            Chargement...
                          </TableCell>
                        </TableRow>
                      ) : transactions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            Aucune transaction trouvée
                          </TableCell>
                        </TableRow>
                      ) : (
                        transactions.map((tx) => (
                          <TableRow key={tx.id}>
                            <TableCell>
                              {new Date(tx.date).toLocaleDateString("fr-FR")}
                            </TableCell>
                            <TableCell>{tx.description}</TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(tx.amount)}
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={tx.status} />
                            </TableCell>
                            <TableCell className="text-right">
                              {tx.receiptUrl ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDownloadReceipt(tx.id)}
                                >
                                  Télécharger reçu
                                </Button>
                              ) : (
                                <Button variant="ghost" size="sm" disabled>
                                  Indisponible
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Invoices */}
          <TabsContent value="factures" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Factures</CardTitle>
                <CardDescription>
                  Téléchargez vos factures au format PDF
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Numéro</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="w-[1%]">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading.invoices ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4">
                            Chargement...
                          </TableCell>
                        </TableRow>
                      ) : invoices.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4">
                            Aucune facture trouvée
                          </TableCell>
                        </TableRow>
                      ) : (
                        invoices.map((inv) => (
                          <TableRow key={inv.id}>
                            <TableCell className="font-medium">
                              {inv.number}
                            </TableCell>
                            <TableCell>
                              {new Date(inv.date).toLocaleDateString("fr-FR")}
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(inv.total)}
                            </TableCell>
                            <TableCell className="text-right">
                              {inv.pdfUrl ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDownloadInvoice(inv.id)}
                                >
                                  Télécharger
                                </Button>
                              ) : (
                                <Button variant="ghost" size="sm" disabled>
                                  Indisponible
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment methods */}
          <TabsContent value="methods" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle>Méthodes enregistrées</CardTitle>
                    <CardDescription>
                      Cartes bancaires associées à votre compte
                    </CardDescription>
                  </div>
                  <AddCardDialog onAdd={addMethod} />
                </CardHeader>
                <CardContent className="space-y-3">
                  {loading.paymentMethods ? (
                    <p className="text-sm text-muted-foreground">
                      Chargement...
                    </p>
                  ) : paymentMethods.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Aucune carte enregistrée.
                    </p>
                  ) : (
                    paymentMethods.map((m) => (
                      <div
                        key={m.id}
                        className="flex items-center justify-between rounded-md border p-3"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium">
                              {m.brand} •••• {m.last4}
                            </p>
                            {m.isDefault && <Badge>Par défaut</Badge>}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Exp. {String(m.expMonth).padStart(2, "0")}/
                            {m.expYear} • {m.holder}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {!m.isDefault && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setDefaultMethod(m.id)}
                            >
                              Définir par défaut
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMethod(m.id)}
                          >
                            Supprimer
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Adresse de facturation</CardTitle>
                  <CardDescription>Utilisée sur les factures</CardDescription>
                </CardHeader>
                <CardContent>
                  {billingAddress ? (
                    <>
                      <div className="rounded-md border p-3">
                        <p>{billingAddress.name}</p>
                        <p>{billingAddress.address}</p>
                        {billingAddress.addressComplement && (
                          <p>{billingAddress.addressComplement}</p>
                        )}
                        <p>
                          {billingAddress.zipCode} {billingAddress.city}
                        </p>
                        <p>{billingAddress.country}</p>
                      </div>
                      <div className="mt-3">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">Modifier</Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>
                                Modifier l'adresse de facturation
                              </DialogTitle>
                            </DialogHeader>
                            <form
                              className="grid gap-3"
                              onSubmit={(e) => {
                                e.preventDefault();
                                const form = new FormData(e.currentTarget);
                                updateBillingAddress({
                                  name: String(form.get("name")),
                                  address: String(form.get("address")),
                                  addressComplement: String(
                                    form.get("addressComplement")
                                  ),
                                  city: String(form.get("city")),
                                  zipCode: String(form.get("zip")),
                                  country: String(form.get("country")),
                                });
                              }}
                            >
                              <div className="grid gap-2">
                                <Label htmlFor="name">Nom complet</Label>
                                <Input
                                  id="name"
                                  name="name"
                                  defaultValue={billingAddress.name}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="address">Adresse</Label>
                                <Input
                                  id="address"
                                  name="address"
                                  defaultValue={billingAddress.address}
                                />
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="addressComplement">
                                  Complément d'adresse
                                </Label>
                                <Input
                                  id="addressComplement"
                                  name="addressComplement"
                                  defaultValue={
                                    billingAddress.addressComplement
                                  }
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div className="grid gap-2">
                                  <Label htmlFor="zip">Code postal</Label>
                                  <Input
                                    id="zip"
                                    name="zip"
                                    defaultValue={billingAddress.zipCode}
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="city">Ville</Label>
                                  <Input
                                    id="city"
                                    name="city"
                                    defaultValue={billingAddress.city}
                                  />
                                </div>
                              </div>
                              <div className="grid gap-2">
                                <Label htmlFor="country">Pays</Label>
                                <Input
                                  id="country"
                                  name="country"
                                  defaultValue={billingAddress.country}
                                />
                              </div>
                              <DialogFooter>
                                <Button type="submit">Enregistrer</Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </>
                  ) : (
                    <p>Chargement de l'adresse...</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
