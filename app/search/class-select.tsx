import React from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Check } from "lucide-react-native";
import Button from "@/components/Button";
import { useSearchStore } from "@/store/searchStore";
import Colors from "@/constants/colors";

const classOptions = [
  {
    id: "economy",
    name: "Economy",
    description: "Standard seating with basic amenities",
  },
  {
    id: "premium-economy",
    name: "Premium Economy",
    description: "More legroom and enhanced amenities",
  },
  {
    id: "business",
    name: "Business",
    description: "Premium seating with superior service",
  },
  {
    id: "first",
    name: "First Class",
    description: "Ultimate comfort with exclusive service",
  },
];

export default function ClassSelectScreen() {
  const router = useRouter();
  const { searchParams, setSearchParams } = useSearchStore();
  const { class: selectedClass } = searchParams;

  const handleClassSelect = (className: string) => {
    setSearchParams({ class: className });
  };

  const handleConfirm = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Class</Text>
      </View>

      <FlatList
        data={classOptions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.classItem,
              selectedClass === item.name && styles.selectedClassItem,
            ]}
            onPress={() => handleClassSelect(item.name)}
          >
            <View style={styles.classInfo}>
              <Text style={styles.className}>{item.name}</Text>
              <Text style={styles.classDescription}>{item.description}</Text>
            </View>
            {selectedClass === item.name && (
              <View style={styles.checkContainer}>
                <Check size={20} color="#fff" />
              </View>
            )}
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
      />

      <Button
        title="Confirm"
        onPress={handleConfirm}
        style={styles.confirmButton}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  listContent: {
    paddingBottom: 16,
  },
  classItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    marginBottom: 12,
  },
  selectedClassItem: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  classInfo: {
    flex: 1,
  },
  className: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  classDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  checkContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButton: {
    marginTop: "auto",
  },
});