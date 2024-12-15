import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "../globals.css";
import MobileMenu from "@/components/mobile-menu";
import { createClient } from "@/utils/supabase/server";
import { LeftNavbar } from "./left-navbar";
import { Toaster } from "@/components/ui/toaster";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "JobFit",
  description: "Customize Your Resume with AI",
};

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: credit_packages, error } = await supabase
    .from("credit_packages")
    .select("*")
    .eq("is_active", true)
    .order("credits");

  if (error) {
    console.error("Package Fetch Error in Layout:", error.message);
  }

  const pricingTiers = credit_packages
    ?.map((pkg) => ({
      id: pkg.id,
      name: pkg.name,
      credits: pkg.credits,
      price: pkg.price,
      popular: pkg.is_popular,
      features: pkg.description.split(",") as [],
    }))
    .filter((pack) => pack.name !== "Free");

  return (
    <html
      lang="en"
      className={GeistSans.className}
      suppressHydrationWarning={true}
    >
      <body
        className="bg-background text-foregroun"
        suppressHydrationWarning={true}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {!user ? (
            <div className="flex flex-col h-screen overflow-x-hidden">
              <nav className="w-full flex justify-center inset-x-0 top-0 border-b border-b-foreground/10">
                <div className="w-full max-w-7xl flex items-center p-3 px-5 text-sm">
                  {/* Left side - Logo */}
                  <div className="flex items-center font-semibold lg:w-1/3 w-full">
                    <Link href="/" className="text-2xl font-bold">
                      JobFit
                    </Link>
                  </div>

                  {/* Center - Navigation Links */}
                  <div className="hidden md:flex items-center justify-center lg:w-1/3 space-x-6">
                    <Link href="/" className="hover:text-primary">
                      Home
                    </Link>
                    <Link href="#features" className="hover:text-primary">
                      Features
                    </Link>
                    <Link href="#pricing" className="hover:text-primary">
                      Pricing
                    </Link>
                    <Link href="#testimonial" className="hover:text-primary">
                      Testimonials
                    </Link>
                    <Link href="#contact" className="hover:text-primary">
                      Contact
                    </Link>
                  </div>

                  {/* Right side - Theme Switcher and Auth */}
                  <div className="hidden md:flex items-center justify-end w-1/3">
                    <ThemeSwitcher />
                    <HeaderAuth />
                  </div>
                  <MobileMenu />
                </div>
              </nav>

              <div>
                {children}
                <Toaster />
              </div>

              <footer className="w-full flex flex-col items-center border-t text-center text-xs gap-4 py-8 px-4">
                <div className="flex gap-4">
                  <a
                    href="https://x.com/jayabdulraman"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X (Twitter)"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="hover:text-primary"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href="https://linkedin.com/in/jayabdulraman"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="hover:text-primary"
                    >
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </a>
                  <a
                    href="https://github.com/jayabdulraman"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="hover:text-primary"
                    >
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                  </a>
                </div>
                <p>&copy; 2024 JobFit. All rights reserved.</p>
              </footer>
            </div>
          ) : (
            // @ts-ignore
            <LeftNavbar children={children} user={user as UserDetails} credit_packages={pricingTiers} />
          )}
        </ThemeProvider>
      </body>
    </html>
  );
}
