import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/colors';
import { mrtLine6Stations } from '@/mocks/locations';

const { width } = Dimensions.get('window');

interface InteractiveRouteMapProps {
  fromStationId: string;
  toStationId: string;
  departureTime: string;
  arrivalTime: string;
  trainNumber: string;
  isRealTime?: boolean;
}

interface TrainPosition {
  currentStationIndex: number;
  progress: number; // 0-1 between stations
  status: 'approaching' | 'at-station' | 'departed' | 'in-transit';
  nextStation?: string;
  estimatedArrival?: string;
}

const InteractiveRouteMap: React.FC<InteractiveRouteMapProps> = ({
  fromStationId,
  toStationId,
  departureTime,
  arrivalTime,
  trainNumber,
  isRealTime = true,
}) => {
  const [trainPosition, setTrainPosition] = useState<TrainPosition>({
    currentStationIndex: 0,
    progress: 0,
    status: 'at-station',
  });
  const [animatedValue] = useState(new Animated.Value(0));

  // Find station indices
  const fromIndex = mrtLine6Stations.findIndex(station => station.id === fromStationId);
  const toIndex = mrtLine6Stations.findIndex(station => station.id === toStationId);
  
  // Get route stations
  const routeStations = fromIndex < toIndex 
    ? mrtLine6Stations.slice(fromIndex, toIndex + 1)
    : mrtLine6Stations.slice(toIndex, fromIndex + 1).reverse();

  // Calculate real-time position based on current time
  useEffect(() => {
    if (!isRealTime) return;

    const updateTrainPosition = () => {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();
      
      // Parse departure and arrival times
      const [depHour, depMin] = departureTime.split(':').map(Number);
      const [arrHour, arrMin] = arrivalTime.split(':').map(Number);
      
      const departureMinutes = depHour * 60 + depMin;
      const arrivalMinutes = arrHour * 60 + arrMin;
      const totalTripTime = arrivalMinutes - departureMinutes;
      
      if (currentTime < departureMinutes) {
        // Train hasn't departed yet
        setTrainPosition({
          currentStationIndex: 0,
          progress: 0,
          status: 'at-station',
          nextStation: routeStations[1]?.name,
          estimatedArrival: `Departs in ${Math.ceil((departureMinutes - currentTime))} min`,
        });
      } else if (currentTime > arrivalMinutes) {
        // Train has arrived
        setTrainPosition({
          currentStationIndex: routeStations.length - 1,
          progress: 1,
          status: 'at-station',
          estimatedArrival: 'Arrived',
        });
      } else {
        // Train is in transit
        const elapsedTime = currentTime - departureMinutes;
        const progressRatio = elapsedTime / totalTripTime;
        
        // Calculate which segment the train is in
        const totalSegments = routeStations.length - 1;
        const currentSegment = Math.floor(progressRatio * totalSegments);
        const segmentProgress = (progressRatio * totalSegments) % 1;
        
        const nextStationIndex = Math.min(currentSegment + 1, routeStations.length - 1);
        const remainingTime = Math.ceil((arrivalMinutes - currentTime));
        
        setTrainPosition({
          currentStationIndex: currentSegment,
          progress: segmentProgress,
          status: segmentProgress > 0.8 ? 'approaching' : 'in-transit',
          nextStation: routeStations[nextStationIndex]?.name,
          estimatedArrival: `${remainingTime} min`,
        });

        // Animate train movement
        Animated.timing(animatedValue, {
          toValue: progressRatio,
          duration: 1000,
          useNativeDriver: false,
        }).start();
      }
    };

    updateTrainPosition();
    const interval = setInterval(updateTrainPosition, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [departureTime, arrivalTime, isRealTime]);

  const getStationStatus = (index: number) => {
    if (index < trainPosition.currentStationIndex) return 'passed';
    if (index === trainPosition.currentStationIndex) return 'current';
    if (index === trainPosition.currentStationIndex + 1 && trainPosition.status === 'approaching') return 'next';
    return 'upcoming';
  };

  const getStationColor = (status: string) => {
    switch (status) {
      case 'passed': return Colors.success;
      case 'current': return Colors.primary;
      case 'next': return Colors.warning;
      default: return Colors.text.secondary;
    }
  };

  const renderStation = (station: any, index: number) => {
    const status = getStationStatus(index);
    const isOrigin = index === 0;
    const isDestination = index === routeStations.length - 1;
    
    return (
      <View key={station.id} style={styles.stationContainer}>
        <View style={styles.stationLine}>
          <View style={[
            styles.stationDot,
            { backgroundColor: getStationColor(status) },
            (isOrigin || isDestination) && styles.terminalStation
          ]}>
            {status === 'current' && (
              <View style={styles.currentStationPulse} />
            )}
          </View>
          {index < routeStations.length - 1 && (
            <View style={[
              styles.connectionLine,
              { backgroundColor: status === 'passed' ? Colors.success : Colors.border }
            ]} />
          )}
        </View>
        
        <TouchableOpacity style={styles.stationInfo}>
          <Text style={[
            styles.stationName,
            { color: status === 'current' ? Colors.primary : Colors.text.primary }
          ]}>
            {station.name}
          </Text>
          <Text style={styles.stationCode}>{station.code}</Text>
          
          {status === 'current' && (
            <View style={styles.currentStationBadge}>
              <Ionicons name="train" size={12} color="white" />
              <Text style={styles.currentStationText}>Train Here</Text>
            </View>
          )}
          
          {status === 'next' && trainPosition.estimatedArrival && (
            <Text style={styles.estimatedTime}>
              Arriving in {trainPosition.estimatedArrival}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.trainInfo}>
          <Text style={styles.trainNumber}>Train {trainNumber}</Text>
          <Text style={styles.routeInfo}>
            {routeStations[0]?.name} → {routeStations[routeStations.length - 1]?.name}
          </Text>
        </View>
        
        {isRealTime && (
          <View style={styles.liveIndicator}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        )}
      </View>

      {/* Real-time Status */}
      {isRealTime && (
        <View style={styles.statusContainer}>
          <Ionicons 
            name={trainPosition.status === 'at-station' ? 'stop-circle' : 'train'} 
            size={16} 
            color={Colors.primary} 
          />
          <Text style={styles.statusText}>
            {trainPosition.status === 'at-station' 
              ? `At ${routeStations[trainPosition.currentStationIndex]?.name}`
              : trainPosition.status === 'approaching'
              ? `Approaching ${trainPosition.nextStation}`
              : `En route to ${trainPosition.nextStation}`
            }
          </Text>
          {trainPosition.estimatedArrival && (
            <Text style={styles.estimatedText}>• {trainPosition.estimatedArrival}</Text>
          )}
        </View>
      )}

      {/* Route Map */}
      <ScrollView 
        style={styles.routeContainer}
        showsVerticalScrollIndicator={false}
      >
        {routeStations.map((station, index) => renderStation(station, index))}
      </ScrollView>

      {/* Map Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.success }]} />
          <Text style={styles.legendText}>Passed</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.primary }]} />
          <Text style={styles.legendText}>Current</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.warning }]} />
          <Text style={styles.legendText}>Next</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: Colors.text.secondary }]} />
          <Text style={styles.legendText}>Upcoming</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.background,
    borderRadius: 12,
    padding: 16,
    margin: 16,
    maxHeight: 400,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  trainInfo: {
    flex: 1,
  },
  trainNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  routeInfo: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.error,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
    marginRight: 4,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text.primary,
    marginLeft: 8,
    flex: 1,
  },
  estimatedText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  routeContainer: {
    flex: 1,
    marginBottom: 16,
  },
  stationContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  stationLine: {
    alignItems: 'center',
    marginRight: 16,
    width: 20,
  },
  stationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    position: 'relative',
  },
  terminalStation: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  currentStationPulse: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    opacity: 0.3,
    top: -4,
    left: -4,
  },
  connectionLine: {
    width: 2,
    height: 40,
    marginTop: 4,
  },
  stationInfo: {
    flex: 1,
    paddingVertical: 4,
  },
  stationName: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  stationCode: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  currentStationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  currentStationText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '600',
    marginLeft: 4,
  },
  estimatedTime: {
    fontSize: 11,
    color: Colors.warning,
    fontWeight: '600',
    marginTop: 2,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
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
    fontSize: 10,
    color: Colors.text.secondary,
  },
});

export default InteractiveRouteMap;
