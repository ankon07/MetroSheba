import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Calendar from 'expo-calendar';
import colors from '../../constants/colors';
import Button from '../../components/Button';
import InteractiveRouteMap from '../../components/InteractiveRouteMap';
import { metroTrips, getMetroTripsForRoute } from '../../mocks/trips';
import { mrtLine6Stations, calculateFare } from '../../mocks/locations';

const { width } = Dimensions.get('window');

interface TrainCar {
  number: string;
  status: 'available' | 'some' | 'middle' | 'crowded' | 'no-data';
}

interface TicketType {
  id: string;
  name: string;
  price: number;
  description?: string;
  quantity: number;
}

const TripDetails = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [selectedView, setSelectedView] = useState<'overview' | 'cars' | 'tickets'>('overview');
  const [currentTrip, setCurrentTrip] = useState<any>(null);
  const [tickets, setTickets] = useState<TicketType[]>([]);

  // Load trip data based on ID
  useEffect(() => {
    if (id) {
      const trip = metroTrips.find(t => t.id === id.toString());
      if (trip) {
        setCurrentTrip(trip);
        
        // Calculate fare and set up tickets
        const fare = calculateFare(trip.from, trip.to);
        setTickets([
          { 
            id: '1', 
            name: 'CityTicket Off-Peak', 
            price: fare, 
            description: 'Valid until 4 AM tomorrow', 
            quantity: 1 
          },
          { 
            id: '2', 
            name: 'Family', 
            price: Math.max(fare * 0.7, 20), 
            description: 'Family discount available', 
            quantity: 0 
          },
        ]);
      }
    }
  }, [id]);

  // Fallback data if no trip found
  const tripData = currentTrip ? {
    id: currentTrip.id,
    departureTime: currentTrip.departureTime,
    arrivalTime: currentTrip.arrivalTime,
    from: currentTrip.from.name,
    to: currentTrip.to.name,
    duration: currentTrip.duration,
    type: 'Off Peak',
    estimatedArrival: 'in 21 min',
    trainNumber: currentTrip.trainNumber,
    trainType: 'MRT-6',
    destination: 'Motijheel',
    totalCars: 10,
    fromStationId: currentTrip.from.id,
    toStationId: currentTrip.to.id,
    route: [
      { station: currentTrip.from.name, time: currentTrip.departureTime, status: 'departure' },
      { station: currentTrip.to.name, time: currentTrip.arrivalTime, status: 'arrival' },
    ]
  } : {
    id: '1',
    departureTime: '11:02',
    arrivalTime: '11:22',
    from: 'Uttara North',
    to: 'Motijheel',
    duration: '20m',
    type: 'Off Peak',
    estimatedArrival: 'in 21 min',
    trainNumber: 'MRT6-1102',
    trainType: 'MRT-6',
    destination: 'Motijheel',
    totalCars: 10,
    fromStationId: 'uttara-north',
    toStationId: 'motijheel',
    route: [
      { station: 'Uttara North', time: '11:02', status: 'departure' },
      { station: 'Motijheel', time: '11:22', status: 'arrival' },
    ]
  };

  const trainCars: TrainCar[] = [
    { number: '7822', status: 'available' },
    { number: '7821', status: 'some' },
    { number: '7750', status: 'available' },
    { number: '7749', status: 'some' },
    { number: '7506', status: 'middle' },
    { number: '7505', status: 'some' },
    { number: '7702', status: 'crowded' },
    { number: '7701', status: 'some' },
    { number: '7760', status: 'available' },
    { number: '7759', status: 'no-data' },
  ];

  const getCarStatusColor = (status: string) => {
    switch (status) {
      case 'available': return '#4CAF50';
      case 'some': return '#FFC107';
      case 'middle': return '#FF5722';
      case 'crowded': return '#F44336';
      case 'no-data': return '#9E9E9E';
      default: return '#9E9E9E';
    }
  };

  const updateTicketQuantity = (ticketId: string, change: number) => {
    setTickets(prev => prev.map(ticket => 
      ticket.id === ticketId 
        ? { ...ticket, quantity: Math.max(0, ticket.quantity + change) }
        : ticket
    ));
  };

  const getTotalPrice = () => {
    return tickets.reduce((total, ticket) => total + (ticket.price * ticket.quantity), 0);
  };

  const addToCalendar = async () => {
    try {
      // Request calendar permissions
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Calendar access is required to add this trip to your calendar. Please enable calendar permissions in your device settings.',
          [{ text: 'OK' }]
        );
        return;
      }

      // Get available calendars
      const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
      
      if (calendars.length === 0) {
        Alert.alert('No Calendar Found', 'No calendars are available on your device.');
        return;
      }

      // Find the default calendar or use the first available one
      const defaultCalendar = calendars.find(cal => cal.isPrimary) || calendars[0];

      // Create event date and time
      const today = new Date();
      const eventDate = new Date(today);
      eventDate.setHours(11, 2, 0, 0); // Set to 11:02 AM

      const endDate = new Date(eventDate);
      endDate.setMinutes(endDate.getMinutes() + 20); // Add 20 minutes duration

      // Create the calendar event
      const eventDetails = {
        title: `Metro Trip: ${tripData.from} to ${tripData.to}`,
        startDate: eventDate,
        endDate: endDate,
        location: `${tripData.from} Station`,
        notes: `Train ${tripData.trainNumber} (${tripData.trainType})\nDestination: ${tripData.destination}\nDuration: ${tripData.duration}\nType: ${tripData.type}`,
        alarms: [
          { relativeOffset: -30 }, // 30 minutes before
          { relativeOffset: -10 }   // 10 minutes before
        ],
      };

      const eventId = await Calendar.createEventAsync(defaultCalendar.id, eventDetails);

      if (eventId) {
        Alert.alert(
          'Success!',
          `Your metro trip has been added to your calendar with reminders 30 and 10 minutes before departure.`,
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error adding to calendar:', error);
      Alert.alert(
        'Error',
        'Failed to add the trip to your calendar. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleAction = (action: string) => {
    switch (action) {
      case 'go':
        Alert.alert('Navigation', 'Opening navigation to station...');
        break;
      case 'buy':
        setSelectedView('tickets');
        break;
      case 'save':
        Alert.alert('Saved', 'Trip saved to your favorites');
        break;
      case 'add':
        addToCalendar();
        break;
      case 'continue':
        router.push({ pathname: '/booking/payment', params: { tripId: (currentTrip?.id || String(id)) as string } });
        break;
    }
  };

  const renderOverview = () => (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* Interactive Route Map */}
      <InteractiveRouteMap
        fromStationId={tripData.fromStationId}
        toStationId={tripData.toStationId}
        departureTime={tripData.departureTime}
        arrivalTime={tripData.arrivalTime}
        trainNumber={tripData.trainNumber}
        isRealTime={true}
      />

      {/* Trip Info */}
      <View style={styles.tripInfo}>
        <Text style={styles.tripTime}>
          {tripData.departureTime} trip to {tripData.to}
        </Text>
        <Text style={styles.tripDetails}>
          {tripData.duration} trip • {tripData.type} • {tripData.estimatedArrival}
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={[styles.actionButton, styles.goButton]} onPress={() => handleAction('go')}>
          <Ionicons name="navigate" size={20} color="white" />
          <Text style={styles.actionButtonText}>Go</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleAction('buy')}>
          <Ionicons name="card-outline" size={20} color={colors.primary} />
          <Text style={[styles.actionButtonText, { color: colors.primary }]}>Buy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleAction('save')}>
          <Ionicons name="bookmark-outline" size={20} color={colors.primary} />
          <Text style={[styles.actionButtonText, { color: colors.primary }]}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={() => handleAction('add')}>
          <Ionicons name="calendar-outline" size={20} color={colors.primary} />
          <Text style={[styles.actionButtonText, { color: colors.primary }]}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Trip Details */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Trip</Text>
          <Text style={styles.estimatedText}>Estimated</Text>
        </View>
        <TouchableOpacity style={styles.trainInfo} onPress={() => setSelectedView('cars')}>
          <Text style={styles.trainDestination}>Train towards {tripData.destination}</Text>
          <Text style={styles.carInfo}>{tripData.totalCars} cars</Text>
          <View style={styles.carIndicator}>
            {Array.from({ length: 10 }, (_, i) => (
              <View key={i} style={styles.carDot} />
            ))}
            <Ionicons name="chevron-forward" size={16} color={colors.text.secondary} />
          </View>
        </TouchableOpacity>
      </View>

      {/* Route Steps */}
      <View style={styles.routeSteps}>
        {tripData.route.map((stop, index) => (
          <View key={index} style={styles.routeStep}>
            <View style={styles.timeContainer}>
              <Text style={styles.stepTime}>{stop.time}</Text>
              <View style={[styles.stepDot, { backgroundColor: colors.primary }]} />
            </View>
            <View style={styles.stepInfo}>
              <Text style={styles.stepStation}>{stop.station}</Text>
              {stop.station === 'Uttara North' && (
                <Text style={styles.stepNote}>Track to be announced</Text>
              )}
              {index === 0 && <Text style={styles.stepDuration}>Ride 1 stop, 20 min</Text>}
            </View>
            <TouchableOpacity>
              <Ionicons name="information-circle-outline" size={20} color={colors.text.secondary} />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Tickets Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>One-Way Tickets</Text>
        <View style={styles.ticketOption}>
          <View style={styles.ticketInfo}>
            <Text style={styles.ticketName}>Regular Ticket Off-Peak</Text>
            <Text style={styles.ticketPrice}>৳25.00</Text>
          </View>
          <TouchableOpacity style={styles.infoButton}>
            <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  const renderTrainCars = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSelectedView('overview')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Train {tripData.trainNumber}</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.trainDestinationBadge}>
        <Text style={styles.trainDestinationText}>{tripData.destination}</Text>
        <TouchableOpacity style={styles.closeBadge}>
          <Ionicons name="close" size={16} color="white" />
        </TouchableOpacity>
      </View>

      <Text style={styles.trainSubtitle}>{tripData.totalCars} cars • {tripData.trainType}</Text>

      <View style={styles.stationHeader}>
        <Text style={styles.stationName}>{tripData.from}</Text>
        <TouchableOpacity style={styles.viewStationButton}>
          <Text style={styles.viewStationText}>View {tripData.to}</Text>
        </TouchableOpacity>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>LEGEND</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#4CAF50' }]} />
            <Text style={styles.legendText}>Seats available</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FFC107' }]} />
            <Text style={styles.legendText}>Some seats available</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FF5722' }]} />
            <Text style={styles.legendText}>Middle seats only</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#F44336' }]} />
            <Text style={styles.legendText}>Crowded</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#9E9E9E' }]} />
            <Text style={styles.legendText}>No Data</Text>
          </View>
        </View>
      </View>

      {/* Train Cars */}
      <View style={styles.trainCars}>
        <View style={styles.trainDirection}>
          <Ionicons name="arrow-up" size={16} color={colors.text.secondary} />
        </View>
        {trainCars.map((car, index) => (
          <TouchableOpacity key={index} style={styles.trainCar}>
            <View style={[styles.carNumber, { backgroundColor: getCarStatusColor(car.status) }]}>
              <Text style={styles.carNumberText}>{car.number}</Text>
            </View>
            <View style={styles.carIcon}>
              <Ionicons name="train" size={20} color={colors.text.secondary} />
            </View>
          </TouchableOpacity>
        ))}
        <View style={styles.trainDirection}>
          <Ionicons name="arrow-down" size={16} color={colors.text.secondary} />
        </View>
      </View>

      <TouchableOpacity style={styles.currentLocationButton}>
        <Ionicons name="location" size={16} color={colors.primary} />
        <Text style={styles.currentLocationText}>Show current location</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderTickets = () => (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setSelectedView('overview')} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Select Tickets</Text>
        <TouchableOpacity onPress={() => setSelectedView('overview')} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={colors.text.primary} />
        </TouchableOpacity>
      </View>

      {/* This Trip */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>This Trip</Text>
        <View style={styles.tripSummary}>
          <View style={styles.tripSummaryRow}>
            <Text style={styles.tripSummaryTime}>{tripData.departureTime}</Text>
            <Text style={styles.tripSummaryStation}>{tripData.from}</Text>
          </View>
          <Text style={styles.tripSummaryDuration}>{tripData.duration}</Text>
          <View style={styles.tripSummaryRow}>
            <Text style={styles.tripSummaryTime}>{tripData.arrivalTime}</Text>
            <Text style={styles.tripSummaryStation}>{tripData.to}</Text>
          </View>
        </View>
      </View>

      {/* One-Way Tickets */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>One-Way Tickets</Text>
          <Text style={styles.sectionSubtitle}>For this trip</Text>
        </View>
        
        {tickets.map((ticket) => (
          <View key={ticket.id} style={styles.ticketRow}>
            <TouchableOpacity style={styles.ticketInfoButton}>
              <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
            </TouchableOpacity>
            <View style={styles.ticketDetails}>
              <Text style={styles.ticketName}>{ticket.name}</Text>
              <Text style={styles.ticketPrice}>৳{ticket.price.toFixed(2)}</Text>
              {ticket.description && (
                <Text style={styles.ticketDescription}>{ticket.description}</Text>
              )}
            </View>
            <View style={styles.quantityControls}>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => updateTicketQuantity(ticket.id, -1)}
              >
                <Ionicons name="remove" size={20} color={colors.primary} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{ticket.quantity}</Text>
              <TouchableOpacity 
                style={styles.quantityButton}
                onPress={() => updateTicketQuantity(ticket.id, 1)}
              >
                <Ionicons name="add" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Other Ticket Types */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Other Ticket Types</Text>
        <TouchableOpacity style={styles.otherTicketsButton}>
          <Ionicons name="information-circle-outline" size={20} color={colors.primary} />
          <View style={styles.otherTicketsText}>
            <Text style={styles.otherTicketsTitle}>Tap here to buy other ticket types between {tripData.from} and {tripData.to}.</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={colors.text.secondary} />
        </TouchableOpacity>
      </View>

      {/* Subtotal and Continue */}
      <View style={styles.footer}>
        <View style={styles.subtotalContainer}>
          <Text style={styles.subtotalLabel}>Subtotal</Text>
          <Text style={styles.subtotalAmount}>৳{getTotalPrice().toFixed(2)}</Text>
        </View>
        <Button
          title="Continue"
          onPress={() => handleAction('continue')}
          style={styles.continueButton}
        />
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.wrapper}>
      {selectedView === 'overview' && renderOverview()}
      {selectedView === 'cars' && renderTrainCars()}
      {selectedView === 'tickets' && renderTickets()}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  backButton: {
    padding: 8,
  },
  shareButton: {
    padding: 8,
  },
  closeButton: {
    padding: 8,
  },
  mapContainer: {
    height: 200,
    backgroundColor: colors.surface,
    margin: 16,
    borderRadius: 12,
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  routeLine: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
  },
  stationDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  routePath: {
    flex: 1,
    height: 3,
    backgroundColor: colors.primary,
    marginHorizontal: 8,
  },
  fromStation: {
    position: 'absolute',
    left: 20,
    top: 20,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  toStation: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  tripInfo: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tripTime: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  tripDetails: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.surface,
    gap: 4,
  },
  goButton: {
    backgroundColor: colors.primary,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  estimatedText: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  trainInfo: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
  },
  trainDestination: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  carInfo: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  carIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  carDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.text.secondary,
  },
  routeSteps: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  routeStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  timeContainer: {
    alignItems: 'center',
    marginRight: 16,
  },
  stepTime: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stepInfo: {
    flex: 1,
  },
  stepStation: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  stepNote: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 2,
  },
  stepDuration: {
    fontSize: 12,
    color: colors.text.secondary,
  },
  ticketOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
  },
  ticketInfo: {
    flex: 1,
  },
  ticketName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  ticketPrice: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  infoButton: {
    padding: 8,
  },
  trainDestinationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    marginHorizontal: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  trainDestinationText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
  },
  closeBadge: {
    padding: 2,
  },
  trainSubtitle: {
    fontSize: 14,
    color: colors.text.secondary,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  stationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  stationName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
  },
  viewStationButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.surface,
    borderRadius: 16,
  },
  viewStationText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  legend: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  legendTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text.secondary,
    marginBottom: 8,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
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
    fontSize: 12,
    color: colors.text.secondary,
  },
  trainCars: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  trainDirection: {
    paddingVertical: 8,
  },
  trainCar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
    maxWidth: 200,
  },
  carNumber: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 12,
    minWidth: 60,
    alignItems: 'center',
  },
  carNumberText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  carIcon: {
    flex: 1,
    alignItems: 'center',
  },
  currentLocationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 16,
    gap: 6,
  },
  currentLocationText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  tripSummary: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
  },
  tripSummaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  tripSummaryTime: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    marginRight: 12,
  },
  tripSummaryStation: {
    fontSize: 14,
    color: colors.text.primary,
  },
  tripSummaryDuration: {
    fontSize: 12,
    color: colors.text.secondary,
    marginVertical: 8,
    textAlign: 'center',
  },
  ticketRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  ticketInfoButton: {
    marginRight: 12,
  },
  ticketDetails: {
    flex: 1,
  },
  ticketDescription: {
    fontSize: 12,
    color: colors.text.secondary,
    marginTop: 2,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    minWidth: 20,
    textAlign: 'center',
  },
  otherTicketsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
  },
  otherTicketsText: {
    flex: 1,
    marginLeft: 12,
  },
  otherTicketsTitle: {
    fontSize: 14,
    color: colors.primary,
  },
  footer: {
    padding: 16,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  subtotalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  subtotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  subtotalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text.primary,
  },
  continueButton: {
    backgroundColor: colors.primary,
  },
});

export default TripDetails;
