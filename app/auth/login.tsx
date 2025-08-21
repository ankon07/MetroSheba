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
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/userStore';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUserStore();

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
});
