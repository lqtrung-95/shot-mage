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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <Stack.Screen options={{ title: 'Create Custom Pose' }} />

      <View style={styles.content}>
        <Text style={styles.title}>Create Custom Pose</Text>
        <Text style={styles.subtitle}>
          Upload a photo to use as a pose reference
        </Text>

        {!image ? (
          <TouchableOpacity style={styles.imagePlaceholder} onPress={pickImage}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  content: {
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#111',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: '#888',
    marginTop: 12,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#e0e0e0',
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
    marginBottom: 24,
  },
  nameInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginRight: 8,
    color: '#333',
  },
  nameDisplay: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  nameText: {
    fontSize: 16,
    color: '#333',
  },
  infoContainer: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 150,
  },
  selectButton: {
    backgroundColor: '#5e72e4',
  },
  saveButton: {
    backgroundColor: '#2dce89',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  errorText: {
    color: '#f5365c',
    marginBottom: 15,
    textAlign: 'center',
  },
});
