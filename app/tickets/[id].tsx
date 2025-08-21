import React from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Share } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { ArrowLeft, Share2, Download, Train, Clock, MapPin, QrCode } from "lucide-react-native";
import Button from "@/components/Button";
import QRCodeDisplay from "@/components/QRCodeDisplay";
import { mockTrips } from "@/mocks/trips";
import { useUserStore } from "@/store/userStore";
import Colors from "@/constants/colors";

export default function TicketDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { trips } = useUserStore();
  
  // Find the trip in user trips first, then fall back to mock data
  const userTrip = trips.find((t) => t.id === id);
  const mockTrip = mockTrips.find((t) => t.id === id);
  const trip = userTrip || mockTrip;
  
  if (!trip || !trip.bookingRef) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Ticket not found</Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const handleShare = async () => {
    try {
      await Share.share({
        message: `My Dhaka Metro Rail Ticket\n\nTrain: ${trip.bookingRef}\nFrom: ${trip.from.city}\nTo: ${trip.to.city}\nDate: ${new Date(trip.departureDate).toLocaleDateString()}\nTime: ${trip.departureTime}\n\nSee you on the metro!`,
        title: "Metro Rail Ticket"
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  const handleDownload = () => {
    console.log("Download ticket");
    // In a real app, this would download the ticket as PDF
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen
        options={{
          headerTitle: "My Ticket",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={Colors.primary} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity onPress={handleShare}>
              <Share2 size={24} color={Colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.ticketContainer}>
          <View style={styles.ticketHeader}>
            <View style={styles.logoContainer}>
              <Train size={32} color={Colors.text.light} />
              <Text style={styles.logoText}>Dhaka Metro Rail</Text>
            </View>
            <Text style={styles.ticketType}>MRT Line-6 Ticket</Text>
          </View>

          <View style={styles.qrContainer}>
            <QRCodeDisplay 
              value={trip.bookingRef || 'DMR-' + trip.id}
              size={140}
            />
          </View>

          <View style={styles.ticketDetails}>
            <View style={styles.bookingRefContainer}>
              <Text style={styles.bookingRefLabel}>Booking Reference</Text>
              <Text style={styles.bookingRefValue}>{trip.bookingRef}</Text>
            </View>

            <View style={styles.routeContainer}>
              <View style={styles.stationContainer}>
                <MapPin size={20} color={Colors.primary} />
                <View style={styles.stationInfo}>
                  <Text style={styles.stationName}>{trip.from.city}</Text>
                  <Text style={styles.stationCode}>{trip.from.station}</Text>
                </View>
              </View>
              
              <View style={styles.routeLine}>
                <View style={styles.routeDot} />
                <View style={styles.routeLineBar} />
                <View style={styles.routeDot} />
              </View>
              
              <View style={styles.stationContainer}>
                <MapPin size={20} color={Colors.primary} />
                <View style={styles.stationInfo}>
                  <Text style={styles.stationName}>{trip.to.city}</Text>
                  <Text style={styles.stationCode}>{trip.to.station}</Text>
                </View>
              </View>
            </View>

            <View style={styles.journeyDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>
                  {new Date(trip.departureDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Departure</Text>
                <Text style={styles.detailValue}>{trip.departureTime}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Arrival</Text>
                <Text style={styles.detailValue}>{trip.arrivalTime}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Duration</Text>
                <Text style={styles.detailValue}>{trip.duration}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Class</Text>
                <Text style={styles.detailValue}>{trip.class}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Fare</Text>
                <Text style={styles.fareValue}>৳{trip.price}</Text>
              </View>
            </View>
          </View>

          <View style={styles.ticketFooter}>
            <Text style={styles.footerText}>
              Please arrive at the station 10 minutes before departure
            </Text>
            <Text style={styles.footerSubtext}>
              Keep this ticket until you exit the station
            </Text>
          </View>
        </View>

        <View style={styles.importantInfo}>
          <Text style={styles.importantTitle}>Important Information</Text>
          <View style={styles.infoItem}>
            <Clock size={16} color={Colors.text.secondary} />
            <Text style={styles.infoText}>
              Platform information will be available 20 minutes before departure
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Train size={16} color={Colors.text.secondary} />
            <Text style={styles.infoText}>
              This ticket is valid only for the specified train and date
            </Text>
          </View>
          <View style={styles.infoItem}>
            <QrCode size={16} color={Colors.text.secondary} />
            <Text style={styles.infoText}>
              Scan the QR code at entry and exit gates
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={handleDownload}>
          <Download size={20} color={Colors.primary} />
          <Text style={styles.actionButtonText}>Download</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Share2 size={20} color={Colors.primary} />
          <Text style={styles.actionButtonText}>Share</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  ticketContainer: {
    margin: 16,
    backgroundColor: Colors.card,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  ticketHeader: {
    backgroundColor: Colors.primary,
    padding: 20,
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text.light,
    marginLeft: 8,
  },
  ticketType: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  qrContainer: {
    alignItems: "center",
    padding: 24,
    backgroundColor: Colors.secondary,
  },
  qrPlaceholder: {
    alignItems: "center",
  },
  qrText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 8,
    fontWeight: "500",
  },
  ticketDetails: {
    padding: 20,
  },
  bookingRefContainer: {
    alignItems: "center",
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  bookingRefLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  bookingRefValue: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primary,
    letterSpacing: 2,
  },
  routeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  stationContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  stationInfo: {
    marginLeft: 8,
  },
  stationName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  stationCode: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  routeLine: {
    alignItems: "center",
    marginHorizontal: 16,
  },
  routeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  routeLineBar: {
    width: 2,
    height: 40,
    backgroundColor: Colors.primary,
    marginVertical: 4,
  },
  journeyDetails: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 20,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  fareValue: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.primary,
  },
  ticketFooter: {
    backgroundColor: Colors.secondary,
    padding: 16,
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text.primary,
    textAlign: "center",
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: "center",
  },
  importantInfo: {
    margin: 16,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
  },
  importantTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 8,
    flex: 1,
  },
  actionButtons: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.card,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
    marginLeft: 8,
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
  },
});
