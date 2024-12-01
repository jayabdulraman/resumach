import { CopySimple } from "@phosphor-icons/react";
import { Button, Input, Label } from "@/components/ui";
import { useResumeStore } from "@/utils/stores/resume";
import { getSectionIcon } from "../shared/section-icon";
import { useToast } from "@/components/hooks/use-toast";
import { AnimatePresence, motion } from "framer-motion";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";

export const SharingSection = () => {
  const { toast } = useToast();
  const resumeId = useResumeStore((state) => state.resume.id);

  // Constants
  const url = `${window.location.origin}/artboard/preview/${resumeId}`;

  const onCopy = async () => {
    await navigator.clipboard.writeText(url);

    toast({
      title: `A link has been copied to your clipboard ✅.`,
      description: `Anyone with this link can view and download the resume. Share it on your profile or with recruiters.`,
    });
  };

  return (
    <section id="sharing" className="grid gap-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          {getSectionIcon("sharing")}
          <h2 className="line-clamp-1 text-3xl font-bold">{`Sharing`}</h2>
        </div>
      </header>
      <main className="grid gap-y-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-x-4">
            <div>
              <Label htmlFor="visibility" className="space-y-1">
                <p className="text-xs opacity-60">
                  {`Anyone with the link can view and download the resume.`}
                </p>
              </Label>
            </div>
          </div>
        </div>
        <AnimatePresence presenceAffectsLayout>
          <motion.div
            layout
            className="space-y-1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Label htmlFor="resume-url">{`URL`}</Label>
            <div className="flex gap-x-1.5">
              <Input readOnly id="resume-url" value={url} className="flex-1" />
              <TooltipProvider>
                <Tooltip content={`Copy to Clipboard`}>
                  <Button size="icon" variant="ghost" onClick={onCopy}>
                    <CopySimple />
                  </Button>
                </Tooltip>
                <Toaster />
              </TooltipProvider>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>
    </section>
  );
};
