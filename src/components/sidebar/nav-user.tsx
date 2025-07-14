"use client"

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,

  LogOut,

  User,
  Building,
  Shield,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"
interface User {
  id: string
  name: string
  email: string
  companyId: string
  role?: string
}

interface NavUserProps {
  user: User | null
}

export function NavUser({ user }: NavUserProps) {
  const { isMobile } = useSidebar()
  const { logout } = useAuth()

  if (!user) {
    return null
  }
//empresa por cor
  const getRoleInfo = (role?: string) => {
    const roleMap: Record<string, string> = {
      'MASTER': 'Administrador Master',
      'ADMIN': 'Administrador',
      'USER': 'Usuário',
      'GUEST': 'Convidado'
    }
    const label = role ? roleMap[role.toUpperCase()] || role : 'Usuário'
    let color = 'bg-gray-100 text-gray-800'
    switch (role?.toUpperCase()) {
      case 'MASTER':
        color = 'bg-red-100 text-red-800'
        break
      case 'ADMIN':
        color = 'bg-blue-100 text-blue-800'
        break
      case 'USER':
        color = 'bg-green-100 text-green-800'
        break
      case 'GUEST':
        color = 'bg-yellow-100 text-yellow-800'
        break
    }
    return { label, color }
  }

  const roleInfo = getRoleInfo(user.role)

  // Generate initials from user name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={`/avatars/${user.id}.jpg`} alt={user.name} />
                <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={`/avatars/${user.id}.jpg`} alt={user.name} />
                  <AvatarFallback className="rounded-lg bg-primary text-primary-foreground">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* User Info Section */}
            <DropdownMenuGroup>
              <DropdownMenuItem className="flex flex-col items-start gap-2 p-3">
                <div className="flex items-center gap-2 w-full">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Função:</span>
                  <Badge variant="secondary" className={`text-xs ${roleInfo.color}`}>
                    {roleInfo.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 w-full">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Empresa:</span>
                  <span className="text-xs text-muted-foreground truncate">{user.companyId}</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles className="mr-2 h-4 w-4" />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup> */}

            <DropdownMenuSeparator />

         <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                <Link href="/intern/dashboard/settings" className="flex items-center w-full">
                  <BadgeCheck className="h-4 w-4" />
                  Account
                </Link>
                </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/intern/dashboard/settings?tab=notifications" className="flex items-center w-full">
                  <Bell className="h-4 w-4" />
                  Notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
              <LogOut className="h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}