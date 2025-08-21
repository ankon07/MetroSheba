import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/colors';
import { locationService, UserLocation, RouteInfo, RoadUpdate } from '@/services/locationService';
import { MetroStation } from '@/types';

interface NavigationMapViewProps {
  onClose: () => void;
  height?: number;
}

export default function NavigationMapView({ onClose, height = 500 }: NavigationMapViewProps) {
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [nearestStation, setNearestStation] = useState<MetroStation | null>(null);
  const [route, setRoute] = useState<RouteInfo | null>(null);
  const [distance, setDistance] = useState<number>(0);
  const [showRouteDetails, setShowRouteDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeNavigation();
  }, []);

  const initializeNavigation = async () => {
    try {
      setLoading(true);
      setError(null);

      // Request location permission and get current location
      const hasPermission = await locationService.requestLocationPermission();
      if (!hasPermission) {
        setError('Location permission is required for navigation');
        setLoading(false);
        return;
      }

      // Get current location and nearest station with route
      const result = await locationService.findNearestStationWithRoute();
      if (!result) {
        setError('Unable to find your location or nearest metro station');
        setLoading(false);
        return;
      }

      setUserLocation({
        latitude: result.route.steps[0].coordinates[0].latitude,
        longitude: result.route.steps[0].coordinates[0].longitude,
      });
      setNearestStation(result.station);
      setRoute(result.route);
      setDistance(result.distance);
      setLoading(false);
    } catch (error) {
      console.error('Error initializing navigation:', error);
      setError('Failed to initialize navigation');
      setLoading(false);
    }
  };

  const createNavigationMapHTML = () => {
    if (!userLocation || !nearestStation || !route) return '';

    const routeCoordinates = route.steps
      .flatMap(step => step.coordinates)
      .map(coord => `[${coord.latitude}, ${coord.longitude}]`)
      .join(',');

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Navigation to ${nearestStation.name}</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css" />
    <script src="https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js"></script>
    <style>
        body { margin: 0; padding: 0; }
        #map { height: 100vh; width: 100vw; }
        .user-marker {
            background: #3b82f6;
            border: 3px solid white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }
        .station-marker {
            background: #ef4444;
            border: 3px solid white;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 10px;
            color: white;
        }
        .route-popup {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 200px;
        }
        .popup-title {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 4px;
        }
        .popup-distance {
            font-size: 12px;
            color: #666;
            margin-bottom: 4px;
        }
        .popup-duration {
            font-size: 12px;
            color: #666;
        }
        .leaflet-routing-container {
            display: none !important;
        }
    </style>
</head>
<body>
    <div id="map"></div>
    <script>
        // Initialize map centered on user location
        var map = L.map('map').setView([${userLocation.latitude}, ${userLocation.longitude}], 15);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Add user location marker
        var userIcon = L.divIcon({
            className: 'user-marker',
            html: '<div class="user-marker"></div>',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });
        
        var userMarker = L.marker([${userLocation.latitude}, ${userLocation.longitude}], {
            icon: userIcon
        }).addTo(map);
        
        userMarker.bindPopup('<div class="route-popup"><div class="popup-title">📍 Your Location</div><div class="popup-distance">Starting point</div></div>');

        // Add station marker
        var stationIcon = L.divIcon({
            className: 'station-marker',
            html: '<div class="station-marker">${nearestStation.code}</div>',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
        });
        
        var stationMarker = L.marker([${nearestStation.coordinates?.latitude}, ${nearestStation.coordinates?.longitude}], {
            icon: stationIcon
        }).addTo(map);
        
        stationMarker.bindPopup('<div class="route-popup"><div class="popup-title">🚇 ${nearestStation.name}</div><div class="popup-distance">Metro Station</div><div class="popup-duration">Distance: ${distance.toFixed(2)} km</div></div>');

        // Add route polyline
        var routeCoords = [${routeCoordinates}];
        var routeLine = L.polyline(routeCoords, {
            color: '#3b82f6',
            weight: 4,
            opacity: 0.8,
            dashArray: '10, 5'
        }).addTo(map);

        // Add route markers for each step
        ${route.steps.map((step, index) => `
        var stepMarker${index} = L.circleMarker([${step.coordinates[0].latitude}, ${step.coordinates[0].longitude}], {
            radius: 6,
            fillColor: '#f59e0b',
            color: 'white',
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8
        }).addTo(map);
        
        stepMarker${index}.bindPopup('<div class="route-popup"><div class="popup-title">Step ${index + 1}</div><div class="popup-distance">${step.instruction}</div><div class="popup-duration">${step.distance.toFixed(2)} km • ${Math.round(step.duration)} min</div></div>');
        `).join('')}

        // Fit map to show the route
        map.fitBounds(routeLine.getBounds(), { padding: [20, 20] });

        // Handle map ready
        map.whenReady(function() {
            window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'mapReady'
            }));
        });

        // Handle map click
        map.on('click', function(e) {
            window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'mapClick',
                coordinates: {
                    latitude: e.latlng.lat,
                    longitude: e.latlng.lng
                }
            }));
        });
    </script>
</body>
</html>`;
  };

  const getSeverityColor = (severity: 'low' | 'medium' | 'high') => {
    switch (severity) {
      case 'low': return Colors.success;
      case 'medium': return Colors.warning;
      case 'high': return Colors.error;
      default: return Colors.text.secondary;
    }
  };

  const getSeverityIcon = (type: RoadUpdate['type']) => {
    switch (type) {
      case 'traffic': return 'car';
      case 'construction': return 'construct';
      case 'accident': return 'warning';
      case 'closure': return 'close-circle';
      default: return 'information-circle';
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { height }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Finding Route...</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Getting your location and finding nearest metro station...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { height }]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Navigation Error</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color={Colors.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={initializeNavigation}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="navigate" size={20} color={Colors.primary} />
          <Text style={styles.headerTitle}>Navigate to {nearestStation?.name}</Text>
        </View>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={Colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Route Summary */}
      <View style={styles.routeSummary}>
        <View style={styles.summaryItem}>
          <Ionicons name="location" size={16} color={Colors.primary} />
          <Text style={styles.summaryText}>{distance.toFixed(2)} km</Text>
        </View>
        <View style={styles.summaryItem}>
          <Ionicons name="time" size={16} color={Colors.primary} />
          <Text style={styles.summaryText}>{route?.duration} min walk</Text>
        </View>
        <TouchableOpacity 
          style={styles.summaryItem}
          onPress={() => setShowRouteDetails(!showRouteDetails)}
        >
          <Ionicons name="list" size={16} color={Colors.primary} />
          <Text style={styles.summaryText}>Details</Text>
          <Ionicons 
            name={showRouteDetails ? "chevron-up" : "chevron-down"} 
            size={16} 
            color={Colors.primary} 
          />
        </TouchableOpacity>
      </View>

      {/* Map */}
      <View style={styles.mapContainer}>
        <WebView
          source={{ html: createNavigationMapHTML() }}
          style={styles.webView}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
        />
      </View>

      {/* Route Details */}
      {showRouteDetails && (
        <ScrollView style={styles.routeDetails}>
          <Text style={styles.routeDetailsTitle}>Route Steps</Text>
          {route?.steps.map((step, index) => (
            <View key={index} style={styles.routeStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <View style={styles.stepContent}>
                <Text style={styles.stepInstruction}>{step.instruction}</Text>
                <Text style={styles.stepDistance}>
                  {step.distance.toFixed(2)} km • {Math.round(step.duration)} min
                </Text>
              </View>
            </View>
          ))}

          {/* Road Updates */}
          {route?.roadUpdates && route.roadUpdates.length > 0 && (
            <View style={styles.roadUpdatesSection}>
              <Text style={styles.roadUpdatesTitle}>Road Updates</Text>
              {route.roadUpdates.map((update) => (
                <View key={update.id} style={styles.roadUpdate}>
                  <View style={[styles.updateIcon, { backgroundColor: getSeverityColor(update.severity) }]}>
                    <Ionicons 
                      name={getSeverityIcon(update.type)} 
                      size={16} 
                      color="white" 
                    />
                  </View>
                  <View style={styles.updateContent}>
                    <Text style={styles.updateMessage}>{update.message}</Text>
                    <Text style={styles.updateLocation}>{update.location}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginLeft: 8,
  },
  closeButton: {
    padding: 4,
  },
  routeSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.card,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  summaryText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.primary,
  },
  mapContainer: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: Colors.text.primary,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  routeDetails: {
    maxHeight: 200,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  routeDetailsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    padding: 16,
    paddingBottom: 8,
  },
  routeStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  stepContent: {
    flex: 1,
  },
  stepInstruction: {
    fontSize: 14,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  stepDistance: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  roadUpdatesSection: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  roadUpdatesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  roadUpdate: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  updateIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  updateContent: {
    flex: 1,
  },
  updateMessage: {
    fontSize: 14,
    color: Colors.text.primary,
    marginBottom: 2,
  },
  updateLocation: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
});
