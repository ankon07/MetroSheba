import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import Button from "@/components/Button";
import Colors from "@/constants/colors";

export default function TermsScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ title: "Terms of Service" }} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Terms of Service</Text>
        <Text style={styles.lastUpdated}>Last Updated: June 27, 2025</Text>
        
        <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By accessing or using our travel booking application ("the App"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the App.
        </Text>
        
        <Text style={styles.sectionTitle}>2. Use of the App</Text>
        <Text style={styles.paragraph}>
          You agree to use the App only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the App.
        </Text>
        
        <Text style={styles.sectionTitle}>3. Account Registration</Text>
        <Text style={styles.paragraph}>
          To use certain features of the App, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
        </Text>
        
        <Text style={styles.sectionTitle}>4. Booking and Payments</Text>
        <Text style={styles.paragraph}>
          4.1. All bookings made through the App are subject to availability and confirmation.
        </Text>
        <Text style={styles.paragraph}>
          4.2. Prices displayed on the App are subject to change without notice.
        </Text>
        <Text style={styles.paragraph}>
          4.3. Payment processing is handled by secure third-party payment processors. We do not store your full payment card details.
        </Text>
        
        <Text style={styles.sectionTitle}>5. Cancellations and Refunds</Text>
        <Text style={styles.paragraph}>
          5.1. Cancellation policies vary depending on the service provider and are displayed before you complete your booking.
        </Text>
        <Text style={styles.paragraph}>
          5.2. Refunds, when applicable, will be processed according to the service provider's policies.
        </Text>
        
        <Text style={styles.sectionTitle}>6. Intellectual Property</Text>
        <Text style={styles.paragraph}>
          All content included on the App, such as text, graphics, logos, images, and software, is the property of the App owner or its content suppliers and is protected by international copyright laws.
        </Text>
        
        <Text style={styles.sectionTitle}>7. Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          To the fullest extent permitted by applicable law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
        </Text>
        
        <Text style={styles.sectionTitle}>8. Changes to Terms</Text>
        <Text style={styles.paragraph}>
          We reserve the right to modify these Terms at any time. If we make changes, we will provide notice by updating the date at the top of these Terms and by maintaining a current version of the Terms on the App.
        </Text>
        
        <Text style={styles.sectionTitle}>9. Governing Law</Text>
        <Text style={styles.paragraph}>
          These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which the App owner is established, without regard to its conflict of law provisions.
        </Text>
        
        <Text style={styles.sectionTitle}>10. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions about these Terms, please contact us at support@travelease.com.
        </Text>
        
        <Button
          title="Back to Settings"
          onPress={() => router.back()}
          style={styles.backButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 24,
    fontStyle: "italic",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 8,
    marginTop: 16,
  },
  paragraph: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 12,
    lineHeight: 24,
  },
  backButton: {
    marginTop: 32,
    marginBottom: 16,
  },
});