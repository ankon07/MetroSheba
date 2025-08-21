import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import Colors from '@/constants/colors';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Logo Section */}
      <View style={styles.logoSection}>
        <View style={styles.logo}>
          <Text style={styles.logoText}>🚇</Text>
        </View>
        <Text style={styles.appName}>Metro Rail</Text>
        <Text style={styles.tagline}>Your Smart Metro Companion</Text>
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>🎫</Text>
          <Text style={styles.featureText}>Book tickets easily</Text>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>🗺️</Text>
          <Text style={styles.featureText}>Real-time navigation</Text>
        </View>
        <View style={styles.feature}>
          <Text style={styles.featureIcon}>💳</Text>
          <Text style={styles.featureText}>Secure PIN-based login</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionSection}>
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push('/auth/pin-login' as any)}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => router.push('/auth/register' as any)}
        >
          <Text style={styles.registerButtonText}>Create Account</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
  },
  logoSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  logoText: {
    fontSize: 60,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  featuresSection: {
    paddingVertical: 40,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  featureText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  actionSection: {
    paddingBottom: 40,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  registerButton: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  registerButtonText: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: '600',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  skipButtonText: {
    color: '#666',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
