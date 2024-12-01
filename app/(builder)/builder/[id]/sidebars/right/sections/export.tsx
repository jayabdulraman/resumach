import { CircleNotch, FilePdf } from "@phosphor-icons/react";
import { Button } from "@/components/ui";
import { useResumeStore } from "@/utils/stores/resume";
import { getSectionIcon } from "../shared/section-icon";
import { generatePDF } from "@/app/(builder)/builder/print-resume/print";
import { usePDFStore } from "@/utils/stores/print";

export const ExportSection = () => {
  const isGenerating = usePDFStore((state) => state.isGenerating);
  const { resume } = useResumeStore.getState();

  const handleDownload = async () => {
    try {
      await generatePDF("resume-id", resume, resume.id as string);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    }
  };

  return (
    <section id="export" className="grid gap-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          {getSectionIcon("export")}
          <h2 className="line-clamp-1 text-3xl font-bold">{`Export`}</h2>
        </div>
      </header>

      <main className="grid gap-y-4 p-2 flex flex-col overflow-auto">
        <Button className="w-full mb-1 rounded-none" onClick={handleDownload}>
          {isGenerating ? (
            <CircleNotch className="animate-spin" />
          ) : (
            <FilePdf />
          )}
          Download PDF
        </Button>
      </main>
    </section>
  );
};
