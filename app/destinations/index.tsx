import React, { useState } from "react";
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { Search, MapPin, Filter } from "lucide-react-native";
import SearchBar from "@/components/SearchBar";
import { useSearchStore } from "@/store/searchStore";
import Colors from "@/constants/colors";

// Extended destinations for the dedicated destinations page
const allDestinations = [
  {
    id: "dest1",
    city: "Paris",
    country: "France",
    description: "The City of Light, known for the Eiffel Tower and world-class cuisine",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    popularRoutes: ["London - Paris", "Amsterdam - Paris", "Berlin - Paris"],
    rating: 4.8,
  },
  {
    id: "dest2",
    city: "Tokyo",
    country: "Japan",
    description: "A vibrant metropolis blending ultramodern and traditional",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    popularRoutes: ["New York - Tokyo", "Los Angeles - Tokyo", "Seoul - Tokyo"],
    rating: 4.9,
  },
  {
    id: "dest3",
    city: "Barcelona",
    country: "Spain",
    description: "Famous for Gaudí architecture and Mediterranean beaches",
    image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    popularRoutes: ["Madrid - Barcelona", "Paris - Barcelona", "Rome - Barcelona"],
    rating: 4.7,
  },
  {
    id: "dest4",
    city: "New York",
    country: "United States",
    description: "The Big Apple, a global center for art, fashion, and finance",
    image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    popularRoutes: ["London - New York", "Los Angeles - New York", "Chicago - New York"],
    rating: 4.6,
  },
  {
    id: "dest5",
    city: "Rome",
    country: "Italy",
    description: "The Eternal City with ancient ruins and Renaissance masterpieces",
    image: "https://images.unsplash.com/photo-1529260830199-42c24126f198?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    popularRoutes: ["Paris - Rome", "Barcelona - Rome", "Athens - Rome"],
    rating: 4.8,
  },
  {
    id: "dest6",
    city: "Amsterdam",
    country: "Netherlands",
    description: "Known for its artistic heritage, canal system, and narrow houses",
    image: "https://images.unsplash.com/photo-1512470876302-972faa2aa9a4?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    popularRoutes: ["London - Amsterdam", "Berlin - Amsterdam", "Paris - Amsterdam"],
    rating: 4.7,
  },
  {
    id: "dest7",
    city: "Sydney",
    country: "Australia",
    description: "Famous for its Opera House, harbor, and beautiful beaches",
    image: "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    popularRoutes: ["Melbourne - Sydney", "Singapore - Sydney", "Tokyo - Sydney"],
    rating: 4.8,
  },
  {
    id: "dest8",
    city: "Dubai",
    country: "United Arab Emirates",
    description: "A city of skyscrapers, luxury shopping, and futuristic architecture",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    popularRoutes: ["London - Dubai", "New York - Dubai", "Mumbai - Dubai"],
    rating: 4.7,
  },
];

export default function DestinationsScreen() {
  const router = useRouter();
  const { setSearchParams } = useSearchStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Europe", "Asia", "Americas", "Oceania", "Middle East"];

  const filteredDestinations = allDestinations.filter(dest => {
    const matchesSearch = dest.city.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         dest.country.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeFilter === "All") return matchesSearch;
    
    const regionMap: Record<string, string[]> = {
      "Europe": ["France", "Spain", "Italy", "Netherlands"],
      "Asia": ["Japan"],
      "Americas": ["United States"],
      "Oceania": ["Australia"],
      "Middle East": ["United Arab Emirates"]
    };
    
    return matchesSearch && regionMap[activeFilter]?.includes(dest.country);
  });

  const handleDestinationPress = (destination: typeof allDestinations[0]) => {
    router.push({
      pathname: "/destinations/details",
      params: { id: destination.id }
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen options={{ title: "Destinations" }} />
      
      <View style={styles.header}>
        <Text style={styles.title}>Explore Destinations</Text>
        <Text style={styles.subtitle}>Discover your next adventure</Text>
      </View>
      
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Search cities or countries..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                activeFilter === filter && styles.activeFilterButton,
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter && styles.activeFilterText,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      <FlatList
        data={filteredDestinations}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.destinationCard}
            onPress={() => handleDestinationPress(item)}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: item.image }}
              style={styles.destinationImage}
              resizeMode="cover"
            />
            <View style={styles.destinationInfo}>
              <View style={styles.destinationHeader}>
                <View>
                  <Text style={styles.destinationCity}>{item.city}</Text>
                  <View style={styles.locationContainer}>
                    <MapPin size={14} color={Colors.text.secondary} />
                    <Text style={styles.destinationCountry}>{item.country}</Text>
                  </View>
                </View>
                <View style={styles.ratingContainer}>
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
              </View>
              <Text style={styles.destinationDescription} numberOfLines={2}>
                {item.description}
              </Text>
              <Text style={styles.popularRoutesText}>
                Popular routes: {item.popularRoutes[0]}...
              </Text>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.destinationsList}
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
  filtersContainer: {
    paddingLeft: 16,
    marginBottom: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.secondary,
    borderRadius: 20,
    marginRight: 8,
  },
  activeFilterButton: {
    backgroundColor: Colors.primary,
  },
  filterText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  activeFilterText: {
    color: "#fff",
    fontWeight: "600",
  },
  destinationsList: {
    padding: 16,
  },
  destinationCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  destinationImage: {
    width: "100%",
    height: 150,
  },
  destinationInfo: {
    padding: 16,
  },
  destinationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  destinationCity: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  destinationCountry: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  ratingContainer: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  ratingText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
  },
  destinationDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 8,
    lineHeight: 20,
  },
  popularRoutesText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "600",
  },
});