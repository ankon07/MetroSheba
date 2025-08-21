import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, ScrollView, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bell, Mail, DollarSign, Lightbulb, MessageSquare, Moon, Type, Package, Scan } from "lucide-react-native";
import { useRouter } from "expo-router";
import SettingsItem from "@/components/SettingsItem";
import { useUserStore } from "@/store/userStore";
import Colors from "@/constants/colors";
import { AppSettings } from "@/types";
import BiometricService from "@/services/biometricService";
import FaceDetectionService from "@/services/faceDetectionService";
import FaceEnrollment from "@/components/FaceEnrollment";

export default function SettingsScreen() {
  const router = useRouter();
  const { settings, updateSettings, enableBiometricAuth, disableBiometricAuth, isBiometricEnabled, user } = useUserStore();
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [biometricType, setBiometricType] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showFaceEnrollment, setShowFaceEnrollment] = useState(false);
  const [faceEnrolled, setFaceEnrolled] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const available = await BiometricService.isAvailable();
      setBiometricAvailable(available);

      if (available) {
        const enabled = await isBiometricEnabled();
        setBiometricEnabled(enabled);

        const types = await BiometricService.getSupportedAuthenticationTypes();
        const typeName = BiometricService.getBiometricTypeName(types);
        setBiometricType(typeName);
      }
    } catch (error) {
      console.error('Error checking biometric availability:', error);
    }
  };

  const handleBiometricToggle = async (value: boolean) => {
    if (isLoading || !user) return;

    if (value) {
      // Check if face is already enrolled
      const hasEnrolledFace = await FaceDetectionService.hasEnrolledFace(user.id);
      if (!hasEnrolledFace) {
        // Show face enrollment modal
        setShowFaceEnrollment(true);
        return;
      }
    }

    setIsLoading(true);
    try {
      if (value) {
        const success = await enableBiometricAuth();
        if (success) {
          setBiometricEnabled(true);
          Alert.alert('Success', `${biometricType} authentication has been enabled for quick sign in.`);
        } else {
          Alert.alert('Error', `Failed to enable ${biometricType} authentication. Please try again.`);
        }
      } else {
        const success = await disableBiometricAuth();
        if (success) {
          setBiometricEnabled(false);
          // Also remove face data
          if (user) {
            await FaceDetectionService.removeEnrolledFace(user.id);
          }
          Alert.alert('Success', `${biometricType} authentication has been disabled.`);
        } else {
          Alert.alert('Error', `Failed to disable ${biometricType} authentication. Please try again.`);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while updating biometric settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFaceEnrollmentSuccess = async () => {
    if (!user) return;
    
    // Enable biometric authentication after successful face enrollment
    const success = await enableBiometricAuth();
    if (success) {
      setBiometricEnabled(true);
      setFaceEnrolled(true);
    }
  };

  const fontSizeOptions: { label: string; value: "small" | "medium" | "large" }[] = [
    { label: "Small", value: "small" },
    { label: "Medium", value: "medium" },
    { label: "Large", value: "large" },
  ];

  const handleFontSizeChange = () => {
    // In a real app, this would open a modal or picker
    const currentIndex = fontSizeOptions.findIndex(
      (option) => option.value === settings.fontSize
    );
    const nextIndex = (currentIndex + 1) % fontSizeOptions.length;
    updateSettings({ fontSize: fontSizeOptions[nextIndex].value });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <SettingsItem
            title="Push Notifications"
            description="Receive alerts about your bookings"
            icon={<Bell size={20} color={Colors.primary} />}
            hasToggle
            toggleValue={settings.pushNotifications}
            onToggleChange={(value) => updateSettings({ pushNotifications: value })}
          />
          
          <SettingsItem
            title="Email Notifications"
            description="Receive booking confirmations and updates"
            icon={<Mail size={20} color="#FF9800" />}
            hasToggle
            toggleValue={settings.emailNotifications}
            onToggleChange={(value) => updateSettings({ emailNotifications: value })}
          />
          
          <SettingsItem
            title="Price Alerts"
            description="Get notified about price drops"
            icon={<DollarSign size={20} color="#4CAF50" />}
            hasToggle
            toggleValue={settings.priceAlerts}
            onToggleChange={(value) => updateSettings({ priceAlerts: value })}
          />
          
          <SettingsItem
            title="Travel Tips"
            description="Receive travel recommendations"
            icon={<Lightbulb size={20} color="#9C27B0" />}
            hasToggle
            toggleValue={settings.travelTips}
            onToggleChange={(value) => updateSettings({ travelTips: value })}
          />
          
          <SettingsItem
            title="Marketing Communications"
            description="Receive promotional offers and news"
            icon={<MessageSquare size={20} color="#F44336" />}
            hasToggle
            toggleValue={settings.marketingCommunications}
            onToggleChange={(value) => updateSettings({ marketingCommunications: value })}
          />
        </View>

        {/* Security Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>
          
          <SettingsItem
            title={biometricAvailable ? `${biometricType} Authentication` : 'Biometric Authentication'}
            description={biometricAvailable 
              ? `Use ${biometricType} for quick and secure sign in` 
              : 'Biometric authentication not available on this device'
            }
            icon={<Scan size={20} color={biometricAvailable ? Colors.primary : '#999'} />}
            hasToggle={biometricAvailable}
            toggleValue={biometricEnabled}
            onToggleChange={biometricAvailable ? handleBiometricToggle : undefined}
            onPress={!biometricAvailable ? () => {
              Alert.alert(
                'Biometric Authentication',
                'Biometric authentication is not available on this device. Please ensure your device supports Face ID, Touch ID, or fingerprint authentication and that it is set up in your device settings.',
                [{ text: 'OK' }]
              );
            } : undefined}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Display</Text>
          
          <SettingsItem
            title="Dark Mode"
            description="Switch between light and dark themes"
            icon={<Moon size={20} color="#5C6BC0" />}
            hasToggle
            toggleValue={settings.darkMode}
            onToggleChange={(value) => updateSettings({ darkMode: value })}
          />
          
          <SettingsItem
            title="Font Size"
            description={`Adjust the size of text in the app (${
              settings.fontSize.charAt(0).toUpperCase() + settings.fontSize.slice(1)
            })`}
            icon={<Type size={20} color="#00BCD4" />}
            onPress={handleFontSizeChange}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Services</Text>
          
          <SettingsItem
            title="Lost & Found"
            description="Report or search for lost items"
            icon={<Package size={20} color={Colors.warning} />}
            onPress={() => router.push("/lost-found/index")}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <SettingsItem
            title="Terms of Service"
            onPress={() => router.push("/legal/terms")}
          />
          
          <SettingsItem
            title="Privacy Policy"
            onPress={() => router.push("/legal/privacy")}
          />
          
          <SettingsItem
            title="App Version"
            description="1.0.0"
          />
        </View>
      </ScrollView>

      {/* Face Enrollment Modal */}
      {user && (
        <FaceEnrollment
          visible={showFaceEnrollment}
          onClose={() => setShowFaceEnrollment(false)}
          onSuccess={handleFaceEnrollmentSuccess}
          userId={user.id}
          mode="enroll"
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  section: {
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 16,
  },
});
