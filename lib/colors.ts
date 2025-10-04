/**
 * HydroSnap Color Palette - Soft UI/Neumorphism Theme
 * Centralized color constants for consistent theming across the application
 */

export const Colors = {
  // Soft UI Base Colors
  softLightGrey: '#F0F4F8',     // Primary Base - Main background color for Neumorphic effect
  deepSecurityBlue: '#194E78',  // Primary Brand - CTAs, Navigation, Main Headings
  aquaTechBlue: '#70C3D3',      // Secondary Accent - Secondary buttons, Active tabs, Progress bars
  alertRed: '#E95454',          // Danger/Warning - Geofence breach, Tamper alerts, Delete buttons
  validationGreen: '#4CAF50',   // Success/Safe - Location validated, Success messages, Verified data
  darkText: '#1A1A1A',          // Typography - Main body text and important labels
  
  // Legacy colors for backward compatibility
  primary: '#194E78',           // Same as deepSecurityBlue
  secondary: '#70C3D3',         // Same as aquaTechBlue
  tertiary: '#3273A8',          // Keeping for gradients
  white: '#FFFFFF',             // Pure white
  background: '#F0F4F8',        // Updated to Soft Light Grey
  
  // Neumorphic Shadow Colors
  lightShadow: '#FFFFFF',       // Top/Left shadow for raised effect
  darkShadow: '#D1D9E6',        // Bottom/Right shadow for depth
  insetShadowLight: '#E6ECF3',  // Light inset shadow
  insetShadowDark: '#C5D2E0',   // Dark inset shadow
  
  // Enhanced Gradients for Soft UI
  primaryGradientStart: '#194E78',
  primaryGradientEnd: '#70C3D3',
  
  // Status colors (updated to match new palette)
  success: '#4CAF50',           // Updated to validation green
  warning: '#FFA726',           // Softer orange for warnings
  error: '#E95454',             // Updated to alert red
  info: '#70C3D3',              // Using aqua tech blue for info
  
  // Text colors (updated for better contrast on soft backgrounds)
  textPrimary: '#1A1A1A',       // Updated to dark text
  textSecondary: '#4A4A4A',     // Slightly lighter for secondary text
  textLight: '#8A8A8A',         // Light gray for disabled/placeholder text
  textOnDark: '#FFFFFF',        // White text on dark backgrounds
  textOnPrimary: '#FFFFFF',     // White text on primary color
  
  // Component specific colors (updated for Soft UI)
  border: '#E0E7F0',            // Softer border color
  borderFocus: '#70C3D3',       // Aqua tech blue for focused borders
  shadow: '#00000015',          // Lighter shadow for Soft UI
  overlay: '#00000040',         // Semi-transparent overlay
  
  // Card and Surface colors
  cardBackground: '#F0F4F8',    // Same as soft light grey for seamless cards
  surfaceElevated: '#F8FAFC',   // Slightly elevated surface
  surfaceDepressed: '#E8EEF4',  // Slightly depressed surface
} as const;

// Soft UI Light Theme
export const LightTheme = {
  ...Colors,
  background: '#F0F4F8',        // Soft Light Grey base
  surface: '#F0F4F8',           // Same as background for seamless neumorphism
  surfaceSecondary: '#F8FAFC',  // Slightly elevated surface
  text: '#1A1A1A',              // Dark text for contrast
  textSecondary: '#4A4A4A',     // Secondary text color
  border: '#E0E7F0',            // Soft border color
};

// Soft UI Dark Theme (adapted for neumorphism)
export const DarkTheme = {
  ...Colors,
  primary: '#70C3D3',           // Aqua tech blue as primary in dark mode
  background: '#1A1D23',        // Darker base for dark neumorphism
  surface: '#1A1D23',           // Same as background
  surfaceSecondary: '#252932',  // Slightly elevated dark surface
  text: '#F0F4F8',              // Light text
  textSecondary: '#B0B8C1',     // Secondary light text
  border: '#3A3F47',            // Dark border
  shadow: '#00000060',          // Stronger shadow in dark mode
  lightShadow: '#2A2F37',       // Lighter shadow for dark neumorphism
  darkShadow: '#0F1115',        // Darker shadow for dark neumorphism
};

export type ColorTheme = typeof LightTheme;