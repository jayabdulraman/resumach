// @ts-ignore
import html2pdf from 'html2pdf.js';
import { usePDFStore } from '@/utils/stores/print';
import { ResumeDto } from '@/lib/dto/resume';

export const generatePDF = async (elementId: string, resume: ResumeDto, resumeId: string): Promise<void> => {
    const { setGenerating } = usePDFStore.getState();
    try {
      setGenerating(true);
      // Get the current URL
      const url = window.location.href;
    
      // Get the current URL for the preview page
      const baseUrl = window.location.origin;
      var previewUrl = `${baseUrl}/artboard/preview/${resumeId}`;
      console.log("previewUrl:", previewUrl)
      const response = await fetch('/api/pdf-api/', {
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
        throw new Error('PDF generation failed');
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
    } finally {
        setGenerating(false);
    }
};

