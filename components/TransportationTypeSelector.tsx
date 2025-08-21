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
          color={Colors.text.light}
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
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.accent,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  metroInfo: {
    marginLeft: 12,
    flex: 1,
  },
  metroTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.light,
    marginBottom: 2,
  },
  metroSubtitle: {
    fontSize: 14,
    color: Colors.text.light,
    opacity: 0.9,
  },
});
