import { AspectRatio } from "@/components/ui/aspect-ratio";
import { cn } from "@/utils/cn";
import { templatesList } from "@/utils/namespaces/template";
import { motion } from "framer-motion";
import { useResumeStore } from "@/utils/stores/resume";
import { getSectionIcon } from "../shared/section-icon";

export function TemplateSection(){
  const setValue = useResumeStore((state) => state.setValue);
  const currentTemplate = useResumeStore((state) => state.resume.data.metadata.template);

  return (
    <section id="template" className="space-y-4 w-full">
      <header className="flex items-center gap-x-4">
        {getSectionIcon("template")}
        <h2 className="text-xl font-bold truncate">Template</h2>
      </header>

      <div className="grid grid-cols-2 gap-3">
        {templatesList.map((template, index) => (
          <AspectRatio key={template} ratio={1 / 1.4142}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: index * 0.1 } }}
              whileTap={{ scale: 0.98, transition: { duration: 0.1 } }}
              className={cn(
                "relative cursor-pointer rounded-sm ring-primary transition-all hover:ring-2",
                currentTemplate === template && "ring-2",
              )}
              onClick={() => setValue("metadata.template", template)}
            >
              <img 
                src={`/templates/jpg/${template}.jpg`} 
                alt={template} 
                className="rounded-sm object-cover w-full h-full"
              />
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-background/80">
                <p className="absolute inset-x-0 bottom-2 text-center text-sm font-medium capitalize text-primary">
                  {template}
                </p>
              </div>
            </motion.div>
          </AspectRatio>
        ))}
      </div>
    </section>
  );
};