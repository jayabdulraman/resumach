import { createClient } from '@/utils/supabase/server'
import JobFitLandingComponent from "@/components/job-fit-landing"
import { redirect } from 'next/navigation';

export default async function WebHome() {
  const supabase = createClient()
  const { data: { user }} = await supabase.auth.getUser();

  const { data: credit_packages, error } = await supabase
    .from('credit_packages')
    .select('*')
    .eq('is_active', true)
    .order('credits')

  const pricingTiers = credit_packages?.map((pkg) => 
    ({
      id: pkg.id,
      name: pkg.name,
      credits: pkg.credits,
      price: pkg.price,
      popular: pkg.is_popular,
      features: pkg.description.split(",") as []
    })
  );

  return (
    <div>
      <JobFitLandingComponent credit_packages={pricingTiers as []} userId={user?.id as string} />
    </div>
  );
}
