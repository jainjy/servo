import React, { useState } from "react";
import { ProductsStats } from "@/components/admin/products/products-stats";
import { ProductsTable } from "@/components/admin/products/products-table";
import { ProductModal } from "@/components/admin/products/product-modal";
import { Button } from "@/components/ui/button";
import { Plus, Package, Filter, Download } from "lucide-react";
import DeliveryCategoryPriceModal from "./DeliveryCategoryPriceModal";

const ProductsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeFilter, setActiveFilter] = useState("all");
  const [open, setOpen] = useState(false);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  const filters = [
    { id: "all", label: "Tous les produits" },
    { id: "active", label: "Actifs" },
    { id: "draft", label: "Brouillons" },
    { id: "outofstock", label: "Rupture" },
  ];

  return (
    <div className="space-y-6 p-1">
      {/* HEADER SECTION */}
      <div className="rounded-xl border border-[#D3D3D3] bg-white p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-6 w-1.5 bg-[#556B2F] rounded-full"></div>
              <h1 className="text-2xl lg:text-3xl font-bold text-[#8B4513]">
                Marketplace Produits
              </h1>
            </div>
            <p className="text-muted-foreground max-w-2xl">
              Gérez les produits, catégories et commandes du marketplace OliPlus.
            </p>
          </div>
<<<<<<< Updated upstream
          
          <div className="flex items-center gap-3">
=======

          <div className="flex flex-col md:flex-row items-center gap-3">
>>>>>>> Stashed changes
            <Button
              variant="outline"
              className="border-[#D3D3D3] text-[#8B4513] hover:bg-[#6B8E23]/10 hover:text-[#556B2F] hover:border-[#6B8E23]"
            >
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#6B8E23] hover:bg-[#556B2F] text-white transition-colors"
            >
              <Plus className="mr-2 h-4 w-4" />
              Nouveau produit
            </Button>
            <Button onClick={() => setOpen(true)}>
              Gérer les prix de livraison
            </Button>
          </div>
        </div>

        {/* FILTER TABS */}
        <div className="mt-8 flex flex-wrap gap-2">
          {filters.map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${activeFilter === filter.id
                ? "bg-[#6B8E23] text-white"
                : "text-[#8B4513] hover:bg-[#6B8E23]/10 border border-[#D3D3D3]"
                }`}
            >
              <Filter className="h-3.5 w-3.5" />
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* STATS SECTION */}
      <div className="rounded-xl border border-[#D3D3D3] bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-[#8B4513] flex items-center gap-2">
            <Package className="h-5 w-5 text-[#556B2F]" />
            Aperçu des produits
          </h2>
          <span className="text-sm text-muted-foreground">
            Données mises à jour à l'instant
          </span>
        </div>
        <ProductsStats />
      </div>

      {/* PRODUCTS TABLE SECTION */}
      <div className="rounded-xl border border-[#D3D3D3] bg-white shadow-sm overflow-hidden">
        <div className="border-b border-[#D3D3D3] bg-[#6B8E23]/5 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-[#8B4513]">
              Liste des produits
            </h2>
            <div className="flex items-center gap-2 text-sm text-[#8B4513]">
              <span className="bg-[#6B8E23]/10 px-3 py-1 rounded-full">
                {activeFilter === "all" ? "Tous" : filters.find(f => f.id === activeFilter)?.label}
              </span>
            </div>
          </div>
        </div>
        <div className="p-1">
          <ProductsTable key={refreshKey} filter={activeFilter} />
        </div>
      </div>

      {/* CREATE PRODUCT MODAL */}
      <ProductModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        mode="create"
        onSuccess={handleSuccess}
      />
      <DeliveryCategoryPriceModal
        open={open}
        onClose={() => setOpen(false)}
      />
    </div>
  );
};

export default ProductsPage;