import { useState, ReactNode } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { 
  Calendar, 
  BookOpen, 
  Brain,
  Trophy,
  TrendingUp,
  Menu,
  X,
  Settings,
  LogOut
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { userData, signOut, isAdmin } = useAuth()

  const getCurrentPage = () => {
    const path = window.location.pathname
    switch (path) {
      case "/":
        return "Dashboard"
      case "/materias":
        return "Matérias"
      case "/cronograma":
        return "Cronograma"
      case "/questoes":
        return "Questões"
      case "/conquistas":
        return "Conquistas"
      case "/admin":
        return "Painel Admin"
      default:
        return "Dashboard"
    }
  }

  const isActivePage = (pageName: string) => {
    return getCurrentPage() === pageName
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-800/10 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b border-gray-800/10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FT</span>
            </div>
            <div>
              <h2 className="font-semibold text-black">FocoTotal</h2>
              <p className="text-xs text-gray-500">Estudos</p>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="p-4 space-y-2">
          <a 
            href="/" 
            className={`sidebar-item ${isActivePage("Dashboard") ? "active" : ""}`}
          >
            <TrendingUp className="h-5 w-5" />
            <span>Dashboard</span>
          </a>
          <a 
            href="/cronograma" 
            className={`sidebar-item ${isActivePage("Cronograma") ? "active" : ""}`}
          >
            <Calendar className="h-5 w-5" />
            <span>Cronograma</span>
          </a>
          <a 
            href="/materias" 
            className={`sidebar-item ${isActivePage("Matérias") ? "active" : ""}`}
          >
            <BookOpen className="h-5 w-5" />
            <span>Matérias</span>
          </a>
          <a 
            href="/questoes" 
            className={`sidebar-item ${isActivePage("Questões") ? "active" : ""}`}
          >
            <Brain className="h-5 w-5" />
            <span>Questões</span>
          </a>
          <a 
            href="/conquistas" 
            className={`sidebar-item ${isActivePage("Conquistas") ? "active" : ""}`}
          >
            <Trophy className="h-5 w-5" />
            <span>Conquistas</span>
          </a>
          {isAdmin && (
            <a 
              href="/admin" 
              className={`sidebar-item ${isActivePage("Painel Admin") ? "active" : ""}`}
            >
              <Settings className="h-5 w-5" />
              <span>Painel Admin</span>
            </a>
          )}
        </nav>
        
        {/* User Info & Logout */}
        <div className="mt-auto p-4 border-t border-gray-800/10">
          <div className="space-y-3">
            <div className="text-sm">
              <p className="font-medium text-black truncate">{userData?.nome}</p>
              <p className="text-xs text-gray-500 truncate">{userData?.email}</p>
              {userData?.tipo === 'aluno' && userData?.data_validade && (
                <p className="text-xs text-gray-500">
                  Válido até: {new Date(userData.data_validade).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={signOut}
              className="w-full border-gray-800/20 hover:bg-gray-50 text-gray-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-0">
        {/* Header with toggle button */}
        <header className="bg-white border-b border-gray-800/10 px-4 lg:px-8 py-4">
          <div className="flex items-center">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 mr-4"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-semibold text-black">{getCurrentPage()}</h1>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}