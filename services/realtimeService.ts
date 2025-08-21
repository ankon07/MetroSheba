import { db } from '@/lib/firebase';
import { ref, onValue, off } from 'firebase/database';
import { UpcomingTrain } from '@/types';
import { toUpcomingTrain } from './mappers';

export class RealtimeService {
  private static subscriptions: Map<string, () => void> = new Map();

  static subscribeToUpcomingTrains(
    callback: (trains: UpcomingTrain[]) => void,
    limit = 5
  ): () => void {
    const subscriptionKey = `upcoming_trains_${limit}`;
    
    // Clean up existing subscription
    this.unsubscribe(subscriptionKey);

    const trainsRef = ref(db, 'upcomingTrains');
    const unsubscribe = onValue(trainsRef, (snapshot) => {
      try {
        if (snapshot.exists()) {
          const val = snapshot.val() || {};
          const items = Object.values(val) as any[];
          const trains = items.map(toUpcomingTrain).slice(0, limit);
          callback(trains);
        } else {
          callback([]);
        }
      } catch (error) {
        console.error('Error in realtime subscription:', error);
        callback([]);
      }
    }, (error) => {
      console.error('Realtime subscription error:', error);
      callback([]);
    });

    this.subscriptions.set(subscriptionKey, unsubscribe);
    return () => this.unsubscribe(subscriptionKey);
  }

  static subscribeToTripStatus(
    tripId: string,
    callback: (status: string) => void
  ): () => void {
    const subscriptionKey = `trip_status_${tripId}`;
    
    // Clean up existing subscription
    this.unsubscribe(subscriptionKey);

    const tripRef = ref(db, `trips/${tripId}/status`);
    const unsubscribe = onValue(tripRef, (snapshot) => {
      try {
        if (snapshot.exists()) {
          callback(snapshot.val());
        }
      } catch (error) {
        console.error('Error in trip status subscription:', error);
      }
    });

    this.subscriptions.set(subscriptionKey, unsubscribe);
    return () => this.unsubscribe(subscriptionKey);
  }

  static unsubscribe(key: string): void {
    const unsubscribe = this.subscriptions.get(key);
    if (unsubscribe) {
      unsubscribe();
      this.subscriptions.delete(key);
    }
  }

  static unsubscribeAll(): void {
    this.subscriptions.forEach((unsubscribe) => unsubscribe());
    this.subscriptions.clear();
  }
}