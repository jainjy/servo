import React, { useState } from "react";
import { ProductsStats } from "@/components/admin/products/products-stats";
import { ProductsTable } from "@/components/admin/products/products-table";
import { ProductModal } from "@/components/admin/products/product-modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const ProductsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1); // Force le re-render du ProductsTable
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Marketplace Produits</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les produits, catégories et commandes du marketplace
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nouveau produit
        </Button>
      </div>

      <ProductsStats />
      <ProductsTable key={refreshKey} />

      <ProductModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        mode="create"
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default ProductsPage;