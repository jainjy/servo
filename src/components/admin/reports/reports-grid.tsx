import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Calendar } from "lucide-react"

export function ReportsGrid() {
  const reports = [
    {
      id: 1,
      name: "Rapport Mensuel Janvier 2024",
      type: "Revenus",
      date: "2024-02-01",
      size: "2.4 MB",
      format: "PDF",
      status: "ready",
    },
    {
      id: 2,
      name: "Analyse Utilisateurs Q4 2023",
      type: "Utilisateurs",
      date: "2024-01-15",
      size: "1.8 MB",
      format: "Excel",
      status: "ready",
    },
    {
      id: 3,
      name: "Performance Annonces 2023",
      type: "Annonces",
      date: "2024-01-10",
      size: "3.2 MB",
      format: "PDF",
      status: "ready",
    },
    {
      id: 4,
      name: "Rapport Prestataires Décembre",
      type: "Prestataires",
      date: "2024-01-05",
      size: "1.5 MB",
      format: "CSV",
      status: "ready",
    },
  ]

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Rapports Récents</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <Card key={report.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <Badge variant="secondary">{report.format}</Badge>
            </div>
            <h4 className="font-semibold mb-2">{report.name}</h4>
            <div className="space-y-1 text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                {report.date}
              </div>
              <div>Type: {report.type}</div>
              <div>Taille: {report.size}</div>
            </div>
            <Button variant="outline" size="sm" className="w-full bg-transparent">
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}
