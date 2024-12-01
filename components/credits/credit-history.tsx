'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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