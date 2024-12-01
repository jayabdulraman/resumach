export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number; // in cents
  description?: string;
  validityDays?: number;
  isPopular?: boolean;
  is_active?: boolean;
}

export interface UserCredits {
  available_credits: number;
  total_credits_earned: number;
  total_credits_used: number;
}

export interface CreditTransaction {
    id: string
    user_id: string
    package_id: string
    credits_amount: number
    stripe_payment_intent_id: string
    amount_paid: number
    created_at: string
    status: 'completed' | 'pending' | 'failed'
  }