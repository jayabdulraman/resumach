  'use client'
import { SectionKey } from "@/utils/schema";
import { Template } from "@/utils/namespaces/template";
import { useEffect, useMemo, useState } from "react";
import { Page } from "../components/resume-page";
import { useResumeStore } from "@/utils/stores/resume";
import getTemplate from "../templates";
import { ResumeDto } from "@/lib/dto/resume";
import { CircleNotch } from "@phosphor-icons/react";

type PreviewLayoutProps = {
  resume: ResumeDto;
};

export default function PreviewLayout({ resume }: PreviewLayoutProps){
  const [isLoading, setIsLoading] = useState(true);
  const layout = resume.data.metadata.layout
  const template = resume.data.metadata.template as Template
  const Template = useMemo(() => getTemplate(template), [template]);

  useEffect(() => {
    if (resume ) {
      useResumeStore.setState({ resume: resume as ResumeDto});
      useResumeStore.temporal.getState().clear();
      setIsLoading(false); // Set loading to false after state is set
    }
  }, [resume])

  if (isLoading) {
    return <CircleNotch className="animate-spin" />; // or a loading spinner
  }

  return (
    <>
      {/* @ts-ignore */}
      {layout.map((columns, pageIndex) => (
        <Page key={pageIndex} mode="preview" pageNumber={pageIndex + 1}>
          <Template isFirstPage={pageIndex === 0} columns={columns as SectionKey[][]} />
        </Page>
      ))}
    </>
  );
};
