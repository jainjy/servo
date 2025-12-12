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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface TourismModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  experience?: any
  mode: "create" | "edit"
}

export function TourismModal({ open, onOpenChange, experience, mode }: TourismModalProps) {
  const [formData, setFormData] = useState({
    title: experience?.title || "",
    type: experience?.type || "visit",
    price: experience?.price || "",
    duration: experience?.duration || "",
    location: experience?.location || "",
    capacity: experience?.capacity || "",
    status: experience?.status || "active",
    description: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("[v0] Tourism form submitted:", formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white border-[#D3D3D3] sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#8B4513]">
            {mode === "create" ? "Nouvelle expérience" : "Modifier l'expérience"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {mode === "create" ? "Créer une nouvelle expérience touristique" : "Modifier les détails de l'expérience"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-[#8B4513]">
                Titre
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-white border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F]"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-[#8B4513]">
                  Type
                </Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger className="bg-white border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-[#D3D3D3]">
                    <SelectItem value="visit">Visite guidée</SelectItem>
                    <SelectItem value="activity">Activité</SelectItem>
                    <SelectItem value="tour">Circuit</SelectItem>
                    <SelectItem value="event">Événement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price" className="text-[#8B4513]">
                  Prix (€)
                </Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="bg-white border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F]"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-[#8B4513]">
                Localisation
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="bg-white border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F]"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-[#8B4513]">
                  Durée
                </Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="bg-white border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F]"
                  placeholder="2h"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity" className="text-[#8B4513]">
                  Capacité
                </Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="bg-white border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F]"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-[#8B4513]">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-white border-[#D3D3D3] focus:border-[#556B2F] focus:ring-[#556B2F] min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              className="border-[#D3D3D3] text-[#8B4513] hover:bg-[#556B2F]/10"
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="bg-[#556B2F] text-white hover:bg-[#6B8E23]"
            >
              {mode === "create" ? "Créer" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}