import React, { useState, useMemo } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { ArrowLeft, Filter, ArrowUpDown } from "lucide-react-native";
import TripCard from "@/components/TripCard";
import FilterModal, { FilterOptions } from "@/components/FilterModal";
import { useSearchStore } from "@/store/searchStore";
import { metroTrips } from "@/mocks/trips";
import { mrtLine6Stations } from "@/mocks/locations";
import Colors from "@/constants/colors";
import LoadingOverlay from "@/components/LoadingOverlay";

type SortOption = "recommended" | "price" | "duration" | "departure";

export default function ResultsScreen() {
  const router = useRouter();
  const { searchParams, searchResults } = useSearchStore();
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions>({
    priceRange: { min: 0, max: 1000 },
    timeRange: { start: "00:00", end: "23:59" },
    stations: [],
    showOnlyDirectRoutes: false,
    showEcoFriendlyOnly: false,
    minOnTimePerformance: 0,
  });

  // Get all available trips and apply filters
  const allTrips = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    let trips = metroTrips.filter(trip => trip.departureDate === today);
    
    // If specific route is searched, filter by it
    if (searchParams.from?.city && searchParams.to?.city) {
      trips = trips.filter(trip => 
        trip.from.name === searchParams.from?.city && 
        trip.to.name === searchParams.to?.city
      );
    }
    
    return trips;
  }, [searchParams.from?.city, searchParams.to?.city]);

  // Apply filters to trips
  const filteredTrips = useMemo(() => {
    let filtered = allTrips;

    // Price filter
    if (activeFilters.priceRange.max < 1000) {
      filtered = filtered.filter(trip => 
        trip.price >= activeFilters.priceRange.min && 
        trip.price <= activeFilters.priceRange.max
      );
    }

    // Time filter
    if (activeFilters.timeRange.start !== "00:00" || activeFilters.timeRange.end !== "23:59") {
      filtered = filtered.filter(trip => {
        const departureTime = trip.departureTime;
        return departureTime >= activeFilters.timeRange.start && 
               departureTime <= activeFilters.timeRange.end;
      });
    }

    // Station filter (via stations)
    if (activeFilters.stations.length > 0) {
      filtered = filtered.filter(trip => 
        activeFilters.stations.includes(trip.from.id) || 
        activeFilters.stations.includes(trip.to.id)
      );
    }

    // Eco-friendly filter
    if (activeFilters.showEcoFriendlyOnly) {
      filtered = filtered.filter(trip => trip.isEcoFriendly);
    }

    // On-time performance filter
    if (activeFilters.minOnTimePerformance > 0) {
      filtered = filtered.filter(trip => trip.onTimePerformance >= activeFilters.minOnTimePerformance);
    }

    return filtered;
  }, [allTrips, activeFilters]);

  const displayResults = filteredTrips.map(trip => ({
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

  const handleFilterApply = (filters: FilterOptions) => {
    setActiveFilters(filters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (activeFilters.priceRange.max < 1000) count++;
    if (activeFilters.timeRange.start !== "00:00" || activeFilters.timeRange.end !== "23:59") count++;
    if (activeFilters.stations.length > 0) count++;
    if (activeFilters.showOnlyDirectRoutes) count++;
    if (activeFilters.showEcoFriendlyOnly) count++;
    if (activeFilters.minOnTimePerformance > 0) count++;
    return count;
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <LoadingOverlay visible={loading} message="Loading search results..." />
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
          {searchParams.from?.city && searchParams.to?.city 
            ? `${searchParams.from.city} — ${searchParams.to.city}`
            : "All Available Trains"
          }
        </Text>
        <Text style={styles.routeDetails}>
          {new Date(searchParams.date).toLocaleDateString()} • {searchParams.passengers} {searchParams.passengers === 1 ? "Adult" : "Adults"}
        </Text>
        <Text style={styles.resultsCount}>
          {displayResults.length} trains found
        </Text>
      </View>

      <View style={styles.filterBar}>
        <TouchableOpacity 
          style={[
            styles.filterButton,
            getActiveFilterCount() > 0 && styles.activeFilterButton
          ]} 
          onPress={() => setShowFilterModal(true)}
        >
          <Filter size={16} color={getActiveFilterCount() > 0 ? Colors.background : Colors.text.primary} />
          <Text style={[
            styles.filterText,
            getActiveFilterCount() > 0 && styles.activeFilterText
          ]}>
            Filter {getActiveFilterCount() > 0 && `(${getActiveFilterCount()})`}
          </Text>
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
            <Text style={styles.emptyTitle}>No trains found</Text>
            <Text style={styles.emptyDescription}>
              Try adjusting your filters or search criteria
            </Text>
          </View>
        }
      />

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleFilterApply}
        currentFilters={activeFilters}
        availableStations={mrtLine6Stations}
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
    marginBottom: 4,
  },
  resultsCount: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "600",
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
  activeFilterButton: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text.primary,
    marginLeft: 4,
  },
  activeFilterText: {
    color: Colors.background,
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
