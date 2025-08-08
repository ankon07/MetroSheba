import React from "react";
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { Award, Gift, ChevronRight, Clock, Ticket } from "lucide-react-native";
import { useUserStore } from "@/store/userStore";
import Colors from "@/constants/colors";
import Check from "@/components/Check";
import Users from "@/components/Users";
import Star from "@/components/Star";

// Loyalty program benefits
const loyaltyBenefits = {
  "Standard": [
    "Basic booking features",
    "Email notifications",
    "Access to special offers",
  ],
  "Gold": [
    "Priority customer support",
    "Free seat selection",
    "10% discount on selected routes",
    "Flexible booking changes",
  ],
  "Platinum": [
    "Dedicated customer support line",
    "Free cancellation on most bookings",
    "20% discount on selected routes",
    "Priority boarding",
    "Lounge access at select stations",
  ],
};

// Available rewards
const availableRewards = [
  {
    id: "reward1",
    title: "Free Upgrade to Business Class",
    points: 500,
    expiresIn: "30 days",
  },
  {
    id: "reward2",
    title: "50% Off Next Booking",
    points: 750,
    expiresIn: "60 days",
  },
  {
    id: "reward3",
    title: "Companion Ticket",
    points: 1000,
    expiresIn: "90 days",
  },
];

export default function LoyaltyProgramScreen() {
  const router = useRouter();
  const { user } = useUserStore();
  
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateTitle}>Not Logged In</Text>
          <Text style={styles.emptyStateDescription}>
            Please log in to view your loyalty program details
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Calculate progress to next tier
  const tierPoints = {
    "Standard": 0,
    "Gold": 1000,
    "Platinum": 2500,
  };
  
  const currentTierPoints = tierPoints[user.membershipLevel as keyof typeof tierPoints];
  const nextTier = user.membershipLevel === "Standard" ? "Gold" : 
                  user.membershipLevel === "Gold" ? "Platinum" : null;
  const nextTierPoints = nextTier ? tierPoints[nextTier as keyof typeof tierPoints] : null;
  const pointsToNextTier = nextTierPoints ? nextTierPoints - user.miles : 0;
  const progressPercentage = nextTierPoints ? (user.miles / nextTierPoints) * 100 : 100;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ title: "Loyalty Program" }} />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.membershipCard}>
          <View style={styles.membershipHeader}>
            <Text style={styles.membershipTitle}>Travel Ease Rewards</Text>
            <Award size={24} color="#FFD700" />
          </View>
          
          <View style={styles.memberInfo}>
            <Text style={styles.memberName}>{user.firstName} {user.lastName}</Text>
            <View style={styles.tierContainer}>
              <Text style={styles.tierLabel}>{user.membershipLevel}</Text>
              <Text style={styles.memberSince}>Member since {new Date(user.memberSince).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</Text>
            </View>
          </View>
          
          <View style={styles.pointsContainer}>
            <Text style={styles.pointsLabel}>Total Points</Text>
            <Text style={styles.pointsValue}>{user.miles}</Text>
          </View>
          
          {nextTier && (
            <View style={styles.progressContainer}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Progress to {nextTier}</Text>
                <Text style={styles.progressPoints}>{pointsToNextTier} points needed</Text>
              </View>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { width: `${Math.min(progressPercentage, 100)}%` }
                  ]} 
                />
              </View>
            </View>
          )}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Benefits</Text>
          
          {loyaltyBenefits[user.membershipLevel as keyof typeof loyaltyBenefits].map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <View style={styles.benefitIcon}>
                <Check size={16} color="#fff" />
              </View>
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Rewards</Text>
          
          {availableRewards.map((reward) => (
            <TouchableOpacity 
              key={reward.id} 
              style={styles.rewardItem}
              onPress={() => console.log("Reward selected:", reward.id)}
            >
              <View style={styles.rewardLeft}>
                <Gift size={20} color={Colors.primary} style={styles.rewardIcon} />
                <View>
                  <Text style={styles.rewardTitle}>{reward.title}</Text>
                  <View style={styles.rewardDetails}>
                    <Clock size={12} color={Colors.text.secondary} />
                    <Text style={styles.rewardExpiry}>Expires in {reward.expiresIn}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.rewardRight}>
                <Text style={styles.rewardPoints}>{reward.points} pts</Text>
                <ChevronRight size={16} color={Colors.text.secondary} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How to Earn Points</Text>
          
          <View style={styles.earnItem}>
            <View style={[styles.earnIcon, { backgroundColor: "#E3F2FD" }]}>
              <Ticket size={20} color={Colors.primary} />
            </View>
            <View style={styles.earnContent}>
              <Text style={styles.earnTitle}>Book a Trip</Text>
              <Text style={styles.earnDescription}>
                Earn 1 point for every $1 spent on bookings
              </Text>
            </View>
          </View>
          
          <View style={styles.earnItem}>
            <View style={[styles.earnIcon, { backgroundColor: "#E8F5E9" }]}>
              <Users size={20} color="#4CAF50" />
            </View>
            <View style={styles.earnContent}>
              <Text style={styles.earnTitle}>Refer a Friend</Text>
              <Text style={styles.earnDescription}>
                Earn 100 points for each friend who signs up and completes a booking
              </Text>
            </View>
          </View>
          
          <View style={styles.earnItem}>
            <View style={[styles.earnIcon, { backgroundColor: "#FFF3E0" }]}>
              <Star size={20} color="#FF9800" />
            </View>
            <View style={styles.earnContent}>
              <Text style={styles.earnTitle}>Write a Review</Text>
              <Text style={styles.earnDescription}>
                Earn 50 points for each verified review of your trips
              </Text>
            </View>
          </View>
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
  scrollContent: {
    padding: 16,
  },
  membershipCard: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  membershipHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  membershipTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
  },
  memberInfo: {
    marginBottom: 16,
  },
  memberName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  tierContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  tierLabel: {
    fontSize: 14,
    color: "#FFD700",
    fontWeight: "700",
    marginRight: 8,
  },
  memberSince: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  pointsContainer: {
    marginBottom: 16,
  },
  pointsLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 4,
  },
  pointsValue: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
  },
  progressContainer: {
    marginTop: 8,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  progressPoints: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.8)",
  },
  progressBar: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FFD700",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 16,
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  benefitIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  benefitText: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  rewardItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.secondary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  rewardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rewardIcon: {
    marginRight: 12,
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  rewardDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  rewardExpiry: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  rewardRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  rewardPoints: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.primary,
    marginRight: 8,
  },
  earnItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  earnIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  earnContent: {
    flex: 1,
  },
  earnTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  earnDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: "center",
  },
});