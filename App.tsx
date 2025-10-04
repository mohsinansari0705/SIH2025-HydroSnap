import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { supabase } from './lib/supabase';
import { ThemeProvider } from './lib/ThemeContext';
import AuthScreen from './components/AuthScreen';
import ProfileSetup from './components/ProfileSetup';
import IndexPage from './pages/IndexPage';
import { Session } from '@supabase/supabase-js';
import { Profile } from './types/profile';

function AppContent() {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('App starting - checking session...');
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      console.log('Initial session check:', { session: !!session, error });
      setSession(session);
      if (session) {
        console.log('Session found, fetching profile for user:', session.user.id);
        fetchProfile(session.user.id);
      } else {
        console.log('No session found, showing auth screen');
        setLoading(false);
      }
    }).catch((error) => {
      console.error('Error getting initial session:', error);
      setError('Failed to initialize app. Please restart the app.');
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Auth state changed:', { event: _event, session: !!session });
      setSession(session);
      if (session) {
        fetchProfile(session.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId);
      // Add a small delay to allow profile creation to complete
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      console.log('Profile fetch result:', { data: !!data, error });
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        setProfile(null);
      } else if (data) {
        console.log('Profile found:', data);
        setProfile(data);
      } else {
        // Profile not found, might need to create one
        console.log('No profile found for user:', userId);
        setProfile(null);
      }
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      setProfile(null);
      // Don't set error here as missing profile is normal for new users
    } finally {
      console.log('Setting loading to false');
      setLoading(false);
    }
  };

  const handleAuthSuccess = () => {
    // The session will be updated through the auth state change listener
  };

  const handleProfileComplete = () => {
    if (session) {
      fetchProfile(session.user.id);
    }
  };

  // Show error state if there's an error
  if (error) {
    console.log('Showing error screen:', error);
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.errorText}>⚠️ {error}</Text>
        <TouchableOpacity 
          style={styles.retryButton} 
          onPress={() => {
            setError(null);
            setLoading(true);
            // Retry initialization
            supabase.auth.getSession().then(({ data: { session } }) => {
              setSession(session);
              if (session) {
                fetchProfile(session.user.id);
              } else {
                setLoading(false);
              }
            });
          }}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    console.log('Showing loading screen');
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading HydroSnap...</Text>
      </View>
    );
  }

  if (!session) {
    console.log('No session, showing auth screen');
    try {
      return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
    } catch (authError) {
      console.error('Error rendering AuthScreen:', authError);
      return (
        <View style={[styles.container, styles.loadingContainer]}>
          <Text style={styles.errorText}>Error loading authentication screen</Text>
        </View>
      );
    }
  }

  // Check if profile exists, if not show ProfileSetup
  if (!profile) {
    console.log('Session exists but no profile, showing profile setup');
    try {
      return (
        <ProfileSetup
          userId={session.user.id}
          onProfileComplete={handleProfileComplete}
        />
      );
    } catch (profileError) {
      console.error('Error rendering ProfileSetup:', profileError);
      return (
        <View style={[styles.container, styles.loadingContainer]}>
          <Text style={styles.errorText}>Error loading profile setup</Text>
        </View>
      );
    }
  }

  console.log('Session and profile exist, showing main app');
  try {
    return (
      <View style={styles.container}>
        <IndexPage userName={session.user.email?.split('@')[0] || 'User'} />
        <StatusBar style="auto" />
      </View>
    );
  } catch (indexError) {
    console.error('Error rendering IndexPage:', indexError);
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.errorText}>Error loading main application</Text>
      </View>
    );
  }
}

export default function App() {
  return (
    <ThemeProvider>
      <View style={{ flex: 1 }}>
        <AppContent />
      </View>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafe',
    padding: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#2c3e50',
    fontWeight: '500',
  },
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  retryButton: {
    backgroundColor: '#3498db',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});