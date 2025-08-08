import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Colors from "@/constants/colors";
import TransportationIcon from "./TransportationIcon";
import { TransportationType } from "@/types";

interface TransportationTypeSelectorProps {
  selectedType: TransportationType;
  onSelect: (type: TransportationType) => void;
}

export default function TransportationTypeSelector({
  selectedType,
  onSelect,
}: TransportationTypeSelectorProps) {
  const transportationTypes: { type: TransportationType; label: string }[] = [
    { type: "train", label: "Metro Rail" },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.metroHeader}>
        <TransportationIcon
          type="train"
          size={32}
          color={Colors.primary}
        />
        <View style={styles.metroInfo}>
          <Text style={styles.metroTitle}>Dhaka Metro Rail</Text>
          <Text style={styles.metroSubtitle}>MRT Line-6 • Uttara North ↔ Motijheel</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  metroHeader: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  metroInfo: {
    marginLeft: 12,
    flex: 1,
  },
  metroTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
    marginBottom: 2,
  },
  metroSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
});