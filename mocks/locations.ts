import { Location, MetroStation, MetroLine } from "@/types";

// Dhaka Metro Rail MRT Line-6 Stations (Operational) - Updated with real coordinates from dhakametro.online
export const mrtLine6Stations: MetroStation[] = [
  {
    id: "uttara-north",
    name: "Uttara North",
    code: "UN",
    line: "MRT-6",
    isOperational: true,
    facilities: ["Parking", "Elevator", "Escalator", "Restroom", "ATM", "Food Court"],
    coordinates: { latitude: 23.8683699, longitude: 90.3671672 }
  },
  {
    id: "uttara-center",
    name: "Uttara Center",
    code: "UC",
    line: "MRT-6",
    isOperational: true,
    facilities: ["Elevator", "Escalator", "Restroom", "ATM"],
    coordinates: { latitude: 23.8589634, longitude: 90.3649124 }
  },
  {
    id: "uttara-south",
    name: "Uttara South",
    code: "US",
    line: "MRT-6",
    isOperational: true,
    facilities: ["Elevator", "Escalator", "Restroom"],
    coordinates: { latitude: 23.8450371, longitude: 90.3632699 }
  },
  {
    id: "pallabi",
    name: "Pallabi",
    code: "PL",
    line: "MRT-6",
    isOperational: true,
    facilities: ["Elevator", "Escalator", "Restroom", "Shopping"],
    coordinates: { latitude: 23.8253510, longitude: 90.3643807 }
  },
  {
    id: "mirpur-11",
    name: "Mirpur-11",
    code: "M11",
    line: "MRT-6",
    isOperational: true,
    facilities: ["Elevator", "Escalator", "Restroom"],
    coordinates: { latitude: 23.8183433, longitude: 90.3656327 }
  },
  {
    id: "mirpur-10",
    name: "Mirpur-10",
    code: "M10",
    line: "MRT-6",
    isOperational: true,
    facilities: ["Elevator", "Escalator", "Restroom", "Shopping", "Food Court"],
    coordinates: { latitude: 23.8072257, longitude: 90.3684888 }
  },
  {
    id: "kazipara",
    name: "Kazipara",
    code: "KZ",
    line: "MRT-6",
    isOperational: true,
    facilities: ["Elevator", "Escalator", "Restroom"],
    coordinates: { latitude: 23.7997618, longitude: 90.3717708 }
  },
  {
    id: "shewrapara",
    name: "Shewrapara",
    code: "SW",
    line: "MRT-6",
    isOperational: true,
    facilities: ["Elevator", "Escalator", "Restroom"],
    coordinates: { latitude: 23.7910148, longitude: 90.3752242 }
  },
  {
    id: "agargaon",
    name: "Agargaon",
    code: "AG",
    line: "MRT-6",
    isOperational: true,
    facilities: ["Elevator", "Escalator", "Restroom", "ATM"],
    coordinates: { latitude: 23.7783780, longitude: 90.3799966 }
  },
  {
    id: "bijoy-sarani",
    name: "Bijoy Sarani",
    code: "BS",
    line: "MRT-6",
    isOperational: true,
    facilities: ["Elevator", "Escalator", "Restroom"],
    coordinates: { latitude: 23.7668781, longitude: 90.3830571 }
  },
  {
    id: "farmgate",
    name: "Farmgate",
    code: "FG",
    line: "MRT-6",
    isOperational: true,
    facilities: ["Elevator", "Escalator", "Restroom", "Shopping", "Food Court"],
    coordinates: { latitude: 23.7581470, longitude: 90.3896469 }
  },
  {
    id: "kawran-bazar",
    name: "Kawran Bazar",
    code: "KB",
    line: "MRT-6",
    isOperational: true,
    facilities: ["Elevator", "Escalator", "Restroom", "ATM"],
    coordinates: { latitude: 23.7512656, longitude: 90.3927762 }
  },
  {
    id: "shahbag",
    name: "Shahbag",
    code: "SB",
    line: "MRT-6",
    isOperational: true,
    facilities: ["Elevator", "Escalator", "Restroom"],
    coordinates: { latitude: 23.7400837, longitude: 90.3960061 }
  },
  {
    id: "dhaka-university",
    name: "Dhaka University",
    code: "DU",
    line: "MRT-6",
    isOperational: true,
    facilities: ["Elevator", "Escalator", "Restroom", "Student Services"],
    coordinates: { latitude: 23.7316979, longitude: 90.3968427 }
  },
  {
    id: "bangladesh-secretariat",
    name: "Bangladesh Secretariat",
    code: "SEC",
    line: "MRT-6",
    isOperational: true,
    facilities: ["Elevator", "Escalator", "Restroom", "Security Check"],
    coordinates: { latitude: 23.7300126, longitude: 90.4074836 }
  },
  {
    id: "motijheel",
    name: "Motijheel",
    code: "MJ",
    line: "MRT-6",
    isOperational: true,
    facilities: ["Elevator", "Escalator", "Restroom", "ATM", "Shopping", "Food Court"],
    coordinates: { latitude: 23.7280587, longitude: 90.4190551 }
  },
];

// Future stations (under construction)
export const futureStations: MetroStation[] = [
  {
    id: "kamalapur",
    name: "Kamalapur",
    code: "KP",
    line: "MRT-6",
    isOperational: false,
    facilities: ["Railway Connection", "Elevator", "Escalator", "Restroom"],
    coordinates: { latitude: 23.7215, longitude: 90.3795 }
  },
];

export const allMetroStations = [...mrtLine6Stations, ...futureStations];

// Legacy locations for backward compatibility
export const popularLocations: Location[] = mrtLine6Stations.map(station => ({
  city: station.name,
  station: `${station.name} Metro Station`,
  code: station.code,
}));

export const getLocationByCity = (city: string): Location | undefined => {
  return popularLocations.find(location => location.city === city);
};

export const getMetroStationById = (id: string): MetroStation | undefined => {
  return allMetroStations.find(station => station.id === id);
};

export const getMetroStationByName = (name: string): MetroStation | undefined => {
  return allMetroStations.find(station => station.name === name);
};

export const getOperationalStations = (): MetroStation[] => {
  return allMetroStations.filter(station => station.isOperational);
};

export const calculateFare = (fromStation: MetroStation, toStation: MetroStation): number => {
  const fromIndex = mrtLine6Stations.findIndex(s => s.id === fromStation.id);
  const toIndex = mrtLine6Stations.findIndex(s => s.id === toStation.id);
  
  if (fromIndex === -1 || toIndex === -1) return 20; // Minimum fare
  
  const distance = Math.abs(toIndex - fromIndex);
  
  // Real Dhaka Metro fare structure in BDT
  // Based on distance between stations
  if (distance === 0) return 0; // Same station
  if (distance <= 2) return 20; // 1-2 stations: ৳20
  if (distance <= 4) return 30; // 3-4 stations: ৳30
  if (distance <= 6) return 40; // 5-6 stations: ৳40
  if (distance <= 8) return 50; // 7-8 stations: ৳50
  if (distance <= 10) return 60; // 9-10 stations: ৳60
  if (distance <= 12) return 80; // 11-12 stations: ৳80
  return 100; // Full route (13+ stations): ৳100
};

// Helper function to get route polyline coordinates for map display
export const getRoutePolyline = (): { latitude: number; longitude: number }[] => {
  return mrtLine6Stations.map(station => station.coordinates).filter(coord => coord !== undefined);
};

// Helper function to get map region that fits all stations
export const getMapRegion = () => {
  const latitudes = mrtLine6Stations.map(station => station.coordinates?.latitude).filter(lat => lat !== undefined) as number[];
  const longitudes = mrtLine6Stations.map(station => station.coordinates?.longitude).filter(lng => lng !== undefined) as number[];
  
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes);
  const maxLng = Math.max(...longitudes);
  
  const latDelta = (maxLat - minLat) * 1.2; // Add 20% padding
  const lngDelta = (maxLng - minLng) * 1.2; // Add 20% padding
  
  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max(latDelta, 0.01), // Minimum zoom level
    longitudeDelta: Math.max(lngDelta, 0.01), // Minimum zoom level
  };
};
