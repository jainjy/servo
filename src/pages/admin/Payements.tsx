import React from "react";
import { PaymentsStats } from "@/components/admin/payments/payments-stats";
import { PaymentsTable } from "@/components/admin/payments/payments-table";

const PaymentsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Paiements & Transactions</h1>
        <p className="text-muted-foreground mt-1">
          Gérez les transactions, remboursements et méthodes de paiement
        </p>
      </div>

      <PaymentsStats />
      <PaymentsTable />
    </div>
  );
};

export default PaymentsPage;
