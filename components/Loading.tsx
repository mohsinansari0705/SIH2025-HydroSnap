import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { NeumorphicTextStyles } from '../lib/neumorphicStyles';
import { Colors } from '../lib/colors';

interface LoadingProps {
  message?: string;
  size?: 'small' | 'large';
}

const Loading: React.FC<LoadingProps> = ({ message = 'Loading...', size = 'large' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={Colors.aquaTechBlue} />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: Colors.softLightGrey,
  },
  message: {
    ...NeumorphicTextStyles.body,
    marginTop: 20,
    fontSize: 17,
    textAlign: 'center',
    color: Colors.textSecondary,
  },
});

export default Loading;