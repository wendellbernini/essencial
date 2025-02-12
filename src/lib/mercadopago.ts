import mercadopago from 'mercadopago'

// Configuração do Mercado Pago
mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN!,
})

export interface CreatePreferenceParams {
  items: {
    id: string
    title: string
    description?: string
    picture_url?: string
    category_id?: string
    quantity: number
    currency_id?: string
    unit_price: number
  }[]
  payer?: {
    name?: string
    surname?: string
    email: string
    phone?: {
      area_code?: string
      number: string
    }
    address?: {
      zip_code?: string
      street_name?: string
      street_number?: number
    }
  }
  back_urls?: {
    success?: string
    pending?: string
    failure?: string
  }
  auto_return?: 'approved' | 'all'
  payment_methods?: {
    excluded_payment_methods?: { id: string }[]
    excluded_payment_types?: { id: string }[]
    installments?: number
  }
  notification_url?: string
  statement_descriptor?: string
  external_reference?: string
}

export async function createPreference(params: CreatePreferenceParams) {
  try {
    const preference = await mercadopago.preferences.create({
      items: params.items.map(item => ({
        ...item,
        currency_id: item.currency_id || 'BRL',
      })),
      payer: params.payer,
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_SITE_URL}/pedidos/sucesso`,
        pending: `${process.env.NEXT_PUBLIC_SITE_URL}/pedidos/pendente`,
        failure: `${process.env.NEXT_PUBLIC_SITE_URL}/pedidos/erro`,
        ...params.back_urls,
      },
      auto_return: params.auto_return || 'approved',
      payment_methods: params.payment_methods,
      notification_url: params.notification_url || `${process.env.NEXT_PUBLIC_API_URL}/webhooks/mercadopago`,
      statement_descriptor: params.statement_descriptor || 'Essencial',
      external_reference: params.external_reference,
    })

    return preference
  } catch (error) {
    console.error('Erro ao criar preferência:', error)
    throw new Error('Erro ao criar preferência de pagamento')
  }
}

export async function getPaymentById(paymentId: string) {
  try {
    const payment = await mercadopago.payment.get(paymentId)
    return payment
  } catch (error) {
    console.error('Erro ao buscar pagamento:', error)
    throw new Error('Erro ao buscar informações do pagamento')
  }
}

export async function createPayment(paymentData: mercadopago.payment.create.Parameters) {
  try {
    const payment = await mercadopago.payment.create(paymentData)
    return payment
  } catch (error) {
    console.error('Erro ao criar pagamento:', error)
    throw new Error('Erro ao processar pagamento')
  }
} 