'use client'

import { StatisticsSection } from "@/components/sections/stats/statistics"
import { TestimonialsSection } from "@/components/sections/testimonial/testimonials"
import { HeroSection } from "@/components/sections/hero/"
import StepsExplanation from "./how-it-works"
import FeaturesSection from "./features"
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

interface PackagesProps {
  credit_packages: CreditPackagesTypes[];
  userId: string;
}

export default function JobFitLandingComponent({credit_packages, userId}: PackagesProps) {

  return (
    <div className="flex flex-col min-h-screen">

      <div className="flex-grow">
        <section id="home" className="p-3">
          <HeroSection />
        </section>
        <section className="py-24 bg-purple-50">
          <StatisticsSection />
        </section>
        <section id="steps">
          <StepsExplanation />
        </section>
        <section id="features" className="py-16 bg-purple-50">
          <FeaturesSection />
        </section>
        <section id="pricing" className="py-16">
          <Pricing credit_packages={credit_packages} userId={userId} />
        </section>
        <section id="testimonial" className="py-24 bg-purple-50">
          <TestimonialsSection />
        </section>
        <section id="contact" className="py-5">
          <ContactUs />
        </section>
      </div>
    </div>
  )
}