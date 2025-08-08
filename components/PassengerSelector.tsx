import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Users } from "lucide-react-native";
import Colors from "@/constants/colors";

interface PassengerSelectorProps {
  passengers: number;
  onPress: () => void;
}

export default function PassengerSelector({
  passengers,
  onPress,
}: PassengerSelectorProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.label}>Passengers</Text>
      <View style={styles.passengerContainer}>
        <Users size={16} color={Colors.primary} style={styles.icon} />
        <Text style={styles.passengerText}>
          {passengers} {passengers === 1 ? "Adult" : "Adults"}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  passengerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  passengerText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
  },
});