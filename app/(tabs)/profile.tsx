import React from "react";
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronRight, CreditCard, User, Award, LogOut, Edit, HelpCircle, Settings as SettingsIcon } from "lucide-react-native";
import ProfileStats from "@/components/ProfileStats";
import { useUserStore } from "@/store/userStore";
import Colors from "@/constants/colors";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useUserStore();

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateTitle}>Not Logged In</Text>
          <Text style={styles.emptyStateDescription}>
            Please log in to view your profile
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>My Profile</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => router.push("/profile/edit")}
          >
            <Edit size={20} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        <View style={styles.profileSection}>
          <Image
            source={{ uri: user.profileImage || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80" }}
            style={styles.profileImage}
          />
          <Text style={styles.userName}>{user.firstName} {user.lastName}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
          <TouchableOpacity 
            style={styles.membershipBadge}
            onPress={() => router.push("/profile/loyalty")}
          >
            <Award size={16} color={Colors.primary} />
            <Text style={styles.membershipText}>{user.membershipLevel} Member</Text>
          </TouchableOpacity>
        </View>

        <ProfileStats
          trips={user.trips}
          countries={user.countries}
          miles={user.miles}
        />

        <View style={styles.menuSection}>
          <Text style={styles.sectionTitle}>My Account</Text>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/trips")}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuItemIcon, { backgroundColor: "#E3F2FD" }]}>
                <CreditCard size={20} color={Colors.primary} />
              </View>
              <View>
                <Text style={styles.menuItemTitle}>My Trips</Text>
                <Text style={styles.menuItemDescription}>
                  View upcoming and past bookings
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={Colors.text.secondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/profile/edit")}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuItemIcon, { backgroundColor: "#E8F5E9" }]}>
                <User size={20} color="#4CAF50" />
              </View>
              <View>
                <Text style={styles.menuItemTitle}>Personal Information</Text>
                <Text style={styles.menuItemDescription}>
                  Manage your personal details
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={Colors.text.secondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/profile/payment-methods")}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuItemIcon, { backgroundColor: "#FFF3E0" }]}>
                <CreditCard size={20} color="#FF9800" />
              </View>
              <View>
                <Text style={styles.menuItemTitle}>Payment Methods</Text>
                <Text style={styles.menuItemDescription}>
                  Manage your cards and payment options
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={Colors.text.secondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/profile/loyalty")}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuItemIcon, { backgroundColor: "#F3E5F5" }]}>
                <Award size={20} color="#9C27B0" />
              </View>
              <View>
                <Text style={styles.menuItemTitle}>Loyalty Program</Text>
                <Text style={styles.menuItemDescription}>
                  View your rewards and benefits
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={Colors.text.secondary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/help")}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuItemIcon, { backgroundColor: "#E0F7FA" }]}>
                <HelpCircle size={20} color="#00BCD4" />
              </View>
              <View>
                <Text style={styles.menuItemTitle}>Help & Support</Text>
                <Text style={styles.menuItemDescription}>
                  Get help with your bookings and account
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={Colors.text.secondary} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push("/settings")}
          >
            <View style={styles.menuItemLeft}>
              <View style={[styles.menuItemIcon, { backgroundColor: "#ECEFF1" }]}>
                <SettingsIcon size={20} color="#607D8B" />
              </View>
              <View>
                <Text style={styles.menuItemTitle}>Settings</Text>
                <Text style={styles.menuItemDescription}>
                  Manage app preferences and notifications
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={Colors.text.secondary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => logout()}
        >
          <LogOut size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
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
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  profileSection: {
    alignItems: "center",
    padding: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  userName: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  membershipBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  membershipText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.primary,
    marginLeft: 4,
  },
  menuSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    margin: 16,
    borderWidth: 1,
    borderColor: Colors.error,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.error,
    marginLeft: 8,
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