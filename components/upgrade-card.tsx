'use client'

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import Pricing from './pricing';

type UserDetails = {
  id: string;
  email: string;
}

type CreditPackagesTypes = {
  id: string;
  name: string;
  credits: number;
  price: number;
  popular: boolean;
  features: string[];
}

interface UpgradeCardProps {
  credit_packages: CreditPackagesTypes[];
  user: UserDetails | null
}

const UpgradeCard: React.FC<UpgradeCardProps> = ({ credit_packages, user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="p-2 pt-0 md:p-4">
        <CardTitle>Upgrade Credits</CardTitle>
        <CardDescription>
          Unlock more credits to access more features and our support team.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="w-full">
              Upgrade
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-6xl p-0">
            <Pricing 
              credit_packages={credit_packages} 
              user={user} 
              page='upgrade'
            />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default UpgradeCard;