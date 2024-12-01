import { create } from 'zustand';

interface PDFState {
    isGenerating: boolean;
    setGenerating: (state: boolean) => void;
  }
  
export const usePDFStore = create<PDFState>((set) => ({
    isGenerating: false,
    setGenerating: (state) => set({ isGenerating: state }),
  }));