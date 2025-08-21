import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useUserStore } from '@/store/userStore';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
    pin: '',
    confirmPin: '',
  });
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUserStore();

  const handleRegister = async () => {
    // Validation
    if (!formData.firstName.trim()) {
      Alert.alert('Error', 'Please enter your first name');
      return;
    }

    if (!formData.lastName.trim()) {
      Alert.alert('Error', 'Please enter your last name');
      return;
    }

    if (!formData.phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    if (!formData.email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    if (formData.pin.length !== 5) {
      Alert.alert('Error', 'PIN must be 5 digits');
      return;
    }

    if (formData.pin !== formData.confirmPin) {
      Alert.alert('Error', 'PINs do not match');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const userData = {
        id: Date.now().toString(),
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phoneNumber,
        nationality: 'Bangladeshi',
        trips: 0,
        countries: 1,
        miles: 0,
        memberSince: new Date().toISOString().split('T')[0],
        membershipLevel: 'Standard' as const,
      };

      await login(userData);
      Alert.alert('Success', 'Account created successfully!', [
        { text: 'OK', onPress: () => router.replace('/(tabs)') }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatPhoneNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, '');
    
    if (cleaned.length > 0 && !cleaned.startsWith('88')) {
      return '+88' + cleaned;
    } else if (cleaned.startsWith('88')) {
      return '+' + cleaned;
    }
    
    return text;
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'phoneNumber' ? formatPhoneNumber(value) : value
    }));
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

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Logo Area */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>🚇</Text>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title}>Create Metro Rail{'\n'}Account</Text>
          
          {/* First Name */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>First Name</Text>
            <TextInput
              style={styles.textInput}
              value={formData.firstName}
              onChangeText={(text) => updateFormData('firstName', text)}
              placeholder="Enter your first name"
              placeholderTextColor="#666"
            />
          </View>

          {/* Last Name */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Last Name</Text>
            <TextInput
              style={styles.textInput}
              value={formData.lastName}
              onChangeText={(text) => updateFormData('lastName', text)}
              placeholder="Enter your last name"
              placeholderTextColor="#666"
            />
          </View>

          {/* Phone Number */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Mobile Number</Text>
            <TextInput
              style={styles.textInput}
              value={formData.phoneNumber}
              onChangeText={(text) => updateFormData('phoneNumber', text)}
              placeholder="+88 01315206061"
              placeholderTextColor="#666"
              keyboardType="phone-pad"
              maxLength={17}
            />
          </View>

          {/* Email */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.textInput}
              value={formData.email}
              onChangeText={(text) => updateFormData('email', text)}
              placeholder="Enter your email"
              placeholderTextColor="#666"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* PIN */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Create Metro PIN</Text>
            <View style={styles.pinInputContainer}>
              <TextInput
                style={styles.pinInput}
                value={formData.pin}
                onChangeText={(text) => updateFormData('pin', text)}
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

          {/* Confirm PIN */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>Confirm Metro PIN</Text>
            <View style={styles.pinInputContainer}>
              <TextInput
                style={styles.pinInput}
                value={formData.confirmPin}
                onChangeText={(text) => updateFormData('confirmPin', text)}
                placeholder="Re-enter 5-digit PIN"
                placeholderTextColor="#666"
                secureTextEntry={!showConfirmPin}
                keyboardType="numeric"
                maxLength={5}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowConfirmPin(!showConfirmPin)}
              >
                {showConfirmPin ? (
                  <EyeOff size={20} color={Colors.primary} />
                ) : (
                  <Eye size={20} color={Colors.primary} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Register Button */}
          <TouchableOpacity
            style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text style={styles.registerButtonText}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Already have an account? 
              <Text 
                style={styles.loginLink}
                onPress={() => router.push('/auth/login' as any)}
              > Login</Text>
            </Text>
          </View>
        </View>
      </ScrollView>
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
  scrollView: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
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
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
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
  textInput: {
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
  registerButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  loginLink: {
    color: Colors.primary,
    fontWeight: '500',
  },
});
