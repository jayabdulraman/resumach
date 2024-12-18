import { createClient } from '@/utils/supabase/server'
import { stripe } from '@/lib/stripe'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { packageId } = await req.json()
    const supabase = createClient()
    
    // Get package details
    const { data: credit_packages } = await supabase
      .from('credit_packages')
      .select('*')
      .eq('id', packageId)
      .single()
    
    if (!credit_packages) {
      return new Response('Package not found', { status: 404 })
    }

    // Get user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return new Response('Unauthorized', { status: 401 })
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${credit_packages.credits} Credits`,
              description: credit_packages.description,
            },
            unit_amount: credit_packages.price,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL ?? `https://resumach.com`}/dashboard/credits?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL ?? `https://resumach.com`}/dashboard/credits?canceled=true`,
      metadata: {
        userId: user.id,
        packageId: packageId,
        credits: credit_packages.credits,
      },
    })

    return new Response(JSON.stringify({ url: session.url }))
  } catch (error) {
    return new Response('Error creating checkout session', { status: 500 })
  }
}