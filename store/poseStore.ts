import { create } from 'zustand';
import { Pose, CapturedPhoto, CustomPose } from '@/types/pose';

interface PoseStore {
  selectedPose: Pose | CustomPose | null;
  capturedPhotos: CapturedPhoto[];
  showOverlay: boolean;
  overlayOpacity: number;
  customPose: CustomPose | null;
  setSelectedPose: (pose: Pose | CustomPose | null) => void;
  addCapturedPhoto: (photo: CapturedPhoto) => void;
  removeCapturedPhoto: (id: string) => void;
  toggleOverlay: () => void;
  setOverlayOpacity: (opacity: number) => void;
  setCustomPose: (pose: CustomPose) => void;
}

export const usePoseStore = create<PoseStore>((set) => ({
  selectedPose: null,
  capturedPhotos: [],
  showOverlay: true,
  overlayOpacity: 0.3,
  customPose: null,
  setSelectedPose: (pose) => set({ selectedPose: pose }),
  addCapturedPhoto: (photo) =>
    set((state) => ({
      capturedPhotos: [photo, ...state.capturedPhotos],
    })),
  removeCapturedPhoto: (id) =>
    set((state) => ({
      capturedPhotos: state.capturedPhotos.filter((p) => p.id !== id),
    })),
  toggleOverlay: () => set((state) => ({ showOverlay: !state.showOverlay })),
  setOverlayOpacity: (opacity) => set({ overlayOpacity: opacity }),
  setCustomPose: (pose) =>
    set({
      customPose: pose,
      selectedPose: pose,
    }),
}));
