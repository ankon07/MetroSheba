import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Image } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { CreditCard, Check, Smartphone, Wallet, ArrowLeft } from "lucide-react-native";
import Button from "@/components/Button";
import BookingSteps from "@/components/BookingSteps";
import AnimatedCard from "@/components/AnimatedCard";
import { mockTrips } from "@/mocks/trips";
import { useUserStore } from "@/store/userStore";
import Colors from "@/constants/colors";

type PaymentMethod = "bkash" | "card" | "nagad";

export default function PaymentScreen() {
  const router = useRouter();
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const { addTrip } = useUserStore();
  
  // Find the trip in our mock data
  const trip = mockTrips.find((t) => t.id === tripId);
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>("bkash");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Card form state
  const [cardForm, setCardForm] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  
  // Mobile payment form state
  const [mobileForm, setMobileForm] = useState({
    phoneNumber: "",
    pin: "",
  });
  
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const handleCardInputChange = (field: string, value: string) => {
    if (field === "cardNumber") {
      // Format card number with spaces
      const formatted = value.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim();
      setCardForm((prev) => ({ ...prev, [field]: formatted }));
    } else if (field === "expiryDate") {
      // Format expiry date as MM/YY
      const formatted = value.replace(/\D/g, "").replace(/(\d{2})(\d{2})/, "$1/$2");
      setCardForm((prev) => ({ ...prev, [field]: formatted }));
    } else {
      setCardForm((prev) => ({ ...prev, [field]: value }));
    }
  };
  
  const handleMobileInputChange = (field: string, value: string) => {
    if (field === "phoneNumber") {
      // Format phone number
      const formatted = value.replace(/\D/g, "");
      setMobileForm((prev) => ({ ...prev, [field]: formatted }));
    } else {
      setMobileForm((prev) => ({ ...prev, [field]: value }));
    }
  };
  
  const validateForm = () => {
    if (!agreedToTerms) return false;
    
    if (selectedPaymentMethod === "card") {
      return cardForm.cardholderName && 
             cardForm.cardNumber.replace(/\s/g, "").length >= 16 && 
             cardForm.expiryDate.length === 5 && 
             cardForm.cvv.length >= 3;
    } else {
      return mobileForm.phoneNumber.length >= 11 && mobileForm.pin.length >= 4;
    }
  };
  
  const handlePayment = async () => {
    if (!validateForm()) return;
    
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      if (trip) {
        const bookedTrip = {
          ...trip,
          status: "upcoming" as const,
          bookingRef: `MTR${Math.floor(Math.random() * 100000)}`,
          paymentMethod: selectedPaymentMethod,
        };
        addTrip(bookedTrip);
      }
      
      setIsProcessing(false);
      router.push({
        pathname: "/booking/confirmation",
        params: { tripId, paymentMethod: selectedPaymentMethod }
      });
    }, 2000);
  };
  
  if (!trip) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Trip not found</Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            style={styles.errorBackButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const renderPaymentMethodCard = (method: PaymentMethod, title: string, icon: React.ReactNode, description: string) => (
    <TouchableOpacity
      style={[
        styles.paymentMethodCard,
        selectedPaymentMethod === method && styles.selectedPaymentMethodCard
      ]}
      onPress={() => setSelectedPaymentMethod(method)}
    >
      <View style={styles.paymentMethodHeader}>
        <View style={styles.paymentMethodIcon}>
          {icon}
        </View>
        <View style={styles.paymentMethodInfo}>
          <Text style={styles.paymentMethodTitle}>{title}</Text>
          <Text style={styles.paymentMethodDescription}>{description}</Text>
        </View>
        <View style={[
          styles.radioButton,
          selectedPaymentMethod === method && styles.selectedRadioButton
        ]}>
          {selectedPaymentMethod === method && <Check size={16} color="#fff" />}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderCardForm = () => (
    <AnimatedCard delay={400}>
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>Card Details</Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Cardholder Name</Text>
          <TextInput
            style={styles.input}
            value={cardForm.cardholderName}
            onChangeText={(text) => handleCardInputChange("cardholderName", text)}
            placeholder="Enter cardholder name"
            placeholderTextColor={Colors.text.secondary}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Card Number</Text>
          <TextInput
            style={styles.input}
            value={cardForm.cardNumber}
            onChangeText={(text) => handleCardInputChange("cardNumber", text)}
            placeholder="1234 5678 9012 3456"
            placeholderTextColor={Colors.text.secondary}
            keyboardType="number-pad"
            maxLength={19}
          />
        </View>
        
        <View style={styles.inputRow}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.inputLabel}>Expiry Date</Text>
            <TextInput
              style={styles.input}
              value={cardForm.expiryDate}
              onChangeText={(text) => handleCardInputChange("expiryDate", text)}
              placeholder="MM/YY"
              placeholderTextColor={Colors.text.secondary}
              keyboardType="number-pad"
              maxLength={5}
            />
          </View>
          
          <View style={[styles.inputContainer, { flex: 1 }]}>
            <Text style={styles.inputLabel}>CVV</Text>
            <TextInput
              style={styles.input}
              value={cardForm.cvv}
              onChangeText={(text) => handleCardInputChange("cvv", text)}
              placeholder="123"
              placeholderTextColor={Colors.text.secondary}
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry
            />
          </View>
        </View>
      </View>
    </AnimatedCard>
  );

  const renderMobileForm = () => (
    <AnimatedCard delay={400}>
      <View style={styles.formContainer}>
        <Text style={styles.formTitle}>
          {selectedPaymentMethod === "bkash" ? "bKash" : "Nagad"} Details
        </Text>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            value={mobileForm.phoneNumber}
            onChangeText={(text) => handleMobileInputChange("phoneNumber", text)}
            placeholder="01XXXXXXXXX"
            placeholderTextColor={Colors.text.secondary}
            keyboardType="phone-pad"
            maxLength={11}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>PIN</Text>
          <TextInput
            style={styles.input}
            value={mobileForm.pin}
            onChangeText={(text) => handleMobileInputChange("pin", text)}
            placeholder="Enter your PIN"
            placeholderTextColor={Colors.text.secondary}
            keyboardType="number-pad"
            maxLength={5}
            secureTextEntry
          />
        </View>
        
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            You will receive a push notification to confirm this payment on your {selectedPaymentMethod === "bkash" ? "bKash" : "Nagad"} app.
          </Text>
        </View>
      </View>
    </AnimatedCard>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>Payment</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <BookingSteps
          currentStep={2}
          steps={["Details", "Booking", "Payment", "Confirmation"]}
        />
        
        <AnimatedCard delay={0}>
          <View style={styles.priceCard}>
            <Text style={styles.priceValue}>৳{trip.price.toFixed(2)}</Text>
            
            <View style={styles.tripDetails}>
              <Text style={styles.tripRoute}>
                {trip.from.city} → {trip.to.city}
              </Text>
              <Text style={styles.tripDate}>
                {new Date(trip.departureDate).toLocaleDateString()} • {trip.departureTime} - {trip.arrivalTime}
              </Text>
            </View>
          </View>
        </AnimatedCard>
        
        <AnimatedCard delay={200}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Payment Method</Text>
            
            {renderPaymentMethodCard(
              "bkash",
              "bKash",
              <View style={[styles.methodIcon, { backgroundColor: "#E2136E" }]}>
                <Smartphone size={24} color="#fff" />
              </View>,
              "Pay with your bKash mobile wallet"
            )}
            
            {renderPaymentMethodCard(
              "card",
              "Credit/Debit Card",
              <View style={[styles.methodIcon, { backgroundColor: "#1E40AF" }]}>
                <CreditCard size={24} color="#fff" />
              </View>,
              "Pay with Visa, Mastercard, or local cards"
            )}
            
            {renderPaymentMethodCard(
              "nagad",
              "Nagad",
              <View style={[styles.methodIcon, { backgroundColor: "#FF6B35" }]}>
                <Wallet size={24} color="#fff" />
              </View>,
              "Pay with your Nagad mobile wallet"
            )}
          </View>
        </AnimatedCard>
        
        {selectedPaymentMethod === "card" ? renderCardForm() : renderMobileForm()}
        
        <AnimatedCard delay={600}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price Breakdown</Text>
            
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Base Fare</Text>
              <Text style={styles.priceAmount}>৳{(trip.price * 0.9).toFixed(2)}</Text>
            </View>
            
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Service Charge</Text>
              <Text style={styles.priceAmount}>৳{(trip.price * 0.1).toFixed(2)}</Text>
            </View>
            
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalAmount}>৳{trip.price.toFixed(2)}</Text>
            </View>
          </View>
        </AnimatedCard>
        
        <AnimatedCard delay={800}>
          <View style={styles.termsContainer}>
            <TouchableOpacity
              style={styles.checkboxContainer}
              onPress={() => setAgreedToTerms(!agreedToTerms)}
            >
              <View style={[styles.checkbox, agreedToTerms && styles.checkedCheckbox]}>
                {agreedToTerms && <Check size={16} color="#fff" />}
              </View>
              <Text style={styles.termsText}>
                I agree to the Terms & Conditions and Privacy Policy
              </Text>
            </TouchableOpacity>
          </View>
        </AnimatedCard>
        
        <Button
          title={isProcessing ? "Processing..." : `Pay ৳${trip.price.toFixed(2)}`}
          onPress={handlePayment}
          disabled={!validateForm() || isProcessing}
          style={StyleSheet.flatten([
            styles.payButton,
            (!validateForm() || isProcessing) && styles.disabledButton
          ])}
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    padding: 16,
  },
  priceCard: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  priceValue: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  tripDetails: {
    alignItems: "center",
  },
  tripRoute: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  tripDate: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  section: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 16,
  },
  paymentMethodCard: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  selectedPaymentMethodCard: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + "10",
  },
  paymentMethodHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentMethodIcon: {
    marginRight: 12,
  },
  methodIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  paymentMethodInfo: {
    flex: 1,
  },
  paymentMethodTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 2,
  },
  paymentMethodDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedRadioButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  formContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text.primary,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text.primary,
    backgroundColor: Colors.background,
  },
  inputRow: {
    flexDirection: "row",
  },
  infoBox: {
    backgroundColor: Colors.primary + "15",
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.primary,
    textAlign: "center",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  priceLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  priceAmount: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text.primary,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.primary,
  },
  termsContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkedCheckbox: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  termsText: {
    fontSize: 14,
    color: Colors.text.secondary,
    flex: 1,
  },
  payButton: {
    marginBottom: 32,
  },
  disabledButton: {
    opacity: 0.5,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 16,
  },
  errorBackButton: {
    width: 200,
  },
});
