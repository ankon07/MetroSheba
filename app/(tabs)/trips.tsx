import React, { useState } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import TripCard from "@/components/TripCard";
import Button from "@/components/Button";
import { useUserStore } from "@/store/userStore";
import { mockTrips } from "@/mocks/trips";
import Colors from "@/constants/colors";

type TripFilter = "upcoming" | "past" | "canceled";

export default function TripsScreen() {
  const router = useRouter();
  const { trips } = useUserStore();
  const [activeFilter, setActiveFilter] = useState<TripFilter>("upcoming");
  
  // For demo purposes, we'll use mock trips
  const displayTrips = trips.length > 0 ? trips : mockTrips;
  
  const filteredTrips = displayTrips.filter(trip => {
    if (activeFilter === "upcoming") {
      return !trip.status || trip.status === "upcoming";
    }
    return trip.status === activeFilter;
  });

  const handleTripPress = (tripId: string) => {
    router.push({
      pathname: "/trips/details",
      params: { id: tripId }
    });
  };

  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <Text style={styles.emptyStateTitle}>No {activeFilter} trips</Text>
      <Text style={styles.emptyStateDescription}>
        {activeFilter === "upcoming"
          ? "Book a trip to see it here"
          : `You don't have any ${activeFilter} trips`}
      </Text>
      {activeFilter === "upcoming" && (
        <Button
          title="Find a Trip"
          onPress={() => router.push("/search")}
          style={styles.findTripButton}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>My Trips</Text>
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === "upcoming" && styles.activeFilterButton,
            ]}
            onPress={() => setActiveFilter("upcoming")}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === "upcoming" && styles.activeFilterText,
              ]}
            >
              Upcoming
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === "past" && styles.activeFilterButton,
            ]}
            onPress={() => setActiveFilter("past")}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === "past" && styles.activeFilterText,
              ]}
            >
              Past
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              activeFilter === "canceled" && styles.activeFilterButton,
            ]}
            onPress={() => setActiveFilter("canceled")}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === "canceled" && styles.activeFilterText,
              ]}
            >
              Canceled
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredTrips}
        renderItem={({ item }) => (
          <TripCard
            trip={item}
            onPress={() => handleTripPress(item.id)}
            showPrice={false}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyState}
      />
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
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 16,
  },
  filterContainer: {
    flexDirection: "row",
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 4,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 6,
  },
  activeFilterButton: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.secondary,
  },
  activeFilterText: {
    color: "#fff",
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    marginTop: 80,
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
    marginBottom: 24,
  },
  findTripButton: {
    width: "100%",
    maxWidth: 200,
  },
});