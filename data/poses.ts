import { Pose } from '@/types/pose';

export const POSES: Pose[] = [
  // Standing poses
  {
    id: 'standing-1',
    name: 'Classic Stand',
    category: 'standing',
    description: 'Basic standing pose with good posture',
    difficulty: 'Easy',
    silhouetteUrl:
      'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
    tips: ['Keep shoulders back', 'Stand tall', 'Relax your arms'],
  },
  {
    id: 'standing-2',
    name: 'Hand on Hip',
    category: 'standing',
    description: 'Confident pose with one hand on hip',
    difficulty: 'Easy',
    silhouetteUrl:
      'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400',
    tips: ['Place hand on hip', 'Shift weight to one leg', 'Smile naturally'],
  },
  {
    id: 'standing-3',
    name: 'Arms Crossed',
    category: 'confident',
    description: 'Strong pose with crossed arms',
    difficulty: 'Easy',
    silhouetteUrl:
      'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    tips: ['Cross arms comfortably', 'Keep posture straight', 'Look confident'],
  },

  // Sitting poses
  {
    id: 'sitting-1',
    name: 'Casual Sit',
    category: 'sitting',
    description: 'Relaxed sitting position',
    difficulty: 'Easy',
    silhouetteUrl:
      'https://images.pexels.com/photos/1040881/pexels-photo-1040881.jpeg?auto=compress&cs=tinysrgb&w=400',
    tips: ['Sit naturally', 'Keep back straight', 'Hands on lap or chair'],
  },
  {
    id: 'sitting-2',
    name: 'Leaning Forward',
    category: 'sitting',
    description: 'Engaged sitting pose leaning slightly forward',
    difficulty: 'Medium',
    silhouetteUrl:
      'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400',
    tips: ['Lean forward slightly', 'Rest elbows on knees', 'Look engaged'],
  },

  // Casual poses
  {
    id: 'casual-1',
    name: 'Looking Away',
    category: 'casual',
    description: 'Natural pose looking to the side',
    difficulty: 'Easy',
    silhouetteUrl:
      'https://images.pexels.com/photos/1040883/pexels-photo-1040883.jpeg?auto=compress&cs=tinysrgb&w=400',
    tips: ['Look to the side', 'Keep expression natural', 'Relax shoulders'],
  },
  {
    id: 'casual-2',
    name: 'Hands in Pockets',
    category: 'casual',
    description: 'Relaxed pose with hands in pockets',
    difficulty: 'Easy',
    silhouetteUrl:
      'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=400',
    tips: ['Put hands in pockets', 'Stand naturally', 'Smile subtly'],
  },

  // Creative poses
  {
    id: 'creative-1',
    name: 'Thinking Pose',
    category: 'creative',
    description: 'Thoughtful pose with hand on chin',
    difficulty: 'Medium',
    silhouetteUrl:
      'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=400',
    tips: ['Place hand on chin', 'Look thoughtful', 'Tilt head slightly'],
  },
  {
    id: 'creative-2',
    name: 'Dynamic Gesture',
    category: 'creative',
    description: 'Expressive pose with gesturing hands',
    difficulty: 'Hard',
    silhouetteUrl:
      'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=400',
    tips: ['Use expressive gestures', 'Be animated', 'Show personality'],
  },
];

export const POSE_CATEGORIES = [
  { id: 'standing', name: 'Standing', icon: 'user' as const },
  { id: 'sitting', name: 'Sitting', icon: 'armchair' as const },
  { id: 'casual', name: 'Casual', icon: 'smile' as const },
  { id: 'confident', name: 'Confident', icon: 'zap' as const },
  { id: 'creative', name: 'Creative', icon: 'palette' as const },
];
