import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { Check, CreditCard } from "lucide-react-native";
import Button from "@/components/Button";
import { useUserStore } from "@/store/userStore";
import Colors from "@/constants/colors";

export default function AddPaymentMethodScreen() {
  const router = useRouter();
  const { addPaymentMethod } = useUserStore();
  
  const [cardData, setCardData] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    isDefault: false,
  });
  
  const [cardType, setCardType] = useState<"visa" | "mastercard" | "amex" | "paypal">("visa");
  
  const handleInputChange = (field: string, value: string) => {
    setCardData((prev) => ({ ...prev, [field]: value }));
    
    // Detect card type based on first digit
    if (field === "cardNumber" && value.length > 0) {
      const firstDigit = value.charAt(0);
      if (firstDigit === "4") {
        setCardType("visa");
      } else if (firstDigit === "5") {
        setCardType("mastercard");
      } else if (firstDigit === "3") {
        setCardType("amex");
      }
    }
  };
  
  const handleToggleDefault = () => {
    setCardData((prev) => ({ ...prev, isDefault: !prev.isDefault }));
  };
  
  const handleSave = async () => {
    // Validate inputs
    if (!cardData.cardholderName || !cardData.cardNumber || !cardData.expiryDate || !cardData.cvv) {
      alert("Please fill in all required fields");
      return;
    }
    
    // Format card number to get last four digits
    const lastFour = cardData.cardNumber.slice(-4);
    
    // Add payment method
    try {
      await addPaymentMethod({
        id: `pm${Date.now()}`,
        type: cardType,
        lastFour,
        expiryDate: cardData.expiryDate,
        isDefault: cardData.isDefault,
      });
      
      router.back();
    } catch (error) {
      console.error("Failed to add payment method:", error);
      alert("Failed to add payment method. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ title: "Add Payment Method" }} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Add New Card</Text>
        <Text style={styles.subtitle}>
          Enter your card details to save for future payments
        </Text>
        
        <View style={styles.cardPreview}>
          <View style={styles.cardTypeContainer}>
            <CreditCard size={24} color="#fff" />
            <Text style={styles.cardTypeText}>
              {cardType.charAt(0).toUpperCase() + cardType.slice(1)}
            </Text>
          </View>
          <Text style={styles.cardNumberPreview}>
            {cardData.cardNumber ? 
              `•••• •••• •••• ${cardData.cardNumber.slice(-4)}` : 
              "•••• •••• •••• ••••"}
          </Text>
          <View style={styles.cardPreviewBottom}>
            <Text style={styles.cardholderPreview}>
              {cardData.cardholderName || "CARDHOLDER NAME"}
            </Text>
            <Text style={styles.expiryPreview}>
              {cardData.expiryDate || "MM/YY"}
            </Text>
          </View>
        </View>
        
        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Cardholder Name</Text>
            <TextInput
              style={styles.input}
              value={cardData.cardholderName}
              onChangeText={(text) => handleInputChange("cardholderName", text)}
              placeholder="Enter cardholder name"
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Card Number</Text>
            <TextInput
              style={styles.input}
              value={cardData.cardNumber}
              onChangeText={(text) => handleInputChange("cardNumber", text.replace(/\D/g, ""))}
              placeholder="1234 5678 9012 3456"
              keyboardType="number-pad"
              maxLength={16}
            />
          </View>
          
          <View style={styles.inputRow}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 12 }]}>
              <Text style={styles.inputLabel}>Expiry Date</Text>
              <TextInput
                style={styles.input}
                value={cardData.expiryDate}
                onChangeText={(text) => {
                  // Format as MM/YY
                  let formatted = text.replace(/\D/g, "");
                  if (formatted.length > 2) {
                    formatted = `${formatted.slice(0, 2)}/${formatted.slice(2, 4)}`;
                  }
                  handleInputChange("expiryDate", formatted);
                }}
                placeholder="MM/YY"
                keyboardType="number-pad"
                maxLength={5}
              />
            </View>
            
            <View style={[styles.inputContainer, { flex: 1 }]}>
              <Text style={styles.inputLabel}>CVV</Text>
              <TextInput
                style={styles.input}
                value={cardData.cvv}
                onChangeText={(text) => handleInputChange("cvv", text.replace(/\D/g, ""))}
                placeholder="123"
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry
              />
            </View>
          </View>
          
          <TouchableOpacity
            style={styles.defaultContainer}
            onPress={handleToggleDefault}
          >
            <View style={[
              styles.checkbox,
              cardData.isDefault && styles.checkedCheckbox,
            ]}>
              {cardData.isDefault && <Check size={16} color="#fff" />}
            </View>
            <Text style={styles.defaultText}>Set as default payment method</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            title="Save Card"
            onPress={handleSave}
            style={styles.saveButton}
          />
          <Button
            title="Cancel"
            onPress={() => router.back()}
            variant="outline"
            style={styles.cancelButton}
          />
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
  },
  cardPreview: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    height: 180,
    justifyContent: "space-between",
  },
  cardTypeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTypeText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
  cardNumberPreview: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
    letterSpacing: 2,
    marginVertical: 16,
  },
  cardPreviewBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardholderPreview: {
    color: "#fff",
    fontSize: 14,
    textTransform: "uppercase",
  },
  expiryPreview: {
    color: "#fff",
    fontSize: 14,
  },
  formContainer: {
    marginBottom: 24,
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
  },
  inputRow: {
    flexDirection: "row",
  },
  defaultContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  checkedCheckbox: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  defaultText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  buttonContainer: {
    marginBottom: 32,
  },
  saveButton: {
    marginBottom: 12,
  },
  cancelButton: {
    marginBottom: 12,
  },
});