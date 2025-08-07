import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Armchair } from "lucide-react-native";
import Colors from "@/constants/colors";

interface ClassSelectorProps {
  selectedClass: string;
  onPress: () => void;
}

export default function ClassSelector({
  selectedClass,
  onPress,
}: ClassSelectorProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.label}>Class</Text>
      <View style={styles.classContainer}>
        <Armchair size={16} color={Colors.primary} style={styles.icon} />
        <Text style={styles.classText}>{selectedClass}</Text>
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
  classContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  classText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
  },
});