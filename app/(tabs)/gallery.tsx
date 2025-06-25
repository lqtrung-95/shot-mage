import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePoseStore } from '@/store/poseStore';
import { POSES } from '@/data/poses';
import { Trash2, Share2, Download } from 'lucide-react-native';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

const { width } = Dimensions.get('window');
const imageSize = (width - 60) / 2; // 2 columns with 20px margins and 20px gap

export default function GalleryScreen() {
  const { capturedPhotos, removeCapturedPhoto } = usePoseStore();
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const handleDeletePhoto = (photoId: string) => {
    Alert.alert('Delete Photo', 'Are you sure you want to delete this photo?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => removeCapturedPhoto(photoId),
      },
    ]);
  };

  const handleSharePhoto = async (photoUri: string) => {
    try {
      if (Platform.OS === 'web') {
        // For web, we can try to download the image
        const link = document.createElement('a');
        link.href = photoUri;
        link.download = `shotmate-photo-${Date.now()}.jpg`;
        link.click();
      } else {
        // Check if sharing is available
        const isAvailable = await Sharing.isAvailableAsync();

        if (isAvailable) {
          // Share directly
          await Sharing.shareAsync(photoUri);
        } else {
          // If sharing is not available, try to save to media library
          const { status } = await MediaLibrary.requestPermissionsAsync();

          if (status === 'granted') {
            await MediaLibrary.saveToLibraryAsync(photoUri);
            Alert.alert('Success', 'Photo saved to your media library');
          } else {
            Alert.alert(
              'Permission Required',
              'Please grant media library access to save photos'
            );
          }
        }
      }
    } catch (error) {
      console.error('Error sharing photo:', error);
      Alert.alert('Error', 'Failed to share photo');
    }
  };

  const getPoseForPhoto = (poseId?: string) => {
    return poseId ? POSES.find((pose) => pose.id === poseId) : null;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (capturedPhotos.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Gallery</Text>
          <Text style={styles.subtitle}>
            Your captured photos will appear here
          </Text>
        </View>

        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Photos Yet</Text>
          <Text style={styles.emptyText}>
            Start taking photos with pose guidance to build your gallery!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Gallery</Text>
        <Text style={styles.subtitle}>
          {capturedPhotos.length} photos captured
        </Text>
      </View>

      <ScrollView
        style={styles.galleryContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.photosGrid}>
          {capturedPhotos.map((photo) => {
            const pose = getPoseForPhoto(photo.poseId);
            return (
              <TouchableOpacity
                key={photo.id}
                style={[
                  styles.photoCard,
                  selectedPhoto === photo.id && styles.photoCardSelected,
                ]}
                onPress={() =>
                  setSelectedPhoto(selectedPhoto === photo.id ? null : photo.id)
                }
              >
                <Image
                  source={{ uri: photo.uri }}
                  style={styles.photoImage}
                  resizeMode="cover"
                />

                {selectedPhoto === photo.id && (
                  <View style={styles.photoOverlay}>
                    <View style={styles.photoActions}>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.shareButton]}
                        onPress={() => handleSharePhoto(photo.uri)}
                      >
                        <Share2 size={18} color="#FFFFFF" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.actionButton, styles.deleteButton]}
                        onPress={() => handleDeletePhoto(photo.id)}
                      >
                        <Trash2 size={18} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                <View style={styles.photoInfo}>
                  <Text style={styles.photoDate}>
                    {formatDate(photo.timestamp)}
                  </Text>
                  {pose && <Text style={styles.photoPose}>{pose.name}</Text>}
                </View>
              </TouchableOpacity>
            );
          })}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  galleryContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  photosGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
    paddingBottom: 100,
  },
  photoCard: {
    width: imageSize,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  photoCardSelected: {
    borderWidth: 2,
    borderColor: '#3B82F6',
  },
  photoImage: {
    width: '100%',
    height: imageSize * 1.2,
  },
  photoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButton: {
    backgroundColor: '#3B82F6',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },
  photoInfo: {
    padding: 12,
  },
  photoDate: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 2,
  },
  photoPose: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
});
