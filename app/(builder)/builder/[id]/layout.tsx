import { createClient } from "@/utils/supabase/server";
import "../../../globals.css"
import { ThemeProvider } from "next-themes";
import { GeistSans } from "geist/font/sans";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Link from "next/link";
import { Toaster } from "@/components/ui/toaster";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "JobFit",
  description: "Customize Your Resume with AI",
};

export default async function BuilderLayout({
    children,
    }: {
    children: React.ReactNode;
    }) {
    const supabase = createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
      
    return (
        <html lang="en" className={GeistSans.className} suppressHydrationWarning={true}>
            <body suppressHydrationWarning={true}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <div>
                        {children}
                        <Toaster />
                    </div>
                    {/* </div> */}
                </ThemeProvider>
            </body>
        </html>
    )
}