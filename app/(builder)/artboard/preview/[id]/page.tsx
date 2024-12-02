import React from 'react'
import PreviewLayout from '../../pages/preview';
import { getPublicResume } from "@/lib/adapter/actions";
import { ResumeDto } from '@/lib/dto/resume';

type PreviewParams = {
  params: {
    id: string;
  };
};

export default async function ResumePreview({ params }: PreviewParams) {
  const { id } = params;
  const resume = await getPublicResume(id)

  return (
    // @ts-ignore
    <PreviewLayout resume={resume as ResumeDto} />
  )
}