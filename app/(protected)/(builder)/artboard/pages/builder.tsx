"use client"
import { SectionKey } from "@/utils/schema";
import { Template } from "@/utils/namespaces/template";
import { pageSizeMap } from "@/utils/namespaces/page";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import { ReactZoomPanPinchRef, TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { Page } from "../components/resume-page";
import getTemplate from "../templates";
import { useResumeStore } from "@/utils/stores/resume";
import { useZoomStore } from "@/utils/stores/zoom";
import { useDebouncedCallback } from 'use-debounce';
import { updateResumeAction } from "@/lib/adapter/actions";
import { useToast } from '@/lib/hooks/use-toast';
import { ResumeDto } from "@/lib/dto/resume";

interface BuilderLayoutProps {
  userId: string
}

export default function BuilderLayout({userId}: BuilderLayoutProps) {
  const transformRef = useRef<ReactZoomPanPinchRef>(null);
  const format = useResumeStore((state) => state.resume.data.metadata.page.format);
  const layout = useResumeStore((state) => state.resume.data.metadata.layout);
  const template = useResumeStore((state) => state.resume.data.metadata.template as Template);
  const zoomType = useZoomStore((state) => state.type)
  const setZoomType = useZoomStore((state) => state.setZoomType)
  const resume = useResumeStore((state) => state.resume);
  const resumeId = useResumeStore((state) => state.resume.id);
  const { toast } = useToast();
  const MM_TO_PX = 3.78;

  const Template = useMemo(() => getTemplate(template), [template]);

  useEffect(() => {
    if (zoomType === "ZOOM_IN") {
      transformRef.current?.zoomIn(0.2) 
    };
    if (zoomType === "ZOOM_OUT") {
      transformRef.current?.zoomOut(0.2)
    };
    if (zoomType === "CENTER_VIEW") {
      transformRef.current?.centerView() 
    };
    if (zoomType === "RESET_VIEW") {
      transformRef.current?.resetTransform(0);
      setTimeout(() => transformRef.current?.centerView(0.6, 0), 10);
    }
    // Reset the zoom type after applying the zoom action
    setZoomType(null)
  }, [transformRef, zoomType, setZoomType]);

  // Debounced save function
  const debouncedSave = useDebouncedCallback(async (resumeData: ResumeDto) => {
    const response = await updateResumeAction(userId, resumeId as string, resumeData);
    
    if (!response.success) {
      toast({
        title: "Error saving changes",
        description: response.error || "Please try again later",
        variant: "destructive",
      });
    }
  }, 8000); // Debounce for 5 second

  // Watch for changes and trigger save
  useEffect(() => {
    debouncedSave(resume);
  }, [resume, debouncedSave]);

  return (
    <TransformWrapper
      ref={transformRef}
      centerOnInit
      maxScale={2}
      minScale={0.4}
      initialScale={0.6}
      limitToBounds={false}
    >
      <TransformComponent
        wrapperClass="!w-screen !h-screen"
        contentClass="grid items-start justify-center space-x-12 pointer-events-none"
        contentStyle={{
          //@ts-ignore
          width: `${layout.length * (pageSizeMap[format].width * MM_TO_PX + 42)}px`,
          height: `1000px`,
          gridTemplateColumns: `repeat(${layout.length}, 1fr)`,
        }}
      >
        <AnimatePresence>
          {/* @ts-ignore */}
          {layout.map((columns, pageIndex) => (
            <motion.div
              key={pageIndex}
              layout
              initial={{ opacity: 0, x: -200, y: 0 }}
              animate={{ opacity: 1, x: 0, transition: { delay: pageIndex * 0.3 } }}
              exit={{ opacity: 0, x: -200 }}
            >
              <Page mode="builder" pageNumber={pageIndex + 1}>
                <Template isFirstPage={pageIndex === 0} columns={columns as SectionKey[][]} />
              </Page>
            </motion.div>
          ))}
        </AnimatePresence>
      </TransformComponent>
    </TransformWrapper>
  );
};
