

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
      <DialogContent className="bg-card border-border sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {mode === "create" ? "Nouvelle expérience" : "Modifier l'expérience"}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {mode === "create" ? "Créer une nouvelle expérience touristique" : "Modifier les détails de l'expérience"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-foreground">
                Titre
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="bg-background border-input"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-foreground">
                  Type
                </Label>
                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                  <SelectTrigger className="bg-background border-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="visit">Visite guidée</SelectItem>
                    <SelectItem value="activity">Activité</SelectItem>
                    <SelectItem value="tour">Circuit</SelectItem>
                    <SelectItem value="event">Événement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="price" className="text-foreground">
                  Prix (€)
                </Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="bg-background border-input"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-foreground">
                Localisation
              </Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="bg-background border-input"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration" className="text-foreground">
                  Durée
                </Label>
                <Input
                  id="duration"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="bg-background border-input"
                  placeholder="2h"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="capacity" className="text-foreground">
                  Capacité
                </Label>
                <Input
                  id="capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="bg-background border-input"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-foreground">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-background border-input min-h-[100px]"
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
