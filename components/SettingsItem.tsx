import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, Switch } from "react-native";
import { ChevronRight } from "lucide-react-native";
import Colors from "@/constants/colors";

interface SettingsItemProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
  hasToggle?: boolean;
  toggleValue?: boolean;
  onToggleChange?: (value: boolean) => void;
}

export default function SettingsItem({
  title,
  description,
  icon,
  onPress,
  hasToggle = false,
  toggleValue = false,
  onToggleChange,
}: SettingsItemProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={!onPress || hasToggle}
      activeOpacity={0.7}
    >
      <View style={styles.leftContent}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {description && (
            <Text style={styles.description}>{description}</Text>
          )}
        </View>
      </View>
      {hasToggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggleChange}
          trackColor={{ false: "#E1E1E1", true: Colors.primary }}
          thumbColor="#FFFFFF"
          ios_backgroundColor="#E1E1E1"
        />
      ) : onPress ? (
        <ChevronRight size={20} color={Colors.text.secondary} />
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
});