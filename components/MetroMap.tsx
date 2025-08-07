import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Train, MapPin, Clock } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { mrtLine6Stations } from '@/mocks/locations';

interface MetroMapProps {
  fromStationId?: string;
  toStationId?: string;
  currentStationId?: string;
  showRoute?: boolean;
  onStationPress?: (stationId: string) => void;
}

export default function MetroMap({ 
  fromStationId, 
  toStationId, 
  currentStationId, 
  showRoute = false,
  onStationPress 
}: MetroMapProps) {
  const getStationStatus = (stationId: string) => {
    if (stationId === fromStationId) return 'origin';
    if (stationId === toStationId) return 'destination';
    if (stationId === currentStationId) return 'current';
    
    if (showRoute && fromStationId && toStationId) {
      const fromIndex = mrtLine6Stations.findIndex(s => s.id === fromStationId);
      const toIndex = mrtLine6Stations.findIndex(s => s.id === toStationId);
      const stationIndex = mrtLine6Stations.findIndex(s => s.id === stationId);
      
      const minIndex = Math.min(fromIndex, toIndex);
      const maxIndex = Math.max(fromIndex, toIndex);
      
      if (stationIndex > minIndex && stationIndex < maxIndex) {
        return 'intermediate';
      }
    }
    
    return 'normal';
  };

  const getStationColor = (status: string) => {
    switch (status) {
      case 'origin': return Colors.success;
      case 'destination': return Colors.error;
      case 'current': return Colors.metro.current;
      case 'intermediate': return Colors.metro.intermediate;
      default: return Colors.border;
    }
  };

  const getStationSize = (status: string) => {
    switch (status) {
      case 'origin':
      case 'destination':
      case 'current': return 16;
      case 'intermediate': return 12;
      default: return 8;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Train size={20} color={Colors.primary} />
        <Text style={styles.title}>MRT Line-6 Route Map</Text>
      </View>
      
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.mapContainer}
      >
        <View style={styles.routeLine}>
          {mrtLine6Stations.map((station, index) => {
            const status = getStationStatus(station.id);
            const isLast = index === mrtLine6Stations.length - 1;
            
            return (
              <View key={station.id} style={styles.stationContainer}>
                <TouchableOpacity
                  style={styles.stationTouchable}
                  onPress={() => onStationPress?.(station.id)}
                  disabled={!onStationPress}
                >
                  <View 
                    style={[
                      styles.stationDot,
                      {
                        backgroundColor: getStationColor(status),
                        width: getStationSize(status),
                        height: getStationSize(status),
                        borderRadius: getStationSize(status) / 2,
                      }
                    ]} 
                  />
                  <Text style={[
                    styles.stationName,
                    status !== 'normal' && styles.activeStationName
                  ]}>
                    {station.name}
                  </Text>
                  <Text style={styles.stationCode}>{station.code}</Text>
                </TouchableOpacity>
                
                {!isLast && (
                  <View style={[
                    styles.connectionLine,
                    showRoute && status === 'intermediate' && styles.activeConnectionLine
                  ]} />
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
      
      {showRoute && fromStationId && toStationId && (
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.success }]} />
            <Text style={styles.legendText}>Origin</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.metro.intermediate }]} />
            <Text style={styles.legendText}>Route</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: Colors.error }]} />
            <Text style={styles.legendText}>Destination</Text>
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
    padding: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
    marginLeft: 8,
  },
  mapContainer: {
    paddingHorizontal: 8,
  },
  routeLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stationTouchable: {
    alignItems: 'center',
    paddingHorizontal: 4,
    paddingVertical: 8,
  },
  stationDot: {
    marginBottom: 4,
  },
  stationName: {
    fontSize: 10,
    color: Colors.text.secondary,
    textAlign: 'center',
    maxWidth: 60,
    lineHeight: 12,
  },
  activeStationName: {
    fontWeight: '600',
    color: Colors.text.primary,
  },
  stationCode: {
    fontSize: 8,
    color: Colors.text.muted,
    textAlign: 'center',
    marginTop: 2,
  },
  connectionLine: {
    width: 20,
    height: 2,
    backgroundColor: Colors.border,
    marginHorizontal: 4,
  },
  activeConnectionLine: {
    backgroundColor: Colors.metro.intermediate,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 4,
  },
  legendText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
});