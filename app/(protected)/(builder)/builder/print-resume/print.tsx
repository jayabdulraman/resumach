import { ResumeDto } from '@/lib/dto/resume';

export async function generatePDF (elementId: string, resume: ResumeDto, resumeId: string): Promise<void> {
    try {
      // Get the current URL for the preview page
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!
      var previewUrl = `${baseUrl}/artboard/preview/${resumeId}`;
      const response = await fetch('/api/resume/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          previewUrl,
          elementId,
          resume,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        //@ts-ignore
        return { success: false, error: errorData.message || 'Failed to generate PDF' };
      }
  
      // Get the PDF blob
      const blob = await response.blob();
      
      // Create download link
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = resume.title;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      window.URL.revokeObjectURL(downloadUrl);
      // @ts-ignore
      return { success: true };
    } catch (error) {
      console.error('Error downloading PDF:', error);
      // @ts-ignore
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' };
    }
};

