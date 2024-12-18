import { getResume } from "@/lib/adapter/actions";
import { ResumeBuilderComponent } from "./resume-builder"
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { type Metadata } from 'next'

export interface ResumePageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ResumePageProps): Promise<Metadata> {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/sign-in?next=login-to-continue`)
  }

  const resume = await getResume(params.id, user.id)

  return {
    // @ts-ignore
    title: `${resume?.title} - resumach` ?? 'resume details - resumach',
  }
}

export default async function ResumeDetailsPage({ params }: ResumePageProps) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/sign-in?next=login-to-continue`)
  }

  const resume = await getResume(params.id, user.id)
  const userId = user?.id as string
  // @ts-ignore
  const resumeUserId = resume?.userId as string

  // get packages
  const isActive = true
  const name = "Free"
  let packagesQuery = supabase.from("credit_packages").select("*")
  if (isActive) {packagesQuery = packagesQuery.eq("is_active", isActive)}
  if (name) {packagesQuery = packagesQuery.neq("name", name)}
  const { data: credit_packages, error } = await packagesQuery
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
  // @ts-ignore
  if (!resume || 'error' in resume) {
    redirect('/dashboard')
  } else {
    if (userId !== resumeUserId) {
      return 
    }
    return (
      <div>
        {/* @ts-ignore */}
        <ResumeBuilderComponent initialResume={resume} user={user} resumeId={resume.id} credit_packages={pricingTiers as []} />
      </div>
    )
  }
}
