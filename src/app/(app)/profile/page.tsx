'use client';

import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@/firebase';
import { updateProfile } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function ProfilePage() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const { toast } = useToast();

  const [displayName, setDisplayName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || '');
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setIsSubmitting(true);
    
    updateProfile(auth.currentUser, {
      displayName: displayName,
    }).then(() => {
      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
      // Force a re-render of components using the user object
      // by touching a state that will trigger updates.
      // A full refresh is another, simpler option: window.location.reload();
    }).catch((error) => {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: 'There was an error updating your profile. Please try again.',
      });
    }).finally(() => {
      setIsSubmitting(false);
    });
  };
  
  if (isUserLoading) {
    return <div className="flex justify-center items-center h-full"><Loader2 className="animate-spin" /></div>;
  }
  
  if (!user) {
    return null;
  }

  return (
    <div className="flex justify-center items-start pt-8">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="font-headline">Your Profile</CardTitle>
          <CardDescription>Manage your public profile information.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                  {displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-semibold">{displayName || 'Your Name'}</h3>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g., Jane Doe"
              />
            </div>
            
            <Button type="submit" disabled={isSubmitting} className="w-full bg-accent hover:bg-accent/90">
              {isSubmitting ? <Loader2 className="animate-spin" /> : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
