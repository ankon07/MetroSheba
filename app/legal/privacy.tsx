import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import Button from "@/components/Button";
import Colors from "@/constants/colors";

export default function PrivacyPolicyScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ title: "Privacy Policy" }} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.lastUpdated}>Last Updated: June 27, 2025</Text>
        
        <Text style={styles.paragraph}>
          This Privacy Policy describes how we collect, use, and share your personal information when you use our travel booking application ("the App").
        </Text>
        
        <Text style={styles.sectionTitle}>1. Information We Collect</Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>1.1. Information You Provide:</Text> We collect information you provide when you create an account, make a booking, or contact customer support, including your name, email address, phone number, payment information, and travel preferences.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>1.2. Automatically Collected Information:</Text> We automatically collect certain information when you use the App, including your IP address, device information, operating system, browser type, and usage data.
        </Text>
        <Text style={styles.paragraph}>
          <Text style={styles.bold}>1.3. Location Information:</Text> With your consent, we may collect precise location information from your device to provide location-based services.
        </Text>
        
        <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          We use your information to:
        </Text>
        <Text style={styles.bulletPoint}>• Process and manage your bookings</Text>
        <Text style={styles.bulletPoint}>• Provide customer support</Text>
        <Text style={styles.bulletPoint}>• Improve and personalize the App</Text>
        <Text style={styles.bulletPoint}>• Send you updates, marketing communications, and promotional offers</Text>
        <Text style={styles.bulletPoint}>• Ensure the security of the App</Text>
        <Text style={styles.bulletPoint}>• Comply with legal obligations</Text>
        
        <Text style={styles.sectionTitle}>3. Information Sharing</Text>
        <Text style={styles.paragraph}>
          We may share your information with:
        </Text>
        <Text style={styles.bulletPoint}>• Service providers (e.g., transportation companies, hotels) to fulfill your bookings</Text>
        <Text style={styles.bulletPoint}>• Payment processors to process transactions</Text>
        <Text style={styles.bulletPoint}>• Third-party service providers who perform services on our behalf</Text>
        <Text style={styles.bulletPoint}>• Legal authorities when required by law</Text>
        
        <Text style={styles.sectionTitle}>4. Data Security</Text>
        <Text style={styles.paragraph}>
          We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
        </Text>
        
        <Text style={styles.sectionTitle}>5. Your Rights</Text>
        <Text style={styles.paragraph}>
          Depending on your location, you may have the right to:
        </Text>
        <Text style={styles.bulletPoint}>• Access the personal information we hold about you</Text>
        <Text style={styles.bulletPoint}>• Correct inaccurate or incomplete information</Text>
        <Text style={styles.bulletPoint}>• Delete your personal information</Text>
        <Text style={styles.bulletPoint}>• Object to or restrict the processing of your information</Text>
        <Text style={styles.bulletPoint}>• Data portability</Text>
        
        <Text style={styles.sectionTitle}>6. Cookies and Similar Technologies</Text>
        <Text style={styles.paragraph}>
          We use cookies and similar technologies to collect information about your browsing activities and to provide, maintain, and improve the App.
        </Text>
        
        <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
        <Text style={styles.paragraph}>
          The App is not intended for children under the age of 16. We do not knowingly collect personal information from children under 16.
        </Text>
        
        <Text style={styles.sectionTitle}>8. Changes to This Privacy Policy</Text>
        <Text style={styles.paragraph}>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
        </Text>
        
        <Text style={styles.sectionTitle}>9. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions about this Privacy Policy, please contact us at privacy@travelease.com.
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
  paragraph: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 12,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 8,
    marginTop: 16,
  },
  bold: {
    fontWeight: "700",
    color: Colors.text.primary,
  },
  bulletPoint: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 8,
    marginLeft: 16,
    lineHeight: 24,
  },
  backButton: {
    marginTop: 32,
    marginBottom: 16,
  },
});