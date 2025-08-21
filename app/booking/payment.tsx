import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { CreditCard, Check } from "lucide-react-native";
import Button from "@/components/Button";
import BookingSteps from "@/components/BookingSteps";
import PaymentMethodCard from "@/components/PaymentMethodCard";
import { mockTrips } from "@/mocks/trips";
import { useUserStore } from "@/store/userStore";
import Colors from "@/constants/colors";

export default function PaymentScreen() {
  const router = useRouter();
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const { paymentMethods, addTrip, removePaymentMethod } = useUserStore();
  
  // Find the trip in our mock data
  const trip = mockTrips.find((t) => t.id === tripId);
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    paymentMethods.length > 0 ? paymentMethods[0].id : ""
  );
  
  const [newCard, setNewCard] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });
  
  const [showNewCardForm, setShowNewCardForm] = useState(paymentMethods.length === 0);
  
  const handleInputChange = (field: string, value: string) => {
    setNewCard((prev) => ({ ...prev, [field]: value }));
  };
  
  const handlePaymentMethodSelect = (id: string) => {
    setSelectedPaymentMethod(id);
    setShowNewCardForm(false);
  };
  
  const handleAddNewCard = () => {
    setSelectedPaymentMethod("");
    setShowNewCardForm(true);
  };
  
  const handlePaymentMethodDelete = async (id: string) => {
    try {
      await removePaymentMethod(id);
    } catch (error) {
      console.error("Failed to delete payment method:", error);
    }
  };
  
  const handlePayment = () => {
    // In a real app, this would process the payment
    // For demo purposes, we'll just add the trip to the user's trips
    if (trip) {
      const bookedTrip = {
        ...trip,
        status: "upcoming" as const,
        bookingRef: `E${Math.floor(Math.random() * 10000)}/${Math.floor(Math.random() * 10000)}`,
      };
      addTrip(bookedTrip);
    }
    
    router.push({
      pathname: "/booking/confirmation",
      params: { tripId }
    });
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

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Payment Details</Text>
        </View>
        
        <BookingSteps
          currentStep={2}
          steps={["Details", "Booking", "Payment", "Confirmation"]}
        />
        
        <View style={styles.priceCard}>
          <Text style={styles.priceValue}>${trip.price.toFixed(2)}</Text>
          
          <View style={styles.tripDetails}>
            <Text style={styles.tripRoute}>
              {trip.from.city} — {trip.to.city} • {trip.class}
            </Text>
            <Text style={styles.tripDate}>
              {new Date(trip.departureDate).toLocaleDateString()} • {trip.departureTime} - {trip.arrivalTime} • 1 Adult
            </Text>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          {paymentMethods.length > 0 && (
            <View style={styles.savedPaymentMethods}>
              {paymentMethods.map((method) => (
                <PaymentMethodCard
                  key={method.id}
                  method={method}
                  onSelect={() => handlePaymentMethodSelect(method.id)}
                  onDelete={() => handlePaymentMethodDelete(method.id)}
                  isSelected={selectedPaymentMethod === method.id}
                />
              ))}
              
              <TouchableOpacity
                style={styles.addNewCardButton}
                onPress={handleAddNewCard}
              >
                <CreditCard size={20} color={Colors.primary} />
                <Text style={styles.addNewCardText}>Add New Card</Text>
              </TouchableOpacity>
            </View>
          )}
          
          {showNewCardForm && (
            <View style={styles.newCardForm}>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Cardholder Name</Text>
                <TextInput
                  style={styles.input}
                  value={newCard.cardholderName}
                  onChangeText={(text) => handleInputChange("cardholderName", text)}
                  placeholder="Enter cardholder name"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Card Number</Text>
                <TextInput
                  style={styles.input}
                  value={newCard.cardNumber}
                  onChangeText={(text) => handleInputChange("cardNumber", text)}
                  placeholder="1234 5678 9012 3456"
                  keyboardType="number-pad"
                  maxLength={19}
                />
              </View>
              
              <View style={styles.inputRow}>
                <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                  <Text style={styles.inputLabel}>Expiry Date</Text>
                  <TextInput
                    style={styles.input}
                    value={newCard.expiryDate}
                    onChangeText={(text) => handleInputChange("expiryDate", text)}
                    placeholder="MM/YY"
                    keyboardType="number-pad"
                    maxLength={5}
                  />
                </View>
                
                <View style={[styles.inputContainer, { flex: 1 }]}>
                  <Text style={styles.inputLabel}>CVV</Text>
                  <TextInput
                    style={styles.input}
                    value={newCard.cvv}
                    onChangeText={(text) => handleInputChange("cvv", text)}
                    placeholder="123"
                    keyboardType="number-pad"
                    maxLength={4}
                    secureTextEntry
                  />
                </View>
              </View>
              
              <View style={styles.saveCardContainer}>
                <View style={styles.checkboxContainer}>
                  <View style={styles.checkbox}>
                    <Check size={16} color="#fff" />
                  </View>
                  <Text style={styles.saveCardText}>Save card for future payments</Text>
                </View>
              </View>
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Details</Text>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Base Fare</Text>
            <Text style={styles.priceAmount}>${(trip.price * 0.85).toFixed(2)}</Text>
          </View>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Taxes & Fees</Text>
            <Text style={styles.priceAmount}>${(trip.price * 0.15).toFixed(2)}</Text>
          </View>
          
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Booking Fee</Text>
            <Text style={styles.priceAmount}>$0.00</Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalAmount}>${trip.price.toFixed(2)}</Text>
          </View>
        </View>
        
        <View style={styles.termsContainer}>
          <View style={styles.checkboxContainer}>
            <View style={styles.checkbox}>
              <Check size={16} color="#fff" />
            </View>
            <Text style={styles.termsText}>
              I agree to the Terms & Conditions and Privacy Policy
            </Text>
          </View>
        </View>
        
        <Button
          title="Pay Now"
          onPress={handlePayment}
          style={styles.payButton}
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
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  priceCard: {
    margin: 16,
    padding: 16,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    alignItems: "center",
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
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  tripDate: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  section: {
    margin: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 16,
  },
  savedPaymentMethods: {
    marginBottom: 16,
  },
  addNewCardButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    borderStyle: "dashed",
  },
  addNewCardText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
    marginLeft: 8,
  },
  newCardForm: {
    marginTop: 16,
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
  saveCardContainer: {
    marginTop: 8,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  saveCardText: {
    fontSize: 14,
    color: Colors.text.secondary,
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
    margin: 16,
  },
  termsText: {
    fontSize: 14,
    color: Colors.text.secondary,
    flex: 1,
  },
  payButton: {
    margin: 16,
    marginBottom: 32,
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