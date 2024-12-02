"use client"
import { HouseSimple, Lock, SidebarSimple } from "@phosphor-icons/react";
import { Button } from "@/components/ui";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/utils/namespaces/style";
import Link from "next/link";
import { useBuilderStore } from "@/utils/stores/builder";
import { useResumeStore } from "@/utils/stores/resume";

export default function BuilderHeader(){
  const title = useResumeStore((state) => state.resume.title);
  const locked = useResumeStore((state) => state.resume.locked);

  const toggle = useBuilderStore((state) => state.toggle);
  const isDragging = useBuilderStore(
    (state) => state.panel.left.handle.isDragging || state.panel.right.handle.isDragging,
  );
  const leftPanelSize = useBuilderStore((state) => state.panel.left.size);
  const rightPanelSize = useBuilderStore((state) => state.panel.right.size);

  const onToggle = (side: "left" | "right") => {
    toggle(side);
  };

  const shortenTitle = (text: string): string => {
    if (text.length <= 30) return text;
    return text.slice(0, 30 - 3) + "...";
  };

  return (
    <div
      style={{ left: `${leftPanelSize}%`, right: `${rightPanelSize}%` }}
      className={cn(
        "fixed inset-x-0 top-0 z-[60] h-16 bg-white dark:bg-black backdrop-blur-xl lg:z-20",
        !isDragging && "transition-[left,right]",
      )}
    >
      <div className="flex h-full items-center justify-between px-4">
        <Button
          size="icon"
          variant="ghost"
          className="flex lg:hidden"
          onClick={() => {
            onToggle("left");
          }}
        >
          <SidebarSimple />
        </Button>

        <div className="flex items-center justify-center gap-x-1 lg:mx-auto">
          <Button asChild size="icon" variant="ghost">
            <Link href="/dashboard">
              <HouseSimple />
            </Link>
          </Button>

          <span className="mr-2 text-xs opacity-40">{"/"}</span>

          <TooltipProvider>
            <Tooltip content={title}>
              <h1 className="font-medium">{shortenTitle(title)}</h1>
            </Tooltip>
          </TooltipProvider>
          
          {locked && (
            <TooltipProvider>
              <Tooltip content={`This resume is locked, please unlock to make further changes.`}>
                <Lock size={14} className="ml-2 opacity-75" />
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <Button
          size="icon"
          variant="ghost"
          className="flex lg:hidden"
          onClick={() => {
            onToggle("right");
          }}
        >
          <SidebarSimple className="-scale-x-100" />
        </Button>
      </div>
    </div>
  );
};
