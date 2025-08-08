import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { Calendar, Clock, Info, Tag, Share2 } from "lucide-react-native";
import Button from "@/components/Button";
import Colors from "@/constants/colors";

// Extended offer details
const offerDetails = {
  "offer1": {
    id: "offer1",
    title: "20% Off Europe Trains",
    description: "Book by July 31st",
    fullDescription: "Enjoy 20% off on all train journeys across Europe. Perfect for summer vacations and exploring multiple cities. Valid for bookings made before July 31st, 2025 for travel until December 31st, 2025.",
    image: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    discount: "20%",
    validUntil: "2025-07-31",
    terms: [
      "Valid for bookings made before July 31st, 2025",
      "Travel period: Until December 31st, 2025",
      "Applicable on Economy and Business class",
      "Cannot be combined with other offers",
      "Subject to availability"
    ],
    routes: ["London - Paris", "Amsterdam - Berlin", "Madrid - Barcelona", "Rome - Florence"]
  },
  "offer2": {
    id: "offer2",
    title: "Summer Flight Deals",
    description: "From $49 one-way",
    fullDescription: "Take advantage of our summer flight deals with prices starting from just $49 one-way. Explore new destinations without breaking the bank. Limited seats available at this price.",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    discount: "From $49",
    validUntil: "2025-08-15",
    terms: [
      "Valid for bookings made before August 15th, 2025",
      "Travel period: June 1st - September 30th, 2025",
      "Limited seats available at advertised price",
      "Baggage restrictions may apply",
      "Subject to availability"
    ],
    routes: ["New York - Miami", "Los Angeles - San Francisco", "Chicago - Denver", "Boston - Washington DC"]
  },
  "offer3": {
    id: "offer3",
    title: "Weekend Getaway",
    description: "30% off hotel packages",
    fullDescription: "Plan the perfect weekend escape with our hotel packages at 30% off regular rates. Includes accommodation, breakfast, and special perks at select properties.",
    image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    discount: "30%",
    validUntil: "2025-09-30",
    terms: [
      "Valid for bookings made before September 30th, 2025",
      "Travel period: Until December 15th, 2025",
      "Minimum 2-night stay required",
      "Includes breakfast for two",
      "Subject to availability"
    ],
    routes: []
  },
  "offer4": {
    id: "offer4",
    title: "Business Class Upgrade",
    description: "Only $99 extra",
    fullDescription: "Upgrade your journey with our special Business Class offer. For just $99 extra, enjoy premium seating, priority boarding, and exclusive lounge access on select routes.",
    image: "https://images.unsplash.com/photo-1540339832862-474599807836?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    discount: "$99",
    validUntil: "2025-10-15",
    terms: [
      "Valid for bookings made before October 15th, 2025",
      "Travel period: Until December 31st, 2025",
      "Applicable on select routes only",
      "Subject to seat availability",
      "Cannot be combined with other offers"
    ],
    routes: ["London - New York", "Paris - Tokyo", "Dubai - Singapore", "Sydney - Los Angeles"]
  },
  "offer5": {
    id: "offer5",
    title: "Family Package",
    description: "Kids travel free",
    fullDescription: "Make family travel more affordable with our special family package. Children under 12 travel free when accompanied by two paying adults. Perfect for school holidays and family vacations.",
    image: "https://images.unsplash.com/photo-1541417904950-b855846fe074?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    discount: "Kids Free",
    validUntil: "2025-08-31",
    terms: [
      "Valid for bookings made before August 31st, 2025",
      "Travel period: Until December 15th, 2025",
      "Children must be under 12 years of age",
      "Maximum 2 children per 2 paying adults",
      "Valid ID required at check-in"
    ],
    routes: ["All domestic routes", "Select international routes"]
  },
  "offer6": {
    id: "offer6",
    title: "Last Minute Deals",
    description: "Up to 40% off",
    fullDescription: "Spontaneous traveler? Take advantage of our last-minute deals with up to 40% off regular fares. Book within 72 hours of departure and save big on your next adventure.",
    image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    discount: "40%",
    validUntil: "2025-12-31",
    terms: [
      "Must book within 72 hours of departure",
      "Valid for travel until December 31st, 2025",
      "Discount varies based on route and availability",
      "No changes or cancellations allowed",
      "Subject to availability"
    ],
    routes: ["All routes subject to availability"]
  }
};

export default function OfferDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("details");
  
  // Find the offer details
  const offer = offerDetails[id as keyof typeof offerDetails];
  
  if (!offer) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Offer not found</Text>
          <Button
            title="Go Back"
            onPress={() => router.back()}
            style={styles.backButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  const handleBookNow = () => {
    // Navigate to search with pre-filled parameters if applicable
    router.push("/search");
  };

  const handleShare = () => {
    // In a real app, this would share the offer
    console.log("Share offer:", offer.id);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen
        options={{
          title: "Offer Details",
          headerRight: () => (
            <TouchableOpacity onPress={handleShare}>
              <Share2 size={24} color={Colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: offer.image }}
          style={styles.offerImage}
          resizeMode="cover"
        />
        
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{offer.discount}</Text>
        </View>
        
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{offer.title}</Text>
          <Text style={styles.description}>{offer.fullDescription}</Text>
          
          <View style={styles.validityContainer}>
            <Calendar size={16} color={Colors.primary} style={styles.icon} />
            <Text style={styles.validityText}>
              Valid until {new Date(offer.validUntil).toLocaleDateString()}
            </Text>
          </View>
          
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "details" && styles.activeTab]}
              onPress={() => setActiveTab("details")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "details" && styles.activeTabText,
                ]}
              >
                Details
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "terms" && styles.activeTab]}
              onPress={() => setActiveTab("terms")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "terms" && styles.activeTabText,
                ]}
              >
                Terms & Conditions
              </Text>
            </TouchableOpacity>
          </View>
          
          {activeTab === "details" && (
            <View style={styles.tabContent}>
              {offer.routes.length > 0 && (
                <>
                  <Text style={styles.sectionTitle}>Available Routes</Text>
                  {offer.routes.map((route, index) => (
                    <View key={index} style={styles.routeItem}>
                      <Tag size={16} color={Colors.primary} style={styles.icon} />
                      <Text style={styles.routeText}>{route}</Text>
                    </View>
                  ))}
                </>
              )}
              
              <Text style={styles.sectionTitle}>How to Redeem</Text>
              <View style={styles.redemptionStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>1</Text>
                </View>
                <Text style={styles.stepText}>
                  Search for your desired route and dates
                </Text>
              </View>
              <View style={styles.redemptionStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={styles.stepText}>
                  Select this offer during checkout
                </Text>
              </View>
              <View style={styles.redemptionStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Text style={styles.stepText}>
                  Discount will be automatically applied
                </Text>
              </View>
            </View>
          )}
          
          {activeTab === "terms" && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>Terms & Conditions</Text>
              {offer.terms.map((term, index) => (
                <View key={index} style={styles.termItem}>
                  <Info size={16} color={Colors.text.secondary} style={styles.icon} />
                  <Text style={styles.termText}>{term}</Text>
                </View>
              ))}
              
              <View style={styles.disclaimerContainer}>
                <Text style={styles.disclaimerText}>
                  This offer is subject to change without notice. The company reserves the right to modify or cancel this promotion at any time. For complete terms and conditions, please contact customer service.
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <View style={styles.validityFooter}>
          <Clock size={16} color={Colors.text.secondary} />
          <Text style={styles.validityFooterText}>
            Offer expires in {Math.ceil((new Date(offer.validUntil).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days
          </Text>
        </View>
        <Button
          title="Book Now"
          onPress={handleBookNow}
          style={styles.bookButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  offerImage: {
    width: "100%",
    height: 200,
  },
  discountBadge: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  discountText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 24,
    marginBottom: 16,
  },
  validityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  icon: {
    marginRight: 8,
  },
  validityText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  tabContainer: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginRight: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  activeTabText: {
    fontWeight: "700",
    color: Colors.primary,
  },
  tabContent: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 16,
  },
  routeItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  routeText: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  redemptionStep: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  stepNumberText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  stepText: {
    fontSize: 14,
    color: Colors.text.primary,
    flex: 1,
  },
  termItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  termText: {
    fontSize: 14,
    color: Colors.text.primary,
    flex: 1,
  },
  disclaimerContainer: {
    backgroundColor: Colors.secondary,
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  disclaimerText: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontStyle: "italic",
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  validityFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  validityFooterText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 8,
  },
  bookButton: {
    width: "100%",
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