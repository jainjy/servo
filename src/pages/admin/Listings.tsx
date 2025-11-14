import React, { useState } from "react";
import { ListingsTable } from "@/components/admin/listings/listings-table";
import { ListingsStats } from "@/components/admin/listings/listings-stats";
import { ListingModal } from "@/components/admin/listings/listing-modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const ListingsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Annonces immobilières
          </h1>
          <p className="text-muted-foreground">
            Gérer toutes les annonces de la plateforme
          </p>
        </div>
      </div>
      <ListingsStats />
      <ListingsTable />
    </div>
  );
};

export default ListingsPage;
