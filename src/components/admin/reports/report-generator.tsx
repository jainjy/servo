

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download } from "lucide-react"

export function ReportGenerator() {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Générer un Rapport</h3>
      <div className="grid gap-4 md:grid-cols-4">
        <div className="space-y-2">
          <Label>Type de Rapport</Label>
          <Select defaultValue="revenue">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue">Revenus</SelectItem>
              <SelectItem value="users">Utilisateurs</SelectItem>
              <SelectItem value="listings">Annonces</SelectItem>
              <SelectItem value="bookings">Réservations</SelectItem>
              <SelectItem value="vendors">Prestataires</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Période</Label>
          <Select defaultValue="30days">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">7 derniers jours</SelectItem>
              <SelectItem value="30days">30 derniers jours</SelectItem>
              <SelectItem value="90days">90 derniers jours</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
              <SelectItem value="custom">Personnalisé</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Format</Label>
          <Select defaultValue="pdf">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pdf">PDF</SelectItem>
              <SelectItem value="excel">Excel</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="invisible">Action</Label>
          <Button className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Générer
          </Button>
        </div>
      </div>
    </Card>
  )
}
