'use client'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { createCheckoutSession } from '@/lib/adapter/actions';
import { useState } from 'react';

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
  page?: string;
}

const Pricing = ({credit_packages, userId, page='home'}: PackagesProps) => {
  const [loadingTierId, setLoadingTierId] = useState<string | null>(null);
  const router = useRouter();
  const handleSelectPlan = async (packageId: string, name: string) => {
    // In real implementation, this would trigger the sign-up flow
    setLoadingTierId(packageId);
    if (name !== "Free") {
        if (userId) {
            await createCheckoutSession(packageId)
        } else {
            router.push(`/sign-up?packageId=${packageId}`)
        }
    } else {
        router.push(`/sign-up`)
    }
    setLoadingTierId(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Choose Your Plan</h2>
        <p className="text-gray-600">Start tailoring your resume with AI-powered precision</p>
      </div>

      <div className={`grid ${page === "home" ? "md:grid-cols-3" : "md:grid-cols-2"} gap-6`}>
        {credit_packages?.map((tier) => (
          <Card key={tier.name} className={`relative ${tier.popular ? 'border-purple-500 border-2' : ''}`}>
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm">
                  Most Popular
                </span>
              </div>
            )}
            
            <CardHeader>
              <h3 className="text-xl font-bold">{tier.name}</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold">${tier.price}</span>
                <span className="text-gray-600 ml-2">({tier.credits} credits)</span>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                ${(tier.price / tier.credits).toFixed(2)} per resume
              </p>
            </CardHeader>

            <CardContent>
              <ul className="space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter>
              <Button 
                className={`w-full ${tier.popular ? 'bg-purple-500 hover:bg-purple-600' : ''}`}
                onClick={() => handleSelectPlan(tier.id, tier.name)}
                disabled={loadingTierId === tier.id} // Disable button if loading
              >
                {loadingTierId === tier.id ? (
                  <>
                    Geting Started...
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  </>
                ) : (
                  <>
                    Get Started
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-gray-600">
        <p>✓ No credit card required for Free plan ✓ 100% satisfaction guarantee ✓ 5 days refund policy</p>
      </div>
    </div>
  );
};

export default Pricing;