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
import { usePDFStore } from "@/utils/stores/print";

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
  const isGenerating = usePDFStore((state) => state.isGenerating);

  const handleDownload = async () => {
    try {
      await generatePDF("resume-id", resume, resumeId as string);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    }
  };

  // const onPrint = async () => {
  //   // const { url } = await printResume({ id });
  //   const url = ""

  //   openInNewTab(url);
  // };

  // const onCopy = async () => {
  //   const { url } = await printResume({ id });
  //   await navigator.clipboard.writeText(url);

  //   toast({
  //     variant: "success",
  //     title: t`A link has been copied to your clipboard.`,
  //     description: t`Anyone with this link can view and download the resume. Share it on your profile or with recruiters.`,
  //   });
  // };

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

        {/* <Tooltip content={`Toggle Page Break Line`}>
          <Toggle
            className="rounded-none"
            pressed={pageOptions.breakLine}
            onPressedChange={(pressed) => {
              setValue("metadata.page.options.breakLine", pressed);
            }}
          >
            <LineSegment />
          </Toggle>
        </Tooltip> */}

        {/* <Tooltip content={`Toggle Page Numbers`}>
          <Toggle
            className="rounded-none"
            pressed={pageOptions.pageNumbers}
            onPressedChange={(pressed) => {
              setValue("metadata.page.options.pageNumbers", pressed);
            }}
          >
            <Hash />
          </Toggle>
        </Tooltip>

        <Separator orientation="vertical" className="h-9" /> */}

        {/* <Tooltip content={`Copy Link to Resume`}>
          <Button
            size="icon"
            variant="ghost"
            className="rounded-none"
            disabled={!isPublic}
            onClick={onCopy}
          >
            <LinkSimple />
          </Button>
        </Tooltip> */}
        
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
