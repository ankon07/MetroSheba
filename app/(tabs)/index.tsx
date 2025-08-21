import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchBar from "@/components/SearchBar";
import TransportationTypeSelector from "@/components/TransportationTypeSelector";
import SectionHeader from "@/components/SectionHeader";
import ContinuousScrollingTrains from "@/components/ContinuousScrollingTrains";
import DestinationCard from "@/components/DestinationCard";
import AnimatedCard from "@/components/AnimatedCard";
import LoadingOverlay from "@/components/LoadingOverlay";
import { TransportationType } from "@/types";
// import { upcomingTrains, popularDestinations } from "@/mocks/trips";
import { useSearchStore } from "@/store/searchStore";
import { useUserStore } from "@/store/userStore";
import Colors from "@/constants/colors";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useUserStore();
  const { setSearchParams } = useSearchStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransportationType, setSelectedTransportationType] = useState<TransportationType>("train");
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [popular, setPopular] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    (async () => {
      try {
        const { USE_FIREBASE } = await import('@/config/featureFlags');
        if (USE_FIREBASE) {
          const TripsService = await import('@/services/tripsService');
          const { RealtimeService } = await import('@/services/realtimeService');
          
          // Load initial data
          const [u, p] = await Promise.all([
            TripsService.getUpcomingTrains(5),
            TripsService.getPopularDestinations(),
          ]);
          setUpcoming(u);
          setPopular(p);

          // Subscribe to realtime updates for upcoming trains
          unsubscribe = RealtimeService.subscribeToUpcomingTrains((trains) => {
            setUpcoming(trains);
          }, 5);
        } else {
          const { upcomingTrains, popularDestinations } = await import('@/mocks/trips');
          setUpcoming(upcomingTrains.slice(0, 5));
          setPopular(popularDestinations);
        }
      } catch (e) {
        console.warn('Failed to load home data', e);
        // Fallback to mocks on error
        try {
          const { upcomingTrains, popularDestinations } = await import('@/mocks/trips');
          setUpcoming(upcomingTrains.slice(0, 5));
          setPopular(popularDestinations);
        } catch (fallbackError) {
          console.error('Failed to load fallback data', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleSearchPress = () => {
    router.push("/search");
  };

  const handleTransportationTypeSelect = (type: TransportationType) => {
    setSelectedTransportationType(type);
    setSearchParams({ transportationType: type });
  };

  const handleTrainPress = (trainId: string) => {
    console.log("Train pressed:", trainId);
    // Navigate to train details or booking
    router.push({
      pathname: "/trips/details",
      params: { id: trainId }
    });
  };

  const handleDestinationPress = (from: string, to: string) => {
    // Set search params and navigate to search results
    const fromLocation = { city: from, station: "", code: "" };
    const toLocation = { city: to, station: "", code: "" };
    
    setSearchParams({ 
      from: fromLocation, 
      to: toLocation,
      transportationType: selectedTransportationType
    });
    
    router.push("/search");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <LoadingOverlay visible={loading} message="Loading metro data" />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <AnimatedCard delay={0}>
          <View style={styles.header}>
            <Text style={styles.greeting}>Hello, {user?.firstName || "Commuter"}!</Text>
            <Text style={styles.subGreeting}>Ready for your metro journey?</Text>
          </View>
        </AnimatedCard>
        
        <AnimatedCard delay={200}>
          <SearchBar
            placeholder="Search metro stations..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onPress={handleSearchPress}
            editable={false}
          />
        </AnimatedCard>
        
        <AnimatedCard delay={400}>
          <TransportationTypeSelector
            selectedType={selectedTransportationType}
            onSelect={handleTransportationTypeSelect}
          />
        </AnimatedCard>
        
        <AnimatedCard delay={600}>
          <SectionHeader
            title="Upcoming Trains"
            showViewAll={true}
            onViewAllPress={() => router.push("/search/results")}
          />
        </AnimatedCard>
        
        <AnimatedCard delay={800}>
          <ContinuousScrollingTrains
            trains={upcoming}
            onTrainPress={handleTrainPress}
          />
        </AnimatedCard>
        
        <AnimatedCard delay={1000}>
          <SectionHeader
            title="Popular Routes"
            showViewAll={true}
            onViewAllPress={() => router.push("/destinations")}
          />
        </AnimatedCard>
        
        <AnimatedCard delay={1200}>
          <View style={styles.destinationsContainer}>
            {popular.map((destination) => (
              <View key={destination.id} style={styles.destinationItem}>
                <DestinationCard
                  from={destination.from}
                  to={destination.to}
                  price={destination.price}
                  image={destination.image}
                  transportationType="train"
                  onPress={() => handleDestinationPress(destination.from, destination.to)}
                />
              </View>
            ))}
          </View>
        </AnimatedCard>
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
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  destinationsContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  destinationItem: {
    flex: 1,
    marginRight: 16,
  },
});
