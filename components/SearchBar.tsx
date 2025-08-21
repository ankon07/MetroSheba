import React from "react";
import { StyleSheet, TextInput, View, TouchableOpacity } from "react-native";
import { Search } from "lucide-react-native";
import Colors from "@/constants/colors";

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onPress?: () => void;
  editable?: boolean;
}

export default function SearchBar({
  placeholder,
  value,
  onChangeText,
  onPress,
  editable = true,
}: SearchBarProps) {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.8 : 1}
    >
      <View style={styles.searchIcon}>
        <Search size={20} color={Colors.text.secondary} />
      </View>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={Colors.text.secondary}
        value={value}
        onChangeText={onChangeText}
        editable={editable && !onPress}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
  },
});
