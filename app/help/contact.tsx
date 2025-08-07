import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { ChevronDown, Paperclip, Send } from "lucide-react-native";
import Button from "@/components/Button";
import { useUserStore } from "@/store/userStore";
import Colors from "@/constants/colors";

const issueCategories = [
  "Booking Issues",
  "Payment Problems",
  "Account Access",
  "Refund Request",
  "Technical Issues",
  "Other",
];

export default function ContactSupportScreen() {
  const router = useRouter();
  const { user } = useUserStore();
  
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setShowCategoryDropdown(false);
  };
  
  const handleSubmit = () => {
    if (!selectedCategory) {
      alert("Please select an issue category");
      return;
    }
    
    if (!message.trim()) {
      alert("Please enter a message");
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Your message has been sent. Our support team will get back to you shortly.");
      router.back();
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ title: "Contact Support" }} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Get in Touch</Text>
        <Text style={styles.subtitle}>
          Our support team is here to help. Please fill out the form below and we'll get back to you as soon as possible.
        </Text>
        
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Your Name</Text>
            <TextInput
              style={styles.input}
              value={`${user?.firstName || ""} ${user?.lastName || ""}`}
              editable={false}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <TextInput
              style={styles.input}
              value={user?.email || ""}
              editable={false}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Issue Category</Text>
            <TouchableOpacity
              style={styles.dropdownButton}
              onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
            >
              <Text style={[
                styles.dropdownButtonText,
                !selectedCategory && styles.placeholderText,
              ]}>
                {selectedCategory || "Select an issue category"}
              </Text>
              <ChevronDown size={20} color={Colors.text.secondary} />
            </TouchableOpacity>
            
            {showCategoryDropdown && (
              <View style={styles.dropdownMenu}>
                {issueCategories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={styles.dropdownItem}
                    onPress={() => handleCategorySelect(category)}
                  >
                    <Text style={[
                      styles.dropdownItemText,
                      selectedCategory === category && styles.selectedItemText,
                    ]}>
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Message</Text>
            <TextInput
              style={styles.messageInput}
              value={message}
              onChangeText={setMessage}
              placeholder="Describe your issue in detail..."
              multiline
              textAlignVertical="top"
            />
          </View>
          
          <TouchableOpacity style={styles.attachButton}>
            <Paperclip size={20} color={Colors.primary} />
            <Text style={styles.attachButtonText}>Attach a file or screenshot</Text>
          </TouchableOpacity>
        </View>
        
        <Button
          title="Send Message"
          onPress={handleSubmit}
          loading={isSubmitting}
          icon={<Send size={20} color="#fff" style={styles.sendIcon} />}
          style={styles.sendButton}
        />
        
        <View style={styles.alternativeContactContainer}>
          <Text style={styles.alternativeContactTitle}>Other Ways to Reach Us</Text>
          
          <View style={styles.contactMethod}>
            <Text style={styles.contactMethodTitle}>Phone Support</Text>
            <Text style={styles.contactMethodValue}>+1 (800) 123-4567</Text>
            <Text style={styles.contactMethodHours}>Available 24/7</Text>
          </View>
          
          <View style={styles.contactMethod}>
            <Text style={styles.contactMethodTitle}>Email Support</Text>
            <Text style={styles.contactMethodValue}>support@travelease.com</Text>
            <Text style={styles.contactMethodHours}>Response within 24 hours</Text>
          </View>
        </View>
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
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 24,
    lineHeight: 22,
  },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: Colors.text.primary,
    backgroundColor: Colors.secondary,
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  placeholderText: {
    color: Colors.text.secondary,
  },
  dropdownMenu: {
    position: "absolute",
    top: 74,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    zIndex: 1,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  dropdownItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dropdownItemText: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  selectedItemText: {
    color: Colors.primary,
    fontWeight: "600",
  },
  messageInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: Colors.text.primary,
    height: 120,
  },
  attachButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  attachButtonText: {
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 8,
  },
  sendIcon: {
    marginRight: 8,
  },
  sendButton: {
    marginBottom: 24,
  },
  alternativeContactContainer: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 32,
  },
  alternativeContactTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 16,
  },
  contactMethod: {
    marginBottom: 16,
  },
  contactMethodTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  contactMethodValue: {
    fontSize: 16,
    color: Colors.primary,
    marginBottom: 2,
  },
  contactMethodHours: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
});