import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, ScrollView, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { MapPin, Train, Clock, Star, Navigation, Users, Zap, Shield, Info, ArrowRight } from "lucide-react-native";
import SearchBar from "@/components/SearchBar";
import { useSearchStore } from "@/store/searchStore";
import Colors from "@/constants/colors";
import MetroMapView from "@/components/MetroMapView";
import { mrtLine6Stations, calculateFare, getMapRegion } from "@/mocks/locations";
import { MetroStation } from "@/types";

const { width } = Dimensions.get('window');

// Dhaka city information and attractions near metro stations
const dhakaAttractions = [
  {
    id: "dhaka-university-area",
    name: "Dhaka University Area",
    description: "Historic university campus and surrounding cultural sites",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=200&fit=crop",
    nearestStation: "dhaka-university",
    stationName: "Dhaka University",
    distance: "0.2 km",
    rating: 4.6,
    attractions: ["Dhaka University", "Curzon Hall", "TSC", "Central Library"],
    category: "Educational & Cultural"
  },
  {
    id: "shahbag-area",
    name: "Shahbag Cultural Hub",
    description: "Museums, cultural centers, and historic landmarks",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop",
    nearestStation: "shahbag",
    stationName: "Shahbag",
    distance: "0.1 km",
    rating: 4.4,
    attractions: ["National Museum", "Shahbag Square", "Bangla Academy", "Ramna Park"],
    category: "Museums & Culture"
  },
  {
    id: "secretariat-area",
    name: "Government Quarter",
    description: "Administrative center with historic buildings",
    image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=200&fit=crop",
    nearestStation: "bangladesh-secretariat",
    stationName: "Bangladesh Secretariat",
    distance: "0.3 km",
    rating: 4.2,
    attractions: ["Bangladesh Secretariat", "National Parliament", "Supreme Court", "High Court"],
    category: "Government & Historic"
  },
  {
    id: "motijheel-area",
    name: "Motijheel Business District",
    description: "Financial and commercial hub of Dhaka",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=200&fit=crop",
    nearestStation: "motijheel",
    stationName: "Motijheel",
    distance: "0.2 km",
    rating: 4.3,
    attractions: ["Bangladesh Bank", "Stock Exchange", "Commercial Buildings", "Shopping Centers"],
    category: "Business & Shopping"
  },
  {
    id: "farmgate-area",
    name: "Farmgate Commercial Area",
    description: "Busy commercial and residential area",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=200&fit=crop",
    nearestStation: "farmgate",
    stationName: "Farmgate",
    distance: "0.1 km",
    rating: 4.1,
    attractions: ["Farmgate Market", "Tejgaon Industrial Area", "Karwan Bazar", "Shopping Malls"],
    category: "Commercial & Shopping"
  },
  {
    id: "uttara-area",
    name: "Uttara Modern Town",
    description: "Planned residential area with modern amenities",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop",
    nearestStation: "uttara-center",
    stationName: "Uttara Center",
    distance: "0.3 km",
    rating: 4.5,
    attractions: ["Uttara Town Center", "Residential Areas", "Parks", "Shopping Centers"],
    category: "Residential & Modern"
  }
];

// Metro system statistics
const metroStats = {
  totalStations: mrtLine6Stations.length,
  operationalStations: mrtLine6Stations.filter(s => s.isOperational).length,
  totalLength: "20.1 km",
  averageSpeed: "35 km/h",
  dailyPassengers: "400,000+",
  operatingHours: "06:00 - 22:00",
  frequency: "4-6 minutes",
  maxFare: "৳100"
};

export default function ExploreDestinations() {
  const router = useRouter();
  const { setSearchParams } = useSearchStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("attractions");
  const [selectedStation, setSelectedStation] = useState<string | null>(null);

  const filteredAttractions = dhakaAttractions.filter(attraction =>
    attraction.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    attraction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    attraction.stationName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStations = mrtLine6Stations.filter(station =>
    station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAttractionPress = (attraction: typeof dhakaAttractions[0]) => {
    router.push({
      pathname: "/destinations/details",
      params: { 
        id: attraction.id,
        type: "attraction"
      }
    });
  };

  const handleStationPress = (stationId: string) => {
    const station = mrtLine6Stations.find(s => s.id === stationId);
    if (station) {
      setSelectedStation(stationId);
      // You could also navigate to a station details page
      router.push({
        pathname: "/destinations/details",
        params: { 
          id: stationId,
          type: "station"
        }
      });
    }
  };

  const handlePlanTrip = (fromStationId?: string, toStationId?: string) => {
    const fromStation = fromStationId ? mrtLine6Stations.find(s => s.id === fromStationId) : null;
    const toStation = toStationId ? mrtLine6Stations.find(s => s.id === toStationId) : null;

    if (fromStation && toStation) {
      setSearchParams({
        from: { city: fromStation.name, station: `${fromStation.name} Metro Station`, code: fromStation.code },
        to: { city: toStation.name, station: `${toStation.name} Metro Station`, code: toStation.code }
      });
    }
    
    router.push("/search");
  };

  const renderAttractionCard = ({ item }: { item: typeof dhakaAttractions[0] }) => (
    <TouchableOpacity
      style={styles.attractionCard}
      onPress={() => handleAttractionPress(item)}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.attractionImage}
        resizeMode="cover"
      />
      <View style={styles.attractionInfo}>
        <View style={styles.attractionHeader}>
          <View style={styles.attractionTitleContainer}>
            <Text style={styles.attractionName}>{item.name}</Text>
            <View style={styles.locationContainer}>
              <Train size={12} color={Colors.primary} />
              <Text style={styles.stationName}>{item.stationName}</Text>
              <Text style={styles.distance}>• {item.distance}</Text>
            </View>
          </View>
          <View style={styles.ratingContainer}>
            <Star size={12} color="#FFD700" fill="#FFD700" />
            <Text style={styles.ratingText}>{item.rating}</Text>
          </View>
        </View>
        <Text style={styles.attractionDescription} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.categoryContainer}>
          <Text style={styles.categoryText}>{item.category}</Text>
        </View>
        <TouchableOpacity
          style={styles.planTripButton}
          onPress={() => handlePlanTrip("uttara-north", item.nearestStation)}
        >
          <Text style={styles.planTripText}>Plan Trip Here</Text>
          <ArrowRight size={14} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderStationCard = ({ item }: { item: MetroStation }) => (
    <TouchableOpacity
      style={styles.stationCard}
      onPress={() => handleStationPress(item.id)}
      activeOpacity={0.8}
    >
      <View style={styles.stationHeader}>
        <View style={styles.stationCodeContainer}>
          <Text style={styles.stationCode}>{item.code}</Text>
        </View>
        <View style={styles.stationInfoContainer}>
          <Text style={styles.stationName}>{item.name}</Text>
          <Text style={styles.stationLine}>{item.line} • MRT Line-6</Text>
          {item.coordinates && (
            <Text style={styles.coordinates}>
              {item.coordinates.latitude.toFixed(4)}, {item.coordinates.longitude.toFixed(4)}
            </Text>
          )}
        </View>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: item.isOperational ? '#22c55e' : '#ef4444' }]} />
          <Text style={styles.statusText}>
            {item.isOperational ? 'Operational' : 'Under Construction'}
          </Text>
        </View>
      </View>
      
      {item.facilities && item.facilities.length > 0 && (
        <View style={styles.facilitiesContainer}>
          <Text style={styles.facilitiesTitle}>Facilities:</Text>
          <Text style={styles.facilitiesText} numberOfLines={2}>
            {item.facilities.join(' • ')}
          </Text>
        </View>
      )}
      
      <TouchableOpacity
        style={styles.planTripButton}
        onPress={() => handlePlanTrip("uttara-north", item.id)}
      >
        <Text style={styles.planTripText}>Plan Trip to {item.name}</Text>
        <ArrowRight size={14} color={Colors.primary} />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ title: "Explore Dhaka Metro" }} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Explore Dhaka Metro</Text>
        <Text style={styles.subtitle}>Discover the city through our metro system</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Search attractions or stations..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Metro Stats */}
      <View style={styles.statsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.statCard}>
            <Train size={20} color={Colors.primary} />
            <Text style={styles.statNumber}>{metroStats.operationalStations}</Text>
            <Text style={styles.statLabel}>Stations</Text>
          </View>
          <View style={styles.statCard}>
            <Navigation size={20} color={Colors.primary} />
            <Text style={styles.statNumber}>{metroStats.totalLength}</Text>
            <Text style={styles.statLabel}>Total Length</Text>
          </View>
          <View style={styles.statCard}>
            <Users size={20} color={Colors.primary} />
            <Text style={styles.statNumber}>{metroStats.dailyPassengers}</Text>
            <Text style={styles.statLabel}>Daily Passengers</Text>
          </View>
          <View style={styles.statCard}>
            <Clock size={20} color={Colors.primary} />
            <Text style={styles.statNumber}>{metroStats.frequency}</Text>
            <Text style={styles.statLabel}>Frequency</Text>
          </View>
        </ScrollView>
      </View>

      {/* Metro Map */}
      <View style={styles.mapContainer}>
        <MetroMapView
          height={200}
          onStationPress={handleStationPress}
          showUserLocation={true}
        />
      </View>
      
      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "attractions" && styles.activeTab]}
          onPress={() => setActiveTab("attractions")}
        >
          <Text style={[styles.tabText, activeTab === "attractions" && styles.activeTabText]}>
            Attractions ({dhakaAttractions.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "stations" && styles.activeTab]}
          onPress={() => setActiveTab("stations")}
        >
          <Text style={[styles.tabText, activeTab === "stations" && styles.activeTabText]}>
            Stations ({metroStats.operationalStations})
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Content */}
      {activeTab === "attractions" ? (
        <FlatList
          data={filteredAttractions}
          renderItem={renderAttractionCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={filteredStations}
          renderItem={renderStationCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
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
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  statsContainer: {
    paddingLeft: 16,
    marginBottom: 16,
  },
  statCard: {
    backgroundColor: Colors.card,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginRight: 12,
    minWidth: 80,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text.primary,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
    textAlign: "center",
  },
  mapContainer: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: Colors.primary,
  },
  tabText: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: "600",
  },
  activeTabText: {
    color: "#fff",
  },
  listContainer: {
    padding: 16,
  },
  attractionCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  attractionImage: {
    width: "100%",
    height: 150,
  },
  attractionInfo: {
    padding: 16,
  },
  attractionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  attractionTitleContainer: {
    flex: 1,
  },
  attractionName: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stationName: {
    fontSize: 14,
    color: Colors.primary,
    marginLeft: 4,
    fontWeight: "600",
  },
  distance: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  ratingText: {
    color: Colors.text.primary,
    fontWeight: "700",
    fontSize: 12,
    marginLeft: 4,
  },
  attractionDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  categoryContainer: {
    alignSelf: "flex-start",
    backgroundColor: Colors.primary + "20",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "600",
  },
  planTripButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.secondary,
    padding: 12,
    borderRadius: 8,
  },
  planTripText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: "600",
  },
  stationCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  stationHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  stationCodeContainer: {
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  stationCode: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  stationInfoContainer: {
    flex: 1,
  },
  stationName: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 2,
  },
  stationLine: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  coordinates: {
    fontSize: 10,
    color: Colors.text.secondary,
    fontFamily: "monospace",
  },
  statusContainer: {
    alignItems: "center",
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  statusText: {
    fontSize: 10,
    color: Colors.text.secondary,
    textAlign: "center",
  },
  facilitiesContainer: {
    marginBottom: 12,
  },
  facilitiesTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  facilitiesText: {
    fontSize: 11,
    color: Colors.text.secondary,
    lineHeight: 16,
  },
});
