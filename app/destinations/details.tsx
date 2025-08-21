import React, { useState } from "react";
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, FlatList } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { MapPin, Calendar, Star, Info, ArrowRight, Share2, Heart, Train, Clock, Users, Navigation } from "lucide-react-native";
import Button from "@/components/Button";
import { useSearchStore } from "@/store/searchStore";
import Colors from "@/constants/colors";
import MetroMapView from "@/components/MetroMapView";
import { mrtLine6Stations, calculateFare } from "@/mocks/locations";
import { MetroStation } from "@/types";

// Dhaka attractions data
const dhakaAttractions = {
  "dhaka-university-area": {
    id: "dhaka-university-area",
    name: "Dhaka University Area",
    description: "The University of Dhaka, established in 1921, is the oldest university in Bangladesh and one of the most prestigious educational institutions in South Asia. The campus is home to beautiful colonial architecture, historic buildings, and vibrant student life. The area around the university is rich with cultural sites, libraries, and academic institutions that have shaped Bangladesh's intellectual landscape.",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=400&h=200&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1523050854058-8df90110c9d1?w=400&h=200&fit=crop",
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=200&fit=crop",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop"
    ],
    nearestStation: "dhaka-university",
    stationName: "Dhaka University",
    distance: "0.2 km",
    rating: 4.6,
    category: "Educational & Cultural",
    attractions: [
      "Dhaka University Campus",
      "Curzon Hall",
      "Teacher-Student Centre (TSC)",
      "Central Library",
      "Aparajeyo Bangla",
      "Raju Memorial Sculpture"
    ],
    bestTimeToVisit: "October to March (Winter Season)",
    metroInfo: {
      nearestStations: ["Dhaka University", "Shahbag"],
      averageFare: "৳20-40",
      walkingTime: "2-5 minutes"
    },
    travelTips: [
      "The campus is most vibrant during academic sessions (March-July, September-December)",
      "Visit TSC for authentic student culture and affordable food",
      "Curzon Hall is a must-see for architecture enthusiasts",
      "The area is pedestrian-friendly and safe during daytime"
    ]
  },
  "shahbag-area": {
    id: "shahbag-area",
    name: "Shahbag Cultural Hub",
    description: "Shahbag is the cultural heart of Dhaka, home to the National Museum, Bangla Academy, and several important cultural institutions. This area has been significant in Bangladesh's history, serving as a center for intellectual discourse and cultural activities. The National Museum houses the country's largest collection of artifacts, while Bangla Academy promotes Bengali language and literature.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=200&fit=crop",
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=200&fit=crop",
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=200&fit=crop"
    ],
    nearestStation: "shahbag",
    stationName: "Shahbag",
    distance: "0.1 km",
    rating: 4.4,
    category: "Museums & Culture",
    attractions: [
      "Bangladesh National Museum",
      "Shahbag Square",
      "Bangla Academy",
      "Ramna Park",
      "Shishu Park",
      "Institute of Fine Arts"
    ],
    bestTimeToVisit: "November to February (Cool and Dry)",
    metroInfo: {
      nearestStations: ["Shahbag", "Dhaka University"],
      averageFare: "৳20-60",
      walkingTime: "1-3 minutes"
    },
    travelTips: [
      "National Museum is closed on Sundays",
      "Ramna Park is perfect for morning walks",
      "Many cultural events happen at Bangla Academy",
      "The area is well-connected and easily accessible"
    ]
  },
  "secretariat-area": {
    id: "secretariat-area",
    name: "Government Quarter",
    description: "The Bangladesh Secretariat area is the administrative heart of the country, housing the Prime Minister's Office, various ministries, and government departments. The area also includes the National Parliament House (Jatiya Sangsad Bhaban), designed by renowned architect Louis Kahn, which is considered one of the architectural masterpieces of the 20th century.",
    image: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?w=400&h=200&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=200&fit=crop",
      "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=400&h=200&fit=crop",
      "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=200&fit=crop"
    ],
    nearestStation: "bangladesh-secretariat",
    stationName: "Bangladesh Secretariat",
    distance: "0.3 km",
    rating: 4.2,
    category: "Government & Historic",
    attractions: [
      "Bangladesh Secretariat",
      "National Parliament House",
      "Supreme Court of Bangladesh",
      "High Court Division",
      "Prime Minister's Office",
      "Sher-e-Bangla Nagar"
    ],
    bestTimeToVisit: "October to March (Cooler Weather)",
    metroInfo: {
      nearestStations: ["Bangladesh Secretariat", "Shahbag"],
      averageFare: "৳40-80",
      walkingTime: "3-8 minutes"
    },
    travelTips: [
      "Security checks are common in this area",
      "Parliament House tours require advance booking",
      "Photography restrictions apply in many areas",
      "Best visited during weekdays for full activity"
    ]
  },
  "motijheel-area": {
    id: "motijheel-area",
    name: "Motijheel Business District",
    description: "Motijheel is the primary financial and commercial district of Dhaka, often called the 'Wall Street of Bangladesh'. It houses the Bangladesh Bank (central bank), Dhaka Stock Exchange, and numerous commercial buildings. This area is the economic hub where major business decisions are made and is bustling with activity during business hours.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=200&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop",
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=200&fit=crop",
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=200&fit=crop"
    ],
    nearestStation: "motijheel",
    stationName: "Motijheel",
    distance: "0.2 km",
    rating: 4.3,
    category: "Business & Shopping",
    attractions: [
      "Bangladesh Bank",
      "Dhaka Stock Exchange",
      "Motijheel Commercial Area",
      "BTMC Bhaban",
      "Shapla Chattar",
      "Various Shopping Centers"
    ],
    bestTimeToVisit: "November to February (Business Season)",
    metroInfo: {
      nearestStations: ["Motijheel", "Bangladesh Secretariat"],
      averageFare: "৳60-100",
      walkingTime: "2-5 minutes"
    },
    travelTips: [
      "Most active during business hours (9 AM - 6 PM)",
      "Heavy traffic during rush hours",
      "Many restaurants and cafes for business meetings",
      "Metro is the best way to avoid traffic congestion"
    ]
  },
  "farmgate-area": {
    id: "farmgate-area",
    name: "Farmgate Commercial Area",
    description: "Farmgate is one of the busiest commercial areas in Dhaka, serving as a major transportation hub and shopping destination. The area is known for its vibrant street life, numerous shopping centers, restaurants, and its proximity to Tejgaon Industrial Area. It's a melting pot of commercial activities and urban life.",
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=200&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop",
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop",
      "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&h=200&fit=crop"
    ],
    nearestStation: "farmgate",
    stationName: "Farmgate",
    distance: "0.1 km",
    rating: 4.1,
    category: "Commercial & Shopping",
    attractions: [
      "Farmgate Market",
      "Tejgaon Industrial Area",
      "Karwan Bazar",
      "Various Shopping Malls",
      "Street Food Scene",
      "Transportation Hub"
    ],
    bestTimeToVisit: "Year-round (Commercial Area)",
    metroInfo: {
      nearestStations: ["Farmgate", "Karwan Bazar"],
      averageFare: "৳40-80",
      walkingTime: "1-3 minutes"
    },
    travelTips: [
      "Very crowded during peak hours",
      "Great for street food and local shopping",
      "Multiple bus and transport connections",
      "Metro provides relief from traffic congestion"
    ]
  },
  "uttara-area": {
    id: "uttara-area",
    name: "Uttara Modern Town",
    description: "Uttara is a planned residential area in northern Dhaka, known for its modern infrastructure, wide roads, and organized layout. It's one of the most developed areas in Dhaka with modern amenities, shopping centers, and residential complexes. The area represents the modern face of Dhaka with its contemporary architecture and urban planning.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=200&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=200&fit=crop",
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop",
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=200&fit=crop"
    ],
    nearestStation: "uttara-center",
    stationName: "Uttara Center",
    distance: "0.3 km",
    rating: 4.5,
    category: "Residential & Modern",
    attractions: [
      "Uttara Town Center",
      "Modern Residential Areas",
      "Uttara Lake",
      "Shopping Centers",
      "Parks and Recreation",
      "Hazrat Shahjalal International Airport (nearby)"
    ],
    bestTimeToVisit: "October to March (Pleasant Weather)",
    metroInfo: {
      nearestStations: ["Uttara Center", "Uttara North", "Uttara South"],
      averageFare: "৳20-100",
      walkingTime: "3-10 minutes"
    },
    travelTips: [
      "Well-planned area with modern amenities",
      "Good for families and residential visits",
      "Multiple metro stations serve the area",
      "Close to the airport for travelers"
    ]
  }
};

// Metro station details
const stationDetails = mrtLine6Stations.reduce((acc, station) => {
  acc[station.id] = {
    ...station,
    description: `${station.name} is a metro station on the MRT Line-6 of Dhaka Metro Rail. This ${station.isOperational ? 'operational' : 'upcoming'} station serves the ${station.name} area and surrounding neighborhoods.`,
    nearbyAttractions: getNearbyAttractions(station.id),
    operatingHours: "06:00 AM - 10:00 PM",
    frequency: "4-6 minutes during peak hours, 8-10 minutes during off-peak",
    accessibility: station.facilities.includes("Elevator") && station.facilities.includes("Escalator"),
    parkingAvailable: station.facilities.includes("Parking"),
    commercialFacilities: station.facilities.filter(f => ["ATM", "Shopping", "Food Court"].includes(f))
  };
  return acc;
}, {} as Record<string, any>);

function getNearbyAttractions(stationId: string): string[] {
  const attractionMap: Record<string, string[]> = {
    "dhaka-university": ["Dhaka University", "Curzon Hall", "TSC", "Central Library"],
    "shahbag": ["National Museum", "Bangla Academy", "Ramna Park", "Shishu Park"],
    "bangladesh-secretariat": ["Parliament House", "Supreme Court", "Secretariat", "High Court"],
    "motijheel": ["Bangladesh Bank", "Stock Exchange", "Commercial Buildings"],
    "farmgate": ["Farmgate Market", "Tejgaon Industrial Area", "Karwan Bazar"],
    "uttara-center": ["Uttara Town Center", "Modern Residential Areas", "Shopping Centers"],
    "uttara-north": ["Residential Areas", "Parks", "Airport Access"],
    "uttara-south": ["Commercial Areas", "Residential Complexes"],
    "pallabi": ["Local Markets", "Residential Areas", "Community Centers"],
    "mirpur-10": ["Mirpur Stadium", "Shopping Areas", "Residential Complexes"],
    "mirpur-11": ["Local Markets", "Residential Areas"],
    "kazipara": ["Local Community", "Residential Areas"],
    "shewrapara": ["Local Markets", "Residential Areas"],
    "agargaon": ["Government Offices", "Residential Areas"],
    "bijoy-sarani": ["Commercial Areas", "Office Buildings"],
    "kawran-bazar": ["Karwan Bazar Market", "Commercial Buildings"]
  };
  
  return attractionMap[stationId] || ["Local Area", "Nearby Facilities"];
}

export default function DestinationDetailsScreen() {
  const router = useRouter();
  const { id, type } = useLocalSearchParams<{ id: string; type: string }>();
  const { setSearchParams } = useSearchStore();
  const [activeTab, setActiveTab] = useState("about");
  const [isFavorite, setIsFavorite] = useState(false);
  
  // Determine if it's an attraction or station
  const isAttraction = type === "attraction";
  const isStation = type === "station";
  
  // Get the appropriate data
  const attraction = isAttraction ? dhakaAttractions[id as keyof typeof dhakaAttractions] : null;
  const station = isStation ? stationDetails[id] : null;
  const data = attraction || station;

  if (!data) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Details not found</Text>
      </SafeAreaView>
    );
  }

  const handlePlanTrip = () => {
    if (isAttraction && attraction) {
      const nearestStation = mrtLine6Stations.find(s => s.id === attraction.nearestStation);
      if (nearestStation) {
        setSearchParams({
          from: { city: "Uttara North", station: "Uttara North Metro Station", code: "UN" },
          to: { city: nearestStation.name, station: `${nearestStation.name} Metro Station`, code: nearestStation.code }
        });
      }
    } else if (isStation && station) {
      setSearchParams({
        from: { city: "Uttara North", station: "Uttara North Metro Station", code: "UN" },
        to: { city: station.name, station: `${station.name} Metro Station`, code: station.code }
      });
    }
    
    router.push("/search");
  };

  const handleToggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    console.log("Share:", data.name);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Stack.Screen
        options={{
          title: data.name,
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
          source={{ uri: data.image }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        
        <View style={styles.contentContainer}>
          <View style={styles.destinationHeader}>
            <View>
              <Text style={styles.name}>{data.name}</Text>
              <View style={styles.locationContainer}>
                {isAttraction ? (
                  <>
                    <Train size={16} color={Colors.primary} />
                    <Text style={styles.stationName}>{attraction?.stationName}</Text>
                    <Text style={styles.distance}>• {attraction?.distance}</Text>
                  </>
                ) : (
                  <>
                    <MapPin size={16} color={Colors.primary} />
                    <Text style={styles.stationInfo}>{station?.code} • {station?.line}</Text>
                  </>
                )}
              </View>
            </View>
            <View style={styles.ratingContainer}>
              <Star size={16} color="#FFD700" fill="#FFD700" />
              <Text style={styles.ratingText}>{data.rating || "4.5"}</Text>
            </View>
          </View>
          
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tab, activeTab === "about" && styles.activeTab]}
              onPress={() => setActiveTab("about")}
            >
              <Text style={[styles.tabText, activeTab === "about" && styles.activeTabText]}>
                About
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "gallery" && styles.activeTab]}
              onPress={() => setActiveTab("gallery")}
            >
              <Text style={[styles.tabText, activeTab === "gallery" && styles.activeTabText]}>
                Gallery
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, activeTab === "info" && styles.activeTab]}
              onPress={() => setActiveTab("info")}
            >
              <Text style={[styles.tabText, activeTab === "info" && styles.activeTabText]}>
                {isAttraction ? "Travel Info" : "Station Info"}
              </Text>
            </TouchableOpacity>
          </View>
          
          {activeTab === "about" && (
            <View style={styles.tabContent}>
              <Text style={styles.description}>{data.description}</Text>
              
              <Text style={styles.sectionTitle}>
                {isAttraction ? "Top Attractions" : "Nearby Attractions"}
              </Text>
              {(attraction?.attractions || station?.nearbyAttractions || []).map((item: string, index: number) => (
                <View key={index} style={styles.attractionItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.attractionText}>{item}</Text>
                </View>
              ))}
              
              {isAttraction && (
                <>
                  <Text style={styles.sectionTitle}>Best Time to Visit</Text>
                  <View style={styles.infoItem}>
                    <Calendar size={16} color={Colors.primary} style={styles.infoIcon} />
                    <Text style={styles.infoText}>{attraction?.bestTimeToVisit}</Text>
                  </View>
                  
                  <Text style={styles.sectionTitle}>Metro Access</Text>
                  <View style={styles.metroInfoCard}>
                    <View style={styles.metroInfoItem}>
                      <Train size={16} color={Colors.primary} />
                      <Text style={styles.metroInfoText}>
                        Nearest: {attraction?.stationName} ({attraction?.distance})
                      </Text>
                    </View>
                    <View style={styles.metroInfoItem}>
                      <Clock size={16} color={Colors.primary} />
                      <Text style={styles.metroInfoText}>
                        Walking: {attraction?.metroInfo?.walkingTime}
                      </Text>
                    </View>
                    <View style={styles.metroInfoItem}>
                      <Users size={16} color={Colors.primary} />
                      <Text style={styles.metroInfoText}>
                        Fare: {attraction?.metroInfo?.averageFare}
                      </Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          )}
          
          {activeTab === "gallery" && (
            <View style={styles.tabContent}>
              <Text style={styles.sectionTitle}>Photo Gallery</Text>
              <FlatList
                data={[data.image, ...(data.gallery || [])]}
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
          
          {activeTab === "info" && (
            <View style={styles.tabContent}>
              {isAttraction ? (
                <>
                  <Text style={styles.sectionTitle}>Travel Tips</Text>
                  {attraction?.travelTips?.map((tip: string, index: number) => (
                    <View key={index} style={styles.tipItem}>
                      <Info size={16} color={Colors.primary} style={styles.tipIcon} />
                      <Text style={styles.tipText}>{tip}</Text>
                    </View>
                  ))}
                </>
              ) : (
                <>
                  <Text style={styles.sectionTitle}>Station Information</Text>
                  <View style={styles.stationInfoGrid}>
                    <View style={styles.stationInfoItem}>
                      <Text style={styles.infoLabel}>Operating Hours</Text>
                      <Text style={styles.infoValue}>{station?.operatingHours}</Text>
                    </View>
                    <View style={styles.stationInfoItem}>
                      <Text style={styles.infoLabel}>Frequency</Text>
                      <Text style={styles.infoValue}>{station?.frequency}</Text>
                    </View>
                    <View style={styles.stationInfoItem}>
                      <Text style={styles.infoLabel}>Accessibility</Text>
                      <Text style={styles.infoValue}>{station?.accessibility ? "Yes" : "Limited"}</Text>
                    </View>
                    <View style={styles.stationInfoItem}>
                      <Text style={styles.infoLabel}>Parking</Text>
                      <Text style={styles.infoValue}>{station?.parkingAvailable ? "Available" : "Not Available"}</Text>
                    </View>
                  </View>
                  
                  <Text style={styles.sectionTitle}>Facilities</Text>
                  <View style={styles.facilitiesGrid}>
                    {station?.facilities?.map((facility: string, index: number) => (
                      <View key={index} style={styles.facilityChip}>
                        <Text style={styles.facilityText}>{facility}</Text>
                      </View>
                    ))}
                  </View>
                </>
              )}
            </View>
          )}

          {/* Metro Map for stations */}
          {isStation && (
            <View style={styles.mapSection}>
              <Text style={styles.sectionTitle}>Station Location</Text>
              <MetroMapView
                height={250}
                currentStationId={station?.id}
                showUserLocation={false}
              />
            </View>
          )}
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button
          title={isAttraction ? `Plan Trip to ${attraction?.stationName}` : `Plan Trip to ${station?.name}`}
          onPress={handlePlanTrip}
          style={styles.planTripButton}
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
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  stationName: {
    fontSize: 16,
    color: Colors.primary,
    marginLeft: 4,
    fontWeight: "600",
  },
  distance: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginLeft: 4,
  },
  stationInfo: {
    fontSize: 16,
    color: Colors.primary,
    marginLeft: 4,
    fontWeight: "600",
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
  metroInfoCard: {
    backgroundColor: Colors.secondary,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  metroInfoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  metroInfoText: {
    fontSize: 14,
    color: Colors.text.primary,
    marginLeft: 8,
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
  stationInfoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  stationInfoItem: {
    width: "48%",
    backgroundColor: Colors.secondary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
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
  facilitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 24,
  },
  facilityChip: {
    backgroundColor: Colors.primary + "20",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  facilityText: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: "600",
  },
  mapSection: {
    marginTop: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.background,
  },
  planTripButton: {
    width: "100%",
  },
});
