import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { Plus } from "lucide-react-native";
import PaymentMethodCard from "@/components/PaymentMethodCard";
import Button from "@/components/Button";
import { useUserStore } from "@/store/userStore";
import Colors from "@/constants/colors";

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const { paymentMethods, removePaymentMethod, setDefaultPaymentMethod } = useUserStore();
  const [selectedMethod, setSelectedMethod] = useState<string | null>(
    paymentMethods.find(method => method.isDefault)?.id || null
  );

  const handleAddPaymentMethod = () => {
    router.push("/profile/add-payment-method");
  };

  const handleSelectPaymentMethod = (id: string) => {
    setSelectedMethod(id);
  };

  const handleDeletePaymentMethod = (id: string) => {
    Alert.alert(
      "Delete Payment Method",
      "Are you sure you want to delete this payment method?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await removePaymentMethod(id);
            } catch (error) {
              Alert.alert("Error", "Failed to delete payment method. Please try again.");
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const handleSetDefault = async () => {
    if (selectedMethod) {
      try {
        await setDefaultPaymentMethod(selectedMethod);
        Alert.alert(
          "Default Payment Method",
          "Your default payment method has been updated.",
          [{ text: "OK" }]
        );
      } catch (error) {
        Alert.alert("Error", "Failed to update default payment method. Please try again.");
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ title: "Payment Methods" }} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Your Payment Methods</Text>
        <Text style={styles.subtitle}>
          Manage your saved payment methods for faster checkout
        </Text>
        
        {paymentMethods.length > 0 ? (
          <View style={styles.paymentMethodsContainer}>
            {paymentMethods.map((method) => (
              <PaymentMethodCard
                key={method.id}
                method={method}
                onSelect={() => handleSelectPaymentMethod(method.id)}
                onDelete={() => handleDeletePaymentMethod(method.id)}
                isSelected={selectedMethod === method.id}
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyStateContainer}>
            <Text style={styles.emptyStateText}>
              You don't have any saved payment methods yet.
            </Text>
          </View>
        )}
        
        <TouchableOpacity
          style={styles.addPaymentButton}
          onPress={handleAddPaymentMethod}
        >
          <Plus size={20} color={Colors.primary} />
          <Text style={styles.addPaymentText}>Add New Payment Method</Text>
        </TouchableOpacity>
        
        {selectedMethod && (
          <Button
            title="Set as Default"
            onPress={handleSetDefault}
            style={styles.setDefaultButton}
            variant="outline"
          />
        )}
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
    flexGrow: 1,
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
  paymentMethodsContainer: {
    marginBottom: 24,
  },
  emptyStateContainer: {
    padding: 24,
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  emptyStateText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: "center",
  },
  addPaymentButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 8,
    borderStyle: "dashed",
    marginBottom: 16,
  },
  addPaymentText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.primary,
    marginLeft: 8,
  },
  setDefaultButton: {
    marginBottom: 16,
  },
});