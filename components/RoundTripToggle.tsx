import React from "react";
import { StyleSheet, Text, View, Switch } from "react-native";
import Colors from "@/constants/colors";

interface RoundTripToggleProps {
  isRoundTrip: boolean;
  onToggle: (value: boolean) => void;
}

export default function RoundTripToggle({
  isRoundTrip,
  onToggle,
}: RoundTripToggleProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Round Trip</Text>
      <Switch
        value={isRoundTrip}
        onValueChange={onToggle}
        trackColor={{ false: "#E1E1E1", true: Colors.primary }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#E1E1E1"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
  },
});