'use client'
import {
  ArrowClockwise,
  ArrowCounterClockwise,
  CircleNotch,
  ClockClockwise,
  CubeFocus,
  FilePdf,
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
} from "@phosphor-icons/react";
import { Button, Separator } from "@/components/ui";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { motion } from "framer-motion";
import { useToast } from "@/lib/hooks/use-toast";
import { useBuilderStore } from "@/utils/stores/builder";
import { useResumeStore, useTemporalResumeStore } from "@/utils/stores/resume";
import { useZoomStore } from "@/utils/stores/zoom";
import { generatePDF } from "../../print-resume/print";
import { useState } from "react";

type ZoomType = 'ZOOM_IN' | 'ZOOM_OUT' | 'RESET_VIEW' | 'CENTER_VIEW' | null

export default function BuilderToolbar() {
  const { toast } = useToast();
  const setValue = useResumeStore((state) => state.setValue);
  const undo = useTemporalResumeStore((state) => state.undo);
  const redo = useTemporalResumeStore((state) => state.redo);
  const frameRef = useBuilderStore((state) => state.frame.ref);
  const setZoomType = useZoomStore((state) => state.setZoomType)

  const id = useResumeStore((state) => state.resume.id);
  const isPublic = useResumeStore((state) => state.resume.visibility === "public");
  const pageOptions = useResumeStore((state) => state.resume.data.metadata.page.options);
  const resume = useResumeStore((state) => state.resume);
  const resumeId = useResumeStore((state) => state.resume.id)
  const [isGenerating, setGenerating] = useState(false)

  const handleDownload = async () => {
    try {
      setGenerating(true)
      const res = await generatePDF("resume-id", resume, resumeId as string);
      // @ts-ignore
      if (res.success) {
        // Update the toast to indicate success
        toast({
          title: "Download ready ✅",
          description: "Your file is ready for download.",
          duration: 5000,
        })
      } else {
        // Update the toast to indicate an error
        toast({
          title: "Download failed ❌",
          description: "There was an error preparing your file. Please try again!",
          variant: "destructive",
          duration: 5000,
        });
      }
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    } finally {
      setGenerating(false)
    }
  };

  const handleZoom = (type: ZoomType) => {
    setZoomType(type)
  }
  
  return (
    <motion.div className="fixed inset-x-0 bottom-0 mx-auto hidden py-6 text-center md:block">
      <div className="inline-flex items-center justify-center rounded-full bg-background px-4 shadow-xl">
        <TooltipProvider>
          <Tooltip content={`Undo`}>
            <Button
              size="icon"
              variant="ghost"
              className="rounded-none"
              onClick={() => {
                undo();
              }}
            >
              <ArrowCounterClockwise />
            </Button>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip content={`Redo`}>
            <Button
              size="icon"
              variant="ghost"
              className="rounded-none"
              onClick={() => {
                redo();
              }}
            >
              <ArrowClockwise />
            </Button>
          </Tooltip>
        </TooltipProvider>

        <Separator orientation="vertical" className="h-9" />
        
        <TooltipProvider>
          <Tooltip content={`Zoom In`}>
            <Button size="icon" variant="ghost" className="rounded-none" onClick={() => handleZoom("ZOOM_IN")}>
              <MagnifyingGlassPlus />
            </Button>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip content={`Zoom Out`}>
            <Button size="icon" variant="ghost" className="rounded-none" onClick={() => handleZoom("ZOOM_OUT")}>
              <MagnifyingGlassMinus />
            </Button>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip content={`Reset Zoom`}>
            <Button size="icon" variant="ghost" className="rounded-none" onClick={() => handleZoom("RESET_VIEW")}>
              <ClockClockwise />
            </Button>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip content={`Center Artboard`}>
            <Button size="icon" variant="ghost" className="rounded-none" onClick={() => handleZoom("CENTER_VIEW")}>
              <CubeFocus />
            </Button>
          </Tooltip>
        </TooltipProvider>

        <Separator orientation="vertical" className="h-9" />
        
        <TooltipProvider>
          <Tooltip content={`Download PDF`}>
            <Button
              size="icon"
              variant="ghost"
              disabled={isGenerating}
              className="rounded-none"
              onClick={handleDownload}
            >
              {isGenerating ? <CircleNotch className="animate-spin" /> : <FilePdf />}
            </Button>
          </Tooltip>
        </TooltipProvider>
      </div>
    </motion.div>
  );
};
