import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Calendar } from "lucide-react-native";
import Colors from "@/constants/colors";

interface DateSelectorProps {
  date: string;
  onPress: () => void;
}

export default function DateSelector({ date, onPress }: DateSelectorProps) {
  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.label}>Date</Text>
      <View style={styles.dateContainer}>
        <Calendar size={16} color={Colors.primary} style={styles.icon} />
        <Text style={styles.dateText}>{formatDate(date)}</Text>
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
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
  },
});