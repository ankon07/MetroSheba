import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { Calendar, Clock, Info, Tag, Share2 } from "lucide-react-native";
import Button from "@/components/Button";
import Colors from "@/constants/colors";

// Extended offer details for Dhaka Metro
const offerDetails = {
  "offer1": {
    id: "offer1",
    title: "Student Discount",
    description: "20% off with student ID",
    fullDescription: "Students get 20% off on all Dhaka Metro Rail journeys. Perfect for daily commuting to universities and colleges. Valid with student ID card from recognized educational institutions.",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    discount: "20%",
    validUntil: "2025-12-31",
    terms: [
      "Valid student ID required at all times",
      "Applicable on all MRT Line-6 stations",
      "Cannot be combined with other offers",
      "Valid for students aged 18-25",
      "Subject to verification"
    ],
    routes: ["Uttara North - Motijheel", "Pallabi - Karwan Bazar", "Mirpur-10 - Secretariat", "Agargaon - Dhaka University"]
  },
  "offer2": {
    id: "offer2",
    title: "Off-Peak Hours Special",
    description: "From ৳15 one-way",
    fullDescription: "Travel during off-peak hours and save money! Enjoy discounted fares starting from just ৳15 one-way during non-rush hours. Perfect for flexible travelers and tourists exploring Dhaka.",
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    discount: "From ৳15",
    validUntil: "2025-08-31",
    terms: [
      "Valid during off-peak hours: 10 AM - 4 PM and after 8 PM",
      "Weekends: All day discounted rates",
      "Limited seats available at advertised price",
      "Not applicable during rush hours",
      "Subject to availability"
    ],
    routes: ["Uttara North - Agargaon", "Mirpur-11 - Farmgate", "Bijoy Sarani - New Market", "Shahbagh - Motijheel"]
  },
  "offer3": {
    id: "offer3",
    title: "Weekend Explorer Pass",
    description: "Unlimited rides for ৳100",
    fullDescription: "Explore Dhaka on weekends with unlimited metro rides for just ৳100 per day. Visit shopping malls, tourist attractions, and cultural sites across the city without worrying about individual ticket costs.",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    discount: "৳100/day",
    validUntil: "2025-09-30",
    terms: [
      "Valid on Saturdays and Sundays only",
      "24-hour validity from first use",
      "Non-transferable pass",
      "Valid on all MRT Line-6 stations",
      "Subject to availability"
    ],
    routes: ["All MRT Line-6 stations"]
  },
  "offer4": {
    id: "offer4",
    title: "Senior Citizen Discount",
    description: "50% off for 60+ age",
    fullDescription: "Senior citizens aged 60 and above enjoy 50% discount on all Dhaka Metro Rail journeys. Making public transport more accessible and affordable for our elderly citizens.",
    image: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    discount: "50%",
    validUntil: "2025-12-31",
    terms: [
      "Valid for citizens aged 60 and above",
      "National ID or passport required for verification",
      "Applicable on all routes and times",
      "Cannot be combined with other offers",
      "Valid throughout the year"
    ],
    routes: ["All MRT Line-6 stations", "Future Line-1 and Line-5 stations"]
  },
  "offer5": {
    id: "offer5",
    title: "Family Package",
    description: "Kids under 10 travel free",
    fullDescription: "Make family outings more affordable! Children under 10 years travel free when accompanied by paying adults. Perfect for family trips to shopping centers, parks, and cultural attractions.",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    discount: "Kids Free",
    validUntil: "2025-12-31",
    terms: [
      "Children must be under 10 years of age",
      "Maximum 2 children per paying adult",
      "Age verification may be required",
      "Valid on all routes and times",
      "Cannot be combined with other discounts"
    ],
    routes: ["All MRT Line-6 stations", "Perfect for trips to Bashundhara City", "New Market", "Dhanmondi Lake"]
  },
  "offer6": {
    id: "offer6",
    title: "Monthly Pass Special",
    description: "Save up to 30%",
    fullDescription: "Regular commuters save big with monthly passes! Get up to 30% savings compared to daily tickets. Perfect for office workers, students, and frequent travelers on the Dhaka Metro Rail network.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    discount: "30%",
    validUntil: "2025-12-31",
    terms: [
      "Valid for 30 consecutive days from activation",
      "Non-transferable and non-refundable",
      "Unlimited rides within validity period",
      "Available at all metro stations",
      "Auto-renewal option available"
    ],
    routes: ["All MRT Line-6 stations", "Future expansion lines included"]
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
          title: "Metro Offer Details",
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
                  Visit any Dhaka Metro Rail station
                </Text>
              </View>
              <View style={styles.redemptionStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>2</Text>
                </View>
                <Text style={styles.stepText}>
                  Show this offer and required documents at ticket counter
                </Text>
              </View>
              <View style={styles.redemptionStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>3</Text>
                </View>
                <Text style={styles.stepText}>
                  Discount will be applied to your ticket purchase
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
                  This offer is subject to change without notice. Dhaka Mass Transit Company Limited reserves the right to modify or cancel this promotion at any time. For complete terms and conditions, please contact customer service at any metro station.
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
          title="Book Metro Ticket"
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
