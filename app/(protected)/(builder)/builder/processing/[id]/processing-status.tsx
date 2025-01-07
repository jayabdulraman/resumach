'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui';

interface ProcessingStatusProps {
  processingId: string;
}

export function ProcessingStatus({ processingId }: ProcessingStatusProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log("Processing ID:", processingId)
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/resume/status/${processingId}`);
        if (!response.ok) throw new Error('Failed to fetch status');
        
        const data = await response.json();
        
        if (data.status === 'completed' && data.resumeId) {
          router.push(`/builder/${data.resumeId}`);
        } else if (data.status === 'failed') {
          router.push(`/dashboard?error=${encodeURIComponent(data.error || 'Processing failed')}`);
        }
        // If still processing, continue polling
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
    };

    const interval = setInterval(checkStatus, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, [processingId, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <h2 className="text-2xl font-semibold">Processing Your Resume</h2>
      <p className="text-muted-foreground">
        This may take a minute or two. Please don't close this page.
      </p>
      {error && (
       <div className="flex flex-col items-center space-y-4">
        <p className="text-destructive">
          Error: {error}
        </p>
        <Button 
          variant="default"
          onClick={() => router.push('/dashboard')}
        >
          Return to Dashboard
        </Button>
      </div>
      )}
    </div>
  );
}