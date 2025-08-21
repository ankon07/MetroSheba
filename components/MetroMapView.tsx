import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/colors';
import { mrtLine6Stations } from '@/mocks/locations';
import { MetroStation } from '@/types';

interface MetroMapViewProps {
  fromStationId?: string;
  toStationId?: string;
  currentStationId?: string;
  showRoute?: boolean;
  onStationPress?: (stationId: string) => void;
  height?: number;
  showUserLocation?: boolean;
}

const { width: screenWidth } = Dimensions.get('window');

export default function MetroMapView({
  fromStationId,
  toStationId,
  currentStationId,
  showRoute = false,
  onStationPress,
  height = 400,
  showUserLocation = false,
}: MetroMapViewProps) {
  const [selectedStation, setSelectedStation] = useState<MetroStation | null>(null);

  // Get route stations if showing route
  const getRouteStations = () => {
    if (!showRoute || !fromStationId || !toStationId) return [];
    
    const fromIndex = mrtLine6Stations.findIndex(s => s.id === fromStationId);
    const toIndex = mrtLine6Stations.findIndex(s => s.id === toStationId);
    
    if (fromIndex === -1 || toIndex === -1) return [];
    
    const minIndex = Math.min(fromIndex, toIndex);
    const maxIndex = Math.max(fromIndex, toIndex);
    
    return mrtLine6Stations.slice(minIndex, maxIndex + 1);
  };

  const routeStations = getRouteStations();

  // Get station color based on status
  const getStationColor = (station: MetroStation) => {
    if (station.id === fromStationId) return '#22c55e'; // green
    if (station.id === toStationId) return '#ef4444'; // red
    if (station.id === currentStationId) return '#3b82f6'; // blue
    if (showRoute && routeStations.some(s => s.id === station.id)) return '#f59e0b'; // amber
    return '#8b5cf6'; // purple (default metro color)
  };

  // Create HTML content for Leaflet map
  const createMapHTML = () => {
    const stations = mrtLine6Stations.map(station => ({
      ...station,
      color: getStationColor(station),
      isRoute: showRoute && routeStations.some(s => s.id === station.id),
      isOrigin: station.id === fromStationId,
      isDestination: station.id === toStationId,
      isCurrent: station.id === currentStationId,
    }));

    // Calculate map center (average of all coordinates)
    const centerLat = stations.reduce((sum, s) => sum + (s.coordinates?.latitude || 0), 0) / stations.length;
    const centerLng = stations.reduce((sum, s) => sum + (s.coordinates?.longitude || 0), 0) / stations.length;

    // Create route polyline coordinates if showing route
    const routeCoordinates = showRoute && routeStations.length > 1 
      ? routeStations.map(s => `[${s.coordinates?.latitude || 0}, ${s.coordinates?.longitude || 0}]`).join(',')
      : '';

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dhaka Metro Map</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <style>
        body { margin: 0; padding: 0; }
        #map { height: 100vh; width: 100vw; }
        .custom-marker {
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 10px;
            color: white;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
        }
        .station-popup {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .station-name {
            font-size: 14px;
            font-weight: 600;
            margin-bottom: 4px;
        }
        .station-code {
            font-size: 12px;
            color: #666;
            margin-bottom: 4px;
        }
        .station-coords {
            font-size: 10px;
            color: #888;
            font-family: monospace;
        }
        .station-status {
            font-size: 11px;
            font-weight: 500;
            margin-top: 4px;
            padding: 2px 6px;
            border-radius: 4px;
            display: inline-block;
        }
        .status-origin { background: #22c55e; color: white; }
        .status-destination { background: #ef4444; color: white; }
        .status-current { background: #3b82f6; color: white; }
        .status-route { background: #f59e0b; color: white; }
    </style>
</head>
<body>
    <div id="map"></div>
    <script>
        // Initialize map
        var map = L.map('map').setView([${centerLat}, ${centerLng}], 11);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Station data
        var stations = ${JSON.stringify(stations)};
        
        // Add route polyline if showing route
        ${routeCoordinates ? `
        var routeCoords = [${routeCoordinates}];
        var routeLine = L.polyline(routeCoords, {
            color: '#3b82f6',
            weight: 4,
            opacity: 0.8
        }).addTo(map);
        ` : ''}
        
        // Add metro line polyline (all stations)
        var allCoords = stations.map(s => [s.coordinates.latitude, s.coordinates.longitude]);
        var metroLine = L.polyline(allCoords, {
            color: '#8b5cf6',
            weight: 3,
            opacity: 0.6,
            dashArray: '10, 10'
        }).addTo(map);
        
        // Add station markers
        stations.forEach(function(station) {
            var markerSize = 24;
            if (station.isOrigin || station.isDestination || station.isCurrent) {
                markerSize = 32;
            } else if (station.isRoute) {
                markerSize = 28;
            }
            
            var markerIcon = L.divIcon({
                className: 'custom-marker',
                html: '<div class="custom-marker" style="width:' + markerSize + 'px;height:' + markerSize + 'px;background-color:' + station.color + '">' + station.code + '</div>',
                iconSize: [markerSize, markerSize],
                iconAnchor: [markerSize/2, markerSize/2]
            });
            
            var marker = L.marker([station.coordinates.latitude, station.coordinates.longitude], {
                icon: markerIcon
            }).addTo(map);
            
            // Create popup content
            var statusText = '';
            var statusClass = '';
            if (station.isOrigin) {
                statusText = '🚀 Origin Station';
                statusClass = 'status-origin';
            } else if (station.isDestination) {
                statusText = '🎯 Destination Station';
                statusClass = 'status-destination';
            } else if (station.isCurrent) {
                statusText = '📍 Current Location';
                statusClass = 'status-current';
            } else if (station.isRoute) {
                statusText = '🚇 On Route';
                statusClass = 'status-route';
            }
            
            var popupContent = '<div class="station-popup">' +
                '<div class="station-name">' + station.name + '</div>' +
                '<div class="station-code">' + station.code + ' • ' + station.line + '</div>' +
                '<div class="station-coords">' + 
                    station.coordinates.latitude.toFixed(6) + ', ' + 
                    station.coordinates.longitude.toFixed(6) + 
                '</div>';
                
            if (statusText) {
                popupContent += '<div class="station-status ' + statusClass + '">' + statusText + '</div>';
            }
            
            popupContent += '</div>';
            
            marker.bindPopup(popupContent);
            
            // Handle marker click
            marker.on('click', function() {
                window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'stationPress',
                    stationId: station.id,
                    station: station
                }));
            });
        });
        
        // Fit map to show all stations or route
        ${routeCoordinates ? `
        if (routeCoords.length > 0) {
            map.fitBounds(routeCoords, { padding: [20, 20] });
        }
        ` : `
        if (allCoords.length > 0) {
            map.fitBounds(allCoords, { padding: [20, 20] });
        }
        `}
        
        // Handle map ready
        map.whenReady(function() {
            window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'mapReady'
            }));
        });
    </script>
</body>
</html>`;
  };

  // Handle messages from WebView
  const handleWebViewMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      
      if (data.type === 'stationPress') {
        const station = mrtLine6Stations.find(s => s.id === data.stationId);
        if (station) {
          setSelectedStation(station);
          if (onStationPress) {
            onStationPress(data.stationId);
          }
        }
      }
    } catch (error) {
      console.log('Error parsing WebView message:', error);
    }
  };

  return (
    <View style={[styles.container, { height }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="map" size={20} color={Colors.primary} />
          <Text style={styles.headerTitle}>Dhaka Metro Rail - MRT Line-6</Text>
        </View>
        
        {showRoute && fromStationId && toStationId && (
          <View style={styles.routeInfo}>
            <Text style={styles.routeText}>
              {routeStations.length} stations
            </Text>
          </View>
        )}
      </View>

      {/* Leaflet Map */}
      <View style={styles.mapContainer}>
        <WebView
          source={{ html: createMapHTML() }}
          style={styles.webView}
          onMessage={handleWebViewMessage}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          scalesPageToFit={true}
          scrollEnabled={false}
          bounces={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Station Info Panel */}
      {selectedStation && (
        <View style={styles.infoPanel}>
          <View style={styles.infoPanelHeader}>
            <View style={styles.stationInfo}>
              <Text style={styles.selectedStationName}>{selectedStation.name}</Text>
              <Text style={styles.selectedStationCode}>
                {selectedStation.code} • {selectedStation.line}
              </Text>
              <Text style={styles.coordinates}>
                {selectedStation.coordinates?.latitude.toFixed(6)}, {selectedStation.coordinates?.longitude.toFixed(6)}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setSelectedStation(null)}
              style={styles.closeButton}
            >
              <Ionicons name="close" size={20} color={Colors.text.secondary} />
            </TouchableOpacity>
          </View>
          
          {selectedStation.facilities && selectedStation.facilities.length > 0 && (
            <View style={styles.facilities}>
              <Text style={styles.facilitiesTitle}>Facilities:</Text>
              <Text style={styles.facilitiesText}>
                {selectedStation.facilities.join(' • ')}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Legend */}
      {showRoute && (
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#22c55e' }]} />
            <Text style={styles.legendText}>Origin</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
            <Text style={styles.legendText}>Destination</Text>
          </View>
          {currentStationId && (
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#3b82f6' }]} />
              <Text style={styles.legendText}>Current</Text>
            </View>
          )}
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
            <Text style={styles.legendText}>Route</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginLeft: 8,
    flex: 1,
  },
  routeInfo: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  routeText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  mapContainer: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  infoPanel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: 120,
  },
  infoPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  stationInfo: {
    flex: 1,
  },
  selectedStationName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  selectedStationCode: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  coordinates: {
    fontSize: 10,
    color: Colors.text.secondary,
    marginTop: 2,
    fontFamily: 'monospace',
  },
  closeButton: {
    padding: 4,
  },
  facilities: {
    marginTop: 8,
  },
  facilitiesTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  facilitiesText: {
    fontSize: 11,
    color: Colors.text.secondary,
    lineHeight: 16,
  },
  legend: {
    position: 'absolute',
    top: 60,
    left: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 8,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendText: {
    fontSize: 10,
    color: Colors.text.secondary,
    fontWeight: '500',
  },
});
