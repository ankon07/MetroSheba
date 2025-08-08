import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Clock, MapPin, Train } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { mrtLine6Stations } from '@/mocks/locations';

interface RouteStepsProps {
  fromStationId: string;
  toStationId: string;
  departureTime: string;
  arrivalTime: string;
}

export default function RouteSteps({ 
  fromStationId, 
  toStationId, 
  departureTime, 
  arrivalTime 
}: RouteStepsProps) {
  const fromStation = mrtLine6Stations.find(s => s.id === fromStationId);
  const toStation = mrtLine6Stations.find(s => s.id === toStationId);
  
  if (!fromStation || !toStation) return null;

  const fromIndex = mrtLine6Stations.findIndex(s => s.id === fromStationId);
  const toIndex = mrtLine6Stations.findIndex(s => s.id === toStationId);
  
  const minIndex = Math.min(fromIndex, toIndex);
  const maxIndex = Math.max(fromIndex, toIndex);
  
  const routeStations = mrtLine6Stations.slice(minIndex, maxIndex + 1);
  if (fromIndex > toIndex) {
    routeStations.reverse();
  }

  const calculateStationTime = (stationIndex: number, totalStations: number) => {
    const departureMinutes = parseInt(departureTime.split(':')[0]) * 60 + parseInt(departureTime.split(':')[1]);
    const arrivalMinutes = parseInt(arrivalTime.split(':')[0]) * 60 + parseInt(arrivalTime.split(':')[1]);
    const totalDuration = arrivalMinutes - departureMinutes;
    
    const stationTime = departureMinutes + (totalDuration * stationIndex / (totalStations - 1));
    const hours = Math.floor(stationTime / 60);
    const minutes = Math.floor(stationTime % 60);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Train size={20} color={Colors.primary} />
        <Text style={styles.title}>Train Route</Text>
      </View>
      
      <View style={styles.routeContainer}>
        {routeStations.map((station, index) => {
          const isFirst = index === 0;
          const isLast = index === routeStations.length - 1;
          const isIntermediate = !isFirst && !isLast;
          const stationTime = isFirst ? departureTime : isLast ? arrivalTime : calculateStationTime(index, routeStations.length);
          
          return (
            <View key={station.id} style={styles.stationStep}>
              <View style={styles.timeColumn}>
                <Text style={[
                  styles.timeText,
                  (isFirst || isLast) && styles.terminalTimeText
                ]}>
                  {stationTime}
                </Text>
                <View style={[
                  styles.stationDot,
                  isFirst && styles.originDot,
                  isLast && styles.destinationDot,
                  isIntermediate && styles.intermediateDot
                ]} />
              </View>
              
              <View style={styles.stationInfo}>
                <View style={styles.stationHeader}>
                  <MapPin 
                    size={16} 
                    color={isFirst ? Colors.success : isLast ? Colors.error : Colors.metro.intermediate} 
                  />
                  <Text style={[
                    styles.stationName,
                    (isFirst || isLast) && styles.terminalStationName
                  ]}>
                    {station.name}
                  </Text>
                </View>
                
                <Text style={styles.stationCode}>Station Code: {station.code}</Text>
                
                {isFirst && (
                  <Text style={styles.stationNote}>
                    Departure • Platform information available 20 min before
                  </Text>
                )}
                
                {isLast && (
                  <Text style={styles.stationNote}>
                    Arrival • Exit through main concourse
                  </Text>
                )}
                
                {isIntermediate && (
                  <Text style={styles.stationNote}>
                    Passing through • {Math.floor(Math.random() * 2) + 1} min stop
                  </Text>
                )}
              </View>
              
              {!isLast && (
                <View style={styles.connectionLine} />
              )}
            </View>
          );
        })}
      </View>
      
      <View style={styles.summary}>
        <View style={styles.summaryItem}>
          <Clock size={16} color={Colors.text.secondary} />
          <Text style={styles.summaryText}>
            Total journey: {routeStations.length} stations
          </Text>
        </View>
        <View style={styles.summaryItem}>
          <Train size={16} color={Colors.text.secondary} />
          <Text style={styles.summaryText}>
            MRT Line-6 • Direct service
          </Text>
        </View>
      </View>
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
  routeContainer: {
    paddingLeft: 8,
  },
  stationStep: {
    flexDirection: 'row',
    position: 'relative',
  },
  timeColumn: {
    alignItems: 'center',
    width: 60,
    marginRight: 16,
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  terminalTimeText: {
    fontWeight: '700',
    color: Colors.text.primary,
  },
  stationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.border,
  },
  originDot: {
    backgroundColor: Colors.success,
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  destinationDot: {
    backgroundColor: Colors.error,
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  intermediateDot: {
    backgroundColor: Colors.metro.intermediate,
  },
  stationInfo: {
    flex: 1,
    paddingBottom: 20,
  },
  stationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  stationName: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text.primary,
    marginLeft: 8,
  },
  terminalStationName: {
    fontWeight: '700',
  },
  stationCode: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginLeft: 24,
    marginBottom: 4,
  },
  stationNote: {
    fontSize: 12,
    color: Colors.text.muted,
    marginLeft: 24,
    fontStyle: 'italic',
  },
  connectionLine: {
    position: 'absolute',
    left: 35,
    top: 40,
    width: 2,
    height: 40,
    backgroundColor: Colors.border,
  },
  summary: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginLeft: 8,
  },
});