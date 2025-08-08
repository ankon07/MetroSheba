import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Minus, Plus } from "lucide-react-native";
import Button from "@/components/Button";
import { useSearchStore } from "@/store/searchStore";
import Colors from "@/constants/colors";

export default function PassengerSelectScreen() {
  const router = useRouter();
  const { searchParams, setSearchParams } = useSearchStore();
  const { passengers } = searchParams;

  const handleIncrement = () => {
    if (passengers < 9) {
      setSearchParams({ passengers: passengers + 1 });
    }
  };

  const handleDecrement = () => {
    if (passengers > 1) {
      setSearchParams({ passengers: passengers - 1 });
    }
  };

  const handleConfirm = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Passengers</Text>
      </View>

      <View style={styles.passengerSelector}>
        <Text style={styles.passengerType}>Adults</Text>
        <View style={styles.counterContainer}>
          <TouchableOpacity
            style={[styles.counterButton, passengers <= 1 && styles.disabledButton]}
            onPress={handleDecrement}
            disabled={passengers <= 1}
          >
            <Minus size={20} color={passengers <= 1 ? Colors.text.secondary : Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.counterValue}>{passengers}</Text>
          <TouchableOpacity
            style={[styles.counterButton, passengers >= 9 && styles.disabledButton]}
            onPress={handleIncrement}
            disabled={passengers >= 9}
          >
            <Plus size={20} color={passengers >= 9 ? Colors.text.secondary : Colors.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.note}>
        You can select up to 9 passengers per booking.
      </Text>

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
  passengerSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  passengerType: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  counterContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  counterButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: "#F0F0F0",
  },
  counterValue: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
    marginHorizontal: 16,
    minWidth: 24,
    textAlign: "center",
  },
  note: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 16,
  },
  confirmButton: {
    marginTop: "auto",
  },
});