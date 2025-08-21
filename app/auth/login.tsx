import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Eye, EyeOff, Scan } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import BiometricService from '@/services/biometricService';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricType, setBiometricType] = useState('');
  const { login, loginWithBiometric, isBiometricEnabled } = useUserStore();

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      console.log('Checking biometric availability...');
      const available = await BiometricService.isAvailable();
      console.log('Biometric available:', available);
      
      // In development mode, always show Face ID option
      const shouldShowBiometric = available || __DEV__;
      setBiometricAvailable(shouldShowBiometric);

      if (shouldShowBiometric) {
        const enabled = await isBiometricEnabled();
        console.log('Biometric enabled:', enabled);
        setBiometricEnabled(enabled);

        const types = await BiometricService.getSupportedAuthenticationTypes();
        const typeName = BiometricService.getBiometricTypeName(types);
        console.log('Biometric type:', typeName);
        setBiometricType(typeName || 'Face ID');
      }
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      // In development mode, still show Face ID even if there's an error
      if (__DEV__) {
        setBiometricAvailable(true);
        setBiometricType('Face ID');
      }
    }
  };

  const handleBiometricLogin = async () => {
    if (!biometricEnabled) {
      Alert.alert('Face ID Not Set Up', 'Please set up Face ID in your device settings first.');
      return;
    }

    setIsLoading(true);
    try {
      const success = await loginWithBiometric();
      if (success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Authentication Failed', 'Face ID authentication was cancelled or failed.');
      }
    } catch (error) {
      Alert.alert('Error', 'Face ID authentication failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSetupFaceID = async () => {
    Alert.alert(
      `Set up ${biometricType}`,
      `To use ${biometricType} for quick login, you need to first log in with your PIN and then set up face authentication in your profile settings.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Continue',
          onPress: () => {
            // Focus on the PIN input to encourage user to complete login first
            Alert.alert(
              'Complete Login First',
              'Please enter your phone number and PIN to log in, then you can set up Face ID in your profile settings.',
              [{ text: 'OK' }]
            );
          },
        },
      ]
    );
  };

  const handleLogin = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    if (pin.length !== 5) {
      Alert.alert('Error', 'PIN must be 5 digits');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, accept any 5-digit PIN
      const userData = {
        id: 'u1',
        firstName: 'User',
        lastName: 'Name',
        email: 'user@example.com',
        phone: phoneNumber,
        nationality: 'Bangladeshi',
        trips: 0,
        countries: 1,
        miles: 0,
        memberSince: new Date().toISOString().split('T')[0],
        membershipLevel: 'Standard' as const,
      };

      await login(userData);
      
      // Check if biometric authentication is available and not yet enabled
      if (biometricAvailable && !biometricEnabled) {
        Alert.alert(
          'Enable Face ID?',
          `Would you like to enable ${biometricType} for quick sign in next time?`,
          [
            {
              text: 'Not Now',
              style: 'cancel',
            },
            {
              text: 'Enable',
              onPress: async () => {
                try {
                  const { enableBiometricAuth } = useUserStore.getState();
                  const success = await enableBiometricAuth();
                  if (success) {
                    setBiometricEnabled(true);
                  }
                } catch (error) {
                  console.error('Error enabling biometric auth:', error);
                }
              },
            },
          ]
        );
      }
      
      router.replace('/(tabs)');
    } catch (error) {
      Alert.alert('Error', 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhoneNumber = (text: string) => {
    // Remove all non-digits
    const cleaned = text.replace(/\D/g, '');
    
    // Add +88 prefix if not present
    if (cleaned.length > 0 && !cleaned.startsWith('88')) {
      return '+88' + cleaned;
    } else if (cleaned.startsWith('88')) {
      return '+' + cleaned;
    }
    
    return text;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={Colors.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.languageButton}>
          <Text style={styles.languageText}>English</Text>
        </TouchableOpacity>
      </View>

      {/* Logo Area */}
      <View style={styles.logoContainer}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>🚇</Text>
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Login to your{'\n'}Metro Rail Account</Text>
        
        {/* Phone Number Input */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Mobile Number</Text>
          <TextInput
            style={styles.phoneInput}
            value={phoneNumber}
            onChangeText={(text) => setPhoneNumber(formatPhoneNumber(text))}
            placeholder="+88 01315206061"
            placeholderTextColor="#666"
            keyboardType="phone-pad"
            maxLength={17}
          />
        </View>

        {/* PIN Input */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Metro PIN</Text>
          <View style={styles.pinInputContainer}>
            <TextInput
              style={styles.pinInput}
              value={pin}
              onChangeText={setPin}
              placeholder="Enter 5-digit PIN"
              placeholderTextColor="#666"
              secureTextEntry={!showPin}
              keyboardType="numeric"
              maxLength={5}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPin(!showPin)}
            >
              {showPin ? (
                <EyeOff size={20} color={Colors.primary} />
              ) : (
                <Eye size={20} color={Colors.primary} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Forgot PIN */}
        <TouchableOpacity style={styles.forgotPin}>
          <Text style={styles.forgotPinText}>Forgot PIN? Reset PIN</Text>
        </TouchableOpacity>

        {/* Biometric Login Button */}
        {biometricAvailable && (
          <>
            <TouchableOpacity
              style={[styles.biometricButton, isLoading && styles.biometricButtonDisabled]}
              onPress={biometricEnabled ? handleBiometricLogin : handleSetupFaceID}
              disabled={isLoading}
            >
              <Scan size={24} color={Colors.primary} />
              <Text style={styles.biometricButtonText}>
                {biometricEnabled 
                  ? `Sign in with ${biometricType}`
                  : `Set up ${biometricType} Login`
                }
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>
          </>
        )}

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <Text style={styles.loginButtonText}>
            {isLoading ? 'Logging in...' : 'Next'}
          </Text>
          <ArrowLeft 
            size={20} 
            color="white" 
            style={{ transform: [{ rotate: '180deg' }] }} 
          />
        </TouchableOpacity>
      </View>

      {/* Register Link */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          New user? 
          <Text 
            style={styles.registerLink}
            onPress={() => router.push('/auth/register' as any)}
          > Register</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  languageButton: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  languageText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 32,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  phoneInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: 'white',
  },
  pinInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: 'white',
  },
  pinInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  eyeButton: {
    padding: 12,
  },
  forgotPin: {
    alignSelf: 'flex-start',
    marginBottom: 40,
  },
  forgotPinText: {
    color: Colors.primary,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  registerLink: {
    color: Colors.primary,
    fontWeight: '500',
  },
  biometricButton: {
    borderWidth: 2,
    borderColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    backgroundColor: 'white',
  },
  biometricButtonDisabled: {
    opacity: 0.6,
  },
  biometricButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  dividerText: {
    marginHorizontal: 16,
    color: '#666',
    fontSize: 14,
  },
});
