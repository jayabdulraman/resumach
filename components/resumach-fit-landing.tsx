'use client'

import { StatisticsSection } from "@/components/sections/stats/statistics"
import { TestimonialsSection } from "@/components/sections/testimonial/testimonials"
import { HeroSection } from "@/components/sections/hero/"
import StepsExplanation from "./how-it-works"
import FeaturesSection from "./sections/features/features"
import Pricing from "./pricing"
import ContactUs from "./contact-us"

type CreditPackagesTypes = {
  id: string;
  name: string;
  credits: number;
  price: number;
  popular: boolean;
  features: string[];
}

type UserDetails = {
  id: string;
  email: string | undefined;
};

interface PackagesProps {
  credit_packages: CreditPackagesTypes[];
  user: UserDetails | null;
}

export default function ResumachLandingComponent({credit_packages, user}: PackagesProps) {

  return (
    // <div className="flex min-h-screen">
      <div className="flex-grow">
        <section id="home">
          <HeroSection userId={user?.id as string} />
        </section>
        <section id="statistics" className="py-12 sm:py-16 lg:py-24 bg-purple-50 dark:bg-slate-800">
          <StatisticsSection />
        </section>
        <section id="steps" className="px-4 sm:px-6 lg:px-8">
          <StepsExplanation />
        </section>
        <section id="features" className="py-12 sm:py-16 lg:py-24 bg-purple-50 dark:bg-slate-800">
          <FeaturesSection />
        </section>
        <section id="pricing" className="py-12 sm:py-16 lg:py-24">
          <Pricing credit_packages={credit_packages} user={user} />
        </section>
        <section id="testimonial" className="py-12 sm:py-16 lg:py-24 bg-purple-50 dark:bg-slate-800">
          <TestimonialsSection />
        </section>
        <section id="contact" className="py-8 sm:py-10 lg:py-16">
          <ContactUs />
        </section>
      </div>
    // </div>
  )
}