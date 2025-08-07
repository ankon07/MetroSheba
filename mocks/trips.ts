import { Trip, MetroTrip, UpcomingTrain } from "@/types";
import { popularLocations, mrtLine6Stations, calculateFare } from "./locations";

// Calculate travel time between stations (3 minutes per station + 1 minute dwell time)
const calculateTravelTime = (fromIndex: number, toIndex: number): number => {
  const distance = Math.abs(toIndex - fromIndex);
  return distance * 3; // 3 minutes per station including dwell time
};

// Calculate duration string from minutes
const formatDuration = (minutes: number): string => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

// Add minutes to time string
const addMinutesToTime = (timeStr: string, minutesToAdd: number): string => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + minutesToAdd;
  const newHours = Math.floor(totalMinutes / 60) % 24;
  const newMinutes = totalMinutes % 60;
  return `${String(newHours).padStart(2, '0')}:${String(newMinutes).padStart(2, '0')}`;
};

// Generate realistic Dhaka Metro Rail trips based on actual schedule for all station combinations
export const generateMetroTrips = (): MetroTrip[] => {
  const trips: MetroTrip[] = [];
  const today = new Date();
  
  // Generate trips for next 7 days
  for (let day = 0; day < 7; day++) {
    const date = new Date(today);
    date.setDate(today.getDate() + day);
    const dateString = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday, 5 = Friday
    
    // Real schedule based on scraped data from dhakametro.online
    let schedules: Array<{direction: 'north' | 'south', startHour: number, startMinute: number, endHour: number, endMinute: number, interval: number}> = [];
    
    if (dayOfWeek >= 0 && dayOfWeek <= 4) { // Sunday to Thursday
      schedules = [
        // Uttara North to Motijheel (Southbound)
        { direction: 'south', startHour: 7, startMinute: 10, endHour: 7, endMinute: 30, interval: 10 },
        { direction: 'south', startHour: 7, startMinute: 31, endHour: 11, endMinute: 36, interval: 8 },
        { direction: 'south', startHour: 11, startMinute: 37, endHour: 14, endMinute: 36, interval: 10 },
        { direction: 'south', startHour: 14, startMinute: 37, endHour: 20, endMinute: 20, interval: 8 },
        { direction: 'south', startHour: 20, startMinute: 21, endHour: 21, endMinute: 0, interval: 10 },
        
        // Motijheel to Uttara North (Northbound)
        { direction: 'north', startHour: 7, startMinute: 30, endHour: 8, endMinute: 0, interval: 10 },
        { direction: 'north', startHour: 8, startMinute: 1, endHour: 12, endMinute: 16, interval: 8 },
        { direction: 'north', startHour: 12, startMinute: 17, endHour: 15, endMinute: 15, interval: 10 },
        { direction: 'north', startHour: 15, startMinute: 16, endHour: 21, endMinute: 0, interval: 8 },
        { direction: 'north', startHour: 21, startMinute: 1, endHour: 21, endMinute: 40, interval: 10 },
      ];
    } else if (dayOfWeek === 6) { // Saturday
      schedules = [
        // Uttara North to Motijheel
        { direction: 'south', startHour: 7, startMinute: 10, endHour: 10, endMinute: 32, interval: 12 },
        { direction: 'south', startHour: 10, startMinute: 33, endHour: 21, endMinute: 0, interval: 10 },
        
        // Motijheel to Uttara North
        { direction: 'north', startHour: 7, startMinute: 30, endHour: 11, endMinute: 12, interval: 12 },
        { direction: 'north', startHour: 11, startMinute: 13, endHour: 21, endMinute: 40, interval: 10 },
      ];
    } else if (dayOfWeek === 5) { // Friday
      schedules = [
        // Uttara North to Motijheel
        { direction: 'south', startHour: 15, startMinute: 0, endHour: 21, endMinute: 0, interval: 10 },
        
        // Motijheel to Uttara North
        { direction: 'north', startHour: 15, startMinute: 20, endHour: 21, endMinute: 40, interval: 10 },
      ];
    }
    
    // Generate trips for all station combinations
    schedules.forEach(schedule => {
      let currentHour = schedule.startHour;
      let currentMinute = schedule.startMinute;
      
      while (currentHour < schedule.endHour || (currentHour === schedule.endHour && currentMinute <= schedule.endMinute)) {
        const departureTime = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
        const trainNumber = `MRT6-${String(currentHour).padStart(2, '0')}${String(currentMinute).padStart(2, '0')}`;
        
        if (schedule.direction === 'south') {
          // Generate southbound trips for all station combinations
          for (let fromIndex = 0; fromIndex < mrtLine6Stations.length - 1; fromIndex++) {
            for (let toIndex = fromIndex + 1; toIndex < mrtLine6Stations.length; toIndex++) {
              const fromStation = mrtLine6Stations[fromIndex];
              const toStation = mrtLine6Stations[toIndex];
              
              // Calculate departure time at origin station (trains start from Uttara North)
              const stationDelayMinutes = fromIndex * 3; // 3 minutes per station from start
              const actualDepartureTime = addMinutesToTime(departureTime, stationDelayMinutes);
              
              // Calculate travel time and arrival time
              const travelMinutes = calculateTravelTime(fromIndex, toIndex);
              const arrivalTime = addMinutesToTime(actualDepartureTime, travelMinutes);
              
              // Calculate fare using the fare calculation function
              const fare = calculateFare(fromStation, toStation);
              
              trips.push({
                id: `sb-${dateString}-${fromIndex}-${toIndex}-${currentHour}-${currentMinute}`,
                from: fromStation,
                to: toStation,
                departureDate: dateString,
                departureTime: actualDepartureTime,
                arrivalDate: dateString,
                arrivalTime: arrivalTime,
                duration: formatDuration(travelMinutes),
                price: fare,
                line: "MRT-6",
                trainNumber: `${trainNumber}S`,
                platform: "Platform 1",
                frequency: `Every ${schedule.interval} minutes`,
                amenities: ["Air Conditioning", "CCTV", "Emergency Communication", "Wheelchair Access"],
                isEcoFriendly: true,
                onTimePerformance: 94,
                status: Math.random() > 0.95 ? "delayed" : "upcoming"
              });
            }
          }
        } else {
          // Generate northbound trips for all station combinations
          for (let fromIndex = mrtLine6Stations.length - 1; fromIndex > 0; fromIndex--) {
            for (let toIndex = fromIndex - 1; toIndex >= 0; toIndex--) {
              const fromStation = mrtLine6Stations[fromIndex];
              const toStation = mrtLine6Stations[toIndex];
              
              // Calculate departure time at origin station (trains start from Motijheel)
              const stationDelayMinutes = (mrtLine6Stations.length - 1 - fromIndex) * 3; // 3 minutes per station from Motijheel
              const actualDepartureTime = addMinutesToTime(departureTime, stationDelayMinutes);
              
              // Calculate travel time and arrival time
              const travelMinutes = calculateTravelTime(fromIndex, toIndex);
              const arrivalTime = addMinutesToTime(actualDepartureTime, travelMinutes);
              
              // Calculate fare using the fare calculation function
              const fare = calculateFare(fromStation, toStation);
              
              trips.push({
                id: `nb-${dateString}-${fromIndex}-${toIndex}-${currentHour}-${currentMinute}`,
                from: fromStation,
                to: toStation,
                departureDate: dateString,
                departureTime: actualDepartureTime,
                arrivalDate: dateString,
                arrivalTime: arrivalTime,
                duration: formatDuration(travelMinutes),
                price: fare,
                line: "MRT-6",
                trainNumber: `${trainNumber}N`,
                platform: "Platform 2",
                frequency: `Every ${schedule.interval} minutes`,
                amenities: ["Air Conditioning", "CCTV", "Emergency Communication", "Wheelchair Access"],
                isEcoFriendly: true,
                onTimePerformance: 94,
                status: Math.random() > 0.95 ? "delayed" : "upcoming"
              });
            }
          }
        }
        
        // Move to next departure time
        currentMinute += schedule.interval;
        if (currentMinute >= 60) {
          currentHour += Math.floor(currentMinute / 60);
          currentMinute = currentMinute % 60;
        }
      }
    });
  }
  
  return trips;
};

export const metroTrips = generateMetroTrips();

// Legacy trips for backward compatibility
export const mockTrips: Trip[] = [
  {
    id: "1",
    from: popularLocations[0], // Uttara North
    to: popularLocations[15], // Motijheel
    departureDate: "2025-08-15",
    departureTime: "08:30",
    arrivalDate: "2025-08-15",
    arrivalTime: "09:15",
    duration: "45m",
    price: 100,
    transportationType: "train",
    company: "Dhaka Mass Transit Company Limited",
    class: "Standard",
    bookingRef: "MRT6-001",
  },
  {
    id: "2",
    from: popularLocations[15], // Motijheel
    to: popularLocations[0], // Uttara North
    departureDate: "2025-08-15",
    departureTime: "09:30",
    arrivalDate: "2025-08-15",
    arrivalTime: "10:15",
    duration: "45m",
    price: 100,
    transportationType: "train",
    company: "Dhaka Mass Transit Company Limited",
    class: "Standard",
    bookingRef: "MRT6-002",
  },
];

// Upcoming trains for the home screen - based on real schedule
export const upcomingTrains: UpcomingTrain[] = [
  {
    id: "upcoming-1",
    trainNumber: "MRT6-0710",
    line: "MRT-6",
    from: mrtLine6Stations[0], // Uttara North
    to: mrtLine6Stations[15], // Motijheel
    departureTime: "07:10",
    arrivalTime: "07:55",
    platform: "Platform 1",
    status: "on-time",
    crowdLevel: "medium"
  },
  {
    id: "upcoming-2",
    trainNumber: "MRT6-0720",
    line: "MRT-6",
    from: mrtLine6Stations[0], // Uttara North
    to: mrtLine6Stations[15], // Motijheel
    departureTime: "07:20",
    arrivalTime: "08:05",
    platform: "Platform 1",
    status: "on-time",
    crowdLevel: "high"
  },
  {
    id: "upcoming-3",
    trainNumber: "MRT6-0731",
    line: "MRT-6",
    from: mrtLine6Stations[0], // Uttara North
    to: mrtLine6Stations[15], // Motijheel
    departureTime: "07:31",
    arrivalTime: "08:16",
    platform: "Platform 1",
    status: "on-time",
    crowdLevel: "high"
  },
  {
    id: "upcoming-4",
    trainNumber: "MRT6-0730N",
    line: "MRT-6",
    from: mrtLine6Stations[15], // Motijheel
    to: mrtLine6Stations[0], // Uttara North
    departureTime: "07:30",
    arrivalTime: "08:15",
    platform: "Platform 2",
    status: "on-time",
    crowdLevel: "medium"
  },
  {
    id: "upcoming-5",
    trainNumber: "MRT6-0740N",
    line: "MRT-6",
    from: mrtLine6Stations[15], // Motijheel
    to: mrtLine6Stations[0], // Uttara North
    departureTime: "07:40",
    arrivalTime: "08:25",
    platform: "Platform 2",
    status: "on-time",
    crowdLevel: "high"
  },
];

// Popular metro routes
export const popularDestinations = [
  {
    id: "dest1",
    from: "Uttara North",
    to: "Motijheel",
    price: 100,
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    transportationType: "train",
  },
  {
    id: "dest2",
    from: "Farmgate",
    to: "Dhaka University",
    price: 40,
    image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    transportationType: "train",
  },
  {
    id: "dest3",
    from: "Mirpur 10",
    to: "Shahbagh",
    price: 60,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    transportationType: "train",
  },
];

export const getTripsForRoute = (fromCity: string, toCity: string): Trip[] => {
  return mockTrips.filter(
    trip => trip.from.city === fromCity && trip.to.city === toCity
  );
};

export const getMetroTripsForRoute = (fromStationId: string, toStationId: string): MetroTrip[] => {
  return metroTrips.filter(
    trip => trip.from.id === fromStationId && trip.to.id === toStationId
  );
};

// Get trips between any two stations by name
export const getMetroTripsByStationName = (fromStationName: string, toStationName: string): MetroTrip[] => {
  return metroTrips.filter(
    trip => trip.from.name === fromStationName && trip.to.name === toStationName
  );
};

// Get next available trips from a station (useful for real-time display)
export const getNextTripsFromStation = (stationId: string, limit: number = 5): MetroTrip[] => {
  const now = new Date();
  const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  const today = now.toISOString().split('T')[0];
  
  return metroTrips
    .filter(trip => 
      trip.from.id === stationId && 
      trip.departureDate === today &&
      trip.departureTime >= currentTime
    )
    .sort((a, b) => a.departureTime.localeCompare(b.departureTime))
    .slice(0, limit);
};

// Get all available destinations from a specific station
export const getDestinationsFromStation = (stationId: string): string[] => {
  const destinations = new Set<string>();
  metroTrips
    .filter(trip => trip.from.id === stationId)
    .forEach(trip => destinations.add(trip.to.name));
  return Array.from(destinations).sort();
};

// Get travel time between two stations
export const getTravelTimeBetweenStations = (fromStationName: string, toStationName: string): number => {
  const fromIndex = mrtLine6Stations.findIndex(station => station.name === fromStationName);
  const toIndex = mrtLine6Stations.findIndex(station => station.name === toStationName);
  
  if (fromIndex === -1 || toIndex === -1) return 0;
  
  return calculateTravelTime(fromIndex, toIndex);
};
