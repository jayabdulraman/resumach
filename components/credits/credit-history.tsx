'use client'

import { CreditTransaction } from '@/lib/dto/credits/credit'
import { TransactionsDataTable } from '../transactions-data-table'

interface CreditHistoryProps {
  transactions: CreditTransaction[]
}

export function CreditHistory({ transactions }: CreditHistoryProps) {

  return (
    <>
      <TransactionsDataTable data={transactions} />
    </>
  )
}