import { ReactNode } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { LoginForm } from './LoginForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, Clock } from 'lucide-react'

interface ProtectedRouteProps {
  children: ReactNode
  requireAdmin?: boolean
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, userData, loading, isAdmin, isActive } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user || !userData) {
    return <LoginForm />
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border border-gray-200">
          <CardHeader className="text-center">
            <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <CardTitle className="text-xl font-semibold text-black">
              Acesso Negado
            </CardTitle>
            <CardDescription className="text-gray-600">
              Você não tem permissão para acessar esta área.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  if (!isActive) {
    const isExpired = userData.data_validade && new Date(userData.data_validade) < new Date()
    
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-lg border border-gray-200">
          <CardHeader className="text-center">
            <Clock className="mx-auto h-12 w-12 text-amber-500 mb-4" />
            <CardTitle className="text-xl font-semibold text-black">
              {isExpired ? 'Acesso Expirado' : 'Conta Inativa'}
            </CardTitle>
            <CardDescription className="text-gray-600">
              {isExpired 
                ? `Seu acesso expirou em ${new Date(userData.data_validade!).toLocaleDateString('pt-BR')}.`
                : 'Sua conta está temporariamente inativa.'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Entre em contato para renovar seu acesso.
            </p>
            <button
              onClick={() => window.location.href = 'mailto:suporte@focototal.com'}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Entrar em Contato
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return <>{children}</>
}