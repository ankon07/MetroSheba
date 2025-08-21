import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  StatusBar,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/colors';
import { mrtLine6Stations } from '@/mocks/locations';
import { MetroStation } from '@/types';

interface FullscreenMapViewProps {
  visible: boolean;
  onClose: () => void;
  fromStationId?: string;
  toStationId?: string;
  currentStationId?: string;
  showRoute?: boolean;
  onStationPress?: (stationId: string) => void;
  showUserLocation?: boolean;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function FullscreenMapView({
  visible,
  onClose,
  fromStationId,
  toStationId,
  currentStationId,
  showRoute = false,
  onStationPress,
  showUserLocation = false,
}: FullscreenMapViewProps) {
  const [selectedStation, setSelectedStation] = useState<MetroStation | null>(null);
  const [mapReady, setMapReady] = useState(false);

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
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=yes">
    <title>Dhaka Metro Map - Fullscreen</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <link rel="stylesheet" href="https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.css" />
    <script src="https://unpkg.com/leaflet-routing-machine@3.2.12/dist/leaflet-routing-machine.js"></script>
    <style>
        body { 
            margin: 0; 
            padding: 0; 
            overflow: hidden;
            touch-action: manipulation;
        }
        #map { 
            height: 100vh; 
            width: 100vw; 
            position: absolute;
            top: 0;
            left: 0;
        }
        .custom-marker {
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 11px;
            color: white;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.7);
            cursor: pointer;
            transition: transform 0.2s ease;
        }
        .custom-marker:hover {
            transform: scale(1.1);
        }
        .station-popup {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            min-width: 200px;
        }
        .station-name {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 6px;
            color: #1f2937;
        }
        .station-code {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 6px;
        }
        .station-coords {
            font-size: 11px;
            color: #9ca3af;
            font-family: monospace;
            margin-bottom: 4px;
        }
        .station-status {
            font-size: 12px;
            font-weight: 500;
            margin-top: 6px;
            padding: 4px 8px;
            border-radius: 6px;
            display: inline-block;
        }
        .status-origin { background: #22c55e; color: white; }
        .status-destination { background: #ef4444; color: white; }
        .status-current { background: #3b82f6; color: white; }
        .status-route { background: #f59e0b; color: white; }
        .leaflet-routing-container {
            display: none !important;
        }
        .leaflet-popup-content {
            margin: 12px 16px;
            line-height: 1.5;
        }
        .leaflet-popup-content-wrapper {
            border-radius: 8px;
        }
        .leaflet-control-zoom {
            border-radius: 8px !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
        }
        .leaflet-control-zoom a {
            border-radius: 8px !important;
            font-size: 18px !important;
            line-height: 36px !important;
            width: 36px !important;
            height: 36px !important;
        }
        .leaflet-control-attribution {
            background: rgba(255,255,255,0.8) !important;
            border-radius: 4px !important;
            font-size: 10px !important;
        }
    </style>
</head>
<body>
    <div id="map"></div>
    <script>
        // Initialize map with better zoom controls
        var map = L.map('map', {
            zoomControl: true,
            scrollWheelZoom: true,
            doubleClickZoom: true,
            touchZoom: true,
            dragging: true,
            tap: true,
            zoomSnap: 0.5,
            zoomDelta: 0.5,
            wheelPxPerZoomLevel: 60
        }).setView([${centerLat}, ${centerLng}], 12);
        
        // Add OpenStreetMap tiles with better quality
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19,
            tileSize: 256,
            zoomOffset: 0
        }).addTo(map);

        // Station data
        var stations = ${JSON.stringify(stations)};
        var routingControl = null;
        var originStation = null;
        var destinationStation = null;
        
        // Find origin and destination stations
        stations.forEach(function(station) {
            if (station.isOrigin) originStation = station;
            if (station.isDestination) destinationStation = station;
        });
        
        // Add route polyline if showing route
        ${routeCoordinates ? `
        var routeCoords = [${routeCoordinates}];
        var routeLine = L.polyline(routeCoords, {
            color: '#3b82f6',
            weight: 5,
            opacity: 0.9,
            smoothFactor: 1
        }).addTo(map);
        ` : ''}
        
        // Add metro line polyline (all stations)
        var allCoords = stations.map(s => [s.coordinates.latitude, s.coordinates.longitude]);
        var metroLine = L.polyline(allCoords, {
            color: '#8b5cf6',
            weight: 4,
            opacity: 0.7,
            dashArray: '12, 8',
            smoothFactor: 1
        }).addTo(map);
        
        // Add station markers with enhanced styling
        stations.forEach(function(station) {
            var markerSize = 28;
            if (station.isOrigin || station.isDestination || station.isCurrent) {
                markerSize = 36;
            } else if (station.isRoute) {
                markerSize = 32;
            }
            
            var markerIcon = L.divIcon({
                className: 'custom-marker',
                html: '<div class="custom-marker" style="width:' + markerSize + 'px;height:' + markerSize + 'px;background-color:' + station.color + '">' + station.code + '</div>',
                iconSize: [markerSize, markerSize],
                iconAnchor: [markerSize/2, markerSize/2]
            });
            
            var marker = L.marker([station.coordinates.latitude, station.coordinates.longitude], {
                icon: markerIcon,
                riseOnHover: true
            }).addTo(map);
            
            // Create enhanced popup content
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
            
            var facilitiesText = station.facilities && station.facilities.length > 0 
                ? '<div style="margin-top: 8px; font-size: 11px; color: #6b7280;"><strong>Facilities:</strong><br>' + station.facilities.join(' • ') + '</div>'
                : '';
            
            var popupContent = '<div class="station-popup">' +
                '<div class="station-name">' + station.name + '</div>' +
                '<div class="station-code">' + station.code + ' • ' + station.line + '</div>' +
                '<div class="station-coords">📍 ' + 
                    station.coordinates.latitude.toFixed(6) + ', ' + 
                    station.coordinates.longitude.toFixed(6) + 
                '</div>' +
                '<div class="station-coords">🚇 ' + (station.isOperational ? 'Operational' : 'Under Construction') + '</div>';
                
            if (statusText) {
                popupContent += '<div class="station-status ' + statusClass + '">' + statusText + '</div>';
            }
            
            popupContent += facilitiesText + '</div>';
            
            marker.bindPopup(popupContent, {
                maxWidth: 300,
                className: 'custom-popup'
            });
            
            // Handle marker click
            marker.on('click', function() {
                window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'stationPress',
                    stationId: station.id,
                    station: station
                }));
            });
        });
        
        // Fit map to show all stations or route with better padding
        ${routeCoordinates ? `
        if (routeCoords.length > 0) {
            map.fitBounds(routeCoords, { padding: [40, 40] });
        }
        ` : `
        if (allCoords.length > 0) {
            map.fitBounds(allCoords, { padding: [40, 40] });
        }
        `}
        
        // Enhanced road route function
        function showRoadRoute(startLat, startLng, endLat, endLng, clickedLat, clickedLng) {
            if (routingControl) {
                map.removeControl(routingControl);
            }
            
            routingControl = L.Routing.control({
                waypoints: [
                    L.latLng(startLat, startLng),
                    L.latLng(endLat, endLng)
                ],
                routeWhileDragging: false,
                addWaypoints: false,
                createMarker: function() { return null; },
                lineOptions: {
                    styles: [{
                        color: '#ff6b35',
                        weight: 6,
                        opacity: 0.8
                    }]
                },
                show: false,
                router: L.Routing.osrmv1({
                    serviceUrl: 'https://router.project-osrm.org/route/v1'
                })
            }).addTo(map);
            
            routingControl.on('routesfound', function(e) {
                var routes = e.routes;
                var summary = routes[0].summary;
                
                var popupContent = '<div class="station-popup">' +
                    '<div class="station-name">🛣️ Road Route</div>' +
                    '<div class="station-code">From Origin to Destination</div>' +
                    '<div class="station-coords">📏 Distance: ' + (summary.totalDistance / 1000).toFixed(2) + ' km</div>' +
                    '<div class="station-coords">⏱️ Duration: ' + Math.round(summary.totalTime / 60) + ' minutes</div>' +
                    '<div class="station-coords">📍 ' + clickedLat.toFixed(6) + ', ' + clickedLng.toFixed(6) + '</div>' +
                '</div>';
                
                L.popup()
                    .setLatLng([clickedLat, clickedLng])
                    .setContent(popupContent)
                    .openOn(map);
            });
        }
        
        // Enhanced map click handler
        map.on('click', function(e) {
            var clickedLat = e.latlng.lat;
            var clickedLng = e.latlng.lng;
            
            if (originStation && destinationStation) {
                showRoadRoute(
                    originStation.coordinates.latitude,
                    originStation.coordinates.longitude,
                    destinationStation.coordinates.latitude,
                    destinationStation.coordinates.longitude,
                    clickedLat,
                    clickedLng
                );
                
                window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'mapClick',
                    coordinates: { latitude: clickedLat, longitude: clickedLng },
                    hasRoute: true
                }));
            } else {
                var popupContent = '<div class="station-popup">' +
                    '<div class="station-name">📍 Location Info</div>' +
                    '<div class="station-coords">Coordinates: ' + clickedLat.toFixed(6) + ', ' + clickedLng.toFixed(6) + '</div>' +
                    '<div class="station-code">Tap stations to select origin and destination</div>' +
                '</div>';
                
                L.popup()
                    .setLatLng([clickedLat, clickedLng])
                    .setContent(popupContent)
                    .openOn(map);
                
                window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'mapClick',
                    coordinates: { latitude: clickedLat, longitude: clickedLng },
                    hasRoute: false
                }));
            }
        });
        
        // Handle map ready
        map.whenReady(function() {
            window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'mapReady'
            }));
        });
        
        // Add zoom event listener
        map.on('zoomend', function() {
            window.ReactNativeWebView && window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'zoomChanged',
                zoom: map.getZoom()
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
      } else if (data.type === 'mapClick') {
        console.log('Map clicked at:', data.coordinates);
      } else if (data.type === 'mapReady') {
        setMapReady(true);
      }
    } catch (error) {
      console.log('Error parsing WebView message:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
          
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Dhaka Metro Map</Text>
            <Text style={styles.headerSubtitle}>
              {showRoute && fromStationId && toStationId 
                ? `${routeStations.length} stations route`
                : 'MRT Line-6 Network'
              }
            </Text>
          </View>
          
          <View style={styles.headerRight}>
            {mapReady && (
              <View style={styles.mapStatus}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Live</Text>
              </View>
            )}
          </View>
        </View>

        {/* Fullscreen Map */}
        <View style={styles.mapContainer}>
          <WebView
            source={{ html: createMapHTML() }}
            style={styles.webView}
            onMessage={handleWebViewMessage}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            scalesPageToFit={false}
            scrollEnabled={true}
            bounces={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
          />
        </View>

        {/* Legend */}
        {(showRoute || fromStationId || toStationId || currentStationId) && (
          <View style={styles.legend}>
            {fromStationId && (
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#22c55e' }]} />
                <Text style={styles.legendText}>Origin</Text>
              </View>
            )}
            {toStationId && (
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#ef4444' }]} />
                <Text style={styles.legendText}>Destination</Text>
              </View>
            )}
            {currentStationId && (
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#3b82f6' }]} />
                <Text style={styles.legendText}>Current</Text>
              </View>
            )}
            {showRoute && (
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#f59e0b' }]} />
                <Text style={styles.legendText}>Route</Text>
              </View>
            )}
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#8b5cf6' }]} />
              <Text style={styles.legendText}>Metro Line</Text>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.primary,
    paddingTop: 50, // Account for status bar
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  headerRight: {
    width: 80,
    alignItems: 'flex-end',
  },
  mapStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#22c55e',
    marginRight: 4,
  },
  statusText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  mapContainer: {
    flex: 1,
  },
  webView: {
    flex: 1,
  },
  legend: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    maxWidth: screenWidth - 40,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: Colors.text.primary,
    fontWeight: '500',
  },
});
