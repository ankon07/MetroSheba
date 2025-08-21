import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { db } from '@/lib/firebase';
import { ref, set, get, update } from 'firebase/database';

export interface BiometricAuthResult {
  success: boolean;
  error?: string;
  biometricType?: string;
}

class BiometricService {
  private static readonly BIOMETRIC_ENABLED_KEY = 'biometric_enabled';
  private static readonly USER_BIOMETRIC_KEY = 'user_biometric_data';
  private static readonly DEMO_MODE = __DEV__; // Enable demo mode in development

  /**
   * Check if biometric authentication is available on the device
   */
  static async isAvailable(): Promise<boolean> {
    try {
      // In demo mode, always return true for development
      if (this.DEMO_MODE) {
        return true;
      }
      
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      return hasHardware && isEnrolled;
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      // In demo mode, return true even if there's an error
      return this.DEMO_MODE;
    }
  }

  /**
   * Get available biometric types
   */
  static async getSupportedAuthenticationTypes(): Promise<LocalAuthentication.AuthenticationType[]> {
    try {
      // In demo mode, return Face ID as the supported type
      if (this.DEMO_MODE) {
        return [LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION];
      }
      
      return await LocalAuthentication.supportedAuthenticationTypesAsync();
    } catch (error) {
      console.error('Error getting supported authentication types:', error);
      // In demo mode, return Face ID even if there's an error
      return this.DEMO_MODE ? [LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION] : [];
    }
  }

  /**
   * Check if face recognition is available
   */
  static async isFaceRecognitionAvailable(): Promise<boolean> {
    try {
      const types = await this.getSupportedAuthenticationTypes();
      return types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION);
    } catch (error) {
      console.error('Error checking face recognition availability:', error);
      return false;
    }
  }

  /**
   * Authenticate using biometrics
   */
  static async authenticate(promptMessage: string = 'Authenticate to access your account'): Promise<BiometricAuthResult> {
    try {
      const isAvailable = await this.isAvailable();
      if (!isAvailable) {
        return {
          success: false,
          error: 'Biometric authentication is not available on this device'
        };
      }

      // In demo mode, simulate successful authentication
      if (this.DEMO_MODE) {
        // Simulate a small delay for realistic feel
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const types = await this.getSupportedAuthenticationTypes();
        const biometricType = this.getBiometricTypeName(types);
        
        return {
          success: true,
          biometricType
        };
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage,
        cancelLabel: 'Cancel',
        fallbackLabel: 'Use PIN instead',
        disableDeviceFallback: false,
      });

      if (result.success) {
        const types = await this.getSupportedAuthenticationTypes();
        const biometricType = types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION) 
          ? 'Face ID' 
          : types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)
          ? 'Fingerprint'
          : 'Biometric';

        return {
          success: true,
          biometricType
        };
      } else {
        return {
          success: false,
          error: result.error || 'Authentication failed'
        };
      }
    } catch (error) {
      console.error('Biometric authentication error:', error);
      return {
        success: false,
        error: 'Authentication failed due to an error'
      };
    }
  }

  /**
   * Enable biometric authentication for a user
   */
  static async enableBiometricAuth(userId: string): Promise<boolean> {
    try {
      // Save locally
      await AsyncStorage.setItem(this.BIOMETRIC_ENABLED_KEY, 'true');
      await AsyncStorage.setItem(this.USER_BIOMETRIC_KEY, userId);
      
      // Save to Firebase
      try {
        const userBiometricRef = ref(db, `user_biometric_settings/${userId}`);
        await set(userBiometricRef, {
          enabled: true,
          enabledAt: new Date().toISOString(),
          lastUsed: null
        });
      } catch (firebaseError) {
        console.error('Error saving biometric settings to Firebase:', firebaseError);
        // Continue even if Firebase fails
      }
      
      return true;
    } catch (error) {
      console.error('Error enabling biometric auth:', error);
      return false;
    }
  }

  /**
   * Disable biometric authentication
   */
  static async disableBiometricAuth(userId?: string): Promise<boolean> {
    try {
      // Get userId if not provided
      if (!userId) {
        const storedUserId = await AsyncStorage.getItem(this.USER_BIOMETRIC_KEY);
        userId = storedUserId || undefined;
      }
      
      // Remove from local storage
      await AsyncStorage.removeItem(this.BIOMETRIC_ENABLED_KEY);
      await AsyncStorage.removeItem(this.USER_BIOMETRIC_KEY);
      
      // Remove from Firebase
      if (userId) {
        try {
          const userBiometricRef = ref(db, `user_biometric_settings/${userId}`);
          await set(userBiometricRef, {
            enabled: false,
            disabledAt: new Date().toISOString()
          });
        } catch (firebaseError) {
          console.error('Error updating biometric settings in Firebase:', firebaseError);
          // Continue even if Firebase fails
        }
      }
      
      return true;
    } catch (error) {
      console.error('Error disabling biometric auth:', error);
      return false;
    }
  }

  /**
   * Check if biometric authentication is enabled for the app
   */
  static async isBiometricEnabled(): Promise<boolean> {
    try {
      const enabled = await AsyncStorage.getItem(this.BIOMETRIC_ENABLED_KEY);
      return enabled === 'true';
    } catch (error) {
      console.error('Error checking biometric enabled status:', error);
      return false;
    }
  }

  /**
   * Get the user ID associated with biometric authentication
   */
  static async getBiometricUserId(): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(this.USER_BIOMETRIC_KEY);
    } catch (error) {
      console.error('Error getting biometric user ID:', error);
      return null;
    }
  }

  /**
   * Get a user-friendly name for the biometric type
   */
  static getBiometricTypeName(types: LocalAuthentication.AuthenticationType[]): string {
    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return 'Face ID';
    } else if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return 'Fingerprint';
    } else if (types.includes(LocalAuthentication.AuthenticationType.IRIS)) {
      return 'Iris';
    } else {
      return 'Biometric';
    }
  }
}

export default BiometricService;
