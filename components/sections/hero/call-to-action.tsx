'use client'
import { Book, SignOut } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
// import { Link } from "react-router-dom";
import Link from 'next/link'

export const HeroCTA = () => {

  return (
    <>
      <Button asChild size="lg">
        <Link href="/dashboard">{`Get Started`}</Link>
      </Button>
    </>
  );
};
