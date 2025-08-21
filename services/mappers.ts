import { Trip, MetroTrip, Location, MetroStation, UpcomingTrain } from '@/types';

export function toTrip(data: any): Trip {
  return {
    id: String(data.id),
    from: data.from as Location,
    to: data.to as Location,
    departureDate: data.departureDate,
    departureTime: data.departureTime,
    arrivalDate: data.arrivalDate,
    arrivalTime: data.arrivalTime,
    duration: data.duration,
    price: Number(data.price),
    transportationType: 'train',
    company: data.company ?? 'Dhaka Mass Transit Company Limited',
    class: data.class ?? 'Standard',
    bookingRef: data.bookingRef,
    status: data.status,
  };
}

export function toMetroTrip(data: any): MetroTrip {
  return {
    id: String(data.id),
    from: data.from as MetroStation,
    to: data.to as MetroStation,
    departureDate: data.departureDate,
    departureTime: data.departureTime,
    arrivalDate: data.arrivalDate,
    arrivalTime: data.arrivalTime,
    duration: data.duration,
    price: Number(data.price),
    line: data.line,
    trainNumber: data.trainNumber,
    platform: data.platform,
    frequency: data.frequency,
    bookingRef: data.bookingRef,
    status: data.status,
    amenities: data.amenities ?? [],
    isEcoFriendly: Boolean(data.isEcoFriendly),
    onTimePerformance: Number(data.onTimePerformance ?? 0),
  };
}

export function toUpcomingTrain(data: any): UpcomingTrain {
  return {
    id: String(data.id),
    trainNumber: data.trainNumber,
    line: data.line,
    from: data.from as MetroStation,
    to: data.to as MetroStation,
    departureTime: data.departureTime,
    arrivalTime: data.arrivalTime,
    platform: data.platform,
    status: data.status,
    delay: data.delay,
    crowdLevel: data.crowdLevel,
  };
}
