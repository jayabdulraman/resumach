// import { Separator } from "@/components/ui";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { useRef } from "react";
// import { ExportSection } from "./sections/export";
// import { LayoutSection } from "./sections/layout";
// import { TemplateSection } from "./sections/template";
// import { SharingSection } from "./sections/sharing";
// import { SectionIcon } from "./shared/section-icon";
// import { ThemeSwitcher } from "@/components/theme-switcher";
// import { useAuthStore } from "@/utils/stores/auth";

// export const RightSidebar = () => {
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const userCurrentSubscription = useAuthStore((state) => state.userCurrentSubscription)

//   const scrollIntoView = (selector: string) => {
//     const section = containerRef.current?.querySelector(selector);
//     section?.scrollIntoView({ behavior: "smooth" });
//   };

//   return (
//     <div className="flex h-full max-w-[400px] bg-secondary-accent/50">
//       <ScrollArea className="flex-1 h-screen">
//         <div 
//           ref={containerRef} 
//           className="p-4 space-y-6 w-full max-w-[368px]"
//         >
//           <div className="w-full">
//             <TemplateSection />
//             <Separator className="my-4" />
//             <LayoutSection />
//             <Separator className="my-4" />
//             <ExportSection />
//             <Separator className="my-4" />
//             <SharingSection />
//           </div>
//         </div>
//       </ScrollArea>

//       <div className="hidden sm:flex flex-col justify-between items-center w-12 bg-secondary-accent/30 py-4">
//         <div className="flex-1" />
        
//         <div className="flex flex-col items-center gap-y-2">
//           <SectionIcon
//             id="template"
//             name="Template"
//             onClick={() => scrollIntoView("#template")}
//           />
//           <SectionIcon
//             id="layout"
//             name="Layout"
//             onClick={() => scrollIntoView("#layout")}
//           />
//           <SectionIcon
//             id="export"
//             name="Export"
//             onClick={() => scrollIntoView("#export")}
//           />
//           <SectionIcon
//             id="sharing"
//             name="Sharing"
//             onClick={() => scrollIntoView("#sharing")}
//           />
//         </div>

//         <div className="flex-1 flex items-end">
//           <ThemeSwitcher />
//         </div>
//       </div>
//     </div>
//   );
// };
import { Separator } from "@/components/ui";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRef } from "react";
import { ExportSection } from "./sections/export";
import { LayoutSection } from "./sections/layout";
import { TemplateSection } from "./sections/template";
import { SharingSection } from "./sections/sharing";
import { SectionIcon } from "./shared/section-icon";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { useAuthStore } from "@/utils/stores/auth";
import { Lock } from "lucide-react";
import UpgradeCard from "@/components/upgrade-card";

type CreditPackagesTypes = {
  id: string;
  name: string;
  credits: number;
  price: number;
  popular: boolean;
  features: string[];
}

interface RightSidebarProps {
  userId: string;
  credit_packages: CreditPackagesTypes[]
}
export const RightSidebar = ({ userId, credit_packages } : RightSidebarProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const userCurrentSubscription = useAuthStore((state) => state.userCurrentSubscription);
  console.log("CREDIT PACKAGES:", credit_packages);

  const scrollIntoView = (selector: string) => {
    const section = containerRef.current?.querySelector(selector);
    section?.scrollIntoView({ behavior: "smooth" });
  };

  const LockedOverlay = ({ sectionName }: { sectionName: string }) => (
    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10">
      <div className="dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
        {/* <h3 className="text-lg font-semibold mb-2">
          {sectionName} Locked
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          Upgrade to unlock advanced {sectionName.toLowerCase()} features
        </p>
        <Button>Upgrade Now</Button> */}
        <UpgradeCard credit_packages={credit_packages} userId={userId}/>
      </div>
    </div>
  );

  return (
    <div className="flex h-full max-w-[400px] bg-secondary-accent/50">
      <ScrollArea className="flex-1 h-screen">
        <div 
          ref={containerRef} 
          className="p-4 space-y-6 w-full max-w-[368px]"
        >
          <div className="w-full">
            <div className="relative" id="template">
              <TemplateSection />
              {userCurrentSubscription === "Free" && (
                <LockedOverlay sectionName="Template" />
              )}
            </div>
            <Separator className="my-4" />
            
            <div className="relative" id="layout">
              <LayoutSection />
              {userCurrentSubscription === "Free" && (
                <LockedOverlay sectionName="Layout" />
              )}
            </div>
            <Separator className="my-4" />
            
            <ExportSection />
            <Separator className="my-4" />
            
            <SharingSection />
          </div>
        </div>
      </ScrollArea>

      <div className="hidden sm:flex flex-col justify-between items-center w-12 bg-secondary-accent/30 py-4">
        <div className="flex-1" />
        
        <div className="flex flex-col items-center gap-y-2">
          <SectionIcon
            id="template"
            name="Template"
            onClick={() => scrollIntoView("#template")}
            disabled={userCurrentSubscription === "Free"}
          />
          <SectionIcon
            id="layout"
            name="Layout"
            onClick={() => scrollIntoView("#layout")}
            disabled={userCurrentSubscription === "Free"}
          />
          <SectionIcon
            id="export"
            name="Export"
            onClick={() => scrollIntoView("#export")}
          />
          <SectionIcon
            id="sharing"
            name="Sharing"
            onClick={() => scrollIntoView("#sharing")}
          />
        </div>

        <div className="flex-1 flex items-end">
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
};