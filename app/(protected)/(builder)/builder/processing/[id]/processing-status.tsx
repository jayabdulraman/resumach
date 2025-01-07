'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Panel, PanelGroup, PanelResizeHandle } from "@/components/ui/resizable-panel";
import { cn } from "@/utils/namespaces/style";
import { useBreakpoint } from "@/lib/hooks/use-breakpoint";
import { Sheet, SheetContent } from "@/components/ui";
import { createClient } from '@/utils/supabase/client';

interface ProcessingStatusProps {
  processingId: string;
}

export function ProcessingStatus({ processingId }: ProcessingStatusProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const { isDesktop } = useBreakpoint();
  const MAX_RETRIES = 3;

  const checkStatus = useCallback(async () => {
    try {
      const response = await fetch(`/api/resume/status/${processingId}`);
      if (!response.ok) throw new Error('Failed to fetch status');
      
      const data = await response.json();
      
      if (data.status === 'completed' && data.resumeId) {
        router.push(`/builder/${data.resumeId}`);
      } else if (data.status === 'failed') {
        setError(data.error || 'Processing failed');
        setIsRetrying(false);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsRetrying(false);
    }
  }, [processingId, router]);

  const handleRetry = async () => {
    if (retryCount >= MAX_RETRIES) return;
    setIsRetrying(true);
    setRetryCount(prev => prev + 1);
    setError(null);

    try {
      // First get the original processing details
      const supabase = createClient();
      const { data: processingEntry } = await supabase
        .from('resume_processing')
        .select('job_description, resume_text, metadata')
        .eq('id', processingId)
        .single();

      if (!processingEntry) {
        throw new Error('Could not find original processing details');
      }

      // Trigger reprocessing with all required data
      const formData = new FormData();
      formData.append('processingId', processingId);
      formData.append('jobDescription', processingEntry.job_description);
      formData.append('resumeText', processingEntry.resume_text);
      formData.append('userCurrentSubscription', processingEntry.metadata?.subscription_type || 'Free');

      const response = await fetch('/api/resume/create', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to retry processing');
      }

      const { processingResumeId } = await response.json();

      // Save the processingId for future reference
      if (processingResumeId) {
        localStorage.setItem('currentResumeProcessingId', processingResumeId);
      }

      // Start checking status again
      const interval = setInterval(checkStatus, 5000);
      return () => clearInterval(interval);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to retry');
      setIsRetrying(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [checkStatus]);

  const LoadingContent = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <h2 className="text-2xl font-semibold">Processing Your Resume</h2>
      <p className="text-muted-foreground">
        This may take up to a minute. Please don't close this page.
      </p>
      {retryCount > 0 && (
        <p className="text-sm text-muted-foreground">
          Retry attempt {retryCount} of {MAX_RETRIES}
        </p>
      )}
    </div>
  );

  const ErrorContent = () => (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      {retryCount >= MAX_RETRIES ? (
        <>
          <p className="text-destructive text-center">
            Unable to complete process after {MAX_RETRIES} tries!
          </p>
          <Button 
            variant="secondary"
            onClick={() => router.push('/dashboard')}
          >
            Return to Dashboard
          </Button>
        </>
      ) : (
        <>
          <p className="text-destructive">Error: {error}</p>
          <Button 
            variant="secondary"
            onClick={handleRetry}
            disabled={isRetrying}
          >
            {isRetrying ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Retrying...
              </>
            ) : (
              `Try Again (${retryCount + 1}/${MAX_RETRIES})`
            )}
          </Button>
        </>
      )}
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
          <PanelResizeHandle />
          <Panel defaultSize={40} className="overflow-hidden">
            {/* Main Content */}
            <div className="h-full">
              {error ? <ErrorContent /> : <LoadingContent />}
            </div>
          </Panel>
          <PanelResizeHandle />
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