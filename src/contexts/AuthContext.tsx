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

  const fetchUserData = async (userId: string): Promise<UsuarioData | null> => {
    try {
      console.log('Buscando dados do usuário:', userId)
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('auth_user_id', userId)
        .single()

      if (error) {
        console.error('Erro ao buscar dados do usuário:', error.message, error)
        return null
      }

      console.log('Dados do usuário encontrados:', data)
      return data as UsuarioData
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error)
      return null
    }
  }

  const updateLastAccess = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ ultimo_acesso: new Date().toISOString() })
        .eq('id', userId)

      if (error) {
        console.error('Erro ao atualizar último acesso:', error.message)
      }
    } catch (error) {
      console.error('Erro ao atualizar último acesso:', error)
    }
  }

  useEffect(() => {
    // Verificar sessão atual
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Erro ao obter sessão:', error.message)
          setLoading(false)
          return
        }

        setUser(session?.user ?? null)
        
        if (session?.user) {
          const userData = await fetchUserData(session.user.id)
          setUserData(userData)
          
          if (userData) {
            await updateLastAccess(userData.id)
          }
        }
      } catch (error) {
        console.error('Erro na inicialização da auth:', error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [])

  useEffect(() => {
    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        setUser(session?.user ?? null)
        
        if (session?.user && event === 'SIGNED_IN') {
          setLoading(true)
          const userData = await fetchUserData(session.user.id)
          console.log('UserData after fetch:', userData)
          setUserData(userData)
          
          if (userData) {
            await updateLastAccess(userData.id)
          }
          setLoading(false)
        } else if (event === 'SIGNED_OUT') {
          setUserData(null)
          setLoading(false)
        } else {
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        console.error('Erro no login:', error.message)
        return { error: error.message }
      }

      // O onAuthStateChange vai lidar com o resto do loading
      return {}
    } catch (error) {
      console.error('Erro no login:', error)
      return { error: 'Erro ao fazer login' }
    }
  }

  const signUp = async (email: string, password: string, nome: string) => {
    try {
      setLoading(true)
      
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
        console.error('Erro no cadastro:', error.message)
        return { error: error.message }
      }

      // Criar registro na tabela usuarios se o usuário foi criado
      if (data.user) {
        const { error: insertError } = await supabase
          .from('usuarios')
          .insert({
            auth_user_id: data.user.id,
            nome,
            email,
            tipo: 'aluno',
            ativo: true,
            criado_por: 'manual'
          })
          
        if (insertError) {
          console.error('Erro ao criar usuário na tabela:', insertError.message)
        }
      }

      return {}
    } catch (error) {
      console.error('Erro no cadastro:', error)
      return { error: 'Erro ao criar conta' }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error('Erro no logout:', error.message)
      }
    } catch (error) {
      console.error('Erro no logout:', error)
    } finally {
      setLoading(false)
    }
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