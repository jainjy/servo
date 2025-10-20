import React, { useState } from "react";
import { ListingsTable } from "@/components/admin/listings/listings-table";
import { ListingsStats } from "@/components/admin/listings/listings-stats";
import { ListingModal } from "@/components/admin/listings/listing-modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const ListingsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle annonce
        </Button>
      </div>

      <ListingsStats />
      <ListingsTable />

      <ListingModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        mode="create"
      />
    </div>
  );
};

export default ListingsPage;
