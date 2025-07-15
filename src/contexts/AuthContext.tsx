import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'

interface UsuarioData {
  id: string
  nome: string
  email: string
  tipo: 'aluno' | 'admin'
  plano?: string
  data_validade?: string
  ativo: boolean
  ultimo_acesso?: string
}

interface AuthContextType {
  user: User | null
  userData: UsuarioData | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signUp: (email: string, password: string, nome: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  isAdmin: boolean
  isActive: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<UsuarioData | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchUserData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('auth_user_id', userId)
        .single()

      if (error) {
        console.error('Erro ao buscar dados do usuário:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error)
      return null
    }
  }

  const updateLastAccess = async (userId: string) => {
    try {
      await supabase
        .from('usuarios')
        .update({ ultimo_acesso: new Date().toISOString() })
        .eq('auth_user_id', userId)

      // Log do acesso
      await supabase
        .from('logs_acesso')
        .insert({
          usuario_id: userId,
          tipo_acao: 'login',
          detalhes: { timestamp: new Date().toISOString() }
        })
    } catch (error) {
      console.error('Erro ao atualizar último acesso:', error)
    }
  }

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchUserData(session.user.id).then(data => {
          setUserData(data)
          if (data) {
            updateLastAccess(session.user.id)
          }
        })
      }
      setLoading(false)
    })

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        
        if (session?.user) {
          const data = await fetchUserData(session.user.id)
          setUserData(data)
          if (data && event === 'SIGNED_IN') {
            updateLastAccess(session.user.id)
          }
        } else {
          setUserData(null)
        }
        
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { error: error.message }
      }

      return {}
    } catch (error) {
      return { error: 'Erro ao fazer login' }
    }
  }

  const signUp = async (email: string, password: string, nome: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome,
            tipo: 'aluno'
          }
        }
      })

      if (error) {
        return { error: error.message }
      }

      // Criar registro na tabela usuarios
      if (data.user) {
        await supabase
          .from('usuarios')
          .insert({
            auth_user_id: data.user.id,
            nome,
            email,
            tipo: 'aluno',
            ativo: true,
            criado_por: 'manual'
          })
      }

      return {}
    } catch (error) {
      return { error: 'Erro ao criar conta' }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const isAdmin = userData?.tipo === 'admin'
  
  const isActive = userData ? (
    userData.ativo && (
      userData.tipo === 'admin' || 
      !userData.data_validade || 
      new Date(userData.data_validade) > new Date()
    )
  ) : false

  const value = {
    user,
    userData,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
    isActive
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}