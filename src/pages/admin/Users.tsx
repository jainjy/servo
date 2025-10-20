import { useState } from "react"
import { UsersTable } from "@/components/admin/users/users-table"
import { UsersStats } from "@/components/admin/users/users-stats"
import { UserModal } from "@/components/admin/users/user-modal"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row  items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Utilisateurs</h1>
          <p className="text-muted-foreground">Gérer tous les utilisateurs de la plateforme</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          Nouvel utilisateur
        </Button>
      </div>
      <UsersStats />
      <UsersTable />
      <UserModal open={isModalOpen} onOpenChange={setIsModalOpen} mode="create" />
    </div>
  )
}