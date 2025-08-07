import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Check, ChevronRight, ArrowLeft, User, Mail, Phone, Globe } from "lucide-react-native";
import Button from "@/components/Button";
import BookingSteps from "@/components/BookingSteps";
import { mockTrips } from "@/mocks/trips";
import { useUserStore } from "@/store/userStore";
import Colors from "@/constants/colors";

export default function BookingScreen() {
  const router = useRouter();
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const { user } = useUserStore();
  
  // Find the trip in our mock data
  const trip = mockTrips.find((t) => t.id === tripId);
  
  const [passengerInfo, setPassengerInfo] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    nationality: user?.nationality || "",
  });
  
  const [selectedSeat, setSelectedSeat] = useState("");
  
  const handleInputChange = (field: string, value: string) => {
    setPassengerInfo((prev) => ({ ...prev, [field]: value }));
  };
  
  const handleSeatSelect = (seat: string) => {
    setSelectedSeat(seat);
  };
  
  const handleContinue = () => {
    // In a real app, validate inputs before proceeding
    router.push({
      pathname: "/booking/payment",
      params: { tripId }
    });
  };
  
  if (!trip) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Trip not found</Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            style={styles.errorBackButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.title}>Complete Your Booking</Text>
        </View>
        
        <BookingSteps
          currentStep={0}
          steps={["Passenger", "Seat", "Payment", "Confirmation"]}
        />
        
        <View style={styles.tripSummary}>
          <Text style={styles.tripSummaryTitle}>
            {trip.from.city} — {trip.to.city}
          </Text>
          <Text style={styles.tripSummaryDetails}>
            {new Date(trip.departureDate).toLocaleDateString()} • {trip.departureTime} • {trip.class}
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Passenger Information</Text>
          
          <View style={styles.passengerHeader}>
            <Text style={styles.passengerTitle}>Passenger 1</Text>
            <View style={styles.adultBadge}>
              <Text style={styles.adultBadgeText}>Adult</Text>
            </View>
          </View>
          
          <View style={styles.inputRow}>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>First Name</Text>
              <View style={styles.inputWithIcon}>
                <User size={20} color={Colors.text.secondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={passengerInfo.firstName}
                  onChangeText={(text) => handleInputChange("firstName", text)}
                  placeholder="Alex"
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Last Name</Text>
              <View style={styles.inputWithIcon}>
                <User size={20} color={Colors.text.secondary} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={passengerInfo.lastName}
                  onChangeText={(text) => handleInputChange("lastName", text)}
                  placeholder="Johnson"
                />
              </View>
            </View>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email</Text>
            <View style={styles.inputWithIcon}>
              <Mail size={20} color={Colors.text.secondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={passengerInfo.email}
                onChangeText={(text) => handleInputChange("email", text)}
                placeholder="alex.johnson@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Check size={20} color={Colors.success} style={styles.validIcon} />
            </View>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Phone Number</Text>
            <View style={styles.inputWithIcon}>
              <Phone size={20} color={Colors.text.secondary} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={passengerInfo.phone}
                onChangeText={(text) => handleInputChange("phone", text)}
                placeholder="+44 123 456 7890"
                keyboardType="phone-pad"
              />
            </View>
          </View>
          
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nationality</Text>
            <TouchableOpacity style={styles.selectInput}>
              <Globe size={20} color={Colors.text.secondary} style={styles.inputIcon} />
              <Text style={styles.selectInputText}>
                {passengerInfo.nationality || "United Kingdom"}
              </Text>
              <ChevronRight size={20} color={Colors.text.secondary} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Seat Selection</Text>
          
          <View style={styles.seatSelectionHeader}>
            <Text style={styles.seatSelectionTitle}>Select Your Seat</Text>
            <Text style={styles.seatSelectionSubtitle}>Car 8</Text>
          </View>
          
          <View style={styles.seatMap}>
            <View style={styles.seatRow}>
              <TouchableOpacity
                style={[
                  styles.seat,
                  selectedSeat === "A1" && styles.selectedSeat,
                ]}
                onPress={() => handleSeatSelect("A1")}
              >
                <Text
                  style={[
                    styles.seatText,
                    selectedSeat === "A1" && styles.selectedSeatText,
                  ]}
                >
                  A1
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.seat,
                  selectedSeat === "B1" && styles.selectedSeat,
                ]}
                onPress={() => handleSeatSelect("B1")}
              >
                <Text
                  style={[
                    styles.seatText,
                    selectedSeat === "B1" && styles.selectedSeatText,
                  ]}
                >
                  B1
                </Text>
              </TouchableOpacity>
              <View style={styles.seatSpacer} />
              <TouchableOpacity
                style={[
                  styles.seat,
                  selectedSeat === "C1" && styles.selectedSeat,
                ]}
                onPress={() => handleSeatSelect("C1")}
              >
                <Text
                  style={[
                    styles.seatText,
                    selectedSeat === "C1" && styles.selectedSeatText,
                  ]}
                >
                  C1
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.seat,
                  selectedSeat === "D1" && styles.selectedSeat,
                ]}
                onPress={() => handleSeatSelect("D1")}
              >
                <Text
                  style={[
                    styles.seatText,
                    selectedSeat === "D1" && styles.selectedSeatText,
                  ]}
                >
                  D1
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.seatRow}>
              <TouchableOpacity
                style={[
                  styles.seat,
                  selectedSeat === "A2" && styles.selectedSeat,
                ]}
                onPress={() => handleSeatSelect("A2")}
              >
                <Text
                  style={[
                    styles.seatText,
                    selectedSeat === "A2" && styles.selectedSeatText,
                  ]}
                >
                  A2
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.seat,
                  selectedSeat === "B2" && styles.selectedSeat,
                ]}
                onPress={() => handleSeatSelect("B2")}
              >
                <Text
                  style={[
                    styles.seatText,
                    selectedSeat === "B2" && styles.selectedSeatText,
                  ]}
                >
                  B2
                </Text>
              </TouchableOpacity>
              <View style={styles.seatSpacer} />
              <TouchableOpacity
                style={[
                  styles.seat,
                  styles.unavailableSeat,
                ]}
                disabled
              >
                <Text style={styles.unavailableSeatText}>C2</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.seat,
                  selectedSeat === "D2" && styles.selectedSeat,
                ]}
                onPress={() => handleSeatSelect("D2")}
              >
                <Text
                  style={[
                    styles.seatText,
                    selectedSeat === "D2" && styles.selectedSeatText,
                  ]}
                >
                  D2
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.seatRow}>
              <TouchableOpacity
                style={[
                  styles.seat,
                  styles.unavailableSeat,
                ]}
                disabled
              >
                <Text style={styles.unavailableSeatText}>A3</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.seat,
                  selectedSeat === "B3" && styles.selectedSeat,
                ]}
                onPress={() => handleSeatSelect("B3")}
              >
                <Text
                  style={[
                    styles.seatText,
                    selectedSeat === "B3" && styles.selectedSeatText,
                  ]}
                >
                  B3
                </Text>
              </TouchableOpacity>
              <View style={styles.seatSpacer} />
              <TouchableOpacity
                style={[
                  styles.seat,
                  selectedSeat === "C3" && styles.selectedSeat,
                ]}
                onPress={() => handleSeatSelect("C3")}
              >
                <Text
                  style={[
                    styles.seatText,
                    selectedSeat === "C3" && styles.selectedSeatText,
                  ]}
                >
                  C3
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.seat,
                  selectedSeat === "D3" && styles.selectedSeat,
                ]}
                onPress={() => handleSeatSelect("D3")}
              >
                <Text
                  style={[
                    styles.seatText,
                    selectedSeat === "D3" && styles.selectedSeatText,
                  ]}
                >
                  D3
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          
          <View style={styles.seatLegend}>
            <View style={styles.legendItem}>
              <View style={styles.legendAvailable} />
              <Text style={styles.legendText}>Available</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={styles.legendSelected} />
              <Text style={styles.legendText}>Selected</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={styles.legendUnavailable} />
              <Text style={styles.legendText}>Unavailable</Text>
            </View>
          </View>
          
          <View style={styles.selectedSeatContainer}>
            <Text style={styles.selectedSeatLabel}>Selected Seat:</Text>
            <Text style={styles.selectedSeatValue}>
              {selectedSeat || "No seat selected"}
            </Text>
          </View>
        </View>
        
        <Button
          title="Continue to Payment"
          onPress={handleContinue}
          style={styles.continueButton}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: Colors.primary,
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    flex: 1,
  },
  tripSummary: {
    margin: 16,
    padding: 20,
    backgroundColor: Colors.primary,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  tripSummaryTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  tripSummaryDetails: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  section: {
    margin: 16,
    padding: 20,
    backgroundColor: Colors.card,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 16,
  },
  passengerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  passengerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginRight: 8,
  },
  adultBadge: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  adultBadgeText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  inputContainer: {
    flex: 1,
    marginBottom: 16,
    marginRight: 8,
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: Colors.secondary,
  },
  inputIcon: {
    marginRight: 8,
  },
  validIcon: {
    marginLeft: 8,
  },
  inputLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text.primary,
  },
  selectInput: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: Colors.secondary,
  },
  selectInputText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
    marginLeft: 8,
  },
  seatSelectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  seatSelectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  seatSelectionSubtitle: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
  },
  seatMap: {
    alignItems: "center",
    marginBottom: 16,
  },
  seatRow: {
    flexDirection: "row",
    marginBottom: 16,
  },
  seat: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.secondary,
    alignItems: "center",
    justifyContent: "center",
    margin: 4,
    borderWidth: 2,
    borderColor: "transparent",
  },
  selectedSeat: {
    backgroundColor: Colors.primary,
    borderColor: Colors.accent,
  },
  unavailableSeat: {
    backgroundColor: "#F5F5F5",
    borderColor: "#E0E0E0",
  },
  seatText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  selectedSeatText: {
    color: "#fff",
  },
  unavailableSeatText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  seatSpacer: {
    width: 20,
  },
  seatLegend: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendAvailable: {
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: Colors.secondary,
    marginRight: 4,
  },
  legendSelected: {
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginRight: 4,
  },
  legendUnavailable: {
    width: 16,
    height: 16,
    borderRadius: 4,
    backgroundColor: "#E1E1E1",
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  selectedSeatContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.secondary,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  selectedSeatLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
    marginRight: 8,
  },
  selectedSeatValue: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  continueButton: {
    margin: 16,
    marginBottom: 32,
    borderRadius: 12,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 16,
  },
  errorBackButton: {
    width: 200,
  },
});