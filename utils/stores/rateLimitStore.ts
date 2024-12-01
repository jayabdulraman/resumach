import { create } from 'zustand';

interface RateLimitState {
  limitError: string | null;
  remaining: number;
  resetAt: Date | null;
  setLimitError: (error: string | null) => void;
  setLimitInfo: (info: { remaining: number; resetAt: Date, }) => void;
  clearState: () => void;
}

export const useRateLimitStore = create<RateLimitState>((set) => ({
  limitError: null,
  remaining: 5, // Default max requests
  resetAt: null,
  setLimitError: (limitError) => set({ limitError }),
  setLimitInfo: (info) => set({ 
    remaining: info.remaining,
    resetAt: info.resetAt,
    limitError: null // Clear error when new limit info is set
  }),
  clearState: () => set({ 
    limitError: null,
    remaining: 5,
    resetAt: null
  })
}));