export type TransportationType = "train";
export type MetroLine = "MRT-6" | "MRT-1" | "MRT-5" | "MRT-2" | "MRT-4";
export type TicketType = "single" | "mrt-pass" | "rapid-pass";
export type PassengerType = "adult" | "child" | "senior" | "disabled" | "freedom-fighter";

export interface Location {
  city: string;
  station: string;
  code: string;
}

export interface MetroTrip {
  id: string;
  from: MetroStation;
  to: MetroStation;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  duration: string;
  price: number;
  line: MetroLine;
  trainNumber: string;
  platform?: string;
  frequency: string;
  bookingRef?: string;
  status?: "upcoming" | "past" | "canceled" | "delayed";
  amenities: string[];
  isEcoFriendly: boolean;
  onTimePerformance: number;
}

export interface MetroStation {
  id: string;
  name: string;
  code: string;
  line: MetroLine;
  isOperational: boolean;
  facilities: string[];
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

// Legacy Trip interface for backward compatibility
export interface Trip {
  id: string;
  from: Location;
  to: Location;
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
  duration: string;
  price: number;
  transportationType: TransportationType;
  company: string;
  class: string;
  bookingRef?: string;
  status?: "upcoming" | "past" | "canceled";
}

export interface MetroSearchParams {
  from: MetroStation | null;
  to: MetroStation | null;
  date: string;
  returnDate?: string;
  isRoundTrip: boolean;
  passengers: {
    adult: number;
    child: number;
    senior: number;
    disabled: number;
  };
  ticketType: TicketType;
  preferredTime?: string;
}

// Legacy SearchParams for backward compatibility
export interface SearchParams {
  from: Location | null;
  to: Location | null;
  date: string;
  returnDate?: string;
  isRoundTrip: boolean;
  passengers: number;
  transportationType: TransportationType;
  class: string;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  nationality: string;
  profileImage?: string;
  trips: number;
  countries: number;
  miles: number;
  memberSince: string;
  membershipLevel: "Standard" | "Gold" | "Platinum";
  kycStatus?: "pending" | "verified" | "rejected" | "not_started";
  kycDocuments?: {
    nidFront?: string;
    nidBack?: string;
    passport?: string;
    drivingLicense?: string;
  };
  dateOfBirth?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}

export interface PaymentMethod {
  id: string;
  type: "visa" | "mastercard" | "amex" | "paypal";
  lastFour: string;
  expiryDate: string;
  isDefault: boolean;
}

export interface AppSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  priceAlerts: boolean;
  travelTips: boolean;
  marketingCommunications: boolean;
  darkMode: boolean;
  fontSize: "small" | "medium" | "large";
  language: "en" | "bn";
  preferredPayment: "cash" | "mrt-pass" | "rapid-pass";
  accessibilityMode: boolean;
}

export interface MetroSchedule {
  id: string;
  line: MetroLine;
  direction: "northbound" | "southbound";
  weekdaySchedule: {
    firstTrain: string;
    lastTrain: string;
    peakFrequency: string;
    offPeakFrequency: string;
  };
  fridaySchedule: {
    firstTrain: string;
    lastTrain: string;
    frequency: string;
  };
  saturdaySchedule: {
    firstTrain: string;
    lastTrain: string;
    frequency: string;
  };
}

export interface UpcomingTrain {
  id: string;
  trainNumber: string;
  line: MetroLine;
  from: MetroStation;
  to: MetroStation;
  departureTime: string;
  arrivalTime: string;
  platform: string;
  status: "on-time" | "delayed" | "cancelled";
  delay?: number;
  crowdLevel: "low" | "medium" | "high";
}

export interface LostFoundItem {
  id: string;
  title: string;
  description: string;
  category: LostFoundCategory;
  location: string;
  dateReported: string;
  status: "lost" | "found" | "claimed";
  reporterName: string;
  contactInfo: string;
  reportId: string;
  image?: string;
  additionalDetails?: {
    [key: string]: string;
  };
}

export type LostFoundCategory = 
  | "Electronics" 
  | "Bags & Luggage" 
  | "Clothing" 
  | "Documents" 
  | "Jewelry" 
  | "Keys" 
  | "Wallet" 
  | "Phone" 
  | "Other";

export interface LostFoundReport {
  title: string;
  description: string;
  category: LostFoundCategory;
  location: string;
  date: string;
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  type: "lost" | "found";
}
