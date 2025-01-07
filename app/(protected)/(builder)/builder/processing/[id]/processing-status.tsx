'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Panel, PanelGroup, PanelResizeHandle } from "@/components/ui/resizable-panel";
import { cn } from "@/utils/namespaces/style";
import { useBreakpoint } from "@/lib/hooks/use-breakpoint";
import { Sheet, SheetContent } from "@/components/ui";

interface ProcessingStatusProps {
  processingId: string;
}

export function ProcessingStatus({ processingId }: ProcessingStatusProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const { isDesktop } = useBreakpoint();

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/resume/status/${processingId}`);
        if (!response.ok) throw new Error('Failed to fetch status');
        
        const data = await response.json();
        
        if (data.status === 'completed' && data.resumeId) {
          router.push(`/builder/${data.resumeId}`);
        } else if (data.status === 'failed') {
          setError(data.error || 'Processing failed');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    };

    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [processingId, router]);

  const LoadingContent = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <h2 className="text-2xl font-semibold">Processing Your Resume</h2>
      <p className="text-muted-foreground">
        This may take up to a minute. Please don't close this page.
      </p>
    </div>
  );

  const ErrorContent = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <p className="text-destructive">Opps! Ran into an issue! Please try again!</p>
      <Button 
        variant="secondary"
        onClick={() => router.push('/dashboard')}
      >
        Return to Dashboard
      </Button>
    </div>
  );

  if (isDesktop) {
    return (
      <div className="relative size-full overflow-hidden overflow-y-hidden">
        <PanelGroup direction="horizontal" className="h-screen">
          <Panel
            minSize={25}
            maxSize={45}
            defaultSize={30}
            className="z-10 bg-background transition-[flex] overflow-hidden"
          >
            {/* Left Sidebar Skeleton */}
            <div className="h-full p-4 space-y-4">
              <div className="space-y-2">
                <div className="h-8 bg-muted rounded animate-pulse w-3/4" />
                <div className="h-32 bg-muted rounded animate-pulse" />
                <div className="h-8 bg-muted rounded animate-pulse w-1/4 ml-auto" />
              </div>
              <div className="space-y-2">
                <div className="h-8 bg-muted rounded animate-pulse w-3/4" />
                <div className="h-32 bg-muted rounded animate-pulse" />
                <div className="h-8 bg-muted rounded animate-pulse w-1/4 ml-auto" />
              </div>
              <div className="space-y-2">
                <div className="h-8 bg-muted rounded animate-pulse w-3/4" />
                <div className="h-32 bg-muted rounded animate-pulse" />
                <div className="h-8 bg-muted rounded animate-pulse w-1/4 ml-auto" />
              </div>
            </div>
          </Panel>
          <Panel defaultSize={40} className="overflow-hidden">
            {/* Main Content */}
            <div className="h-full">
              {error ? <ErrorContent /> : <LoadingContent />}
            </div>
          </Panel>
          <Panel
            minSize={25}
            maxSize={45}
            defaultSize={30}
            className="z-10 bg-background transition-[flex] overflow-hidden"
          >
            {/* Right Sidebar Skeleton */}
            <div className="h-full p-4 space-y-4">
              <div className="space-y-2">
                  <div className="h-8 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-36 bg-muted rounded animate-pulse" />
                </div>
                <div className="space-y-2">
                  <div className="h-8 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-36 bg-muted rounded animate-pulse" />
                  <div className="h-8 bg-muted rounded animate-pulse w-1/4 ml-auto" />
                </div>
                <div className="space-y-2">
                  <div className="h-8 bg-muted rounded animate-pulse w-3/4" />
                  <div className="h-36 bg-muted rounded animate-pulse" />
                  <div className="h-8 bg-muted rounded animate-pulse w-1/4 ml-auto" />
                </div>
            </div>
          </Panel>
        </PanelGroup>
      </div>
    );
  }

  // Mobile view
  return (
    <div className="relative">
      <Sheet>
        <SheetContent side="left" className="top-16 p-0 sm:max-w-xl">
          {/* Left Sidebar Skeleton */}
          <div className="h-full p-4 space-y-4">
            <div className="h-8 bg-muted rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
              <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
            </div>
          </div>
        </SheetContent>
      </Sheet>
      
      {/* Main Content */}
      <div className="absolute inset-0">
        {error ? <ErrorContent /> : <LoadingContent />}
      </div>

      <Sheet>
        <SheetContent side="right" className="top-16 p-0 sm:max-w-xl">
          {/* Right Sidebar Skeleton */}
          <div className="h-full p-4 space-y-4">
            <div className="h-8 bg-muted rounded animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
              <div className="h-4 bg-muted rounded animate-pulse w-1/2" />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}