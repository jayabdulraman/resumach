"use client"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { UserCredits } from '@/lib/dto/credits/credit'
import { useAuthStore } from '@/utils/stores/auth'
import { useRateLimitStore } from '@/utils/stores/rateLimitStore'

export function CreditBalance({ credits }: { credits: UserCredits }) {
  const userCurrentSubscription = useAuthStore((state) => state.userCurrentSubscription)
  const remaining = useRateLimitStore((state) => state.remaining)
  const rateLimit = Number(process.env.NEXT_PUBLIC_RATE_LIMIT!)
  let creditUsage;
  
  if (userCurrentSubscription === "Free") {
    const userFreeUsage = {
      available_credits: remaining,
      total_credits_used: rateLimit - remaining,
      total_credits_earned: rateLimit,
    }
    creditUsage = userFreeUsage
  } else {
    // get user's credit usage
    creditUsage = credits
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Credit Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span>Available Credits</span>
              <span className="font-bold">{creditUsage ? creditUsage.available_credits: 0}</span>
            </div>
            <Progress value={
              creditUsage ? (creditUsage.available_credits / creditUsage.total_credits_earned) * 100 : 0
            } />
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Total Earned</p>
              <p className="font-medium">{creditUsage?.total_credits_earned ? creditUsage.total_credits_earned: 5}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Total Used</p>
              <p className="font-medium">{creditUsage?.total_credits_used ? creditUsage.total_credits_used : 0}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}