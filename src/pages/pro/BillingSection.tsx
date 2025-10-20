"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreditCard, FileText, DollarSign, TrendingUp, RefreshCcw } from "lucide-react";

export default function BillingSection() {
  const [tab, setTab] = useState("payments");

  const payments = [
    { id: "P-9821", amount: 230, currency: "€", status: "succeeded", date: "2025-10-01" },
    { id: "P-9822", amount: 59, currency: "€", status: "pending", date: "2025-10-05" },
    { id: "P-9823", amount: 410, currency: "€", status: "failed", date: "2025-10-07" },
  ];

  const invoices = [
    { id: "INV-2025-015", total: 560, vat: 20, status: "paid", issued: "2025-09-28" },
    { id: "INV-2025-016", total: 230, vat: 20, status: "unpaid", issued: "2025-10-01" },
  ];

  const stats = {
    totalPayments: "7 580 €",
    avgPayment: "188 €",
    refundRate: "3%",
  };

  const tabMotion = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -30 },
    transition: { duration: 0.4 },
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
            <h1 className="text-3xl font-bold tracking-tight">Gestion de la facturation</h1>
            <p className="text-muted-foreground">Suivi des paiements, factures et revenus SERVO.</p>
          </div>
          <Button variant="default" className="gap-2">
            <RefreshCcw className="w-4 h-4" /> Actualiser
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
                            <TableHead>Montant</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {payments.map((p) => (
                            <TableRow key={p.id}>
                              <TableCell>{p.id}</TableCell>
                              <TableCell>
                                {p.amount}
                                {p.currency}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    p.status === "succeeded"
                                      ? "default"
                                      : p.status === "pending"
                                      ? "secondary"
                                      : "destructive"
                                  }
                                >
                                  {p.status === "succeeded"
                                    ? "Succès"
                                    : p.status === "pending"
                                    ? "En attente"
                                    : "Échoué"}
                                </Badge>
                              </TableCell>
                              <TableCell>{new Date(p.date).toLocaleDateString("fr-FR")}</TableCell>
                            </TableRow>
                          ))}
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
                            <TableHead>Total</TableHead>
                            <TableHead>TVA</TableHead>
                            <TableHead>Statut</TableHead>
                            <TableHead>Date d’émission</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {invoices.map((i) => (
                            <TableRow key={i.id}>
                              <TableCell>{i.id}</TableCell>
                              <TableCell>{i.total} €</TableCell>
                              <TableCell>{i.vat} %</TableCell>
                              <TableCell>
                                <Badge variant={i.status === "paid" ? "default" : "secondary"}>
                                  {i.status === "paid" ? "Payée" : "En attente"}
                                </Badge>
                              </TableCell>
                              <TableCell>{new Date(i.issued).toLocaleDateString("fr-FR")}</TableCell>
                            </TableRow>
                          ))}
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
                        <p className="text-2xl font-semibold">{stats.totalPayments}</p>
                      </CardContent>
                    </Card>

                    <Card className="rounded-2xl shadow-sm border border-gray-200 bg-gradient-to-br from-emerald-500/10 to-teal-500/10">
                      <CardHeader>
                        <CardTitle>Montant moyen</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-semibold">{stats.avgPayment}</p>
                      </CardContent>
                    </Card>

                    <Card className="rounded-2xl shadow-sm border border-gray-200 bg-gradient-to-br from-red-500/10 to-orange-500/10">
                      <CardHeader>
                        <CardTitle>Taux de remboursement</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-semibold">{stats.refundRate}</p>
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
