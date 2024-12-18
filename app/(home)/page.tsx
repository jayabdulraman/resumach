import { createClient } from '@/utils/supabase/server'
import ResumachFitLandingComponent from "@/components/resumach-fit-landing"

type UserDetails = {
  id: string;
  email: string;
}

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
      <ResumachFitLandingComponent credit_packages={pricingTiers as []} user={user as UserDetails} />
    </div>
  );
}
