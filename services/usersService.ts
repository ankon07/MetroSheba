import { db } from '@/lib/firebase';
import { ref, get, set, update, remove } from 'firebase/database';
import { AppSettings, PaymentMethod, Trip, User } from '@/types';

export async function loginOrBootstrap(user: User): Promise<User> {
  const userRef = ref(db, `users/${user.id}/profile`);
  const snap = await get(userRef);
  if (!snap.exists()) {
    await set(userRef, user);
  }
  return user;
}

export async function getUserProfile(uid: string): Promise<User | null> {
  const snap = await get(ref(db, `users/${uid}/profile`));
  return snap.exists() ? (snap.val() as User) : null;
}

export async function getUserPaymentMethods(uid: string): Promise<PaymentMethod[]> {
  const snap = await get(ref(db, `users/${uid}/paymentMethods`));
  if (!snap.exists()) return [];
  const val = snap.val() || {};
  return Object.values(val) as PaymentMethod[];
}

export async function addPaymentMethod(uid: string, method: PaymentMethod): Promise<void> {
  await set(ref(db, `users/${uid}/paymentMethods/${method.id}`), method);
}

export async function removePaymentMethod(uid: string, methodId: string): Promise<void> {
  await remove(ref(db, `users/${uid}/paymentMethods/${methodId}`));
}

export async function setDefaultPaymentMethod(uid: string, methodId: string): Promise<void> {
  const methods = await getUserPaymentMethods(uid);
  const updates: Record<string, any> = {};
  for (const m of methods) {
    updates[`users/${uid}/paymentMethods/${m.id}/isDefault`] = m.id === methodId;
  }
  await update(ref(db), updates);
}

export async function addTripToUser(uid: string, trip: Trip): Promise<void> {
  await set(ref(db, `users/${uid}/trips/${trip.id}`), true);
  await set(ref(db, `trips/${trip.id}`), trip);
}

export async function updateTripStatus(tripId: string, status: Trip['status']): Promise<void> {
  await update(ref(db, `trips/${tripId}`), { status });
}
