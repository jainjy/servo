// src/components/admin/services/category-modal.tsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";

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
      alert("Le nom de la catégorie est requis");
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
      onOpenChange(false);
    } catch (error: any) {
      console.error("Erreur lors de la sauvegarde:", error);
      alert(error.response?.data?.error || "Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {mode === "create"
              ? "Créer une catégorie"
              : "Modifier la catégorie"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Nom de la catégorie
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Plomberie, Électricité, Jardinage..."
              className="bg-background border-input"
              disabled={loading}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="border-border"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading
                ? "Enregistrement..."
                : mode === "create"
                ? "Créer"
                : "Modifier"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
