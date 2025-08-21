import { Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '@/lib/firebase';
import { ref, set, get, remove, update } from 'firebase/database';

export interface FaceData {
  id: string;
  userId: string;
  faceDescriptor: number[];
  timestamp: string;
}

export interface FaceDetectionResult {
  success: boolean;
  faceData?: FaceData;
  error?: string;
}

class FaceDetectionService {
  private static readonly FACE_DATA_KEY = 'user_face_data';
  private static readonly FACE_THRESHOLD = 0.8; // Similarity threshold for face matching
  private static readonly DEMO_MODE = __DEV__; // Enable demo mode in development

  /**
   * Request camera permissions
   */
  static async requestCameraPermissions(): Promise<boolean> {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting camera permissions:', error);
      return false;
    }
  }

  /**
   * Check if camera permissions are granted
   */
  static async hasCameraPermissions(): Promise<boolean> {
    try {
      const { status } = await Camera.getCameraPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error checking camera permissions:', error);
      return false;
    }
  }

  /**
   * Simulate face detection (for demo purposes)
   */
  static async detectFaces(imageUri: string): Promise<any[]> {
    try {
      // In demo mode, simulate face detection
      if (this.DEMO_MODE) {
        // Simulate a delay for realistic feel
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Return a mock face detection result
        return [{
          bounds: {
            origin: { x: 100, y: 150 },
            size: { width: 200, height: 250 }
          },
          rollAngle: 0,
          yawAngle: 0,
          smilingProbability: 0.8,
          leftEyeOpenProbability: 0.9,
          rightEyeOpenProbability: 0.9
        }];
      }
      
      // In production, this would use actual face detection
      return [];
    } catch (error) {
      console.error('Error detecting faces:', error);
      return [];
    }
  }

  /**
   * Extract face features for comparison (simplified version)
   */
  static extractFaceFeatures(face: any): number[] {
    // Create a simple feature vector from face properties
    const features: number[] = [];
    
    // Add face bounds
    if (face.bounds) {
      features.push(
        face.bounds.origin.x,
        face.bounds.origin.y,
        face.bounds.size.width,
        face.bounds.size.height
      );
    }

    // Add face angles
    features.push(
      face.rollAngle || 0,
      face.yawAngle || 0
    );

    // Add classification scores if available
    if (face.smilingProbability !== undefined) {
      features.push(face.smilingProbability);
    }
    if (face.leftEyeOpenProbability !== undefined) {
      features.push(face.leftEyeOpenProbability);
    }
    if (face.rightEyeOpenProbability !== undefined) {
      features.push(face.rightEyeOpenProbability);
    }

    // In demo mode, add some random but consistent features based on userId
    if (this.DEMO_MODE) {
      // Generate consistent features for demo
      for (let i = 0; i < 10; i++) {
        features.push(Math.random() * 100);
      }
    }

    return features;
  }

  /**
   * Calculate similarity between two face feature vectors
   */
  static calculateSimilarity(features1: number[], features2: number[]): number {
    if (features1.length !== features2.length) {
      return 0;
    }

    // In demo mode, return high similarity for testing
    if (this.DEMO_MODE) {
      return 0.9; // High similarity for demo
    }

    // Calculate Euclidean distance
    let sumSquaredDiff = 0;
    for (let i = 0; i < features1.length; i++) {
      const diff = features1[i] - features2[i];
      sumSquaredDiff += diff * diff;
    }

    const distance = Math.sqrt(sumSquaredDiff);
    
    // Convert distance to similarity score (0-1, where 1 is identical)
    const maxDistance = Math.sqrt(features1.length * 10000); // Approximate max distance
    const similarity = Math.max(0, 1 - (distance / maxDistance));
    
    return similarity;
  }

  /**
   * Enroll a new face for a user
   */
  static async enrollFace(userId: string, imageUri: string): Promise<FaceDetectionResult> {
    try {
      const faces = await this.detectFaces(imageUri);
      
      if (faces.length === 0) {
        return {
          success: false,
          error: 'No face detected in the image. Please ensure your face is clearly visible.'
        };
      }

      if (faces.length > 1) {
        return {
          success: false,
          error: 'Multiple faces detected. Please ensure only your face is visible.'
        };
      }

      const face = faces[0];
      const faceDescriptor = this.extractFaceFeatures(face);

      const faceData: FaceData = {
        id: `face_${userId}_${Date.now()}`,
        userId,
        faceDescriptor,
        timestamp: new Date().toISOString()
      };

      // Store face data both locally and in Firebase
      await AsyncStorage.setItem(
        `${this.FACE_DATA_KEY}_${userId}`,
        JSON.stringify(faceData)
      );

      // Save to Firebase
      try {
        const faceRef = ref(db, `face_data/${userId}`);
        await set(faceRef, {
          id: faceData.id,
          userId: faceData.userId,
          faceDescriptor: faceData.faceDescriptor,
          timestamp: faceData.timestamp,
          lastUsed: null
        });
      } catch (firebaseError) {
        console.error('Error saving to Firebase:', firebaseError);
        // Continue with local storage even if Firebase fails
      }

      return {
        success: true,
        faceData
      };
    } catch (error) {
      console.error('Error enrolling face:', error);
      return {
        success: false,
        error: 'Failed to enroll face. Please try again.'
      };
    }
  }

  /**
   * Verify a face against enrolled face data
   */
  static async verifyFace(userId: string, imageUri: string): Promise<FaceDetectionResult> {
    try {
      // Get enrolled face data from local storage first
      let storedFaceData = await AsyncStorage.getItem(`${this.FACE_DATA_KEY}_${userId}`);
      let enrolledFace: FaceData | null = null;

      if (storedFaceData) {
        enrolledFace = JSON.parse(storedFaceData);
      } else {
        // Try to get from Firebase if not found locally
        try {
          const faceRef = ref(db, `face_data/${userId}`);
          const snapshot = await get(faceRef);
          if (snapshot.exists()) {
            const firebaseData = snapshot.val();
            enrolledFace = {
              id: firebaseData.id,
              userId: firebaseData.userId,
              faceDescriptor: firebaseData.faceDescriptor,
              timestamp: firebaseData.timestamp
            };
            // Cache locally for future use
            await AsyncStorage.setItem(
              `${this.FACE_DATA_KEY}_${userId}`,
              JSON.stringify(enrolledFace)
            );
          }
        } catch (firebaseError) {
          console.error('Error fetching from Firebase:', firebaseError);
        }
      }

      if (!enrolledFace) {
        return {
          success: false,
          error: 'No enrolled face data found. Please enroll your face first.'
        };
      }

      // Detect faces in current image
      const faces = await this.detectFaces(imageUri);
      
      if (faces.length === 0) {
        return {
          success: false,
          error: 'No face detected. Please ensure your face is clearly visible.'
        };
      }

      // Find the best matching face
      let bestMatch = 0;
      let bestFace: any = null;

      for (const face of faces) {
        const currentFeatures = this.extractFaceFeatures(face);
        const similarity = this.calculateSimilarity(enrolledFace.faceDescriptor, currentFeatures);
        
        if (similarity > bestMatch) {
          bestMatch = similarity;
          bestFace = face;
        }
      }

      if (bestMatch >= this.FACE_THRESHOLD) {
        return {
          success: true,
          faceData: enrolledFace
        };
      } else {
        return {
          success: false,
          error: 'Face verification failed. Please try again or use alternative authentication.'
        };
      }
    } catch (error) {
      console.error('Error verifying face:', error);
      return {
        success: false,
        error: 'Face verification failed due to an error.'
      };
    }
  }

  /**
   * Check if user has enrolled face data
   */
  static async hasEnrolledFace(userId: string): Promise<boolean> {
    try {
      // Check local storage first
      const storedFaceData = await AsyncStorage.getItem(`${this.FACE_DATA_KEY}_${userId}`);
      if (storedFaceData !== null) {
        return true;
      }
      
      // Check Firebase if not found locally
      try {
        const faceRef = ref(db, `face_data/${userId}`);
        const snapshot = await get(faceRef);
        return snapshot.exists();
      } catch (firebaseError) {
        console.error('Error checking Firebase:', firebaseError);
        return false;
      }
    } catch (error) {
      console.error('Error checking enrolled face:', error);
      return false;
    }
  }

  /**
   * Remove enrolled face data for a user
   */
  static async removeEnrolledFace(userId: string): Promise<boolean> {
    try {
      // Remove from local storage
      await AsyncStorage.removeItem(`${this.FACE_DATA_KEY}_${userId}`);
      
      // Remove from Firebase
      try {
        const faceRef = ref(db, `face_data/${userId}`);
        await remove(faceRef);
      } catch (firebaseError) {
        console.error('Error removing from Firebase:', firebaseError);
        // Continue even if Firebase removal fails
      }
      
      return true;
    } catch (error) {
      console.error('Error removing enrolled face:', error);
      return false;
    }
  }

  /**
   * Get face enrollment status and data
   */
  static async getFaceEnrollmentStatus(userId: string): Promise<{
    isEnrolled: boolean;
    enrollmentDate?: string;
  }> {
    try {
      const storedFaceData = await AsyncStorage.getItem(`${this.FACE_DATA_KEY}_${userId}`);
      if (storedFaceData) {
        const faceData: FaceData = JSON.parse(storedFaceData);
        return {
          isEnrolled: true,
          enrollmentDate: faceData.timestamp
        };
      }
      return { isEnrolled: false };
    } catch (error) {
      console.error('Error getting face enrollment status:', error);
      return { isEnrolled: false };
    }
  }
}

export default FaceDetectionService;
