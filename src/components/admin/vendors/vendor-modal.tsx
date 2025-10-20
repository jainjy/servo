

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface VendorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  vendor?: any
  mode: "create" | "edit"
}

export function VendorModal({ open, onOpenChange, vendor, mode }: VendorModalProps) {
  const [formData, setFormData] = useState({
    name: vendor?.name || "",
    company: vendor?.company || "",
    email: vendor?.email || "",
    phone: vendor?.phone || "",
    category: vendor?.category || "moving",
    status: vendor?.status || "pending",
    zones: vendor?.zones || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Vendor form submitted:", formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {mode === "create" ? "Nouveau prestataire" : "Modifier le prestataire"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {mode === "create" ? "Ajouter un nouveau prestataire" : "Modifier les informations du prestataire"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">
                  Nom
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-background border-input"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-foreground">
                  Entreprise
                </Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="bg-background border-input"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-background border-input"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-foreground">
                  Téléphone
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-background border-input"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-foreground">
                Catégorie
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="bg-background border-input">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  <SelectItem value="moving">Déménagement</SelectItem>
                  <SelectItem value="cleaning">Nettoyage</SelectItem>
                  <SelectItem value="renovation">Rénovation</SelectItem>
                  <SelectItem value="legal">Juridique</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="zones" className="text-foreground">
                Zones de couverture
              </Label>
              <Input
                id="zones"
                value={formData.zones}
                onChange={(e) => setFormData({ ...formData, zones: e.target.value })}
                className="bg-background border-input"
                placeholder="Paris, Lyon, Marseille"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-border">
              Annuler
            </Button>
            <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
              {mode === "create" ? "Créer" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
