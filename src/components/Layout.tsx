import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { Bell, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Top Navigation */}
          <header className="border-b bg-white border-gray-200 shadow-sm">
            <div className="flex items-center justify-between px-6 py-3">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="lg:hidden" />
                <div className="hidden md:flex items-center gap-2 max-w-md flex-1">
                  <Search className="h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder="Buscar matérias, tópicos..." 
                    className="border-0 shadow-none focus-visible:ring-0 bg-gray-50"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                  <Bell className="h-4 w-4 text-gray-600" />
                </Button>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-indigo-600 text-white text-sm">
                    U
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>
          
          {/* Main Content */}
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}