"use client";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CircleUser, FileCheck, Menu, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signOutAction } from "../actions";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Coin } from "@phosphor-icons/react";
import UpgradeCard from "@/components/upgrade-card";

type UserMetadata = {
  name: string;
  email_verified: boolean;
};
type UserDetails = {
  id: string;
  email: string | undefined;
  email_confirmed_at: string;
  user_metadata: UserMetadata;
};

type CreditPackagesTypes = {
  id: string;
  name: string;
  credits: number;
  price: number;
  popular: boolean;
  features: string[];
};

interface LeftNavbarProps {
  children: React.ReactNode;
  user: UserDetails | null;
  credit_packages: CreditPackagesTypes[];
}

export function LeftNavbar({
  children,
  user,
  credit_packages,
}: LeftNavbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-col md:w-[220px] lg:w-[280px] border-r bg-muted/40">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="">JobFit</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto px-2 py-4 lg:px-4">
          <Link
            href="/dashboard"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
              pathname === "/dashboard"
                ? "bg-muted text-primary"
                : "text-muted-foreground"
            }`}
          >
            <FileCheck className="h-4 w-4" />
            Resumes
          </Link>
          <Link
            href="/credits"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
              pathname === "/credits"
                ? "bg-muted text-primary"
                : "text-muted-foreground"
            }`}
          >
            <Coin className="h-4 w-4" />
            Credit Management
          </Link>
          <Link
            href="/settings"
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
              pathname === "/settings"
                ? "bg-muted text-primary"
                : "text-muted-foreground"
            }`}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </nav>
        <div className="p-4">
          <UpgradeCard credit_packages={credit_packages} userId={user?.id} />
        </div>
      </div>

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <span className="sr-only">JobFit</span>
                </Link>
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                    pathname === "/dashboard"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <FileCheck className="h-4 w-4" />
                  Resumes
                </Link>
                <Link
                  href="/credits"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                    pathname === "/credits"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <Coin className="h-4 w-4" />
                  Credit Management
                </Link>
                <Link
                  href="/settings"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                    pathname === "/settings"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </nav>
              <div className="mt-auto">
                <UpgradeCard
                  credit_packages={credit_packages}
                  userId={user?.id}
                />
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex items-center ml-auto gap-4">
            {user && (
              <div className="font-normal text-sm transition-all">
                Hey, {user.email?.split("@")[0]}!
              </div>
            )}
            <div className="h-8 w-8 flex items-center">
              <ThemeSwitcher />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="secondary"
                  size="icon"
                  className="rounded-full"
                >
                  <CircleUser className="h-5 w-5" />
                  <span className="sr-only">Toggle user menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <form action={signOutAction}>
                    <Button type="submit" variant={"ghost"} className="p-0 m-0">
                      Sign out
                    </Button>
                  </form>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        {/* Scrollable main content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
