import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image } from 'react-native';
import { useTheme } from '../lib/ThemeContext';
import {
  createNeumorphicCard,
  createNeumorphicIconContainer,
  NeumorphicTextStyles,
} from '../lib/neumorphicStyles';
import { Colors } from '../lib/colors';

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
  onNavigate: (screen: string) => void;
  isGuest?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isVisible, onClose, onNavigate, isGuest = false }) => {
  const translateX = React.useRef(new Animated.Value(-300)).current;
  const { theme, toggleTheme } = useTheme();
  const styles = React.useMemo(() => createStyles(), []);

  React.useEffect(() => {
    Animated.timing(translateX, {
      toValue: isVisible ? 0 : -300,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isVisible]);

  const menuItems = [
    { icon: '📊', label: 'Dashboard', screen: 'Dashboard' },
    { icon: '📸', label: 'Water Level Capture', screen: 'Capture' },
    { icon: '📋', label: 'My Readings', screen: 'Readings' },
    { icon: '🗺️', label: 'Site Locations', screen: 'Sites' },
    { icon: '📈', label: 'Analytics', screen: 'Analytics' },
    { icon: '🚨', label: 'Flood Alerts', screen: 'Alerts' },
    ...(!isGuest ? [{ icon: '👤', label: 'Profile', screen: 'Profile' }] : []),
    { icon: '⚙️', label: 'Settings', screen: 'Settings' },
    { icon: theme === 'dark' ? '☀️' : '🌙', label: `${theme === 'dark' ? 'Light' : 'Dark'} Mode`, action: toggleTheme },
    ...(isGuest ? [{ icon: '🔑', label: 'Sign In', screen: 'Auth' }] : []),
  ];

  return (
    <>
      {isVisible && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={onClose}
        />
      )}
      <Animated.View
        style={[
          styles.sidebar,
          {
            transform: [{ translateX }],
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <View style={styles.logoContainer}>
              <Image 
                source={require('../assets/icon.png')}
                style={styles.logoImage}
              />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.headerText}>HydroSnap</Text>
              <Text style={styles.headerSubtext}>Water Monitoring</Text>
            </View>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
        </View>

        {!isGuest && (
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>👤</Text>
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>Field Personnel</Text>
              <Text style={styles.userStatus}>Online</Text>
            </View>
          </View>
        )}

        <View style={styles.menuItems}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => {
                if (item.action) {
                  item.action();
                } else if (item.screen) {
                  onNavigate(item.screen);
                  onClose();
                }
              }}
            >
              <Text style={styles.menuItemIcon}>{item.icon}</Text>
              <Text style={styles.menuItemText}>{item.label}</Text>
              <Text style={styles.menuItemArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>
    </>
  );
};

const createStyles = () => StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.overlay || 'rgba(0,0,0,0.4)',
    zIndex: 1,
  },
  sidebar: {
    position: 'absolute',
    top: 35,
    left: 0,
    bottom: 0,
    width: 290,
    backgroundColor: Colors.softLightGrey, // Soft UI background
    zIndex: 2,
    elevation: 15,
    shadowColor: Colors.darkShadow,
    shadowOffset: { width: 8, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    paddingTop: 15,
    // Neumorphic border effect
    borderRightWidth: 1,
    borderRightColor: Colors.lightShadow,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    marginHorizontal: 15,
    marginBottom: 20,
    borderRadius: 20,
    backgroundColor: Colors.deepSecurityBlue, // Deep Security Blue header
    // Neumorphic effect on dark background
    shadowColor: Colors.deepSecurityBlue + '60',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  logoContainer: {
    ...createNeumorphicIconContainer(42),
    backgroundColor: Colors.aquaTechBlue, // Accent color for logo
  },
  logoImage: {
    width: 26,
    height: 26,
    tintColor: Colors.white,
  },
  headerInfo: {
    marginLeft: 16,
    flex: 1,
  },
  headerText: {
    ...NeumorphicTextStyles.heading,
    fontSize: 20,
    color: Colors.white,
    letterSpacing: 0.5,
  },
  headerSubtext: {
    fontSize: 13,
    color: Colors.aquaTechBlue, // Accent color for subtext
    fontWeight: '600',
    marginTop: 3,
  },
  closeButton: {
    ...createNeumorphicCard({ size: 'small', borderRadius: 22 }),
    padding: 10,
    backgroundColor: Colors.softLightGrey,
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 18,
    color: Colors.deepSecurityBlue,
    fontWeight: 'bold',
  },
  userInfo: {
    ...createNeumorphicCard({ size: 'medium', borderRadius: 16 }),
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    marginHorizontal: 15,
    marginBottom: 20,
  },
  avatarContainer: {
    ...createNeumorphicIconContainer(44),
    backgroundColor: Colors.deepSecurityBlue,
  },
  avatarText: {
    fontSize: 20,
    color: Colors.white,
  },
  userDetails: {
    marginLeft: 16,
    flex: 1,
  },
  userName: {
    ...NeumorphicTextStyles.body,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: Colors.textPrimary,
  },
  userStatus: {
    fontSize: 13,
    color: Colors.validationGreen,
    fontWeight: '600',
  },
  menuItems: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  menuItem: {
    ...createNeumorphicCard({ size: 'small', borderRadius: 14 }),
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginVertical: 6,
  },
  menuItemIcon: {
    fontSize: 20,
    width: 32,
    textAlign: 'center',
    color: Colors.aquaTechBlue, // Accent color for icons
  },
  menuItemText: {
    ...NeumorphicTextStyles.body,
    flex: 1,
    marginLeft: 14,
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  menuItemArrow: {
    fontSize: 18,
    color: Colors.aquaTechBlue,
    fontWeight: 'bold',
  },
});

export default Sidebar;