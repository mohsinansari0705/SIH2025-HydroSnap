import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import {
  createNeumorphicCard,
  createNeumorphicButton,
  createNeumorphicIconContainer,
  NeumorphicTextStyles,
} from '../lib/neumorphicStyles';
import { Colors } from '../lib/colors';

interface HeroSectionProps {
  userName: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ userName }) => {
  const styles = React.useMemo(() => createStyles(), []);

  const currentHour = new Date().getHours();
  const getGreeting = () => {
    if (currentHour < 12) return 'Good Morning';
    if (currentHour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerSection}>
        <View style={styles.greetingContainer}>
          <Text style={styles.greeting}>{getGreeting()}, {userName}</Text>
          <Text style={styles.userName}>HydroSnap Monitor 🌊</Text>
          <Text style={styles.date}>Water Level Data Collection • {getCurrentDate()}</Text>
        </View>
        
        <View style={styles.waterIcon}>
          <Image 
            source={require('../assets/icon.png')}
            style={styles.logoImage}
          />
        </View>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>📍</Text>
          <Text style={styles.statNumber}>24</Text>
          <Text style={styles.statLabel}>Active Sites</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>📊</Text>
          <Text style={styles.statNumber}>156</Text>
          <Text style={styles.statLabel}>Today's Readings</Text>
        </View>
        
        <View style={styles.statCard}>
          <Text style={styles.statIcon}>⚠️</Text>
          <Text style={styles.statNumber}>2</Text>
          <Text style={styles.statLabel}>Flood Alerts</Text>
        </View>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>�</Text>
          <Text style={styles.actionText}>Capture Reading</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionIcon}>🗺️</Text>
          <Text style={styles.actionText}>View Sites</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const createStyles = () => StyleSheet.create({
  container: {
    ...createNeumorphicCard({ size: 'large', borderRadius: 24 }),
    margin: 20,
    padding: 24,
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    ...NeumorphicTextStyles.body,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  userName: {
    ...NeumorphicTextStyles.heading,
    fontSize: 26,
    marginBottom: 6,
    color: Colors.textPrimary,
  },
  date: {
    ...NeumorphicTextStyles.bodySecondary,
    fontSize: 14,
  },
  waterIcon: {
    ...createNeumorphicIconContainer(68),
    backgroundColor: Colors.deepSecurityBlue,
  },
  iconText: {
    fontSize: 32,
  },
  logoImage: {
    width: 40,
    height: 40,
    tintColor: Colors.white,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    ...createNeumorphicCard({ size: 'medium', borderRadius: 16 }),
    flex: 1,
    padding: 18,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  statIcon: {
    fontSize: 28,
    marginBottom: 10,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.aquaTechBlue,
    marginBottom: 6,
  },
  statLabel: {
    ...NeumorphicTextStyles.caption,
    textAlign: 'center',
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    ...createNeumorphicButton('secondary', { size: 'large', borderRadius: 16 }),
    flex: 1,
    paddingVertical: 18,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginHorizontal: 6,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 10,
  },
  actionText: {
    ...NeumorphicTextStyles.buttonSecondary,
    fontSize: 15,
    fontWeight: '600',
  },
});

export default HeroSection;