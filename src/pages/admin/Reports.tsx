import { ReportsGrid } from "@/components/admin/reports/reports-grid"
import { ReportGenerator } from "@/components/admin/reports/report-generator"

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Rapports & Exports</h1>
        <p className="text-muted-foreground mt-1">Générez et téléchargez des rapports détaillés</p>
      </div>

      <ReportGenerator />
      <ReportsGrid />
    </div>
  )
}
