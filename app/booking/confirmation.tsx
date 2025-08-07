import React from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { CheckCircle, Ticket, Wallet, Share2 } from "lucide-react-native";
import Button from "@/components/Button";
import { mockTrips } from "@/mocks/trips";
import { useUserStore } from "@/store/userStore";
import Colors from "@/constants/colors";

export default function ConfirmationScreen() {
  const router = useRouter();
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const { trips } = useUserStore();
  
  // Find the trip in our trips or mock data
  const userTrip = trips.find((t) => t.id === tripId);
  const mockTrip = mockTrips.find((t) => t.id === tripId);
  const trip = userTrip || mockTrip;
  
  // Generate a booking reference if not available
  const bookingRef = trip?.bookingRef || `E${Math.floor(Math.random() * 10000)}/${Math.floor(Math.random() * 10000)}`;
  
  const handleViewTrips = () => {
    router.push("/trips");
  };
  
  const handleAddToWallet = () => {
    // In a real app, this would add the ticket to the wallet
    console.log("Add to wallet");
  };
  
  const handleShare = () => {
    // In a real app, this would share the ticket
    console.log("Share ticket");
  };
  
  if (!trip) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Trip not found</Text>
          <Button
            title="Go to My Trips"
            onPress={handleViewTrips}
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Booking Confirmation</Text>
        </View>
        
        <View style={styles.successContainer}>
          <View style={styles.successIconContainer}>
            <CheckCircle size={80} color="#fff" />
          </View>
          <Text style={styles.successTitle}>Booking Successful!</Text>
          <Text style={styles.successMessage}>Your ticket is ready</Text>
        </View>
        
        <View style={styles.ticketContainer}>
          <View style={styles.ticketHeader}>
            <Text style={styles.ticketTitle}>E-Ticket</Text>
            <Text style={styles.bookingRef}>Booking Ref: {bookingRef}</Text>
          </View>
          
          <View style={styles.ticketBody}>
            <View style={styles.routeContainer}>
              <Text style={styles.cityName}>{trip.from.city}</Text>
              <View style={styles.routeLineContainer}>
                <View style={styles.routeLine} />
              </View>
              <Text style={styles.cityName}>{trip.to.city}</Text>
            </View>
            
            <View style={styles.stationContainer}>
              <Text style={styles.stationName}>{trip.from.station}</Text>
              <Text style={styles.stationName}>{trip.to.station}</Text>
            </View>
            
            <View style={styles.ticketDivider} />
            
            <View style={styles.tripDetailsContainer}>
              <View style={styles.tripDetailItem}>
                <Text style={styles.tripDetailLabel}>Date</Text>
                <Text style={styles.tripDetailValue}>
                  {new Date(trip.departureDate).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
              </View>
              
              <View style={styles.tripDetailRow}>
                <View style={styles.tripDetailItem}>
                  <Text style={styles.tripDetailLabel}>Departure</Text>
                  <Text style={styles.tripDetailValue}>{trip.departureTime}</Text>
                </View>
                
                <View style={styles.tripDetailItem}>
                  <Text style={styles.tripDetailLabel}>Arrival</Text>
                  <Text style={styles.tripDetailValue}>{trip.arrivalTime}</Text>
                </View>
                
                <View style={styles.tripDetailItem}>
                  <Text style={styles.tripDetailLabel}>Duration</Text>
                  <Text style={styles.tripDetailValue}>{trip.duration}</Text>
                </View>
              </View>
              
              <View style={styles.tripDetailRow}>
                <View style={styles.tripDetailItem}>
                  <Text style={styles.tripDetailLabel}>Train</Text>
                  <Text style={styles.tripDetailValue}>{trip.company} {bookingRef.split("/")[0]}</Text>
                </View>
                
                <View style={styles.tripDetailItem}>
                  <Text style={styles.tripDetailLabel}>Class</Text>
                  <Text style={styles.tripDetailValue}>{trip.class}</Text>
                </View>
              </View>
              
              <View style={styles.tripDetailItem}>
                <Text style={styles.tripDetailLabel}>Passenger</Text>
                <Text style={styles.tripDetailValue}>Alex Johnson</Text>
              </View>
            </View>
            
            <View style={styles.barcodeContainer}>
              <Text style={styles.barcodeText}>{bookingRef}</Text>
            </View>
          </View>
        </View>
        
        <View style={styles.actionsContainer}>
          <Button
            title="Add to Wallet"
            onPress={handleAddToWallet}
            icon={<Wallet size={20} color="#fff" style={styles.buttonIcon} />}
            style={styles.walletButton}
          />
          
          <Button
            title="Share"
            onPress={handleShare}
            variant="outline"
            icon={<Share2 size={20} color={Colors.primary} style={styles.buttonIcon} />}
            style={styles.shareButton}
          />
        </View>
        
        <Button
          title="View My Trips"
          onPress={handleViewTrips}
          icon={<Ticket size={20} color="#fff" style={styles.buttonIcon} />}
          style={styles.viewTripsButton}
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
    backgroundColor: Colors.success,
    padding: 16,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  scrollContent: {
    paddingHorizontal: 0,
    paddingBottom: 16,
  },
  successContainer: {
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: Colors.success,
    paddingBottom: 32,
  },
  successIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
  },
  successMessage: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.9)",
  },
  ticketContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  ticketHeader: {
    backgroundColor: Colors.primary,
    padding: 20,
  },
  ticketTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  bookingRef: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  ticketBody: {
    padding: 20,
  },
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  cityName: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  routeLineContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 16,
    position: "relative",
  },
  routeLine: {
    height: 2,
    backgroundColor: Colors.primary,
    width: "100%",
  },
  routeArrow: {
    position: "absolute",
    right: 0,
    top: -4,
    width: 0,
    height: 0,
    borderLeftWidth: 8,
    borderLeftColor: Colors.primary,
    borderTopWidth: 5,
    borderTopColor: "transparent",
    borderBottomWidth: 5,
    borderBottomColor: "transparent",
  },
  stationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  stationName: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  ticketDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: 16,
  },
  tripDetailsContainer: {
    marginBottom: 20,
  },
  tripDetailItem: {
    marginBottom: 12,
  },
  tripDetailLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  tripDetailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  tripDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  barcodeContainer: {
    alignItems: "center",
    padding: 20,
    backgroundColor: Colors.secondary,
    borderRadius: 12,
  },
  barcodeText: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
    letterSpacing: 2,
  },
  tripDate: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 8,
    textAlign: "center",
  },
  actionsContainer: {
    flexDirection: "row",
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  walletButton: {
    flex: 1,
    marginRight: 8,
    borderRadius: 12,
  },
  shareButton: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 12,
  },
  buttonIcon: {
    marginRight: 8,
  },
  viewTripsButton: {
    marginBottom: 16,
    marginHorizontal: 16,
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
  backButton: {
    width: 200,
    borderRadius: 12,
  },
});