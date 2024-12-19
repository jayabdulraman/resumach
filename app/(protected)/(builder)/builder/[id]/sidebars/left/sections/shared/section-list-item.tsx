"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CopySimple, DotsSixVertical, PencilSimple, TrashSimple, Eye, EyeSlash } from "@phosphor-icons/react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { useResumeStore } from "@/utils/stores/resume";

export type SectionListItemProps = {
  id: string;
  title: string;
  visible?: boolean;
  description?: string;
  onUpdate?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onToggleVisibility?: () => void;
};

export function SectionListItem({
  id,
  title,
  description,
  visible = true,
  onUpdate,
  onDuplicate,
  onDelete,
  onToggleVisibility,
}: SectionListItemProps) {
  const { setNodeRef, transform, transition, attributes, listeners, isDragging } = useSortable({
    id,
  });
  const education = useResumeStore((state) => state.resume.data.sections.education);
  console.log("EDUCATION:", education)

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.5 : undefined,
    zIndex: isDragging ? 100 : undefined,
    transition,
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) onDelete();
  };

  const shortenTitle = (text: string): string => {
    if (text.length <= 30) return text;
    return text.slice(0, 30 - 3) + "...";
  };

  return (
    <motion.section
      ref={setNodeRef}
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="border bg-secondary/10 first-of-type:rounded-t last-of-type:rounded-b last-of-type:border-b"
    >
      <div style={style} className="flex transition-opacity">
        <div
          {...listeners}
          {...attributes}
          className={cn(
            "flex w-5 cursor-move items-center justify-center",
            !isDragging && "hover:bg-secondary",
          )}
        >
          <DotsSixVertical weight="bold" size={12} />
        </div>
        <div
          className={cn(
            "flex-1 cursor-context-menu p-4 hover:bg-secondary-accent",
            !visible && "opacity-50",
          )}
          onClick={onUpdate}
        >
          <h4 className="font-medium leading-relaxed">{shortenTitle(title ?? '...')}</h4>
          {description && <p className="text-xs leading-relaxed opacity-50">{shortenTitle(description ?? '...')}</p>}
        </div>
        
        {/* Right actions with border */}
        <div className="border-l flex flex-col justify-center">
          <TooltipProvider>
            <Tooltip content={`Edit`} side="right">
              <Button variant="ghost" size="icon" className="rounded-none w-5 h-7" onClick={onUpdate}>
                <PencilSimple className="h-3 w-3" />
              </Button>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip content={visible ? `Hide`: `Show`} side="right">
              <Button variant="ghost" size="icon" className="rounded-none w-5 h-7 border-y" onClick={onToggleVisibility}>
                {visible ? <Eye className="h-3 w-3" /> : <EyeSlash className="h-3 w-3" />}
              </Button>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip content={`Delete`} side="right">
              <Button variant="ghost" size="icon" className="rounded-none w-5 h-7" onClick={handleDelete}>
                <TrashSimple className="h-3 w-3" />
              </Button>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </motion.section>
  );
};