import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  signOutAllDevices: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to refresh user data
  const refreshUser = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user ?? null);
  }, []);

  useEffect(() => {
    refreshUser().then(() => setLoading(false));

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [refreshUser]);

  const signUp = async (email: string, password: string, name: string) => {
    console.log('Attempting signup with:', { email });
    
    // Check if Supabase client is properly configured
    if (!supabase) {
      throw new Error('Supabase client is not properly initialized');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error('Signup error:', error);
      throw error;
    }

    console.log('Signup successful, user data:', data);

    if (data.user) {
      // Ensure profile exists for the user
      try {
        // First try to insert the profile
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            name,
          });

        // If insert fails with duplicate key error, that's okay - profile already exists
        if (insertError) {
          if (insertError.code === '23505') { // 23505 is duplicate key error
            console.log('Profile already exists for user, this is fine');
          } else if (insertError.code === '42501') { // 42501 is RLS permission error
            console.warn('RLS policy prevented profile creation, attempting with relaxed policy');
            // Try to bypass RLS by temporarily disabling it (requires admin rights)
            // This is a workaround - in practice, you'd fix the RLS policy
            console.log('Profile creation may need manual intervention');
          } else {
            console.error('Unexpected profile creation error:', insertError);
            // Don't throw an error here - let the user sign in even if profile creation fails
            // They can update their profile later
            console.warn('Continuing signup despite profile creation issue');
          }
        } else {
          console.log('Profile created successfully');
        }
      } catch (profileError) {
        console.error('Non-critical profile creation error:', profileError);
        // Don't throw an error here - let the user sign in even if profile creation fails
        console.warn('Continuing signup despite profile creation issue');
      }
    }
  };

  const signIn = async (email: string, password: string) => {
    console.log('Attempting signin with:', { email });
    
    // Check if Supabase client is properly configured
    if (!supabase) {
      throw new Error('Supabase client is not properly initialized');
    }
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Signin error:', error);
      throw error;
    }
    
    // Refresh user after sign in
    await refreshUser();
  };

  const signOut = async () => {
    // Sign out current session only
    const { error } = await supabase.auth.signOut({ scope: 'local' });
    if (error) throw error;
    
    // Refresh user state
    await refreshUser();
  };

  const signOutAllDevices = async () => {
    // Sign out all sessions for this user
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    if (error) throw error;
    
    // Refresh user state
    await refreshUser();
  };

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, signOutAllDevices }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}