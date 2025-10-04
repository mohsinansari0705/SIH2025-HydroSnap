import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, Alert } from 'react-native';
import {
  createNeumorphicCard,
  NeumorphicTextStyles,
} from '../lib/neumorphicStyles';
import { Colors } from '../lib/colors';

import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import HeroSection from '../components/HeroSection';
import Card from '../components/Card';
import SettingsPage from './SettingsPage';

interface IndexPageProps {
  isGuest?: boolean;
  userName?: string;
}

type Screen = 'Dashboard' | 'Settings' | 'Profile' | 'Auth';

const IndexPage: React.FC<IndexPageProps> = ({ isGuest = false, userName = 'Guest' }) => {
  const [isSidebarVisible, setSidebarVisible] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>('Dashboard');
  const styles = React.useMemo(() => createStyles(), []);

  // Sample water level monitoring data - replace with actual data from your backend
  const floodAlerts = [
    {
      id: 1,
      title: 'High Water Level Alert',
      description: 'Water level approaching danger mark at gauge station',
      location: 'Brahmaputra River - Guwahati',
      date: '2025-10-02',
      type: 'flood_alert' as const,
      severity: 'high' as const,
      waterLevel: 142.5,
      dangerLevel: 145.0,
    },
    {
      id: 2,
      title: 'Rising Water Levels',
      description: 'Steady increase in water level due to upstream rainfall',
      location: 'Ganges River - Patna',
      date: '2025-10-02',
      type: 'flood_alert' as const,
      severity: 'medium' as const,
      waterLevel: 48.2,
      dangerLevel: 50.0,
    },
  ];

  const sitesStatus = [
    {
      id: 3,
      title: 'Site Connectivity Issue',
      description: 'Data transmission interrupted from monitoring station',
      location: 'Yamuna River - Delhi',
      date: '2025-10-01',
      type: 'site_status' as const,
      severity: 'medium' as const,
      lastReading: '12 hours ago',
    },
    {
      id: 4,
      title: 'Calibration Required',
      description: 'Gauge post needs recalibration after maintenance',
      location: 'Godavari River - Nashik',
      date: '2025-10-01',
      type: 'site_status' as const,
      severity: 'low' as const,
      lastReading: '2 hours ago',
    },
  ];

  const recentReadings = [
    {
      id: 5,
      title: 'Latest Water Level Reading',
      description: 'Automated reading captured via HydroSnap mobile app',
      location: 'Narmada River - Bhopal',
      date: '2025-10-02',
      type: 'reading' as const,
      severity: 'low' as const,
      waterLevel: 35.8,
      fieldPersonnel: 'Rajesh Kumar',
    },
  ];

  const handleNavigation = (screen: string) => {
    if (isGuest && screen === 'Profile') {
      Alert.alert('Sign In Required', 'Please sign in to access your profile.');
      return;
    }
    
    // Handle specific navigation cases
    switch (screen) {
      case 'Settings':
        setCurrentScreen('Settings');
        break;
      case 'Auth':
        setCurrentScreen('Auth');
        break;
      case 'Profile':
        setCurrentScreen('Profile');
        break;
      case 'Dashboard':
        setCurrentScreen('Dashboard');
        break;
      default:
        console.log(`Navigating to ${screen} - Feature coming soon!`);
        Alert.alert('Coming Soon', `${screen} feature will be available soon!`);
        break;
    }
  };

  const handleBackToDashboard = () => {
    setCurrentScreen('Dashboard');
  };

  // Render Settings page if selected
  if (currentScreen === 'Settings') {
    return (
      <SettingsPage 
        onNavigate={handleNavigation}
        onBack={handleBackToDashboard}
      />
    );
  }

  // Show auth message for auth screen navigation
  if (currentScreen === 'Auth') {
    Alert.alert('Logout', 'You have been logged out successfully.');
    setCurrentScreen('Dashboard');
  }

  // Render main dashboard
  return (
    <View style={styles.container}>
      <Navbar 
        onMenuPress={() => setSidebarVisible(true)}
        userName={userName}
      />
      
      <Sidebar
        isVisible={isSidebarVisible}
        onClose={() => setSidebarVisible(false)}
        onNavigate={handleNavigation}
        isGuest={isGuest}
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <HeroSection userName={userName} />

        {/* Flood Alerts Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🚨 Flood Alert Status</Text>
            <Text style={styles.sectionSubtitle}>Real-time water level monitoring</Text>
          </View>
          {floodAlerts.map(alert => (
            <Card
              key={alert.id}
              type={alert.type}
              severity={alert.severity}
              title={alert.title}
              description={alert.description}
              location={alert.location}
              date={alert.date}
              waterLevel={alert.waterLevel}
              dangerLevel={alert.dangerLevel}
              onPress={() => console.log(`Flood alert ${alert.id} pressed`)}
            />
          ))}
        </View>

        {/* Site Status Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>� Monitoring Sites Status</Text>
            <Text style={styles.sectionSubtitle}>Site connectivity and maintenance</Text>
          </View>
          {sitesStatus.map(site => (
            <Card
              key={site.id}
              type={site.type}
              severity={site.severity}
              title={site.title}
              description={site.description}
              location={site.location}
              date={site.date}
              lastReading={site.lastReading}
              onPress={() => console.log(`Site status ${site.id} pressed`)}
            />
          ))}
        </View>

        {/* Recent Readings Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>� Recent Water Level Readings</Text>
            <Text style={styles.sectionSubtitle}>Latest data collection</Text>
          </View>
          {recentReadings.map(reading => (
            <Card
              key={reading.id}
              type={reading.type}
              severity={reading.severity}
              title={reading.title}
              description={reading.description}
              location={reading.location}
              date={reading.date}
              waterLevel={reading.waterLevel}
              fieldPersonnel={reading.fieldPersonnel}
              onPress={() => console.log(`Reading ${reading.id} pressed`)}
            />
          ))}
        </View>

        {/* AI Insights Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>🤖 AI Flood Prediction</Text>
            <Text style={styles.sectionSubtitle}>Machine learning analysis</Text>
          </View>
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>Flood Risk Assessment</Text>
            <Text style={styles.insightText}>
              AI model predicts 68% chance of moderate flooding in Brahmaputra basin within next 48 hours based on upstream precipitation data and current water levels.
            </Text>
            <View style={styles.riskIndicator}>
              <Text style={styles.riskLabel}>Risk Level: </Text>
              <Text style={styles.riskMedium}>MEDIUM</Text>
            </View>
          </View>
        </View>

        {/* Quick Stats Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>📊 Water Monitoring Statistics</Text>
            <Text style={styles.sectionSubtitle}>Last 30 days overview</Text>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>1,247</Text>
              <Text style={styles.statLabel}>Total Readings</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>42</Text>
              <Text style={styles.statLabel}>Active Sites</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>5</Text>
              <Text style={styles.statLabel}>High Risk Areas</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>98.5%</Text>
              <Text style={styles.statLabel}>Data Accuracy</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const createStyles = () => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.softLightGrey, // Soft UI background
  },
  content: {
    flex: 1,
  },
  section: {
    margin: 20,
    marginBottom: 28,
  },
  sectionHeader: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    ...NeumorphicTextStyles.heading,
    fontSize: 22,
    marginBottom: 6,
    color: Colors.textPrimary,
  },
  sectionSubtitle: {
    ...NeumorphicTextStyles.bodySecondary,
    fontSize: 15,
    color: Colors.textSecondary,
  },
  insightCard: {
    ...createNeumorphicCard({ size: 'large', borderRadius: 20 }),
    padding: 24,
    borderLeftWidth: 6,
    borderLeftColor: Colors.warning || '#FFA726',
    marginHorizontal: 4,
  },
  insightTitle: {
    ...NeumorphicTextStyles.subheading,
    marginBottom: 12,
    color: Colors.textPrimary,
  },
  insightText: {
    ...NeumorphicTextStyles.body,
    lineHeight: 24,
    marginBottom: 16,
    color: Colors.textSecondary,
  },
  riskIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  riskLabel: {
    ...NeumorphicTextStyles.body,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  riskHigh: {
    ...createNeumorphicCard({ size: 'small', borderRadius: 10 }),
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.alertRed,
    backgroundColor: Colors.alertRed + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    overflow: 'hidden',
  },
  riskMedium: {
    ...createNeumorphicCard({ size: 'small', borderRadius: 10 }),
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.warning || '#FFA726',
    backgroundColor: (Colors.warning || '#FFA726') + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    overflow: 'hidden',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  statItem: {
    ...createNeumorphicCard({ size: 'medium', borderRadius: 16 }),
    padding: 20,
    alignItems: 'center',
    width: '47%',
    marginBottom: 16,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: Colors.aquaTechBlue, // Accent color for numbers
    marginBottom: 8,
  },
  statLabel: {
    ...NeumorphicTextStyles.bodySecondary,
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 13,
  },
});

export default IndexPage;