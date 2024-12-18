'use client'

import React, { useEffect, useState } from 'react'
import LeftSidebar from './sidebars/left';
import { RightSidebar } from "./sidebars/right";
import BuilderHeader from './_components/header';
import BuilderToolbar from './_components/toolbar';
import { useBuilderStore } from "@/utils/stores/builder";
import { useResumeStore } from "@/utils/stores/resume";
import { ResumeDto } from "@/lib/dto/resume";
import { Sheet, SheetContent } from "@/components/ui";
import { Panel, PanelGroup, PanelResizeHandle } from "@/components/ui/resizable-panel";
import { useBreakpoint } from "@/lib/hooks/use-breakpoint";
import { ResumeBuilder } from '../../artboard/resume-builder'
import { cn } from "@/utils/namespaces/style";
import { usePathname } from 'next/navigation'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'

type CreditPackagesTypes = {
  id: string;
  name: string;
  credits: number;
  price: number;
  popular: boolean;
  features: string[];
}

type UserDetails = {
  id: string;
  email: string;
}

export interface ResumeProps extends React.ComponentProps<'div'> {
  initialResume?: ResumeDto
  resumeId?: string
  user: UserDetails;
  credit_packages: CreditPackagesTypes[]
}

const onOpenAutoFocus = (event: Event) => {
  event.preventDefault();
};

export function ResumeBuilderComponent({ initialResume, resumeId, user, credit_packages }: ResumeProps) {
  const path = usePathname()
  const { isDesktop } = useBreakpoint();
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const sheet = useBuilderStore((state) => state.sheet);

  const leftSetSize = useBuilderStore((state) => state.panel.left.setSize);
  const rightSetSize = useBuilderStore((state) => state.panel.right.setSize);

  const leftHandle = useBuilderStore((state) => state.panel.left.handle);
  const rightHandle = useBuilderStore((state) => state.panel.right.handle);

  const [_, setNewResumeId] = useLocalStorage('newResumeId', resumeId)


  useEffect(() => {
    if (initialResume) {
      useResumeStore.setState({ resume: initialResume });
      useResumeStore.temporal.getState().clear();
      // setResume(initialResume.data)
      setIsDataLoaded(true);
    }
  }, [initialResume]);

  useEffect(() => {
    if (user) {
      if (!path.includes('builder') && initialResume) {
        window.history.replaceState({}, '', `/builder/${resumeId}`)
      }
    }
  }, [resumeId, path, user.id, initialResume])

  useEffect(() => {
    setNewResumeId(resumeId)
  })
  
  if (isDesktop) {
    return (
      <div className="relative size-full overflow-hidden">
        <PanelGroup direction="horizontal">
          <Panel
            minSize={25}
            maxSize={45}
            defaultSize={30}
            className={cn("z-10 bg-background", !leftHandle.isDragging && "transition-[flex]")}
            onResize={leftSetSize}
          >
            {isDataLoaded && <LeftSidebar />}
          </Panel>
          <PanelResizeHandle
            isDragging={leftHandle.isDragging}
            onDragging={leftHandle.setDragging}
          />
          <Panel defaultSize={40}>
            {/* Main Content */}
            <div className="absolute inset-0">
              {isDataLoaded && 
                <>
                  <BuilderHeader /> 
                  <ResumeBuilder userId={user.id as string} /> 
                  <BuilderToolbar />
                </>
              }
            </div>
          </Panel>
          <PanelResizeHandle
            isDragging={rightHandle.isDragging}
            onDragging={rightHandle.setDragging}
          />
          <Panel
            minSize={25}
            maxSize={45}
            defaultSize={30}
            className={cn("z-10 bg-background", !rightHandle.isDragging && "transition-[flex]")}
            onResize={rightSetSize}
          >
             {/* Right Sidebar */}
             {isDataLoaded && <RightSidebar user={user} credit_packages={credit_packages} />}
          </Panel>
        </PanelGroup>
      </div>
    );
  }


  return (
    // <div className="flex-1 grid md:grid-cols-[400px_1fr_300px] gap-4 p-4 bg-background h-[calc(100vh-64px)]">
    <div className="relative">
      <Sheet open={sheet.left.open} onOpenChange={sheet.left.setOpen}>
        <SheetContent
          side="left"
          showClose={false}
          className="top-16 p-0 sm:max-w-xl"
          onOpenAutoFocus={onOpenAutoFocus}
        >
          {isDataLoaded && <LeftSidebar />}
        </SheetContent>
      </Sheet>
       {/* Main Content */}
       <div className="absolute inset-0">
          {isDataLoaded && 
            <>
              <BuilderHeader /> 
              <ResumeBuilder userId={user.id as string} /> 
              <BuilderToolbar /> 
            </>
          }
       </div>
      <Sheet open={sheet.right.open} onOpenChange={sheet.right.setOpen}>
        <SheetContent
          side="right"
          showClose={false}
          className="top-16 p-0 sm:max-w-xl"
          onOpenAutoFocus={onOpenAutoFocus}
        >
          {/* Right Sidebar */}
          {isDataLoaded && <RightSidebar user={user} credit_packages={credit_packages} />}
        </SheetContent>
      </Sheet>
    </div>
  )
}