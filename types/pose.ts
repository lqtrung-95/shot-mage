export interface Pose {
  id: string;
  name: string;
  category: PoseCategory;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  silhouetteUrl: string;
  overlayImage?: string;
  tips: string[];
}

export interface CustomPose {
  id: string;
  name: string;
  category: 'custom';
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  silhouetteData?: {
    paths: string[];
    circles: { cx: number; cy: number; r: number }[];
  };
  originalImage: string;
  overlayImage?: string;
  tips: string[];
}

export type PoseCategory =
  | 'standing'
  | 'sitting'
  | 'casual'
  | 'confident'
  | 'creative'
  | 'custom';

export interface CapturedPhoto {
  id: string;
  uri: string;
  poseId?: string;
  timestamp: number;
}
