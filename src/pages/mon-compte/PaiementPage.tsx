import React, { useMemo, useState, useCallback } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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
  const { toast } = useToast();

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const form = new FormData(e.currentTarget);
      const holder = String(form.get("holder") || "");
      const number = String(form.get("number") || "");
      const exp = String(form.get("exp") || "");

      if (!holder || !number || !exp) {
        toast({
          title: "Champs manquants",
          description: "Veuillez compléter le formulaire",
        });
        return;
      }

      const last4 = number.replace(/\s+/g, "").slice(-4);
      const [mm, yy] = exp.split("/");

      onAdd({
        id: `pm_${Date.now()}`,
        brand: number.startsWith("4")
          ? "Visa"
          : number.startsWith("5")
          ? "Mastercard"
          : "Carte",
        last4,
        expMonth: Number(mm),
        expYear: 2000 + Number(yy),
        holder,
      });

      setOpen(false);
      toast({
        title: "Carte ajoutée",
        description: `**** **** **** ${last4}`,
      });
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
            <Input id="holder" name="holder" placeholder="Jean Dupont" required />
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
              <Input id="cvc" name="cvc" inputMode="numeric" placeholder="123" required />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Enregistrer</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// --- Main Component ---
export default function PaiementPage() {
  const { toast } = useToast();

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: "pm_1",
      brand: "Visa",
      last4: "4242",
      expMonth: 12,
      expYear: 2026,
      holder: "Jean Dupont",
      isDefault: true,
    },
    {
      id: "pm_2",
      brand: "Mastercard",
      last4: "4444",
      expMonth: 7,
      expYear: 2025,
      holder: "Jean Dupont",
    },
  ]);

  const transactions: Transaction[] = useMemo(
    () => [
      {
        id: "tr_1",
        date: "2025-05-03",
        description: "Réservation #BK-3942",
        amount: 120.0,
        status: "payee",
        receiptUrl: "#",
      },
      {
        id: "tr_2",
        date: "2025-04-18",
        description: "Acompte Réservation #BK-3810",
        amount: 50.0,
        status: "rembourse",
        receiptUrl: "#",
      },
      {
        id: "tr_3",
        date: "2025-03-29",
        description: "Réservation #BK-3721",
        amount: 90.5,
        status: "en_attente",
      },
      {
        id: "tr_4",
        date: "2025-03-02",
        description: "Réservation #BK-3605",
        amount: 210.0,
        status: "echoue",
      },
    ],
    []
  );

  const invoices: Invoice[] = useMemo(
    () => [
      { id: "inv_1", number: "FA-2025-0012", date: "2025-05-03", total: 120.0, pdfUrl: "#" },
      { id: "inv_2", number: "FA-2025-0009", date: "2025-04-18", total: 50.0, pdfUrl: "#" },
      { id: "inv_3", number: "FA-2025-0003", date: "2025-03-02", total: 210.0, pdfUrl: "#" },
    ],
    []
  );

  const setDefaultMethod = useCallback(
    (id: string) => {
      setPaymentMethods((prev) =>
        prev.map((m) => ({ ...m, isDefault: m.id === id }))
      );
      toast({ title: "Méthode par défaut mise à jour" });
    },
    [toast]
  );

  const removeMethod = useCallback(
    (id: string) => {
      setPaymentMethods((prev) => prev.filter((m) => m.id !== id));
      toast({ title: "Méthode de paiement supprimée" });
    },
    [toast]
  );

  const addMethod = useCallback((method: PaymentMethod) => {
    setPaymentMethods((prev) => [...prev, method]);
  }, []);

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
                <CardDescription>Vos derniers paiements et remboursements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 pb-4">
                  <div className="w-48">
                    <Select defaultValue="3m">
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
                      {transactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell>{new Date(tx.date).toLocaleDateString("fr-FR")}</TableCell>
                          <TableCell>{tx.description}</TableCell>
                          <TableCell className="text-right">{formatCurrency(tx.amount)}</TableCell>
                          <TableCell><StatusBadge status={tx.status} /></TableCell>
                          <TableCell className="text-right">
                            {tx.receiptUrl ? (
                              <Button variant="outline" size="sm" asChild>
                                <a href={tx.receiptUrl}>Télécharger reçu</a>
                              </Button>
                            ) : (
                              <Button variant="ghost" size="sm" disabled>
                                Indisponible
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
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
                <CardDescription>Téléchargez vos factures au format PDF</CardDescription>
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
                      {invoices.map((inv) => (
                        <TableRow key={inv.id}>
                          <TableCell className="font-medium">{inv.number}</TableCell>
                          <TableCell>{new Date(inv.date).toLocaleDateString("fr-FR")}</TableCell>
                          <TableCell className="text-right">{formatCurrency(inv.total)}</TableCell>
                          <TableCell className="text-right">
                            {inv.pdfUrl ? (
                              <Button variant="outline" size="sm" asChild>
                                <a href={inv.pdfUrl} target="_blank" rel="noreferrer">
                                  Télécharger
                                </a>
                              </Button>
                            ) : (
                              <Button variant="ghost" size="sm" disabled>
                                Indisponible
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
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
                    <CardDescription>Cartes bancaires associées à votre compte</CardDescription>
                  </div>
                  <AddCardDialog onAdd={addMethod} />
                </CardHeader>
                <CardContent className="space-y-3">
                  {paymentMethods.length === 0 && (
                    <p className="text-sm text-muted-foreground">Aucune carte enregistrée.</p>
                  )}
                  {paymentMethods.map((m) => (
                    <div key={m.id} className="flex items-center justify-between rounded-md border p-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">
                            {m.brand} •••• {m.last4}
                          </p>
                          {m.isDefault && <Badge>Par défaut</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Exp. {String(m.expMonth).padStart(2, "0")}/{m.expYear} • {m.holder}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {!m.isDefault && (
                          <Button variant="outline" size="sm" onClick={() => setDefaultMethod(m.id)}>
                            Définir par défaut
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" onClick={() => removeMethod(m.id)}>
                          Supprimer
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Adresse de facturation</CardTitle>
                  <CardDescription>Utilisée sur les factures</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border p-3">
                    <p>Jean Dupont</p>
                    <p>12 rue des Fleurs</p>
                    <p>75010 Paris</p>
                    <p>France</p>
                  </div>
                  <div className="mt-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">Modifier</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Modifier l'adresse de facturation</DialogTitle>
                        </DialogHeader>
                        <form
                          className="grid gap-3"
                          onSubmit={(e) => {
                            e.preventDefault();
                            toast({ title: "Adresse mise à jour" });
                          }}
                        >
                          <div className="grid gap-2">
                            <Label htmlFor="name">Nom complet</Label>
                            <Input id="name" defaultValue="Jean Dupont" />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="address">Adresse</Label>
                            <Input id="address" defaultValue="12 rue des Fleurs" />
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="grid gap-2">
                              <Label htmlFor="zip">Code postal</Label>
                              <Input id="zip" defaultValue="75010" />
                            </div>
                            <div className="grid gap-2">
                              <Label htmlFor="city">Ville</Label>
                              <Input id="city" defaultValue="Paris" />
                            </div>
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="country">Pays</Label>
                            <Input id="country" defaultValue="France" />
                          </div>
                          <DialogFooter>
                            <Button type="submit">Enregistrer</Button>
                          </DialogFooter>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
  
    </>
  );
}
