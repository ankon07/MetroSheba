import { Location, MetroStation, MetroLine } from "@/types";

// Dhaka Metro Rail MRT Line-6 Stations (Operational)
export const mrtLine6Stations: MetroStation[] = [
  {
    id: "uttara-north",
    name: "Uttara North",
    code: "UN",
    line: "MRT-6",
    isOperational: true,
    facilities: ["Parking", "Elevator", "Escalator", "Restroom", "ATM", "Food Court"],
    coordinates: { latitude: 23.8759, longitude: 90.3795 }
  },
  {
    id: "uttara-center",
    name: "Uttara Center",
    code: "UC",
    line: "MRT-6",
    isOperational: true,
    facilities: ["Elevator", "Escalator", "Restroom", "ATM"],
    coordinates: { latitude: 23.8697, longitude: 90.3795 }
  },
  {
    id: "uttara-south",
    name: "Uttara South",
    code: "US",
    line: "MRT-6",
    isOperational: true,
    facilities: ["Elevator", "Escalator", "Restroom"],
    coordinates: { latitude: 23.8635, longitude: 90.3795 }
  },
  {
    id: "pallabi",
    name: "Pallabi",
    code: "PL",
    line: "MRT-6",
    isOperational: true,
    facilities: ["Elevator", "Escalator", "Restroom", "Shopping"],
    coordinates: { latitude: 23.8573, longitude: 90.3795 }
  },
  {
    id: "mirpur-11",
    name: "Mirpur 11",
    code: "M11",
    line: "MRT-6",
    isOperational: true,
    facilities: ["Elevator", "Escalator", "Restroom"],
    coordinates: { latitude: 23.8511, longitude: 90.3795 }
  },
  {
    id: "mirpur-10",
    name: "Mirpur 10",
    code: "M10",
    line: "MRT-6",
    isOperational: true,
    facilities: ["Elevator", "Escalator", "Restroom", "Shopping", "Food Court"],
    coordinates: { latitude: 23.8449, longitude: 90.3795 }
  },
  {
    id: "kazipara",
    name: "Kazipara",
    code: "KZ",
    line: "MRT-6",
    isOperational: true,
    facilities: ["Elevator", "Escalator", "Restroom"],
    coordinates: { latitude: 23.8387, longitude: 90.3795 }
  },
  {
    id: "shewrapara",
    name: "Shewrapara",
    code: "SW",
    line: "MRT-6",
    isOperational: true,
    facilities: ["Elevator", "Escalator", "Restroom"],
    coordinates: { latitude: 23.8325, longitude: 90.3795 }
  },
  {
    id: "agargaon",
    name: "Agargaon",
    code: "AG",
    line: "MRT-6",
    isOperational: true,
    facilities: ["Elevator", "Escalator", "Restroom", "ATM"],
    coordinates: { latitude: 23.7775, longitude: 90.3795 }
  },
  {
    id: "bijoy-sarani",
    name: "Bijoy Sarani",
    code: "BS",
    line: "MRT-6",
    isOperational: true,
    facilities: ["Elevator", "Escalator", "Restroom"],
    coordinates: { latitude: 23.7635, longitude: 90.3795 }
  },
  {
    id: "farmgate",
    name: "Farmgate",
    code: "FG",
    line: "MRT-6",
    isOperational: true,
    facilities: ["Elevator", "Escalator", "Restroom", "Shopping", "Food Court"],
    coordinates: { latitude: 23.7575, longitude: 90.3795 }
  },
  {
    id: "karwan-bazar",
    name: "Karwan Bazar",
    code: "KB",
    line: "MRT-6",
    isOperational: true,
    facilities: ["Elevator", "Escalator", "Restroom", "ATM"],
    coordinates: { latitude: 23.7515, longitude: 90.3795 }
  },
  {
    id: "shahbagh",
    name: "Shahbagh",
    code: "SB",
    line: "MRT-6",
    isOperational: true,
    facilities: ["Elevator", "Escalator", "Restroom"],
    coordinates: { latitude: 23.7455, longitude: 90.3795 }
  },
  {
    id: "dhaka-university",
    name: "Dhaka University",
    code: "DU",
    line: "MRT-6",
    isOperational: true,
    facilities: ["Elevator", "Escalator", "Restroom", "Student Services"],
    coordinates: { latitude: 23.7395, longitude: 90.3795 }
  },
  {
    id: "bangladesh-secretariat",
    name: "Bangladesh Secretariat",
    code: "SEC",
    line: "MRT-6",
    isOperational: true,
    facilities: ["Elevator", "Escalator", "Restroom", "Security Check"],
    coordinates: { latitude: 23.7335, longitude: 90.3795 }
  },
  {
    id: "motijheel",
    name: "Motijheel",
    code: "MJ",
    line: "MRT-6",
    isOperational: true,
    facilities: ["Elevator", "Escalator", "Restroom", "ATM", "Shopping", "Food Court"],
    coordinates: { latitude: 23.7275, longitude: 90.3795 }
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
