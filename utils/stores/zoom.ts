import { create } from 'zustand'

type ZoomType = 'ZOOM_IN' | 'ZOOM_OUT' | 'RESET_VIEW' | 'CENTER_VIEW' | null

interface ZoomState {
  type: ZoomType
  setZoomType: (type: ZoomType) => void
}

export const useZoomStore = create<ZoomState>((set) => ({
  type: null,
  setZoomType: (type) => set({ type }),
}))