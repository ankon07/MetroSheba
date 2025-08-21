import React, { useEffect } from 'react';
import { router } from 'expo-router';
import { useUserStore } from '@/store/userStore';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { isLoggedIn } = useUserStore();

  useEffect(() => {
    if (!isLoggedIn) {
      // Redirect to welcome screen if not logged in
      router.replace('/welcome' as any);
    }
  }, [isLoggedIn]);

  // If not logged in, don't render children (will redirect)
  if (!isLoggedIn) {
    return null;
  }

  return <>{children}</>;
}
