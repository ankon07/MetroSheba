import * as Location from 'expo-location';
import { MetroStation } from '@/types';
import { mrtLine6Stations, calculateFare } from '@/mocks/locations';

export interface UserLocation {
  latitude: number;
  longitude: number;
  address?: string;
  nearestStation?: MetroStation;
}

export interface RouteInfo {
  distance: number; // in kilometers
  duration: number; // in minutes
  steps: RouteStep[];
  roadUpdates?: RoadUpdate[];
}

export interface RouteStep {
  instruction: string;
  distance: number; // in kilometers
  duration: number; // in minutes
  coordinates: { latitude: number; longitude: number }[];
}

export interface RoadUpdate {
  id: string;
  type: 'traffic' | 'construction' | 'accident' | 'closure';
  severity: 'low' | 'medium' | 'high';
  message: string;
  location: string;
  coordinates: { latitude: number; longitude: number };
  timestamp: string;
}

export class LocationService {
  private static instance: LocationService;
  private currentLocation: UserLocation | null = null;

  static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  async requestLocationPermission(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === 'granted';
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  }

  async getCurrentLocation(): Promise<UserLocation | null> {
    try {
      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) {
        console.warn('Location permission not granted');
        return null;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const userLocation: UserLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      // Get address from coordinates
      try {
        const addresses = await Location.reverseGeocodeAsync({
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        });

        if (addresses.length > 0) {
          const address = addresses[0];
          userLocation.address = `${address.street || ''} ${address.city || ''} ${address.region || ''}`.trim();
        }
      } catch (error) {
        console.warn('Error getting address:', error);
      }

      // Find nearest metro station
      const nearestStation = this.findNearestStation(userLocation.latitude, userLocation.longitude);
      userLocation.nearestStation = nearestStation || undefined;

      this.currentLocation = userLocation;
      return userLocation;
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }

  private findNearestStation(latitude: number, longitude: number): MetroStation | null {
    let nearestStation: MetroStation | null = null;
    let minDistance = Infinity;

    for (const station of mrtLine6Stations) {
      if (station.coordinates) {
        const distance = this.calculateDistance(
          latitude,
          longitude,
          station.coordinates.latitude,
          station.coordinates.longitude
        );

        if (distance < minDistance) {
          minDistance = distance;
          nearestStation = station;
        }
      }
    }

    return nearestStation;
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in kilometers
    return d;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  getCurrentLocationSync(): UserLocation | null {
    return this.currentLocation;
  }

  calculateFareFromCurrentLocation(toStation: MetroStation): number {
    if (!this.currentLocation?.nearestStation) {
      return 20; // Default minimum fare
    }
    return calculateFare(this.currentLocation.nearestStation, toStation);
  }

  async findNearestStationWithRoute(userLocation?: UserLocation): Promise<{
    station: MetroStation;
    distance: number;
    route: RouteInfo;
  } | null> {
    try {
      const location = userLocation || await this.getCurrentLocation();
      if (!location) return null;

      const nearestStation = this.findNearestStation(location.latitude, location.longitude);
      if (!nearestStation || !nearestStation.coordinates) return null;

      const distance = this.calculateDistance(
        location.latitude,
        location.longitude,
        nearestStation.coordinates.latitude,
        nearestStation.coordinates.longitude
      );

      const route = await this.getRouteToStation(location, nearestStation);
      if (!route) return null;

      return {
        station: nearestStation,
        distance,
        route
      };
    } catch (error) {
      console.error('Error finding nearest station with route:', error);
      return null;
    }
  }

  async getRouteToStation(userLocation: UserLocation, station: MetroStation): Promise<RouteInfo | null> {
    try {
      if (!station.coordinates) return null;

      const distance = this.calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        station.coordinates.latitude,
        station.coordinates.longitude
      );

      // Estimate walking time (average walking speed: 5 km/h)
      const duration = Math.round((distance / 5) * 60); // Convert to minutes

      // Create route steps
      const steps: RouteStep[] = [
        {
          instruction: `Head ${this.getDirection(userLocation, station.coordinates)} towards ${station.name} Metro Station`,
          distance: distance * 0.3,
          duration: duration * 0.3,
          coordinates: [
            userLocation,
            {
              latitude: userLocation.latitude + (station.coordinates.latitude - userLocation.latitude) * 0.3,
              longitude: userLocation.longitude + (station.coordinates.longitude - userLocation.longitude) * 0.3,
            }
          ]
        },
        {
          instruction: 'Continue straight on the main road',
          distance: distance * 0.4,
          duration: duration * 0.4,
          coordinates: [
            {
              latitude: userLocation.latitude + (station.coordinates.latitude - userLocation.latitude) * 0.3,
              longitude: userLocation.longitude + (station.coordinates.longitude - userLocation.longitude) * 0.3,
            },
            {
              latitude: userLocation.latitude + (station.coordinates.latitude - userLocation.latitude) * 0.7,
              longitude: userLocation.longitude + (station.coordinates.longitude - userLocation.longitude) * 0.7,
            }
          ]
        },
        {
          instruction: `Arrive at ${station.name} Metro Station`,
          distance: distance * 0.3,
          duration: duration * 0.3,
          coordinates: [
            {
              latitude: userLocation.latitude + (station.coordinates.latitude - userLocation.latitude) * 0.7,
              longitude: userLocation.longitude + (station.coordinates.longitude - userLocation.longitude) * 0.7,
            },
            station.coordinates
          ]
        }
      ];

      // Get road updates for the route
      const roadUpdates = await this.getRoadUpdates(userLocation, station.coordinates);

      return {
        distance,
        duration,
        steps,
        roadUpdates
      };
    } catch (error) {
      console.error('Error getting route to station:', error);
      return null;
    }
  }

  private getDirection(from: { latitude: number; longitude: number }, to: { latitude: number; longitude: number }): string {
    const latDiff = to.latitude - from.latitude;
    const lngDiff = to.longitude - from.longitude;

    if (Math.abs(latDiff) > Math.abs(lngDiff)) {
      return latDiff > 0 ? 'north' : 'south';
    } else {
      return lngDiff > 0 ? 'east' : 'west';
    }
  }

  async getRoadUpdates(from: { latitude: number; longitude: number }, to: { latitude: number; longitude: number }): Promise<RoadUpdate[]> {
    // Simulate road updates - in a real app, this would fetch from a traffic API
    const updates: RoadUpdate[] = [];
    
    // Generate some sample road updates based on common Dhaka traffic patterns
    const currentTime = new Date();
    const hour = currentTime.getHours();
    
    // Peak hour traffic updates
    if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 20)) {
      updates.push({
        id: 'traffic-1',
        type: 'traffic',
        severity: 'high',
        message: 'Heavy traffic expected during peak hours. Consider alternative routes.',
        location: 'Main roads in Dhaka',
        coordinates: {
          latitude: (from.latitude + to.latitude) / 2,
          longitude: (from.longitude + to.longitude) / 2
        },
        timestamp: currentTime.toISOString()
      });
    }

    // Construction updates for major areas
    if (this.isNearMajorArea(from) || this.isNearMajorArea(to)) {
      updates.push({
        id: 'construction-1',
        type: 'construction',
        severity: 'medium',
        message: 'Ongoing metro construction may cause delays. Allow extra time.',
        location: 'Metro construction zones',
        coordinates: to,
        timestamp: currentTime.toISOString()
      });
    }

    // Weather-based updates
    if (this.isRainyWeather()) {
      updates.push({
        id: 'weather-1',
        type: 'traffic',
        severity: 'medium',
        message: 'Rainy weather may cause slower traffic. Drive carefully.',
        location: 'City-wide',
        coordinates: from,
        timestamp: currentTime.toISOString()
      });
    }

    return updates;
  }

  private isNearMajorArea(location: { latitude: number; longitude: number }): boolean {
    const majorAreas = [
      { name: 'Farmgate', lat: 23.7581470, lng: 90.3896469 },
      { name: 'Shahbag', lat: 23.7400837, lng: 90.3960061 },
      { name: 'Motijheel', lat: 23.7280587, lng: 90.4190551 },
      { name: 'Uttara', lat: 23.8683699, lng: 90.3671672 }
    ];

    return majorAreas.some(area => 
      this.calculateDistance(location.latitude, location.longitude, area.lat, area.lng) < 2 // Within 2km
    );
  }

  private isRainyWeather(): boolean {
    // Simulate weather check - in a real app, this would use a weather API
    // For demo, randomly return true 30% of the time
    return Math.random() < 0.3;
  }

  getPopularRoutesFromCurrentLocation(): Array<{
    id: string;
    from: string;
    to: string;
    price: number;
    image: string;
    transportationType: string;
    fromStation?: MetroStation;
    toStation?: MetroStation;
  }> {
    const currentStation = this.currentLocation?.nearestStation;
    
    if (!currentStation) {
      // Return default popular routes if no location
      return [
        {
          id: "default-1",
          from: "Uttara North",
          to: "Motijheel",
          price: 100,
          image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
          transportationType: "train",
        },
        {
          id: "default-2",
          from: "Farmgate",
          to: "Dhaka University",
          price: 40,
          image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
          transportationType: "train",
        },
        {
          id: "default-3",
          from: "Mirpur-10",
          to: "Shahbag",
          price: 60,
          image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
          transportationType: "train",
        },
      ];
    }

    // Generate popular routes from current location
    const popularDestinations = [
      mrtLine6Stations.find(s => s.name === "Motijheel"),
      mrtLine6Stations.find(s => s.name === "Dhaka University"),
      mrtLine6Stations.find(s => s.name === "Farmgate"),
      mrtLine6Stations.find(s => s.name === "Shahbag"),
      mrtLine6Stations.find(s => s.name === "Uttara North"),
    ].filter(Boolean) as MetroStation[];

    return popularDestinations
      .filter(station => station.id !== currentStation.id)
      .slice(0, 3)
      .map((station, index) => ({
        id: `location-${index}`,
        from: currentStation.name,
        to: station.name,
        price: calculateFare(currentStation, station),
        image: this.getStationImage(station.name),
        transportationType: "train",
        fromStation: currentStation,
        toStation: station,
      }));
  }

  private getStationImage(stationName: string): string {
    // Map station names to appropriate city/landmark images
    const imageMap: { [key: string]: string } = {
      "Uttara North": "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "Uttara Center": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "Uttara South": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "Pallabi": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "Mirpur-11": "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "Mirpur-10": "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "Kazipara": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "Shewrapara": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "Agargaon": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "Bijoy Sarani": "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "Farmgate": "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "Kawran Bazar": "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "Shahbag": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "Dhaka University": "https://images.unsplash.com/photo-1570168007204-dfb528c6958f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "Bangladesh Secretariat": "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      "Motijheel": "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
    };

    return imageMap[stationName] || "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80";
  }
}

export const locationService = LocationService.getInstance();
