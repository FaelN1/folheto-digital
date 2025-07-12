// app/dashboard/layout.tsx
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { SiteHeader } from "@/components/Metrics/site-header"
import ProtectedRoute from '@/components/ProtectedRoute';

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {children} {/* 👈 Mostra a tela de cada rota */}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
     </ProtectedRoute>
  )
}
