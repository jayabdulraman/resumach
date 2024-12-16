import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { stripe } from '@/lib/stripe'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!
  const supabase = createClient()

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      signature!,
      endpointSecret
    ) as Stripe.Event

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const { userId, packageId, credits, amount, package_name } = session.metadata as {
        userId: string
        packageId: string
        credits: string
        amount: string
        package_name: string
      }
      // Create pending upgrade record
      console.log("Payment ID:", session.payment_intent, "and Metadata:", session.metadata)
      const { error: insertError } = await supabase
      .from('pending_upgrades')
      .insert({
        user_id: userId,
        package_id: packageId,
        stripe_session_id: session.payment_intent,
        status: 'pending',
      })

      if (insertError) throw insertError

      // Call the database function to handle the successful payment
      const { data, error } = await supabase.rpc('handle_successful_payment', {
        p_package_id: packageId,
        p_user_id: userId,
        p_stripe_session_id: session.payment_intent,
        p_amount_paid: amount,
        p_credits: credits,
        p_status: 'completed',
        p_name: package_name
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
