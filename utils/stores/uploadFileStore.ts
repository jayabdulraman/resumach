// useDocumentStore.ts
import { create } from 'zustand';

type Document = {
  id: string;
  name: string;
  type: string;
  file: File;
  text: string;
};

type DocumentStore = {
  documents: Document[] | [];
  setDocuments: (docs: Document[] | []) => void;
  addDocument: (doc: Document) => void;
  removeDocument: (id: string) => void;
};

export const useDocumentStore = create<DocumentStore>((set) => ({
  documents: [],
  setDocuments: (docs) => set({ documents: docs }),
  addDocument: (doc) => set((state) => ({ documents: [doc, ...state.documents] })),
  removeDocument: (id) => set((state) => ({ documents: state.documents.filter(doc => doc.id !== id) })),
}));
