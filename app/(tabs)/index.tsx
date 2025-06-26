import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  Image,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePoseStore } from '@/store/poseStore';
import {
  FlipHorizontal,
  Settings,
  Camera as CameraIcon,
  Eye,
  EyeOff,
  SlidersHorizontal,
  Lightbulb,
  Check,
  X,
  ZoomIn,
  ZoomOut,
  MoveHorizontal,
  MoveVertical,
  RefreshCw,
  Menu,
  RotateCcw,
  RotateCw,
  FlipVertical,
  Rotate3D,
} from 'lucide-react-native';
import * as MediaLibrary from 'expo-media-library';
import Slider from '@react-native-community/slider';
import { useRouter } from 'expo-router';
import PoseSilhouette from '@/components/PoseSilhouette';
import { CustomPose } from '@/types/pose';

export default function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>('front');
  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();
  const [showOverlayMenu, setShowOverlayMenu] = useState(false);
  const [showOpacitySlider, setShowOpacitySlider] = useState(false);
  const [showScaleSlider, setShowScaleSlider] = useState(false);
  const [showPositionControls, setShowPositionControls] = useState(false);
  const [showRotationControls, setShowRotationControls] = useState(false);
  const [showZDegreeControls, setShowZDegreeControls] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [overlayScale, setOverlayScale] = useState(1);
  const [overlayOffsetX, setOverlayOffsetX] = useState(0);
  const [overlayOffsetY, setOverlayOffsetY] = useState(0);
  const [overlayRotation, setOverlayRotation] = useState(0);
  const [overlayZRotation, setOverlayZRotation] = useState(0);
  const [overlayFlipY, setOverlayFlipY] = useState(false);
  const [rotationInputValue, setRotationInputValue] = useState('0');
  const [zRotationInputValue, setZRotationInputValue] = useState('0');
  const [overlayFlipX, setOverlayFlipX] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

  const {
    selectedPose,
    showOverlay,
    overlayOpacity,
    toggleOverlay,
    setOverlayOpacity,
    addCapturedPhoto,
  } = usePoseStore();

  // Check if any menu is currently open
  const isAnyMenuOpen =
    showOverlayMenu ||
    showOpacitySlider ||
    showScaleSlider ||
    showPositionControls ||
    showRotationControls ||
    showZDegreeControls ||
    showTips;

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionTitle}>Camera Access Required</Text>
          <Text style={styles.permissionText}>
            ShotMate needs camera access to help you take better photos with
            pose guidance.
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={requestPermission}
          >
            <Text style={styles.permissionButtonText}>
              Grant Camera Permission
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === 'back' ? 'front' : 'back'));
  };

  const takePicture = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
      });

      if (photo) {
        setCapturedPhoto(photo.uri);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to take picture. Please try again.');
    }
  };

  const savePhoto = async () => {
    if (!capturedPhoto) return;

    try {
      // Request media library permission if not granted
      if (Platform.OS !== 'web' && !mediaPermission?.granted) {
        const { status } = await requestMediaPermission();
        if (status !== 'granted') {
          Alert.alert(
            'Permission required',
            'Please grant media library access to save photos.'
          );
          return;
        }
      }

      // Save to device gallery if on mobile
      if (Platform.OS !== 'web') {
        await MediaLibrary.saveToLibraryAsync(capturedPhoto);
      }

      // Add to our store
      addCapturedPhoto({
        id: Date.now().toString(),
        uri: capturedPhoto,
        poseId: selectedPose?.id,
        timestamp: Date.now(),
      });

      Alert.alert('Photo Saved!', 'Your photo has been saved successfully.', [
        { text: 'View in Gallery', onPress: () => router.push('/gallery') },
        { text: 'Take Another', onPress: () => setCapturedPhoto(null) },
      ]);
    } catch (error) {
      console.error('Error saving photo:', error);
      Alert.alert('Error', 'Failed to save photo. Please try again.');
    }
  };

  const discardPhoto = () => {
    setCapturedPhoto(null);
  };

  const resetOverlayAdjustments = () => {
    setOverlayScale(1);
    setOverlayOffsetX(0);
    setOverlayOffsetY(0);
    setOverlayRotation(0);
    setOverlayZRotation(0);
    setRotationInputValue('0');
    setZRotationInputValue('0');
    setOverlayFlipY(false);
    setOverlayFlipX(false);
  };

  const closeAllMenus = () => {
    setShowOverlayMenu(false);
    setShowOpacitySlider(false);
    setShowScaleSlider(false);
    setShowPositionControls(false);
    setShowRotationControls(false);
    setShowZDegreeControls(false);
    setShowTips(false);
  };

  // If we have a captured photo, show the preview screen
  if (capturedPhoto) {
    return (
      <View style={styles.container}>
        <Image
          source={{ uri: capturedPhoto }}
          style={styles.previewImage}
          resizeMode="contain"
        />

        <View style={styles.previewControls}>
          <TouchableOpacity
            style={[styles.previewButton, styles.discardButton]}
            onPress={discardPhoto}
          >
            <X size={24} color="#FFFFFF" />
            <Text style={styles.previewButtonText}>Retake</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.previewButton, styles.saveButton]}
            onPress={savePhoto}
          >
            <Check size={24} color="#FFFFFF" />
            <Text style={styles.previewButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        ratio="16:9"
      >
        {/* Background overlay for closing menus */}
        {isAnyMenuOpen && (
          <TouchableOpacity
            style={styles.backgroundOverlay}
            activeOpacity={1}
            onPress={closeAllMenus}
          />
        )}

        {/* Pose Overlay */}
        {selectedPose && showOverlay && (
          <View
            style={[
              styles.overlayContainer,
              {
                transform: [
                  { translateX: overlayOffsetX },
                  { translateY: overlayOffsetY },
                  { scale: overlayScale },
                  { rotate: `${overlayRotation}deg` },
                  { rotateZ: `${overlayZRotation}deg` },
                  { scaleY: overlayFlipY ? -1 : 1 },
                  { scaleX: overlayFlipX ? -1 : 1 },
                ],
              },
            ]}
          >
            {selectedPose.overlayImage ? (
              // If the pose has an overlay image (new approach), use that
              <Image
                source={{ uri: selectedPose.overlayImage }}
                style={[styles.poseOverlay, { opacity: overlayOpacity }]}
                resizeMode="contain"
              />
            ) : 'silhouetteUrl' in selectedPose ? (
              // If the pose has a silhouette URL (standard poses)
              <Image
                source={{ uri: selectedPose.silhouetteUrl }}
                style={[styles.poseOverlay, { opacity: overlayOpacity }]}
                resizeMode="contain"
              />
            ) : selectedPose.silhouetteData ? (
              // If the pose has silhouette data (old custom poses)
              <PoseSilhouette
                paths={selectedPose.silhouetteData.paths}
                circles={selectedPose.silhouetteData.circles}
                width={400}
                height={600}
                opacity={overlayOpacity}
              />
            ) : (
              // Fallback for custom poses without silhouette data
              <Image
                source={{ uri: selectedPose.originalImage }}
                style={[styles.poseOverlay, { opacity: overlayOpacity }]}
                resizeMode="contain"
              />
            )}
          </View>
        )}

        {/* Top Controls */}
        <View
          style={[
            styles.topControls,
            isAnyMenuOpen && styles.topControlsHidden,
          ]}
        >
          <TouchableOpacity
            style={styles.controlButton}
            onPress={toggleCameraFacing}
          >
            <FlipHorizontal size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {selectedPose && (
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => setShowOverlayMenu(!showOverlayMenu)}
            >
              <Menu size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )}

          {selectedPose && (
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => {
                setShowTips(!showTips);
                setShowOverlayMenu(false);
                setShowOpacitySlider(false);
                setShowScaleSlider(false);
                setShowPositionControls(false);
                setShowRotationControls(false);
                setShowZDegreeControls(false);
              }}
            >
              <Lightbulb size={24} color="#FFFFFF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Overlay Menu */}
        {showOverlayMenu && selectedPose && (
          <View style={styles.overlayMenuContainer}>
            <View style={styles.controlHeader}>
              <Text style={styles.menuTitle}>Overlay Controls</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowOverlayMenu(false)}
              >
                <X size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.menuOptions}>
              <TouchableOpacity
                style={styles.menuOption}
                onPress={() => {
                  toggleOverlay();
                  setShowOverlayMenu(false);
                }}
              >
                {showOverlay ? (
                  <Eye size={24} color="#FFFFFF" />
                ) : (
                  <EyeOff size={24} color="#FFFFFF" />
                )}
                <Text style={styles.menuOptionText}>
                  {showOverlay ? 'Hide Overlay' : 'Show Overlay'}
                </Text>
              </TouchableOpacity>

              {showOverlay && (
                <>
                  <TouchableOpacity
                    style={styles.menuOption}
                    onPress={() => {
                      setShowOpacitySlider(true);
                      setShowOverlayMenu(false);
                      setShowScaleSlider(false);
                      setShowPositionControls(false);
                      setShowRotationControls(false);
                    }}
                  >
                    <SlidersHorizontal size={24} color="#FFFFFF" />
                    <Text style={styles.menuOptionText}>Adjust Opacity</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuOption}
                    onPress={() => {
                      setShowScaleSlider(true);
                      setShowOverlayMenu(false);
                      setShowOpacitySlider(false);
                      setShowPositionControls(false);
                      setShowRotationControls(false);
                    }}
                  >
                    <ZoomIn size={24} color="#FFFFFF" />
                    <Text style={styles.menuOptionText}>Adjust Size</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuOption}
                    onPress={() => {
                      setShowPositionControls(true);
                      setShowOverlayMenu(false);
                      setShowOpacitySlider(false);
                      setShowScaleSlider(false);
                      setShowRotationControls(false);
                    }}
                  >
                    <MoveHorizontal size={24} color="#FFFFFF" />
                    <Text style={styles.menuOptionText}>Adjust Position</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuOption}
                    onPress={() => {
                      setShowRotationControls(true);
                      setShowOverlayMenu(false);
                      setShowOpacitySlider(false);
                      setShowScaleSlider(false);
                      setShowPositionControls(false);
                      setShowZDegreeControls(false);
                    }}
                  >
                    <RotateCw size={24} color="#FFFFFF" />
                    <Text style={styles.menuOptionText}>Adjust Rotation</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.menuOption}
                    onPress={() => {
                      setShowZDegreeControls(true);
                      setShowOverlayMenu(false);
                      setShowOpacitySlider(false);
                      setShowScaleSlider(false);
                      setShowPositionControls(false);
                      setShowRotationControls(false);
                    }}
                  >
                    <Rotate3D size={24} color="#FFFFFF" />
                    <Text style={styles.menuOptionText}>Adjust Z-Rotation</Text>
                  </TouchableOpacity>

                  {(overlayScale !== 1 ||
                    overlayOffsetX !== 0 ||
                    overlayOffsetY !== 0 ||
                    overlayRotation !== 0 ||
                    overlayZRotation !== 0 ||
                    overlayFlipY !== false ||
                    overlayFlipX !== false) && (
                    <TouchableOpacity
                      style={styles.menuOption}
                      onPress={() => {
                        resetOverlayAdjustments();
                        setShowOverlayMenu(false);
                      }}
                    >
                      <RefreshCw size={24} color="#FFFFFF" />
                      <Text style={styles.menuOptionText}>Reset All</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
          </View>
        )}

        {/* Opacity Slider */}
        {showOpacitySlider && showOverlay && (
          <View style={styles.sliderContainer}>
            <View style={styles.controlHeader}>
              <Text style={styles.sliderLabel}>Overlay Opacity</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowOpacitySlider(false)}
              >
                <X size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0.1}
              maximumValue={0.9}
              step={0.1}
              value={overlayOpacity}
              onValueChange={setOverlayOpacity}
              minimumTrackTintColor="#3B82F6"
              maximumTrackTintColor="#FFFFFF"
              thumbTintColor="#3B82F6"
            />
          </View>
        )}

        {/* Scale Slider */}
        {showScaleSlider && showOverlay && (
          <View style={styles.sliderContainer}>
            <View style={styles.controlHeader}>
              <Text style={styles.sliderLabel}>Overlay Size</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowScaleSlider(false)}
              >
                <X size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <Slider
              style={styles.slider}
              minimumValue={0.5}
              maximumValue={1.5}
              step={0.05}
              value={overlayScale}
              onValueChange={setOverlayScale}
              minimumTrackTintColor="#3B82F6"
              maximumTrackTintColor="#FFFFFF"
              thumbTintColor="#3B82F6"
            />
          </View>
        )}

        {/* Position Controls */}
        {showPositionControls && showOverlay && (
          <View style={styles.positionControlsContainer}>
            <View style={styles.controlHeader}>
              <Text style={styles.sliderLabel}>Adjust Position</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowPositionControls(false)}
              >
                <X size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.positionButtonsRow}>
              <TouchableOpacity
                style={styles.positionButton}
                onPress={() => setOverlayOffsetY(overlayOffsetY - 10)}
              >
                <Text style={styles.positionButtonText}>↑</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.positionButtonsRow}>
              <TouchableOpacity
                style={styles.positionButton}
                onPress={() => setOverlayOffsetX(overlayOffsetX - 10)}
              >
                <Text style={styles.positionButtonText}>←</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.positionButton, styles.resetPositionButton]}
                onPress={resetOverlayAdjustments}
              >
                <Text style={styles.positionButtonText}>Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.positionButton}
                onPress={() => setOverlayOffsetX(overlayOffsetX + 10)}
              >
                <Text style={styles.positionButtonText}>→</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.positionButtonsRow}>
              <TouchableOpacity
                style={styles.positionButton}
                onPress={() => setOverlayOffsetY(overlayOffsetY + 10)}
              >
                <Text style={styles.positionButtonText}>↓</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Rotation Controls */}
        {showRotationControls && showOverlay && (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.rotationControlsContainer}
          >
            <View style={styles.controlHeader}>
              <Text style={styles.sliderLabel}>Adjust Rotation</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowRotationControls(false)}
              >
                <X size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.positionButtonsRow}>
              <TouchableOpacity
                style={styles.positionButton}
                onPress={() => {
                  const newRotation = overlayRotation - 5;
                  setOverlayRotation(newRotation);
                  setRotationInputValue(String(newRotation));
                }}
              >
                <RotateCcw size={24} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.positionButton, styles.resetPositionButton]}
                onPress={() => {
                  setOverlayRotation(0);
                  setRotationInputValue('0');
                  setOverlayFlipY(false);
                  setOverlayFlipX(false);
                }}
              >
                <Text style={styles.positionButtonText}>Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.positionButton}
                onPress={() => {
                  const newRotation = overlayRotation + 5;
                  setOverlayRotation(newRotation);
                  setRotationInputValue(String(newRotation));
                }}
              >
                <RotateCw size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Precise rotation input */}
            <View style={styles.rotationInputContainer}>
              <Text style={styles.rotationText}>Rotation: </Text>
              <TextInput
                style={styles.rotationInput}
                value={rotationInputValue}
                onChangeText={setRotationInputValue}
                onBlur={() => {
                  const angle = parseInt(rotationInputValue) || 0;
                  setOverlayRotation(angle);
                  setRotationInputValue(String(angle));
                }}
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor="#CCCCCC"
              />
              <Text style={styles.rotationText}>°</Text>
            </View>

            {/* Flip controls */}
            <View style={styles.flipControlsContainer}>
              <TouchableOpacity
                style={[
                  styles.flipButton,
                  overlayFlipY && { backgroundColor: 'rgba(59, 130, 246, 1)' },
                ]}
                onPress={() => setOverlayFlipY((prev) => !prev)}
              >
                <FlipVertical size={24} color="#FFFFFF" />
                <Text style={styles.flipButtonText}>Flip Vertical</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.flipButton,
                  overlayFlipX && { backgroundColor: 'rgba(59, 130, 246, 1)' },
                ]}
                onPress={() => setOverlayFlipX((prev) => !prev)}
              >
                <FlipHorizontal size={24} color="#FFFFFF" />
                <Text style={styles.flipButtonText}>Flip Horizontal</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        )}

        {/* Z-Degree Rotation Controls */}
        {showZDegreeControls && showOverlay && (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.rotationControlsContainer}
          >
            <View style={styles.controlHeader}>
              <Text style={styles.sliderLabel}>Adjust Z-Rotation</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowZDegreeControls(false)}
              >
                <X size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View style={styles.positionButtonsRow}>
              <TouchableOpacity
                style={styles.positionButton}
                onPress={() => {
                  const newRotation = overlayZRotation - 5;
                  setOverlayZRotation(newRotation);
                  setZRotationInputValue(String(newRotation));
                }}
              >
                <RotateCcw size={24} color="#FFFFFF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.positionButton, styles.resetPositionButton]}
                onPress={() => {
                  setOverlayZRotation(0);
                  setZRotationInputValue('0');
                }}
              >
                <Text style={styles.positionButtonText}>Reset</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.positionButton}
                onPress={() => {
                  const newRotation = overlayZRotation + 5;
                  setOverlayZRotation(newRotation);
                  setZRotationInputValue(String(newRotation));
                }}
              >
                <RotateCw size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {/* Precise Z-rotation input */}
            <View style={styles.rotationInputContainer}>
              <Text style={styles.rotationText}>Z-Rotation: </Text>
              <TextInput
                style={styles.rotationInput}
                value={zRotationInputValue}
                onChangeText={setZRotationInputValue}
                onBlur={() => {
                  const angle = parseInt(zRotationInputValue) || 0;
                  setOverlayZRotation(angle);
                  setZRotationInputValue(String(angle));
                }}
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor="#CCCCCC"
              />
              <Text style={styles.rotationText}>°</Text>
            </View>
          </KeyboardAvoidingView>
        )}

        {/* Tips Panel */}
        {showTips && selectedPose && (
          <View style={styles.tipsContainer}>
            <View style={styles.controlHeader}>
              <Text style={styles.tipsTitle}>Tips for {selectedPose.name}</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowTips(false)}
              >
                <X size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.tipsScrollView}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.tipsScrollContent}
            >
              {selectedPose.tips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <View style={styles.tipBullet} />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Bottom Controls */}
        <View style={styles.bottomControls}>
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <View style={styles.captureButtonInner}>
              <CameraIcon size={32} color="#3B82F6" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Pose Name at Bottom */}
        {selectedPose && (
          <View style={styles.poseNameContainer}>
            <Text style={styles.poseName}>{selectedPose.name}</Text>
          </View>
        )}
      </CameraView>

      {!selectedPose && (
        <View style={styles.noPoseContainer}>
          <Text style={styles.noPoseText}>
            Select a pose from the Poses tab to get started with guided
            photography!
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F9FAFB',
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  camera: {
    flex: 1,
  },
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  poseOverlay: {
    width: '90%',
    height: '90%',
  },
  topControls: {
    position: 'absolute',
    top: 60,
    right: 20,
    flexDirection: 'column',
    gap: 12,
    zIndex: 15,
  },
  controlButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 5,
  },
  poseNameContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  poseName: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    opacity: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  poseDescription: {
    color: '#D1D5DB',
    fontSize: 14,
    textAlign: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPoseContainer: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
    padding: 16,
    borderRadius: 12,
  },
  noPoseText: {
    color: '#FFFFFF',
    fontWeight: '500',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  overlayMenuContainer: {
    position: 'absolute',
    top: 120,
    right: 20,
    width: 220,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 16,
    borderRadius: 12,
    zIndex: 40,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
  },
  menuTitle: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    flex: 1,
  },
  menuOptions: {
    marginTop: 8,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  menuOptionText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 12,
  },
  sliderContainer: {
    position: 'absolute',
    top: 140,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 16,
    borderRadius: 12,
    zIndex: 40,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
  },
  sliderLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    flex: 1,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  positionControlsContainer: {
    position: 'absolute',
    top: 140,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    zIndex: 40,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
  },
  positionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8,
    width: '100%',
    gap: 24,
  },
  positionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(59, 130, 246, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  positionButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 24,
  },
  resetPositionButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
    width: 80,
  },
  rotationControlsContainer: {
    position: 'absolute',
    top: 140,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    zIndex: 40,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
  },
  rotationText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 12,
    fontWeight: '500',
  },
  tipsContainer: {
    position: 'absolute',
    top: 140,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    padding: 16,
    borderRadius: 12,
    maxHeight: '50%',
    zIndex: 40,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 10,
  },
  tipsTitle: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 18,
    flex: 1,
  },
  tipsScrollView: {
    maxHeight: 200,
  },
  tipsScrollContent: {
    paddingVertical: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipBullet: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
    marginRight: 8,
  },
  tipText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  previewContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'space-between',
  },
  previewImage: {
    flex: 1,
    width: '100%',
  },
  previewControls: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  previewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    width: '45%',
    gap: 8,
  },
  discardButton: {
    backgroundColor: '#EF4444',
  },
  saveButton: {
    backgroundColor: '#10B981',
  },
  previewButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  controlHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  closeButton: {
    padding: 4,
  },
  rotationInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 12,
  },
  rotationInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: 60,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 8,
  },
  flipControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
    width: '100%',
  },
  flipButton: {
    backgroundColor: 'rgba(59, 130, 246, 0.6)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  flipButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    marginTop: 4,
  },
  backgroundOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 25,
  },
  topControlsHidden: {
    zIndex: 5,
  },
});
