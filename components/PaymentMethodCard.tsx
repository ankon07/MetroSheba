import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { CreditCard, Trash2 } from "lucide-react-native";
import Colors from "@/constants/colors";
import { PaymentMethod } from "@/types";

interface PaymentMethodCardProps {
  method: PaymentMethod;
  onSelect: () => void;
  onDelete: () => void;
  isSelected: boolean;
}

export default function PaymentMethodCard({
  method,
  onSelect,
  onDelete,
  isSelected,
}: PaymentMethodCardProps) {
  const getCardIcon = () => {
    switch (method.type) {
      case "visa":
        return "V";
      case "mastercard":
        return "M";
      case "amex":
        return "A";
      case "paypal":
        return "P";
      default:
        return "C";
    }
  };

  const getCardColor = () => {
    switch (method.type) {
      case "visa":
        return "#1A1F71";
      case "mastercard":
        return "#EB001B";
      case "amex":
        return "#006FCF";
      case "paypal":
        return "#003087";
      default:
        return Colors.primary;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.selectedContainer,
      ]}
      onPress={onSelect}
      activeOpacity={0.7}
    >
      <View style={styles.leftContent}>
        <View
          style={[
            styles.cardIconContainer,
            { backgroundColor: getCardColor() },
          ]}
        >
          <Text style={styles.cardIconText}>{getCardIcon()}</Text>
        </View>
        <View style={styles.cardDetails}>
          <Text style={styles.cardType}>
            {method.type.charAt(0).toUpperCase() + method.type.slice(1)}
            {method.lastFour && ` •••• ${method.lastFour}`}
          </Text>
          {method.expiryDate && (
            <Text style={styles.expiryDate}>Expires {method.expiryDate}</Text>
          )}
          {method.isDefault && <Text style={styles.defaultText}>Default</Text>}
        </View>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={onDelete}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
      >
        <Trash2 size={16} color={Colors.error} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedContainer: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardIconText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
  },
  cardDetails: {
    justifyContent: "center",
  },
  cardType: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 2,
  },
  expiryDate: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  defaultText: {
    fontSize: 12,
    color: Colors.accent,
    fontWeight: "600",
  },
  deleteButton: {
    padding: 4,
  },
});