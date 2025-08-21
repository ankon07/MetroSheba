import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowRight, ChevronRight } from "lucide-react-native";
import Button from "@/components/Button";
import LocationSelector from "@/components/LocationSelector";
import DateSelector from "@/components/DateSelector";
import PassengerSelector from "@/components/PassengerSelector";
import ClassSelector from "@/components/ClassSelector";
import RoundTripToggle from "@/components/RoundTripToggle";
import SectionHeader from "@/components/SectionHeader";
import TransportationIcon from "@/components/TransportationIcon";
import { useSearchStore } from "@/store/searchStore";
import Colors from "@/constants/colors";
import { useToast } from "@/hooks/useToast";
import Toast from "@/components/Toast";
import LoadingOverlay from "@/components/LoadingOverlay";

export default function SearchScreen() {
  const router = useRouter();
  const { 
    searchParams, 
    setSearchParams, 
    recentSearches,
    searchTrips,
    addRecentSearch
  } = useSearchStore();
  const { toast, showError, hideToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchParams.from || !searchParams.to) {
      showError("Please select both origin and destination");
      return;
    }

    try {
      setLoading(true);
      await searchTrips();
      addRecentSearch();
      router.push("/search/results");
    } catch (error) {
      showError("Failed to search trips. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRecentSearchPress = (from: string, to: string) => {
    // Find the locations in our mock data and set them
    // In a real app, you would fetch the full location data
    setSearchParams({
      from: { city: from, station: "", code: "" },
      to: { city: to, station: "", code: "" },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <LoadingOverlay visible={loading} message="Searching trips..." />
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={hideToast}
      />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.formContainer}>
          <LocationSelector
            label="From"
            location={searchParams.from}
            onPress={() => router.push({
              pathname: "/search/location-select",
              params: { type: "from" }
            })}
          />
          
          <LocationSelector
            label="To"
            location={searchParams.to}
            onPress={() => router.push({
              pathname: "/search/location-select",
              params: { type: "to" }
            })}
          />
          
          <DateSelector
            date={searchParams.date}
            onPress={() => router.push("/search/date-select")}
          />
          
          <RoundTripToggle
            isRoundTrip={searchParams.isRoundTrip}
            onToggle={(value) => setSearchParams({ isRoundTrip: value })}
          />
          
          <PassengerSelector
            passengers={searchParams.passengers}
            onPress={() => router.push("/search/passenger-select")}
          />
          
          <ClassSelector
            selectedClass={searchParams.class}
            onPress={() => router.push("/search/class-select")}
          />
          
          <Button
            title="Search"
            onPress={handleSearch}
            style={styles.searchButton}
          />
        </View>
        
        {recentSearches.length > 0 && (
          <View style={styles.recentSearchesContainer}>
            <SectionHeader title="Recent Searches" />
            
            {recentSearches.map((search) => (
              <TouchableOpacity
                key={search.id}
                style={styles.recentSearchItem}
                onPress={() => handleRecentSearchPress(search.from, search.to)}
              >
                <View style={styles.recentSearchLeft}>
                  <TransportationIcon
                    type={search.transportationType as any}
                    size={20}
                    containerStyle={styles.recentSearchIcon}
                  />
                  <View>
                    <View style={styles.recentSearchRoute}>
                      <Text style={styles.recentSearchCity}>{search.from}</Text>
                      <ArrowRight size={16} color={Colors.text.secondary} style={styles.arrowIcon} />
                      <Text style={styles.recentSearchCity}>{search.to}</Text>
                    </View>
                    <Text style={styles.recentSearchDetails}>
                      {new Date(search.date).toLocaleDateString()} • {search.passengers} {search.passengers === 1 ? "passenger" : "passengers"}
                    </Text>
                  </View>
                </View>
                <ChevronRight size={20} color={Colors.text.secondary} />
              </TouchableOpacity>
            ))}
          </View>
        )}
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
  formContainer: {
    marginBottom: 24,
  },
  searchButton: {
    marginTop: 16,
  },
  recentSearchesContainer: {
    marginBottom: 24,
  },
  recentSearchItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.secondary,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  recentSearchLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  recentSearchIcon: {
    marginRight: 12,
  },
  recentSearchRoute: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  recentSearchCity: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
  },
  arrowIcon: {
    marginHorizontal: 8,
  },
  recentSearchDetails: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
});