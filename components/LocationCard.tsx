import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import { MapPin, Navigation, RefreshCw, AlertCircle } from "lucide-react-native";
import Colors from "@/constants/colors";
import { useUserStore } from "@/store/userStore";

interface LocationCardProps {
  onLocationUpdate?: () => void;
}

export default function LocationCard({ onLocationUpdate }: LocationCardProps) {
  const { 
    userLocation, 
    locationPermissionGranted, 
    requestLocationPermission, 
    updateUserLocation,
    clearUserLocation 
  } = useUserStore();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRequestLocation = async () => {
    setIsLoading(true);
    try {
      const hasPermission = await requestLocationPermission();
      
      if (hasPermission) {
        await updateUserLocation();
        onLocationUpdate?.();
      } else {
        Alert.alert(
          "Location Permission Required",
          "Please enable location access in your device settings to use location-based features.",
          [
            { text: "Cancel", style: "cancel" },
            { text: "Settings", onPress: () => {
              // In a real app, you would open device settings
              Alert.alert("Info", "Please go to Settings > Privacy & Security > Location Services to enable location access for this app.");
            }}
          ]
        );
      }
    } catch (error) {
      console.error('Error requesting location:', error);
      Alert.alert("Error", "Failed to get your location. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefreshLocation = async () => {
    if (!locationPermissionGranted) {
      handleRequestLocation();
      return;
    }

    setIsRefreshing(true);
    try {
      await updateUserLocation();
      onLocationUpdate?.();
    } catch (error) {
      console.error('Error refreshing location:', error);
      Alert.alert("Error", "Failed to refresh your location. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleClearLocation = () => {
    Alert.alert(
      "Clear Location",
      "Are you sure you want to clear your saved location?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear", 
          style: "destructive",
          onPress: () => {
            clearUserLocation();
            onLocationUpdate?.();
          }
        }
      ]
    );
  };

  if (!locationPermissionGranted && !userLocation) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={[styles.iconContainer, { backgroundColor: "#FFF3E0" }]}>
              <MapPin size={20} color="#FF9800" />
            </View>
            <View>
              <Text style={styles.title}>Location Services</Text>
              <Text style={styles.subtitle}>Enable location to enhance your experience</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.permissionPrompt}>
            <AlertCircle size={24} color={Colors.text.secondary} />
            <Text style={styles.permissionText}>
              Location access is disabled. Enable it to see nearby stations and get personalized recommendations.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.enableButton}
            onPress={handleRequestLocation}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color={Colors.background} />
            ) : (
              <>
                <Navigation size={16} color={Colors.background} />
                <Text style={styles.enableButtonText}>Enable Location</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconContainer, { backgroundColor: "#E8F5E9" }]}>
            <MapPin size={20} color="#4CAF50" />
          </View>
          <View>
            <Text style={styles.title}>Current Location</Text>
            <Text style={styles.subtitle}>Your location information</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={handleRefreshLocation}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <ActivityIndicator size="small" color={Colors.primary} />
          ) : (
            <RefreshCw size={16} color={Colors.primary} />
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {userLocation ? (
          <>
            <View style={styles.locationInfo}>
              <Text style={styles.locationLabel}>Address</Text>
              <Text style={styles.locationValue}>
                {userLocation.address || "Address not available"}
              </Text>
            </View>

            <View style={styles.locationInfo}>
              <Text style={styles.locationLabel}>Coordinates</Text>
              <Text style={styles.locationValue}>
                {userLocation.latitude.toFixed(6)}, {userLocation.longitude.toFixed(6)}
              </Text>
            </View>

            {userLocation.nearestStation && (
              <View style={styles.locationInfo}>
                <Text style={styles.locationLabel}>Nearest Metro Station</Text>
                <Text style={styles.locationValue}>
                  {userLocation.nearestStation.name}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearLocation}
            >
              <Text style={styles.clearButtonText}>Clear Location</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.noLocationContainer}>
            <Text style={styles.noLocationText}>
              Location not available. Tap refresh to get your current location.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  refreshButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.secondary,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    gap: 12,
  },
  permissionPrompt: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    backgroundColor: Colors.secondary,
    borderRadius: 8,
  },
  permissionText: {
    flex: 1,
    fontSize: 14,
    color: Colors.text.secondary,
    lineHeight: 20,
  },
  enableButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    gap: 8,
  },
  enableButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.background,
  },
  locationInfo: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  locationValue: {
    fontSize: 16,
    color: Colors.text.primary,
    lineHeight: 22,
  },
  noLocationContainer: {
    padding: 16,
    alignItems: "center",
  },
  noLocationText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: "center",
    lineHeight: 20,
  },
  clearButton: {
    alignSelf: "flex-start",
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  clearButtonText: {
    fontSize: 14,
    color: Colors.error,
    fontWeight: "500",
  },
});
