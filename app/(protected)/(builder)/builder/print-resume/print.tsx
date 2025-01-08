import { ResumeDto } from '@/lib/dto/resume';

export async function generatePDF (elementId: string, resume: ResumeDto, resumeId: string): Promise<void> {
    try {
      // Get the current URL for the preview page
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!
      console.log("BASE URL:", baseUrl)
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
        throw new Error(response.statusText);
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
    } catch (error) {
      console.error('Error downloading PDF:', error);
      throw error;
    }
};

