'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createCheckoutSession } from '@/lib/adapter/actions'
import { CreditPackage } from '@/lib/dto/credits/credit'

interface PurchaseCreditsProps {
  packages: CreditPackage[]
}

export function PurchaseCredits({ packages }: PurchaseCreditsProps) {
  const [loading, setLoading] = useState<string | null>(null)

  const handlePurchase = async (packageId: string) => {
    try {
      setLoading(packageId)
      await createCheckoutSession(packageId)
    } catch (error) {
      console.error('Purchase failed:', error)
    } finally {
      setLoading(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Purchase Credits</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <h3 className="font-medium">{pkg.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {pkg.credits} credits for ${(pkg.price).toFixed(2)}
                </p>
              </div>
              <Button
                onClick={() => handlePurchase(pkg.id)}
                disabled={loading === pkg.id}
              >
                {loading === pkg.id ? 'Processing...' : 'Purchase'}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}