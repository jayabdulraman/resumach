import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { GeistSans } from "geist/font/sans";
import { ThemeProvider } from "next-themes";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    template: '%s - resumach',
    default: 'resumach - tailor your resume with AI',
  },
  description: 'Quickly tailor your resume to match any job description with AI!',
  keywords: `resume, resume builder, tailor resume`,
  metadataBase: new URL(`${process.env.NEXT_PUBLIC_BASE_URL}` ?? `https://resumach.com`),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
          <div>
            {children}
            <Toaster />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
