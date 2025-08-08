import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, FlatList } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { MapPin, Calendar, Star, Info, ArrowRight, Share2, Heart } from "lucide-react-native";
import Button from "@/components/Button";
import { useSearchStore } from "@/store/searchStore";
import Colors from "@/constants/colors";

// Extended destination details
const destinationDetails = {
  "dest1": {
    id: "dest1",
    city: "Paris",
    country: "France",
    description: "Paris, the capital of France, is a major European city and a global center for art, fashion, gastronomy, and culture. Its 19th-century cityscape is crisscrossed by wide boulevards and the River Seine. Beyond such landmarks as the Eiffel Tower and the 12th-century, Gothic Notre-Dame cathedral, the city is known for its cafe culture and designer boutiques along the Rue du Faubourg Saint-Honoré.",
    image: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1520939817895-060bdaf4fe1b?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1509041322357-8a3f9757a475?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
    ],
    popularRoutes: ["London - Paris", "Amsterdam - Paris", "Berlin - Paris"],
    attractions: [
      "Eiffel Tower",
      "Louvre Museum",
      "Notre-Dame Cathedral",
      "Champs-Élysées",
      "Arc de Triomphe"
    ],
    bestTimeToVisit: "April to June, September to October",
    rating: 4.8,
    weather: {
      spring: "Cool to mild, 8-18°C",
      summer: "Warm, 15-25°C",
      autumn: "Mild to cool, 10-18°C",
      winter: "Cold, 2-8°C"
    },
    currency: "Euro (€)",
    language: "French",
    travelTips: [
      "Many Parisians speak English, but learning a few French phrases is appreciated",
      "The Paris Metro is an efficient way to get around the city",
      "Museums are often closed on Mondays or Tuesdays",
      "Tipping is not required but appreciated for good service"
    ]
  },
  "dest2": {
    id: "dest2",
    city: "Tokyo",
    country: "Japan",
    description: "Tokyo, Japan's busy capital, mixes the ultramodern and the traditional, from neon-lit skyscrapers to historic temples. The opulent Meiji Shinto Shrine is known for its towering gate and surrounding woods. The Imperial Palace sits amid large public gardens. The city's many museums offer exhibits ranging from classical art (in the Tokyo National Museum) to a reconstructed kabuki theater (in the Edo-Tokyo Museum).",
    image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80",
      "https://images.unsplash.com/photo-1551641506-ee5bf4cb45f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=80"
    ],
    popularRoutes: ["New York - Tokyo", "Los Angeles - Tokyo", "Seoul - Tokyo"],
    attractions: [
      "Tokyo Skytree",
      "Senso-ji Temple",
      "Meiji Shrine",
      "Shibuya Crossing",
      "Tokyo Disneyland"
    ],
    bestTimeToVisit: "March to May, September to November",
    rating: 4.9,
    weather: {
      spring: "Mild, 10-20°C",
      summer: "Hot and humid, 22-30°C",
      autumn: "Mild, 15-23°C",
      winter: "Cold, 2-10°C"
    },
    currency: "Japanese Yen (¥)",
    language: "Japanese",
    travelTips: [
      "English is not widely spoken, so a translation app is helpful",
      "The subway system is extensive but can be confusing for first-timers",
      "Tipping is not customary and can even be considered rude",
      "Bow when greeting people as a sign of respect"
    ]
  }
};

export default function DestinationDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { setSearchParams } = useSearchStore();
  const [activeTab, setActiveTab] = useState("about");
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Find the destination details
  const destination = destinationDetails[id as keyof typeof destinationDetails] || destinationDetails.dest1;

  const handleSearchRoute = (route: string) => {
    const [from, to] = route.split(" - ");
    
    // Set search params and navigate to search
    setSearchParams({
      from: { city: from, station: "", code: "" },
      to: { city: to, station: "", code: "" }
    });
    
    router.push("/search");
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In a real app, this would save to user preferences
  };

  const handleShare = () => {
    // In a real app, this would share the destination
    console.log("Share destination:", destination.id);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen
        options={{
          title: destination.city,
          headerRight: () => (
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.headerButton} 
                onPress={handleToggleFavorite}
              >
                <Heart 
                  size={24} 
                  color={isFavorite ? Colors.error : Colors.text.secondary} 
                  fill={isFavorite ? Colors.error : "none"} 
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.headerButton} 
                onPress={handleShare}
              >
                <Share2 size={24} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: destination.image }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        
        <View style={styles.contentContainer}>
          <View style={styles.destinationHeader}>
            <View>
              <Text style={styles.cityName}>{destination.city}</Text>
              <View style={styles.locationContainer}>
                <MapPin size={16} color={Colors.text.secondary} />
                <Text style={styles.countryName}>{destination.country}</Text>
              </View>
            </View>
            <View style={styles.ratingContainer}>
              <Star size={16} color="#FFD700" fill="#FFD700" />
              <Text style={styles.ratingText}>{destination.rating}</Text>
            </View>
          </View>
          
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "about" && styles.activeTab]}
              onPress={() => setActiveTab("about")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "about" && styles.activeTabText,
                ]}
              >
                About
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "gallery" && styles.activeTab]}
              onPress={() => setActiveTab("gallery")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "gallery" && styles.activeTabText,
                ]}
              >
                Gallery
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "travel" && styles.activeTab]}
              onPress={() => setActiveTab("travel")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "travel" && styles.activeTabText,
                ]}
              >
                Travel Info
              </Text>
            </TouchableOpacity>
          </View>
          
          {activeTab === "about" && (
            <View style={styles.tabContent}>
              <Text style={styles.description}>{destination.description}</Text>
              
              <Text style={styles.sectionTitle}>Top Attractions</Text>
              {destination.attractions.map((attraction, index) => (
                <View key={index} style={styles.attractionItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.attractionText}>{attraction}</Text>
                </View>
              ))}
              
              <Text style={styles.sectionTitle}>Best Time to Visit</Text>
              <View style={styles.infoItem}>
                <Calendar size={16} color={Colors.primary} style={styles.infoIcon} />
                <Text style={styles.infoText}>{destination.bestTimeToVisit}</Text>
              </View>
              
              <Text style={styles.sectionTitle}>Popular Routes</Text>
              {destination.popularRoutes.map((route, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.routeItem}
                  onPress={() => handleSearchRoute(route)}
                >
                  <Text style={styles.routeText}>{route}</Text>
                  <ArrowRight size={16} color={Colors.primary} />
                </TouchableOpacity>
              ))}
            </View>
          )}
          
          {activeTab === "gallery" && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>Photo Gallery</Text>
              <FlatList
                data={[destination.image, ...destination.gallery]}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.galleryItem}>
                    <Image
                      source={{ uri: item }}
                      style={styles.galleryImage}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
                contentContainerStyle={styles.galleryList}
              />
            </View>
          )}
          
          {activeTab === "travel" && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>Weather</Text>
              <View style={styles.weatherContainer}>
                <View style={styles.weatherItem}>
                  <Text style={styles.weatherSeason}>Spring</Text>
                  <Text style={styles.weatherDescription}>{destination.weather.spring}</Text>
                </View>
                <View style={styles.weatherItem}>
                  <Text style={styles.weatherSeason}>Summer</Text>
                  <Text style={styles.weatherDescription}>{destination.weather.summer}</Text>
                </View>
                <View style={styles.weatherItem}>
                  <Text style={styles.weatherSeason}>Autumn</Text>
                  <Text style={styles.weatherDescription}>{destination.weather.autumn}</Text>
                </View>
                <View style={styles.weatherItem}>
                  <Text style={styles.weatherSeason}>Winter</Text>
                  <Text style={styles.weatherDescription}>{destination.weather.winter}</Text>
                </View>
              </View>
              
              <Text style={styles.sectionTitle}>Practical Information</Text>
              <View style={styles.infoGrid}>
                <View style={styles.infoGridItem}>
                  <Text style={styles.infoLabel}>Currency</Text>
                  <Text style={styles.infoValue}>{destination.currency}</Text>
                </View>
                <View style={styles.infoGridItem}>
                  <Text style={styles.infoLabel}>Language</Text>
                  <Text style={styles.infoValue}>{destination.language}</Text>
                </View>
              </View>
              
              <Text style={styles.sectionTitle}>Travel Tips</Text>
              {destination.travelTips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <Info size={16} color={Colors.primary} style={styles.tipIcon} />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          title="Find Trips to Paris"
          onPress={() => handleSearchRoute(`London - ${destination.city}`)}
          style={styles.findTripsButton}
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
  headerButtons: {
    flexDirection: "row",
  },
  headerButton: {
    marginLeft: 16,
  },
  heroImage: {
    width: "100%",
    height: 200,
  },
  contentContainer: {
    padding: 16,
  },
  destinationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  cityName: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  countryName: {
    fontSize: 16,
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
    fontSize: 14,
    marginLeft: 4,
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
  description: {
    fontSize: 16,
    color: Colors.text.secondary,
    lineHeight: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 12,
    marginTop: 8,
  },
  attractionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginRight: 8,
  },
  attractionText: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  infoIcon: {
    marginRight: 8,
  },
  infoText: {
    fontSize: 16,
    color: Colors.text.primary,
  },
  routeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.secondary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  routeText: {
    fontSize: 16,
    color: Colors.text.primary,
    fontWeight: "600",
  },
  galleryList: {
    paddingBottom: 16,
  },
  galleryItem: {
    marginRight: 12,
    borderRadius: 8,
    overflow: "hidden",
  },
  galleryImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
  },
  weatherContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  weatherItem: {
    width: "48%",
    backgroundColor: Colors.secondary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  weatherSeason: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  weatherDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  infoGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  infoGridItem: {
    width: "48%",
    backgroundColor: Colors.secondary,
    padding: 12,
    borderRadius: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  tipIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  tipText: {
    fontSize: 14,
    color: Colors.text.primary,
    flex: 1,
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  findTripsButton: {
    width: "100%",
  },
});