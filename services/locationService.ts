import * as Location from 'expo-location';
import { MetroStation } from '@/types';
import { mrtLine6Stations, calculateFare } from '@/mocks/locations';

export interface UserLocation {
  latitude: number;
  longitude: number;
  address?: string;
  nearestStation?: MetroStation;
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
