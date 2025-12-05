//pages/pro/layout.tsx
import type React from "react"
import { ProRoute } from "@/components/protected-route"
import { ProSidebar } from "@/components/pro/pro-sidebar"
import { AuthHeader } from "@/components/layout/AuthHeader"
import { Outlet } from "react-router-dom"

export default function ProLayout() {
  return (
    <ProRoute>
      <div className="flex h-screen bg-background">
        <ProSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <AuthHeader />
          <main className="flex-1 overflow-y-auto p-0 lg:p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </ProRoute>
  )
}