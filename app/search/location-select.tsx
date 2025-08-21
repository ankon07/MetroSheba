import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { MapPin } from "lucide-react-native";
import SearchBar from "@/components/SearchBar";
import LoadingOverlay from "@/components/LoadingOverlay";
import { popularLocations } from "@/mocks/locations";
import { USE_FIREBASE } from "@/config/featureFlags";
import * as StationsService from "@/services/stationsService";
import { useSearchStore } from "@/store/searchStore";
import Colors from "@/constants/colors";

export default function LocationSelectScreen() {
  const router = useRouter();
  const { type } = useLocalSearchParams<{ type: "from" | "to" }>();
  const { setSearchParams } = useSearchStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [locations, setLocations] = useState(popularLocations);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    if (!USE_FIREBASE) return;
    
    try {
      setLoading(true);
      const stations = await StationsService.getStations();
      const locationData = stations.map(station => ({
        city: station.name,
        station: `${station.name} Metro Station`,
        code: station.code,
      }));
      setLocations(locationData);
    } catch (error) {
      console.warn('Failed to load stations from Firebase, using mocks');
    } finally {
      setLoading(false);
    }
  };

  const filteredLocations = locations.filter((location) =>
    location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.station.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLocationSelect = (location: typeof popularLocations[0]) => {
    if (type === "from") {
      setSearchParams({ from: location });
    } else {
      setSearchParams({ to: location });
    }
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <LoadingOverlay visible={loading} message="Loading stations..." />
      <View style={styles.header}>
        <Text style={styles.title}>
          {type === "from" ? "Select Origin" : "Select Destination"}
        </Text>
      </View>

      <SearchBar
        placeholder="Search cities or stations..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredLocations}
        keyExtractor={(item) => item.city}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.locationItem}
            onPress={() => handleLocationSelect(item)}
          >
            <MapPin size={20} color={Colors.primary} style={styles.locationIcon} />
            <View>
              <Text style={styles.cityName}>{item.city}</Text>
              <Text style={styles.stationName}>{item.station}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No locations found</Text>
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
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  listContent: {
    paddingTop: 16,
  },
  locationItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  locationIcon: {
    marginRight: 16,
  },
  cityName: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 2,
  },
  stationName: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  emptyContainer: {
    padding: 24,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
});