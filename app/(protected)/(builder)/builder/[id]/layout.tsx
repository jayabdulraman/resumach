import "../../../../globals.css";
import { Toaster } from "@/components/ui/toaster";

export default async function BuilderLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <div>
      {children}
      <Toaster />
    </div>
  );
}
