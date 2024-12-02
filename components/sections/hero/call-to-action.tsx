'use client'
import { Book, SignOut } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
// import { Link } from "react-router-dom";
import Link from 'next/link'

interface HeroCTAProps {
  userId: string;
}

export function HeroCTA({userId}: HeroCTAProps) {
  if (userId) {
    return (
      <>
        <Button asChild size="lg">
          <Link href="/sign-up">{`Get Started`}</Link>
        </Button>
      </>
    );
  } else {
    return (
      <>
        <Button asChild size="lg">
          <Link href="/dashboard">{`Go to Dashboard`}</Link>
        </Button>
      </>
    );
  }
  
};
