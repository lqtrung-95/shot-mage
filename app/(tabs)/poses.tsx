import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePoseStore } from '@/store/poseStore';
import { POSES, POSE_CATEGORIES } from '@/data/poses';
import { PoseCategory } from '@/types/pose';
import {
  User,
  Armchair,
  Smile,
  Zap,
  Palette,
  Check,
  Camera,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

const categoryIcons = {
  user: User,
  armchair: Armchair,
  smile: Smile,
  zap: Zap,
  palette: Palette,
} as const;

export default function PosesScreen() {
  const [selectedCategory, setSelectedCategory] = useState<
    PoseCategory | 'all'
  >('all');
  const { selectedPose, setSelectedPose } = usePoseStore();
  const router = useRouter();

  const filteredPoses =
    selectedCategory === 'all'
      ? POSES
      : POSES.filter((pose) => pose.category === selectedCategory);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return '#10B981';
      case 'Medium':
        return '#F59E0B';
      case 'Hard':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const goToCamera = () => {
    router.push('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pose Library</Text>
        <Text style={styles.subtitle}>
          Choose a pose to guide your photography
        </Text>
      </View>

      {/* Category Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
        style={styles.categoriesScroll}
      >
        <TouchableOpacity
          style={[
            styles.categoryButton,
            selectedCategory === 'all' && styles.categoryButtonActive,
          ]}
          onPress={() => setSelectedCategory('all')}
        >
          <Text
            style={[
              styles.categoryButtonText,
              selectedCategory === 'all' && styles.categoryButtonTextActive,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        {POSE_CATEGORIES.map((category) => {
          const IconComponent = categoryIcons[category.icon];
          return (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category.id as PoseCategory)}
            >
              <IconComponent
                size={18}
                color={selectedCategory === category.id ? '#FFFFFF' : '#6B7280'}
              />
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === category.id &&
                    styles.categoryButtonTextActive,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Selected Pose Action */}
      {selectedPose && (
        <View style={styles.selectedPoseAction}>
          <Text style={styles.selectedPoseText}>
            <Text style={styles.selectedPoseLabel}>Selected: </Text>
            {selectedPose.name}
          </Text>
          <TouchableOpacity style={styles.cameraButton} onPress={goToCamera}>
            <Camera size={18} color="#FFFFFF" />
            <Text style={styles.cameraButtonText}>Go to Camera</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Poses Grid */}
      <ScrollView
        style={styles.posesContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.posesGrid}>
          {filteredPoses.map((pose) => (
            <TouchableOpacity
              key={pose.id}
              style={[
                styles.poseCard,
                selectedPose?.id === pose.id && styles.poseCardSelected,
              ]}
              onPress={() => setSelectedPose(pose)}
            >
              <View style={styles.poseImageContainer}>
                <Image
                  source={{ uri: pose.silhouetteUrl }}
                  style={styles.poseImage}
                  resizeMode="contain"
                />
                {selectedPose?.id === pose.id && (
                  <View style={styles.selectedOverlay}>
                    <Check size={24} color="#FFFFFF" />
                  </View>
                )}
              </View>

              <View style={styles.poseInfo}>
                <Text style={styles.poseName}>{pose.name}</Text>
                <Text style={styles.poseDescription} numberOfLines={2}>
                  {pose.description}
                </Text>

                <View style={styles.poseMetadata}>
                  <View
                    style={[
                      styles.difficultyBadge,
                      { backgroundColor: getDifficultyColor(pose.difficulty) },
                    ]}
                  >
                    <Text style={styles.difficultyText}>{pose.difficulty}</Text>
                  </View>
                  <Text style={styles.categoryText}>
                    {POSE_CATEGORIES.find((c) => c.id === pose.category)?.name}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  categoriesScroll: {
    marginBottom: 20,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  categoryButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#6B7280',
  },
  categoryButtonTextActive: {
    color: '#FFFFFF',
  },
  posesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  posesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    paddingBottom: 100,
  },
  poseCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  poseCardSelected: {
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  poseImageContainer: {
    position: 'relative',
    height: 160,
    backgroundColor: '#F3F4F6',
  },
  poseImage: {
    width: '100%',
    height: '100%',
  },
  selectedOverlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  poseInfo: {
    padding: 12,
  },
  poseName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  poseDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  poseMetadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  difficultyText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  selectedPoseAction: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EBF5FF',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  selectedPoseText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#1E40AF',
    flex: 1,
  },
  selectedPoseLabel: {
    fontFamily: 'Inter-SemiBold',
  },
  cameraButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  cameraButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
});
