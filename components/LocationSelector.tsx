import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { MapPin } from "lucide-react-native";
import Colors from "@/constants/colors";
import { Location } from "@/types";

interface LocationSelectorProps {
  label: string;
  location: Location | null;
  onPress: () => void;
}

export default function LocationSelector({
  label,
  location,
  onPress,
}: LocationSelectorProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.label}>{label}</Text>
      <View style={styles.locationContainer}>
        <MapPin size={16} color={Colors.primary} style={styles.icon} />
        <Text style={styles.locationText}>
          {location ? location.city : "Select location"}
        </Text>
      </View>
      {location && (
        <Text style={styles.stationText}>{location.station}</Text>
      )}
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
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 8,
  },
  locationText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  stationText: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 4,
    marginLeft: 24,
  },
});