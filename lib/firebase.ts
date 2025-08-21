import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

const configFromExtra = (Constants.expoConfig as any)?.extra?.firebase;

const firebaseConfig = configFromExtra ?? {
  apiKey: 'AIzaSyAP0ap1CmMTAC_HNTpLOsh1RuBe_Q8gQn0',
  authDomain: 'metrosheba.firebaseapp.com',
  databaseURL: 'https://metrosheba-default-rtdb.firebaseio.com',
  projectId: 'metrosheba',
  storageBucket: 'metrosheba.firebasestorage.app',
  messagingSenderId: '911059147830',
  appId: '1:911059147830:web:23f2fb3673b9f1d7d54c97',
  measurementId: 'G-FSEECP5LKX',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const db = getDatabase(app);

export async function getAnalyticsSafe() {
  if (Platform.OS === 'web') {
    const { getAnalytics } = await import('firebase/analytics');
    return getAnalytics(app);
  }
  return null;
}
