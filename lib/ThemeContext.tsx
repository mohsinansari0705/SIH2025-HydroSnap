import React, { createContext, useContext, useState } from 'react';
import { LightTheme, DarkTheme } from './colors';

/**
 * Theme Context for HydroSnap - Soft UI/Neumorphism Design
 * 
 * This context provides access to the updated Soft UI color palette and neumorphic design tokens.
 * The themes automatically include the new color scheme with:
 * - Soft Light Grey (#F0F4F8) as the primary background
 * - Deep Security Blue (#194E78) for primary brand elements
 * - Aqua Tech Blue (#70C3D3) for secondary accents
 * - Alert Red (#E95454) for danger states
 * - Validation Green (#4CAF50) for success states
 * - Dark Text (#1A1A1A) for primary typography
 */

export interface Theme {
  // Main colors
  background: string;
  surface: string;
  surfaceSecondary: string;
  text: string;
  textSecondary: string;
  textOnDark: string;
  
  // HydroSnap brand colors
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  tertiary: string;
  white: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // UI colors
  border: string;
  borderFocus: string;
  shadow: string;
  overlay: string;
  disabled: string;
  
  // Gradient colors
  gradientStart: string;
  gradientEnd: string;
  
  elevation: {
    low: string;
    medium: string;
    high: string;
  };
}

export const themes = {
  light: {
    // Main colors
    background: LightTheme.background,
    surface: LightTheme.surface,
    surfaceSecondary: LightTheme.surfaceSecondary,
    text: LightTheme.text,
    textSecondary: LightTheme.textSecondary,
    textOnDark: LightTheme.textOnDark,
    
    // HydroSnap brand colors (updated for Soft UI)
    primary: LightTheme.deepSecurityBlue,
    primaryLight: LightTheme.aquaTechBlue,
    primaryDark: LightTheme.deepSecurityBlue,
    secondary: LightTheme.aquaTechBlue,
    secondaryLight: LightTheme.aquaTechBlue + 'CC',
    secondaryDark: LightTheme.aquaTechBlue,
    tertiary: LightTheme.deepSecurityBlue,
    white: LightTheme.white,
    
    // Status colors (updated for Soft UI)
    success: LightTheme.validationGreen,
    warning: '#FFA726',
    error: LightTheme.alertRed,
    info: LightTheme.aquaTechBlue,
    
    // UI colors
    border: LightTheme.border,
    borderFocus: LightTheme.borderFocus,
    shadow: LightTheme.shadow,
    overlay: LightTheme.overlay,
    disabled: '#bdc3c7',
    
    // Gradient colors (updated for Soft UI)
    gradientStart: LightTheme.primaryGradientStart,
    gradientEnd: LightTheme.primaryGradientEnd,
    
    elevation: {
      low: 'rgba(0,0,0,0.1)',
      medium: 'rgba(0,0,0,0.2)',
      high: 'rgba(0,0,0,0.3)',
    },
  } as Theme,
  dark: {
    // Main colors
    background: DarkTheme.background,
    surface: DarkTheme.surface,
    surfaceSecondary: DarkTheme.surfaceSecondary,
    text: DarkTheme.text,
    textSecondary: DarkTheme.textSecondary,
    textOnDark: DarkTheme.textOnDark,
    
    // HydroSnap brand colors (Dark theme adapted for Soft UI)
    primary: DarkTheme.aquaTechBlue,
    primaryLight: DarkTheme.aquaTechBlue + 'CC',
    primaryDark: DarkTheme.deepSecurityBlue,
    secondary: DarkTheme.aquaTechBlue,
    secondaryLight: DarkTheme.aquaTechBlue + 'DD',
    secondaryDark: DarkTheme.deepSecurityBlue,
    tertiary: DarkTheme.deepSecurityBlue,
    white: DarkTheme.white,
    
    // Status colors (Dark theme for Soft UI)
    success: DarkTheme.validationGreen,
    warning: '#FFB74D',
    error: DarkTheme.alertRed,
    info: DarkTheme.aquaTechBlue,
    
    // UI colors
    border: DarkTheme.border,
    borderFocus: DarkTheme.borderFocus,
    shadow: DarkTheme.shadow,
    overlay: DarkTheme.overlay,
    disabled: '#6c6c6c',
    
    // Gradient colors (Dark theme for Soft UI)
    gradientStart: DarkTheme.primaryGradientStart,
    gradientEnd: DarkTheme.primaryGradientEnd,
    
    elevation: {
      low: 'rgba(255,255,255,0.1)',
      medium: 'rgba(255,255,255,0.2)',
      high: 'rgba(255,255,255,0.3)',
    },
  } as Theme,
};

interface ThemeContextType {
  theme: 'light' | 'dark';
  colors: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const value: ThemeContextType = {
    theme,
    colors: themes[theme],
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};