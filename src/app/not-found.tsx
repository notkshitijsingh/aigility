
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@/firebase';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/logo';

export default function NotFound() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    // Wait until the authentication status is determined
    if (!isUserLoading) {
      if (user) {
        // If logged in, redirect to the main app dashboard
        router.replace('/dashboard');
      } else {
        // If not logged in, redirect to the login page
        router.replace('/login');
      }
    }
  }, [user, isUserLoading, router]);

  // Display a loading message while checking auth status
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
      <Logo />
      <h1 className="mt-8 text-2xl font-semibold text-foreground">Checking your session...</h1>
      <p className="mt-2 text-muted-foreground">You've found a page that doesn't exist. We'll redirect you shortly.</p>
      <Loader2 className="mt-6 h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
