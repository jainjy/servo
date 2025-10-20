// app/admin/layout.tsx
import type React from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AuthHeader } from "@/components/layout/AuthHeader"
import { AdminRoute } from "@/components/protected-route"
import { Outlet } from "react-router-dom"

export default function AdminLayout() {
  return (
    <AdminRoute>
      <div className="flex h-screen bg-background">
        <AdminSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <AuthHeader />
          <main className="flex-1 overflow-y-auto p-6"><Outlet /></main>
        </div>
      </div>
    </AdminRoute>
  )
}