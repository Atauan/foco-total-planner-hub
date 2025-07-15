import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface KiwifyWebhookData {
  Customer: {
    full_name: string
    email: string
  }
  Product: {
    ProductName: string
  }
  order_status: string
  created_at: string
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const webhookData: KiwifyWebhookData = await req.json()
    
    // Verificar se é uma venda aprovada
    if (webhookData.order_status !== 'paid') {
      return new Response(
        JSON.stringify({ message: 'Pedido não aprovado' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { Customer, Product } = webhookData
    
    // Gerar senha aleatória
    const { data: senhaData } = await supabaseClient.rpc('gerar_senha_aleatoria', { tamanho: 12 })
    const senhaAleatoria = senhaData

    // Determinar validade baseada no produto
    let diasValidade = 30 // Padrão mensal
    if (Product.ProductName.toLowerCase().includes('anual')) {
      diasValidade = 365
    } else if (Product.ProductName.toLowerCase().includes('trimestral')) {
      diasValidade = 90
    }

    const dataValidade = new Date()
    dataValidade.setDate(dataValidade.getDate() + diasValidade)

    // Criar usuário no Supabase Auth
    const { data: authUser, error: authError } = await supabaseClient.auth.admin.createUser({
      email: Customer.email,
      password: senhaAleatoria,
      email_confirm: true,
      user_metadata: {
        nome: Customer.full_name,
        tipo: 'aluno',
        plano: Product.ProductName,
        criado_por: 'kiwify'
      }
    })

    if (authError) {
      console.error('Erro ao criar usuário auth:', authError)
      return new Response(
        JSON.stringify({ error: 'Erro ao criar usuário' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Criar registro na tabela usuarios
    const { error: userError } = await supabaseClient
      .from('usuarios')
      .insert({
        auth_user_id: authUser.user?.id,
        nome: Customer.full_name,
        email: Customer.email,
        tipo: 'aluno',
        plano: Product.ProductName,
        data_validade: dataValidade.toISOString(),
        senha_temporaria: senhaAleatoria,
        criado_por: 'kiwify',
        ativo: true
      })

    if (userError) {
      console.error('Erro ao criar usuário na tabela:', userError)
      return new Response(
        JSON.stringify({ error: 'Erro ao salvar dados do usuário' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Log da criação
    await supabaseClient
      .from('logs_acesso')
      .insert({
        usuario_id: authUser.user?.id,
        tipo_acao: 'usuario_criado_kiwify',
        detalhes: {
          produto: Product.ProductName,
          dias_validade: diasValidade,
          data_compra: webhookData.created_at
        }
      })

    // Aqui você pode enviar email com as credenciais
    // TODO: Implementar envio de email com senha

    return new Response(
      JSON.stringify({ 
        message: 'Usuário criado com sucesso',
        email: Customer.email,
        validade: dataValidade.toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Erro no webhook:', error)
    return new Response(
      JSON.stringify({ error: 'Erro interno do servidor' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})