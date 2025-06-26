import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { Stack, useRouter } from 'expo-router';
import { usePoseStore } from '../../store/poseStore';
import { CustomPose } from '../../types/pose';
import { Ionicons } from '@expo/vector-icons';

export default function CustomPoseScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [poseName, setPoseName] = useState('');
  const [opacity, setOpacity] = useState(0.7);
  const setCustomPose = usePoseStore((state) => state.setCustomPose);
  const router = useRouter();

  // Handle picking an image from the gallery
  const pickImage = async () => {
    setError(null);

    // Request permission to access the media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      setError('Permission to access media library is required!');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled) {
        setIsLoading(true);
        try {
          // Set the image directly
          setImage(result.assets[0].uri);
          setPoseName(`Custom Pose ${new Date().toLocaleTimeString()}`);
        } catch (err) {
          console.error('Error processing image:', err);
          setError('Failed to process the image. Please try again.');
        } finally {
          setIsLoading(false);
        }
      }
    } catch (err) {
      console.error('Error picking image:', err);
      setError('Failed to pick image. Please try again.');
      setIsLoading(false);
    }
  };

  // Save the custom pose
  const savePose = () => {
    if (image) {
      const newPose: CustomPose = {
        id: `custom-${Date.now()}`,
        name: poseName || `Custom Pose`,
        category: 'custom',
        description: 'My custom pose',
        difficulty: 'Medium',
        originalImage: image,
        overlayImage: image,
        tips: ['Position yourself like in the image'],
      };

      setCustomPose(newPose);

      Alert.alert('Success', 'Custom pose saved successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // Reset the state
            setImage(null);
            router.push('/');
          },
        },
      ]);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Stack.Screen
        options={{ title: 'Create Custom Pose', headerShown: false }}
      />

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Create Custom Pose</Text>
          <Text style={styles.subtitle}>
            Upload a photo to use as a pose reference
          </Text>
        </View>

        <View style={styles.content}>
          {!image ? (
            <TouchableOpacity
              style={styles.imagePlaceholder}
              onPress={pickImage}
            >
              <Ionicons name="image-outline" size={48} color="#888" />
              <Text style={styles.imagePlaceholderText}>
                Tap to select an image
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.imageContainer}>
              <Image source={{ uri: image }} style={styles.image} />

              {isLoading && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="large" color="#ffffff" />
                  <Text style={styles.loadingText}>Processing image...</Text>
                </View>
              )}
            </View>
          )}

          {error && <Text style={styles.errorText}>{error}</Text>}

          {image && (
            <View style={styles.controlsContainer}>
              <View style={styles.nameInputContainer}>
                <Text style={styles.inputLabel}>Pose Name:</Text>
                <TouchableOpacity
                  style={styles.nameDisplay}
                  onPress={() => {
                    Alert.prompt(
                      'Pose Name',
                      'Enter a name for your custom pose',
                      (text) => setPoseName(text),
                      'plain-text',
                      poseName
                    );
                  }}
                >
                  <Text style={styles.nameText}>{poseName}</Text>
                  <Ionicons name="pencil-outline" size={16} color="#3B82F6" />
                </TouchableOpacity>
              </View>

              <View style={styles.infoContainer}>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color="#666"
                />
                <Text style={styles.infoText}>
                  This image will be used as an overlay reference in the camera
                  view
                </Text>
              </View>
            </View>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.selectButton]}
              onPress={pickImage}
            >
              <Ionicons name="image-outline" size={20} color="#fff" />
              <Text style={styles.buttonText}>
                {image ? 'Choose Different Image' : 'Select Image'}
              </Text>
            </TouchableOpacity>

            {image && (
              <TouchableOpacity
                style={[styles.button, styles.saveButton]}
                onPress={savePose}
              >
                <Ionicons name="save-outline" size={20} color="#fff" />
                <Text style={styles.buttonText}>Save Pose</Text>
              </TouchableOpacity>
            )}
          </View>
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
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  content: {
    width: '100%',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111827',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 18,
    color: '#6B7280',
    marginBottom: 0,
    textAlign: 'center',
    lineHeight: 24,
  },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 3,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  imagePlaceholderText: {
    fontSize: 18,
    color: '#9CA3AF',
    marginTop: 16,
    fontWeight: '500',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 24,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 10,
    fontSize: 16,
  },
  controlsContainer: {
    width: '100%',
    marginBottom: 8,
  },
  nameInputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },
  nameDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  nameText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: '#EBF5FF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  infoText: {
    marginLeft: 12,
    fontSize: 15,
    color: '#1E40AF',
    flex: 1,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: 16,
    marginTop: 24,
    flexWrap: 'wrap',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 16,
    minWidth: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  selectButton: {
    backgroundColor: '#3B82F6',
  },
  saveButton: {
    backgroundColor: '#10B981',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '700',
    marginLeft: 8,
    letterSpacing: 0.3,
  },
  errorText: {
    color: '#f5365c',
    marginBottom: 15,
    textAlign: 'center',
  },
});
