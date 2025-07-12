import { 
  Calendar, 
  BookOpen, 
  Brain, 
  HelpCircle, 
  BarChart3, 
  Download, 
  Calculator,
  Home,
  User,
  Settings
} from "lucide-react"
import { NavLink, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"

const navigationItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Cronograma", url: "/cronograma", icon: Calendar },
  { title: "Matérias", url: "/materias", icon: BookOpen },
  { title: "Banco de Questões", url: "/questoes", icon: HelpCircle },
  { title: "Flashcards", url: "/flashcards", icon: Brain },
  { title: "Desempenho", url: "/desempenho", icon: BarChart3 },
  { title: "Materiais", url: "/materiais", icon: Download },
  { title: "Calculadoras", url: "/calculadoras", icon: Calculator },
]

const userItems = [
  { title: "Perfil", url: "/perfil", icon: User },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
]

export function AppSidebar() {
  const { state } = useSidebar()
  const location = useLocation()
  const currentPath = location.pathname
  const collapsed = state === "collapsed"

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/"
    }
    return currentPath.startsWith(path)
  }

  const getNavClasses = (path: string) => {
    const baseClasses = "w-full justify-start transition-colors"
    return isActive(path) 
      ? `${baseClasses} bg-indigo-600 text-white font-medium` 
      : `${baseClasses} hover:bg-gray-100 text-gray-700`
  }

  return (
    <Sidebar className={`${collapsed ? "w-16" : "w-64"} bg-white border-r border-gray-200`} collapsible="icon">
      <SidebarHeader className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">FT</span>
          </div>
          {!collapsed && (
            <div>
              <h2 className="font-bold text-lg text-black">FocoTotal</h2>
              <p className="text-xs text-gray-600">Sua plataforma de estudos</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClasses(item.url)}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Conta</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} className={getNavClasses(item.url)}>
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}