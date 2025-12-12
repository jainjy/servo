// src/components/admin/services/category-modal.tsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import { toast } from "sonner";

interface CategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: any;
  mode: "create" | "edit";
  onCategoryUpdated: () => void;
}

export function CategoryModal({
  open,
  onOpenChange,
  category,
  mode,
  onCategoryUpdated,
}: CategoryModalProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (category && mode === "edit") {
      setName(category.name);
    } else {
      setName("");
    }
  }, [category, mode, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Le nom de la catégorie est requis");
      return;
    }

    setLoading(true);

    try {
      if (mode === "create") {
        await api.post("/categories", { name: name.trim() });
      } else {
        await api.put(`/categories/${category.id}`, { name: name.trim() });
      }

      onCategoryUpdated();
      toast.success(
        mode === "create"
          ? "Catégorie créée avec succès"
          : "Catégorie modifiée avec succès"
      );
      onOpenChange(false);
    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast.error(
        error.response?.data?.error || "Erreur lors de la sauvegarde"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[500px] border"
        style={{ 
          backgroundColor: '#FFFFFF0',
          borderColor: '#D3D3D3'
        }}
      >
        <DialogHeader className="space-y-2">
          <DialogTitle 
            className="text-xl font-bold"
            style={{ color: '#556B2F' }}
          >
            {mode === "create"
              ? "Créer une catégorie"
              : "Modifier la catégorie"}
          </DialogTitle>
          <DialogDescription className="text-gray-800">
            {mode === "create"
              ? "Ajoutez une nouvelle catégorie de service"
              : "Modifiez les informations de la catégorie"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-3">
            <Label 
              htmlFor="name" 
              className="font-medium block"
              style={{ color: '#556B2F' }}
            >
              Nom de la catégorie <span className="text-[#8B4513]">*</span>
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Plomberie, Électricité, Jardinage..."
              style={{ 
                borderColor: '#D3D3D3',
                color: '#556B2F'
              }}
              className="focus:ring-1 focus:ring-[#6B8E23]"
              disabled={loading}
              required
            />
            <p className="text-xs text-gray-800">
              Ce nom sera visible par les utilisateurs
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t" style={{ borderColor: '#D3D3D3' }}>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              style={{ 
                borderColor: '#D3D3D3',
                color: '#8B4513'
              }}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading || !name.trim()}
              style={{ 
                backgroundColor: '#6B8E23',
                color: 'white',
                borderColor: '#6B8E23',
                opacity: loading || !name.trim() ? 0.7 : 1
              }}
            >
              {loading
                ? "Enregistrement..."
                : mode === "create"
                ? "Créer la catégorie"
                : "Enregistrer les modifications"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}