

// TourismModal.tsx - Modal modifié
export function TourismModal({ open, onOpenChange, experience, mode }: TourismModalProps) {
  // ... le code reste inchangé jusqu'au return ...

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
                className="bg-white border-[#D3D3D3]"
                required
              />
            </div>
            {/* Les autres champs avec les mêmes modifications */}
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              className="border-[#D3D3D3] text-[#8B4513]"
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              className="bg-[#556B2F] hover:bg-[#6B8E23] text-white"
            >
              {mode === "create" ? "Créer" : "Enregistrer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}