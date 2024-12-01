"use client"
import { useState } from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Menu, X } from 'lucide-react';

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" onClick={toggleMenu}>
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>
      {isOpen && (
        <div className="fixed inset-0 top-16 z-50 bg-background border-b border-b-foreground/10 p-4 overflow-y-auto">
          <nav className="flex flex-col space-y-4">
            <Link href="/" className="hover:text-primary" onClick={toggleMenu}>Home</Link>
            <Link href="#features" className="hover:text-primary" onClick={toggleMenu}>Features</Link>
            <Link href="#pricing" className="hover:text-primary" onClick={toggleMenu}>Pricing</Link>
            <Link href="#testimonial" className="hover:text-primary" onClick={toggleMenu}>Testimonials</Link>
            <Link href="#contact" className="hover:text-primary" onClick={toggleMenu}>Contact</Link>
          </nav>
          <div className="mt-4 flex flex-col space-y-2">
            <Button asChild size="sm" variant="outline">
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button asChild size="sm" variant="default">
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </div>
          <div className="mt-4">
            <ThemeSwitcher />
          </div>
        </div>
      )}
    </div>
  );
}