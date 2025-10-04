import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { supabase } from '../lib/supabase';
import { Profile } from '../types/profile';
import {
  createNeumorphicCard,
  createNeumorphicButton,
  createNeumorphicInput,
  NeumorphicTextStyles,
} from '../lib/neumorphicStyles';
import { Colors } from '../lib/colors';

interface AuthScreenProps {
  onAuthSuccess: () => void;
}

export default function AuthScreen({ onAuthSuccess }: AuthScreenProps) {
  const styles = createStyles();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Signup form fields
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<Profile['role']>('public');
  const [organization, setOrganization] = useState('');
  const [location, setLocation] = useState('');
  const [siteId, setSiteId] = useState('');

  // OTP related state
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  // Role dropdown state
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const roles: { value: Profile['role']; label: string; description: string }[] = [
    { 
      value: 'central_analyst', 
      label: 'Central Analyst', 
      description: 'CWC headquarters staff for data analysis and policy decisions'
    },
    { 
      value: 'supervisor', 
      label: 'Supervisor', 
      description: 'Regional supervisors managing multiple monitoring sites'
    },
    { 
      value: 'field_personnel', 
      label: 'Field Personnel', 
      description: 'On-ground staff taking water level readings at monitoring sites'
    },
    { 
      value: 'public', 
      label: 'Public User', 
      description: 'General public contributing to water level monitoring'
    },
  ];

  const isValidEmail = (text: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text);
  };

  const handleAuth = async () => {
    if (isLogin) {
      // For login, only use email (remove phone login for now)
      if (!email || !password) {
        Alert.alert('Error', 'Please enter email and password');
        return;
      }
      if (!isValidEmail(email)) {
        Alert.alert('Error', 'Please enter a valid email address');
        return;
      }
    } else {
      if (!email || !password || !fullName || !organization || !location) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }
      if (!isValidEmail(email)) {
        Alert.alert('Error', 'Please enter a valid email address');
        return;
      }
      if (role === 'field_personnel' && !siteId) {
        Alert.alert('Error', 'Site ID is required for field personnel');
        return;
      }
    }

    setLoading(true);
    
    try {
      if (isLogin) {
        // Login with email only
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) {
          Alert.alert('Login Error', error.message);
        } else {
          onAuthSuccess();
        }
      } else {
        // First create user with password for future logins
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role,
              organization,
              location,
              phone,
              site_id: role === 'field_personnel' ? siteId : null,
            }
          }
        });

        if (signUpError) {
          Alert.alert('Sign Up Error', signUpError.message);
          return;
        }

        // Then send OTP for verification (without creating another user)
        const { error: otpError } = await supabase.auth.signInWithOtp({
          email: email,
        });
        
        if (otpError) {
          Alert.alert('OTP Error', otpError.message);
        } else {
          setUserEmail(email);
          setShowOtpModal(true);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerification = async () => {
    if (!otpCode || otpCode.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    setOtpLoading(true);
    
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: userEmail,
        token: otpCode,
        type: 'email'
      });
      
      if (error) {
        Alert.alert('OTP Error', error.message);
      } else if (data.user) {
        // Check if profile already exists (might be created by trigger)
        const { error: profileCheckError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileCheckError && profileCheckError.code === 'PGRST116') {
          // Profile doesn't exist, create it
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              full_name: fullName,
              role,
              organization,
              location,
              site_id: role === 'field_personnel' ? siteId : null,
              created_at: new Date().toISOString(),
              is_active: true,
            });

          if (profileError) {
            console.error('Profile creation error:', profileError);
          }
        }

        setShowOtpModal(false);
        setShowSuccessModal(true);
        setOtpCode('');
      }
    } catch (error) {
      Alert.alert('Error', 'An unexpected error occurred');
      console.error('OTP verification error:', error);
    } finally {
      setOtpLoading(false);
    }
  };

  const handleSuccessNext = () => {
    setShowSuccessModal(false);
    // Reset form
    setEmail('');
    setPassword('');
    setFullName('');
    setOrganization('');
    setLocation('');
    setPhone('');
    setSiteId('');
    setIsLogin(true);
    onAuthSuccess();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <Image 
            source={require('../assets/icon.png')} 
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.subtitle}>
            {isLogin ? 'Welcome Back!' : 'Join Water Level Monitoring'}
          </Text>
          <Text style={styles.description}>
            Secure River Water Level Data Collection
          </Text>
        </View>

        <View style={styles.formContainer}>
          {isLogin ? (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="password"
                />
              </View>
            </>
          ) : (
            <>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Full Name *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Email Address *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email address"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter your phone number"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  autoComplete="tel"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Role *</Text>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => setShowRoleDropdown(!showRoleDropdown)}
                >
                  <View style={styles.dropdownContent}>
                    <View style={styles.dropdownLeft}>
                      <Text style={styles.dropdownText}>
                        {roles.find(r => r.value === role)?.label || 'Select Role'}
                      </Text>
                      <Text style={styles.dropdownDescription}>
                        {roles.find(r => r.value === role)?.description}
                      </Text>
                    </View>
                    <Text style={styles.dropdownArrow}>
                      {showRoleDropdown ? '▲' : '▼'}
                    </Text>
                  </View>
                </TouchableOpacity>
                
                {showRoleDropdown && (
                  <View style={styles.dropdownList}>
                    {roles.map((roleOption) => (
                      <TouchableOpacity
                        key={roleOption.value}
                        style={[
                          styles.dropdownItem,
                          role === roleOption.value && styles.dropdownItemSelected,
                        ]}
                        onPress={() => {
                          setRole(roleOption.value);
                          setShowRoleDropdown(false);
                        }}
                      >
                        <View style={styles.dropdownItemContent}>
                          <Text
                            style={[
                              styles.dropdownItemText,
                              role === roleOption.value && styles.dropdownItemTextSelected,
                            ]}
                          >
                            {roleOption.label}
                          </Text>
                          <Text
                            style={[
                              styles.dropdownItemDescription,
                              role === roleOption.value && styles.dropdownItemDescriptionSelected,
                            ]}
                          >
                            {roleOption.description}
                          </Text>
                        </View>
                        {role === roleOption.value && (
                          <Text style={styles.checkmark}>✓</Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Organization *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Central Water Commission, State Irrigation Dept"
                  value={organization}
                  onChangeText={setOrganization}
                  autoCapitalize="words"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Location *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Your work location/region"
                  value={location}
                  onChangeText={setLocation}
                  autoCapitalize="words"
                />
              </View>

              {role === 'field_personnel' && (
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Site ID *</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g., CWC-GAN-001, IRR-DEL-05"
                    value={siteId}
                    onChangeText={setSiteId}
                    autoCapitalize="characters"
                  />
                  <Text style={styles.helperText}>
                    Enter the monitoring site ID assigned to you
                  </Text>
                </View>
              )}

              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Password *</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Create a strong password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoComplete="password"
                />
              </View>
            </>
          )}

          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.buttonDisabled]}
            onPress={handleAuth}
            disabled={loading}
          >
            <Text style={styles.primaryButtonText}>
              {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Join HydroSnap'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => {
              setIsLogin(!isLogin);
              setShowRoleDropdown(false); // Close dropdown when switching
              // Clear form when switching
              setEmail('');
              setPhone('');
              setPassword('');
              setFullName('');
              setOrganization('');
              setLocation('');
              setSiteId('');
            }}
          >
            <Text style={styles.switchText}>
              {isLogin
                ? "Don't have an account? "
                : 'Already have an account? '}
              <Text style={styles.switchTextBold}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* OTP Verification Modal */}
      <Modal
        visible={showOtpModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowOtpModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enter Verification Code</Text>
            <Text style={styles.modalSubtitle}>
              We've sent a 6-digit verification code to {userEmail}
            </Text>
            
            <View style={styles.otpContainer}>
              <TextInput
                style={styles.otpInput}
                value={otpCode}
                onChangeText={setOtpCode}
                placeholder="000000"
                keyboardType="numeric"
                maxLength={6}
              />
            </View>

            <TouchableOpacity
              style={[styles.primaryButton, otpLoading && styles.buttonDisabled]}
              onPress={handleOtpVerification}
              disabled={otpLoading}
            >
              {otpLoading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={styles.primaryButtonText}>Verify OTP</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setShowOtpModal(false)}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.successIcon}>
              <Text style={styles.successCheckmark}>✓</Text>
            </View>
            
            <Text style={styles.modalTitle}>Account Created Successfully!</Text>
            <Text style={styles.modalSubtitle}>
              Your account has been created and verified. You can now start monitoring water levels with HydroSnap.
            </Text>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleSuccessNext}
            >
              <Text style={styles.primaryButtonText}>Start Monitoring</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const createStyles = () => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.softLightGrey, // Use new Soft UI background
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 65,
    paddingBottom: 30,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 0,
  },
  subtitle: {
    ...NeumorphicTextStyles.subheading,
    textAlign: 'center',
    marginBottom: 4,
    color: Colors.textSecondary,
  },
  description: {
    ...NeumorphicTextStyles.bodySecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  formContainer: {
    ...createNeumorphicCard({ size: 'large', borderRadius: 24 }),
    padding: 30,
    marginHorizontal: 5,
  },
  inputContainer: {
    marginBottom: 20,
    position: 'relative',
  },
  inputLabel: {
    ...NeumorphicTextStyles.body,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    color: Colors.textPrimary,
  },
  input: {
    ...createNeumorphicInput({ borderRadius: 14 }),
    padding: 18,
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  helperText: {
    ...NeumorphicTextStyles.caption,
    marginTop: 8,
    fontStyle: 'italic',
    color: Colors.textSecondary,
  },
  // Dropdown styles
  dropdownButton: {
    ...createNeumorphicInput({ borderRadius: 14 }),
    padding: 18,
  },
  dropdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownLeft: {
    flex: 1,
  },
  dropdownText: {
    fontSize: 16,
    color: Colors.textPrimary,
    fontWeight: '600',
    marginBottom: 2,
  },
  dropdownDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  dropdownArrow: {
    fontSize: 16,
    color: Colors.aquaTechBlue,
    marginLeft: 10,
  },
  dropdownList: {
    ...createNeumorphicCard({ size: 'medium', borderRadius: 16 }),
    position: 'absolute',
    top: 85,
    left: 0,
    right: 0,
    maxHeight: 250,
    zIndex: 1000,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dropdownItemSelected: {
    backgroundColor: Colors.aquaTechBlue + '20', // Soft tint
  },
  dropdownItemContent: {
    flex: 1,
  },
  dropdownItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  dropdownItemTextSelected: {
    color: Colors.deepSecurityBlue,
  },
  dropdownItemDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  dropdownItemDescriptionSelected: {
    color: Colors.aquaTechBlue,
  },
  checkmark: {
    fontSize: 16,
    color: Colors.aquaTechBlue,
    fontWeight: 'bold',
  },
  primaryButton: {
    ...createNeumorphicButton('primary', { size: 'large', borderRadius: 16 }),
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginTop: 15,
  },
  buttonDisabled: {
    backgroundColor: Colors.textLight,
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryButtonText: {
    ...NeumorphicTextStyles.buttonPrimary,
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 30,
    alignItems: 'center',
    paddingVertical: 15,
  },
  switchText: {
    ...NeumorphicTextStyles.body,
    color: Colors.textSecondary,
  },
  switchTextBold: {
    color: Colors.deepSecurityBlue,
    fontWeight: 'bold',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(26, 26, 26, 0.6)', // Darker overlay using new dark text color
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    ...createNeumorphicCard({ size: 'large', borderRadius: 28 }),
    padding: 35,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
  },
  modalTitle: {
    ...NeumorphicTextStyles.heading,
    textAlign: 'center',
    marginBottom: 15,
    color: Colors.textPrimary,
  },
  modalSubtitle: {
    ...NeumorphicTextStyles.body,
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
    color: Colors.textSecondary,
  },
  otpContainer: {
    width: '100%',
    marginBottom: 30,
  },
  otpInput: {
    ...createNeumorphicInput({ borderRadius: 16 }),
    padding: 24,
    textAlign: 'center',
    fontSize: 28,
    letterSpacing: 12,
    fontWeight: 'bold',
    color: Colors.deepSecurityBlue,
  },
  cancelButton: {
    marginTop: 20,
    padding: 15,
  },
  cancelButtonText: {
    ...NeumorphicTextStyles.body,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  successIcon: {
    ...createNeumorphicCard({ size: 'medium', borderRadius: 50 }),
    width: 90,
    height: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    backgroundColor: Colors.validationGreen,
  },
  successCheckmark: {
    color: Colors.white,
    fontSize: 44,
    fontWeight: 'bold',
  },
});