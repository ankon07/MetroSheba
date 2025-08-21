import React from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { CheckCircle, Ticket, Wallet, Share2, Download, ArrowLeft } from "lucide-react-native";
import Button from "@/components/Button";
import QRCodeDisplay from "@/components/QRCodeDisplay";
import AnimatedCard from "@/components/AnimatedCard";
import { mockTrips } from "@/mocks/trips";
import { useUserStore } from "@/store/userStore";
import Colors from "@/constants/colors";

export default function ConfirmationScreen() {
  const router = useRouter();
  const { tripId, paymentMethod } = useLocalSearchParams<{ tripId: string; paymentMethod?: string }>();
  const { trips } = useUserStore();
  
  // Find the trip in our trips or mock data
  const userTrip = trips.find((t) => t.id === tripId);
  const mockTrip = mockTrips.find((t) => t.id === tripId);
  const trip = userTrip || mockTrip;
  
  // Generate a booking reference if not available
  const bookingRef = trip?.bookingRef || `MTR${Math.floor(Math.random() * 100000)}`;
  
  const handleViewTrips = () => {
    router.push("/trips");
  };
  
  const handleViewTicket = () => {
    router.push(`/tickets/${tripId}`);
  };
  
  const handleAddToWallet = () => {
    // In a real app, this would add the ticket to the wallet
    // Add to wallet functionality would go here
    // For now, show a success message
    alert("Ticket added to wallet successfully!");
  };
  
  const handleShare = () => {
    // In a real app, this would share the ticket
    alert("Sharing ticket...");
  };

  const handleDownload = () => {
    // In a real app, this would download the ticket as PDF
    console.log("Download ticket");
  };

  const getPaymentMethodDisplay = () => {
    switch (paymentMethod) {
      case "bkash":
        return "bKash";
      case "nagad":
        return "Nagad";
      case "card":
        return "Card";
      default:
        return "Card";
    }
  };
  
  if (!trip) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Trip not found</Text>
          <Button
            title="Go to My Trips"
            onPress={handleViewTrips}
            style={styles.errorBackButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/trips")} style={styles.backButton}>
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Successful</Text>
        <View style={styles.placeholder} />
      </View>
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <AnimatedCard delay={0}>
          <View style={styles.successContainer}>
            <View style={styles.successIconContainer}>
              <CheckCircle size={80} color="#fff" />
            </View>
            <Text style={styles.successTitle}>Payment Successful!</Text>
            <Text style={styles.successMessage}>Your metro ticket is ready</Text>
            <Text style={styles.paymentMethodText}>
              Paid via {getPaymentMethodDisplay()}
            </Text>
          </View>
        </AnimatedCard>
        
        <AnimatedCard delay={200}>
          <View style={styles.ticketContainer}>
            <View style={styles.ticketHeader}>
              <Text style={styles.ticketTitle}>Metro E-Ticket</Text>
              <Text style={styles.bookingRef}>Booking ID: {bookingRef}</Text>
            </View>
            
            <View style={styles.ticketBody}>
              <View style={styles.routeContainer}>
                <Text style={styles.cityName}>{trip.from.city}</Text>
                <View style={styles.routeLineContainer}>
                  <View style={styles.routeLine} />
                  <View style={styles.routeArrow} />
                </View>
                <Text style={styles.cityName}>{trip.to.city}</Text>
              </View>
              
              <View style={styles.stationContainer}>
                <Text style={styles.stationName}>{trip.from.station || "Metro Station"}</Text>
                <Text style={styles.stationName}>{trip.to.station || "Metro Station"}</Text>
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
                    <Text style={styles.tripDetailLabel}>Line</Text>
                    <Text style={styles.tripDetailValue}>MRT Line-6</Text>
                  </View>
                  
                  <View style={styles.tripDetailItem}>
                    <Text style={styles.tripDetailLabel}>Fare</Text>
                    <Text style={styles.tripDetailValue}>৳{trip.price.toFixed(2)}</Text>
                  </View>
                </View>
                
                <View style={styles.tripDetailItem}>
                  <Text style={styles.tripDetailLabel}>Passenger</Text>
                  <Text style={styles.tripDetailValue}>1 Adult</Text>
                </View>
              </View>
            </View>
          </View>
        </AnimatedCard>

        <AnimatedCard delay={400}>
          <View style={styles.qrContainer}>
            <Text style={styles.qrTitle}>Scan to Enter Metro</Text>
            <QRCodeDisplay 
              value={bookingRef} 
              size={200} 
              showValue={false}
            />
            <Text style={styles.qrInstructions}>
              Show this QR code at the metro station gates
            </Text>
            <View style={styles.validityContainer}>
              <Text style={styles.validityText}>
                Valid for: {new Date(trip.departureDate).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </AnimatedCard>
        
        <AnimatedCard delay={600}>
          <View style={styles.actionsContainer}>
            <TouchableOpacity style={styles.actionButton} onPress={handleAddToWallet}>
              <Wallet size={20} color={Colors.primary} />
              <Text style={styles.actionButtonText}>Add to Wallet</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
              <Share2 size={20} color={Colors.primary} />
              <Text style={styles.actionButtonText}>Share</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleDownload}>
              <Download size={20} color={Colors.primary} />
              <Text style={styles.actionButtonText}>Download</Text>
            </TouchableOpacity>
          </View>
        </AnimatedCard>

        <AnimatedCard delay={800}>
          <View style={styles.importantNotesContainer}>
            <Text style={styles.importantNotesTitle}>Important Notes</Text>
            <View style={styles.noteItem}>
              <Text style={styles.noteText}>• Keep this QR code ready before entering the station</Text>
            </View>
            <View style={styles.noteItem}>
              <Text style={styles.noteText}>• This ticket is valid only for the selected date and time</Text>
            </View>
            <View style={styles.noteItem}>
              <Text style={styles.noteText}>• No refund available after ticket purchase</Text>
            </View>
            <View style={styles.noteItem}>
              <Text style={styles.noteText}>• Contact support for any issues: +880-1234-567890</Text>
            </View>
          </View>
        </AnimatedCard>
        
        <View style={styles.buttonContainer}>
          <Button
            title="View Ticket"
            onPress={handleViewTicket}
            icon={<Ticket size={20} color="#fff" style={styles.buttonIcon} />}
            style={styles.viewTicketButton}
          />
          <Button
            title="View My Trips"
            onPress={handleViewTrips}
            variant="outline"
            style={styles.viewTripsButton}
          />
        </View>
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    padding: 16,
  },
  successContainer: {
    alignItems: "center",
    backgroundColor: Colors.success,
    borderRadius: 16,
    padding: 32,
    marginBottom: 16,
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
    marginBottom: 8,
  },
  paymentMethodText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    fontWeight: "500",
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
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
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
    marginBottom: 0,
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
  qrContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 16,
  },
  qrInstructions: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: "center",
    marginTop: 16,
    marginBottom: 12,
  },
  validityContainer: {
    backgroundColor: Colors.primary + "15",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  validityText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "600",
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionButton: {
    alignItems: "center",
    padding: 12,
  },
  actionButtonText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "500",
    marginTop: 4,
  },
  importantNotesContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  importantNotesTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 12,
  },
  noteItem: {
    marginBottom: 8,
  },
  noteText: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonContainer: {
    gap: 12,
    marginBottom: 32,
  },
  viewTicketButton: {
    marginBottom: 0,
  },
  viewTripsButton: {
    marginBottom: 0,
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
