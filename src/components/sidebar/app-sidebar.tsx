"use client"

import * as React from "react"
import {
  Bot,
  Users,
  Command,

  Moon,

  BarChart2,
  LayoutDashboard,
  Share2,

  Settings,
  Search,
  Megaphone,
  Shield,
} from "lucide-react"

import { NavMain } from "@/components/sidebar/nav-main"
import { NavSecondary } from "@/components/sidebar/nav-secondary"
import { NavUser } from "@/components/sidebar/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/AuthContext"
import { usePermissions } from "@/hooks/usePermissions"

// Mapeamento de ícones
const iconMap = {
  LayoutDashboard,
  Megaphone,
  Users,
  Bot,
  Share2,
  BarChart2,
  Settings,
  Shield,
  Moon,
  Search,
}

const data = {
  navSecondary: [
    {
      title: "Tema",
      url: "#",
      icon: Moon,
    },
    {
      title: "Configurações",
      url: "#",
      icon: Settings,
    },
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth()
  const { getFilteredNavigation } = usePermissions()
  
  // Obter navegação filtrada baseada nas permissões do usuário
  const filteredNavigation = getFilteredNavigation()
  
  // Converter para o formato esperado pelo NavMain, mapeando os ícones
  const navMainItems = filteredNavigation.map(item => ({
    ...item,
    icon: iconMap[item.icon as keyof typeof iconMap] || LayoutDashboard,
  }))

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Folheto Digital</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMainItems} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  )
}