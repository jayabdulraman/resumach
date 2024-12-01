import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')
  const supabase = createClient()

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET!
    ) as Stripe.Event

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const { userId, packageId, credits, package_name } = session.metadata as {
        userId: string
        packageId: string
        credits: string
        package_name: string
      }

      // Call the database function to handle the successful payment
      const { data, error } = await supabase.rpc('handle_successful_payment', {
        p_stripe_session_id: session.payment_intent,
        p_amount_paid: session.amount_total,
        p_status: 'completed',
        p_name: package_name,
      })

      if (error) throw error
      
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    )
  }
}
