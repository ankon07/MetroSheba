import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Modal,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { X, Camera as CameraIcon, RotateCcw } from 'lucide-react-native';
import Colors from '@/constants/colors';
import FaceDetectionService from '@/services/faceDetectionService';

const { width, height } = Dimensions.get('window');

interface FaceEnrollmentProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
  mode: 'enroll' | 'verify';
}

export default function FaceEnrollment({
  visible,
  onClose,
  onSuccess,
  userId,
  mode
}: FaceEnrollmentProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [type, setType] = useState<'front' | 'back'>('front');
  const [isProcessing, setIsProcessing] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (visible) {
      requestPermissions();
    }
  }, [visible]);

  const requestPermissions = async () => {
    const granted = await FaceDetectionService.requestCameraPermissions();
    setHasPermission(granted);
    
    if (!granted) {
      Alert.alert(
        'Camera Permission Required',
        'Please grant camera permission to use face authentication.',
        [
          { text: 'Cancel', onPress: onClose },
          { text: 'Settings', onPress: () => {
            // In a real app, you would open device settings
            onClose();
          }}
        ]
      );
    }
  };

  const takePicture = async () => {
    if (!cameraRef.current || isProcessing) return;

    setIsProcessing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: false,
      });

      if (mode === 'enroll') {
        await handleEnrollment(photo.uri);
      } else {
        await handleVerification(photo.uri);
      }
    } catch (error) {
      console.error('Error taking picture:', error);
      Alert.alert('Error', 'Failed to capture image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEnrollment = async (imageUri: string) => {
    const result = await FaceDetectionService.enrollFace(userId, imageUri);
    
    if (result.success) {
      Alert.alert(
        'Success!',
        'Your face has been successfully enrolled. You can now use face authentication to sign in.',
        [{ text: 'OK', onPress: () => {
          onSuccess();
          onClose();
        }}]
      );
    } else {
      Alert.alert('Enrollment Failed', result.error || 'Please try again.');
    }
  };

  const handleVerification = async (imageUri: string) => {
    const result = await FaceDetectionService.verifyFace(userId, imageUri);
    
    if (result.success) {
      onSuccess();
      onClose();
    } else {
      Alert.alert('Verification Failed', result.error || 'Please try again.');
    }
  };

  const handleFacesDetected = ({ faces }: { faces: any[] }) => {
    setFaceDetected(faces.length === 1);
  };

  // Simulate face detection for demo
  useEffect(() => {
    if (visible) {
      // Simulate face detection after a delay
      const timer = setTimeout(() => {
        setFaceDetected(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (hasPermission === null) {
    return null;
  }

  if (hasPermission === false) {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.text.primary} />
            </TouchableOpacity>
            <Text style={styles.title}>Camera Permission</Text>
          </View>
          <View style={styles.permissionContainer}>
            <Text style={styles.permissionText}>
              Camera access is required for face authentication.
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={requestPermissions}>
              <Text style={styles.retryButtonText}>Grant Permission</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.title}>
            {mode === 'enroll' ? 'Enroll Your Face' : 'Face Verification'}
          </Text>
          <TouchableOpacity
            style={styles.flipButton}
            onPress={() => setType(type === 'back' ? 'front' : 'back')}
          >
            <RotateCcw size={24} color="white" />
          </TouchableOpacity>
        </View>

        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={type}
        >
          <View style={styles.overlay}>
            {/* Face detection frame */}
            <View style={[
              styles.faceFrame,
              faceDetected && styles.faceFrameDetected
            ]}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>

            {/* Instructions */}
            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsText}>
                {mode === 'enroll' 
                  ? 'Position your face within the frame and tap capture'
                  : 'Look at the camera to verify your identity'
                }
              </Text>
              {faceDetected && (
                <Text style={styles.faceDetectedText}>
                  ✓ Face detected
                </Text>
              )}
            </View>
          </View>
        </CameraView>

        {/* Controls */}
        <View style={styles.controls}>
          <TouchableOpacity
            style={[
              styles.captureButton,
              (!faceDetected || isProcessing) && styles.captureButtonDisabled
            ]}
            onPress={takePicture}
            disabled={!faceDetected || isProcessing}
          >
            <CameraIcon size={32} color="white" />
          </TouchableOpacity>
        </View>

        {isProcessing && (
          <View style={styles.processingOverlay}>
            <Text style={styles.processingText}>
              {mode === 'enroll' ? 'Enrolling face...' : 'Verifying face...'}
            </Text>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  closeButton: {
    padding: 8,
  },
  flipButton: {
    padding: 8,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceFrame: {
    width: 250,
    height: 300,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 125,
    position: 'relative',
  },
  faceFrameDetected: {
    borderColor: '#4CAF50',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: 'white',
  },
  topLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    top: -2,
    right: -2,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  instructionsContainer: {
    position: 'absolute',
    bottom: 150,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  instructionsText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  faceDetectedText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
  controls: {
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonDisabled: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  permissionText: {
    color: Colors.text.primary,
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
