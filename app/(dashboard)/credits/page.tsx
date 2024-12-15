import { Suspense } from 'react'
import { createClient } from '@/utils/supabase/server'
import { CreditBalance } from '@/components/credits/credit-balance'
import { CreditHistory } from '@/components/credits/credit-history'
import { PurchaseCredits } from '@/components/credits/purchase-credits'
import { Skeleton } from '@/components/ui/skeleton'

type UserDetails = {
  id: string;
  email: string | undefined;
};

export default async function CreditsPage() {
  const supabase = createClient()
  const {data: {user}} = await supabase.auth.getUser()

  // get user credits
  const { data: credits } = await supabase
    .from('user_credits')
    .select('*')
    .eq("user_id", user?.id)
    .single()

  // get packages
  const isActive = true
  const name = "Free"
  let packagesQuery = supabase.from("credit_packages").select("*")
  if (isActive) {packagesQuery = packagesQuery.eq("is_active", isActive)}
  if (name) {packagesQuery = packagesQuery.neq("name", name)}
  const { data: credit_packages, error } = await packagesQuery

  // get user's transactions
  const { data: transactions } = await supabase
    .from('credit_purchases')
    .select('*')
    .eq("user_id", user?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Credit Management</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <Suspense fallback={<Skeleton className="h-[200px]" />}>
          <CreditBalance credits={credits} />
        </Suspense>
        <PurchaseCredits packages={credit_packages || []} user={user as UserDetails} />
      </div>
      
      <Suspense fallback={<Skeleton className="h-[400px]" />}>
        <CreditHistory transactions={transactions || []} />
      </Suspense>
    </div>
  )
}