import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  UserCheck, 
  UserX, 
  Calendar,
  Search,
  Plus,
  Edit,
  Trash2,
  RefreshCw
} from 'lucide-react'
import { Layout } from '@/components/Layout'

interface Usuario {
  id: string
  nome: string
  email: string
  tipo: 'aluno' | 'admin'
  plano?: string
  data_validade?: string
  ativo: boolean
  ultimo_acesso?: string
  created_at: string
  criado_por: string
}

export default function AdminDashboard() {
  const { userData } = useAuth()
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState<'todos' | 'ativos' | 'expirados' | 'inativos'>('todos')

  const fetchUsuarios = async () => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Erro ao buscar usuários:', error)
        return
      }

      setUsuarios((data || []) as Usuario[])
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsuarios()
  }, [])

  const filteredUsuarios = usuarios.filter(usuario => {
    const matchesSearch = usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         usuario.email.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (!matchesSearch) return false

    switch (filter) {
      case 'ativos':
        return usuario.ativo && (!usuario.data_validade || new Date(usuario.data_validade) > new Date())
      case 'expirados':
        return usuario.data_validade && new Date(usuario.data_validade) < new Date()
      case 'inativos':
        return !usuario.ativo
      default:
        return true
    }
  })

  const stats = {
    total: usuarios.length,
    ativos: usuarios.filter(u => u.ativo && (!u.data_validade || new Date(u.data_validade) > new Date())).length,
    expirados: usuarios.filter(u => u.data_validade && new Date(u.data_validade) < new Date()).length,
    inativos: usuarios.filter(u => !u.ativo).length
  }

  const renovarAcesso = async (usuarioId: string) => {
    const novaData = new Date()
    novaData.setDate(novaData.getDate() + 30) // 30 dias

    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ 
          data_validade: novaData.toISOString(),
          ativo: true 
        })
        .eq('id', usuarioId)

      if (error) {
        console.error('Erro ao renovar acesso:', error)
        return
      }

      await fetchUsuarios()
    } catch (error) {
      console.error('Erro ao renovar acesso:', error)
    }
  }

  const toggleStatus = async (usuarioId: string, novoStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ ativo: novoStatus })
        .eq('id', usuarioId)

      if (error) {
        console.error('Erro ao alterar status:', error)
        return
      }

      await fetchUsuarios()
    } catch (error) {
      console.error('Erro ao alterar status:', error)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando dados...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="p-4 lg:p-8 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-black">Painel Administrativo</h1>
            <p className="text-gray-600 mt-1">Gerencie usuários e acessos</p>
          </div>
          <Button className="bg-black hover:bg-gray-800 text-white">
            <Plus className="h-4 w-4 mr-2" />
            Novo Usuário
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total de Usuários</p>
                  <p className="text-2xl font-bold text-black">{stats.total}</p>
                </div>
                <Users className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Usuários Ativos</p>
                  <p className="text-2xl font-bold text-green-600">{stats.ativos}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Acessos Expirados</p>
                  <p className="text-2xl font-bold text-amber-600">{stats.expirados}</p>
                </div>
                <Calendar className="h-8 w-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Usuários Inativos</p>
                  <p className="text-2xl font-bold text-red-600">{stats.inativos}</p>
                </div>
                <UserX className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-black">Usuários</CardTitle>
            <CardDescription>Gerencie todos os usuários da plataforma</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar por nome ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300"
                />
              </div>
              <div className="flex gap-2">
                {(['todos', 'ativos', 'expirados', 'inativos'] as const).map((filterOption) => (
                  <Button
                    key={filterOption}
                    variant={filter === filterOption ? "default" : "outline"}
                    size="sm"
                    onClick={() => setFilter(filterOption)}
                    className={filter === filterOption ? "bg-black text-white" : "border-gray-300"}
                  >
                    {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            {/* Users Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-2 font-medium text-gray-700">Usuário</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700">Tipo</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700">Plano</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700">Validade</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700">Status</th>
                    <th className="text-left py-3 px-2 font-medium text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsuarios.map((usuario) => {
                    const isExpired = usuario.data_validade && new Date(usuario.data_validade) < new Date()
                    const isActive = usuario.ativo && !isExpired

                    return (
                      <tr key={usuario.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-2">
                          <div>
                            <p className="font-medium text-black">{usuario.nome}</p>
                            <p className="text-sm text-gray-600">{usuario.email}</p>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <Badge variant={usuario.tipo === 'admin' ? 'default' : 'secondary'}>
                            {usuario.tipo}
                          </Badge>
                        </td>
                        <td className="py-3 px-2">
                          <span className="text-sm text-gray-600">
                            {usuario.plano || '-'}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <span className="text-sm text-gray-600">
                            {usuario.data_validade 
                              ? new Date(usuario.data_validade).toLocaleDateString('pt-BR')
                              : '-'
                            }
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <Badge 
                            variant={isActive ? 'default' : isExpired ? 'destructive' : 'secondary'}
                            className={
                              isActive ? 'bg-green-100 text-green-800' :
                              isExpired ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }
                          >
                            {isActive ? 'Ativo' : isExpired ? 'Expirado' : 'Inativo'}
                          </Badge>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex gap-2">
                            {isExpired && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => renovarAcesso(usuario.id)}
                                className="border-green-300 text-green-700 hover:bg-green-50"
                              >
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Renovar
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleStatus(usuario.id, !usuario.ativo)}
                              className={
                                usuario.ativo 
                                  ? "border-red-300 text-red-700 hover:bg-red-50"
                                  : "border-green-300 text-green-700 hover:bg-green-50"
                              }
                            >
                              {usuario.ativo ? 'Desativar' : 'Ativar'}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {filteredUsuarios.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-600">Nenhum usuário encontrado</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}