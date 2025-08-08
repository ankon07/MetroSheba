import React, { useState } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { ArrowLeft, Filter, ArrowUpDown } from "lucide-react-native";
import TripCard from "@/components/TripCard";
import { useSearchStore } from "@/store/searchStore";
import { metroTrips } from "@/mocks/trips";
import Colors from "@/constants/colors";

type SortOption = "recommended" | "price" | "duration" | "departure";

export default function ResultsScreen() {
  const router = useRouter();
  const { searchParams, searchResults } = useSearchStore();
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [showSortOptions, setShowSortOptions] = useState(false);

  // Use metro trips if no search results, filter by search parameters if available
  const hasResults = searchResults.length > 0;
  let filteredTrips = metroTrips;
  
  // Filter by search parameters if available
  if (searchParams.from?.city && searchParams.to?.city) {
    filteredTrips = metroTrips.filter(trip => 
      trip.from.name === searchParams.from?.city && 
      trip.to.name === searchParams.to?.city
    );
  }
  
  // If no specific route searched, show a variety of trips from different stations
  if (!searchParams.from?.city || !searchParams.to?.city) {
    // Get today's trips and limit to reasonable number
    const today = new Date().toISOString().split('T')[0];
    filteredTrips = metroTrips
      .filter(trip => trip.departureDate === today)
      .slice(0, 20);
  }
  
  const displayResults = hasResults ? searchResults : filteredTrips.slice(0, 15).map(trip => ({
    id: trip.id,
    from: { city: trip.from.name, station: `${trip.from.name} Metro Station`, code: trip.from.code },
    to: { city: trip.to.name, station: `${trip.to.name} Metro Station`, code: trip.to.code },
    departureDate: trip.departureDate,
    departureTime: trip.departureTime,
    arrivalDate: trip.arrivalDate,
    arrivalTime: trip.arrivalTime,
    duration: trip.duration,
    price: trip.price,
    transportationType: "train" as const,
    company: "Dhaka Mass Transit Company Limited",
    class: "Standard"
  }));

  const sortedResults = [...displayResults].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.price - b.price;
      case "duration":
        return a.duration.localeCompare(b.duration);
      case "departure":
        return a.departureTime.localeCompare(b.departureTime);
      default:
        return 0; // Keep original order for "recommended"
    }
  });

  const handleTripSelect = (tripId: string) => {
    router.push({
      pathname: "/trips/details",
      params: { id: tripId }
    });
  };

  const toggleSortOptions = () => {
    setShowSortOptions(!showSortOptions);
  };

  const handleSortSelect = (option: SortOption) => {
    setSortBy(option);
    setShowSortOptions(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen
        options={{
          headerTitle: "Available Trains",
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color={Colors.primary} />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.routeInfo}>
        <Text style={styles.routeTitle}>
          {searchParams.from?.city} — {searchParams.to?.city}
        </Text>
        <Text style={styles.routeDetails}>
          {new Date(searchParams.date).toLocaleDateString()} • {searchParams.passengers} {searchParams.passengers === 1 ? "Adult" : "Adults"}
        </Text>
      </View>

      <View style={styles.filterBar}>
        <TouchableOpacity style={styles.filterButton}>
          <Filter size={16} color={Colors.text.primary} />
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sortButton} onPress={toggleSortOptions}>
          <ArrowUpDown size={16} color={Colors.text.primary} />
          <Text style={styles.sortText}>
            Sort by: {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}
          </Text>
        </TouchableOpacity>
      </View>

      {showSortOptions && (
        <View style={styles.sortOptionsContainer}>
          <TouchableOpacity
            style={[
              styles.sortOption,
              sortBy === "recommended" && styles.selectedSortOption,
            ]}
            onPress={() => handleSortSelect("recommended")}
          >
            <Text
              style={[
                styles.sortOptionText,
                sortBy === "recommended" && styles.selectedSortOptionText,
              ]}
            >
              Recommended
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sortOption,
              sortBy === "price" && styles.selectedSortOption,
            ]}
            onPress={() => handleSortSelect("price")}
          >
            <Text
              style={[
                styles.sortOptionText,
                sortBy === "price" && styles.selectedSortOptionText,
              ]}
            >
              Price
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sortOption,
              sortBy === "duration" && styles.selectedSortOption,
            ]}
            onPress={() => handleSortSelect("duration")}
          >
            <Text
              style={[
                styles.sortOptionText,
                sortBy === "duration" && styles.selectedSortOptionText,
              ]}
            >
              Duration
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.sortOption,
              sortBy === "departure" && styles.selectedSortOption,
            ]}
            onPress={() => handleSortSelect("departure")}
          >
            <Text
              style={[
                styles.sortOptionText,
                sortBy === "departure" && styles.selectedSortOptionText,
              ]}
            >
              Departure Time
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={sortedResults}
        renderItem={({ item }) => (
          <TripCard
            trip={item}
            onPress={() => handleTripSelect(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No trips found</Text>
            <Text style={styles.emptyDescription}>
              Try changing your search criteria or dates
            </Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  routeInfo: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  routeTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  routeDetails: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  filterBar: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 12,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
    marginLeft: 4,
  },
  sortButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
  },
  sortText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
    marginLeft: 4,
  },
  sortOptionsContainer: {
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    padding: 8,
  },
  sortOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  selectedSortOption: {
    backgroundColor: Colors.secondary,
  },
  sortOptionText: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  selectedSortOptionText: {
    fontWeight: "600",
    color: Colors.primary,
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    marginTop: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: "center",
  },
});
