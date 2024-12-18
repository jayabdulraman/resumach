// import { Providers } from "./providers";
import '../../../globals.css'
import { Toaster } from "@/components/ui/toaster"
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
      <Toaster />
    </div>
  );
}