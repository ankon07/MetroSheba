import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, QrCode } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/userStore';
import PinKeypad from '@/components/PinKeypad';
import PinDots from '@/components/PinDots';

export default function PinLoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUserStore();

  const handleNumberPress = (number: string) => {
    if (pin.length < 5) {
      setPin(prev => prev + number);
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleClear = () => {
    setPin('');
  };

  const handleLogin = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    if (pin.length !== 5) {
      Alert.alert('Error', 'Please enter your 5-digit PIN');
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

      {/* Logo and QR Code */}
      <View style={styles.topSection}>
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>🚇</Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.qrButton}>
          <QrCode size={32} color={Colors.primary} />
        </TouchableOpacity>
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

        {/* PIN Section */}
        <View style={styles.pinSection}>
          <Text style={styles.inputLabel}>Metro PIN</Text>
          <PinDots pinLength={pin.length} />
        </View>

        {/* Forgot PIN */}
        <TouchableOpacity style={styles.forgotPin}>
          <Text style={styles.forgotPinText}>Forgot PIN? Reset PIN</Text>
        </TouchableOpacity>

        {/* Login Button */}
        <TouchableOpacity
          style={[styles.loginButton, (isLoading || pin.length !== 5) && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={isLoading || pin.length !== 5}
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

      {/* PIN Keypad */}
      <PinKeypad
        onNumberPress={handleNumberPress}
        onBackspace={handleBackspace}
        onClear={handleClear}
      />

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
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 30,
  },
  qrButton: {
    padding: 8,
  },
  content: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 28,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
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
  pinSection: {
    marginBottom: 20,
  },
  forgotPin: {
    alignSelf: 'flex-start',
    marginBottom: 30,
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
