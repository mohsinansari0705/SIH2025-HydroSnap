import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {
  createNeumorphicCard,
  createNeumorphicIconContainer,
  NeumorphicTextStyles,
} from '../lib/neumorphicStyles';
import { Colors } from '../lib/colors';
interface CardProps {
  title: string;
  date: string;
  description: string;
  location: string;
  type: 'outbreak' | 'water_quality' | 'prevention' | 'alert' | 'flood_alert' | 'site_status' | 'reading';
  severity: 'high' | 'medium' | 'low';
  caseCount?: number;
  waterLevel?: number;
  dangerLevel?: number;
  lastReading?: string;
  fieldPersonnel?: string;
  onPress: () => void;
}

const Card: React.FC<CardProps> = ({ 
  title, 
  date, 
  description, 
  location, 
  type, 
  severity, 
  caseCount: _caseCount, 
  waterLevel, 
  dangerLevel, 
  lastReading, 
  fieldPersonnel, 
  onPress 
}) => {
  const isAlert = type === 'alert';

  const styles = React.useMemo(() => createStyles(), []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getPriorityColor = () => {
    if (severity === 'high') return Colors.alertRed;
    if (severity === 'medium') return Colors.warning || '#FFA726';
    return Colors.validationGreen;
  };

  const getTypeIcon = () => {
    switch (type) {
      case 'outbreak': return '🦠';
      case 'water_quality': return '💧';
      case 'prevention': return '🛡️';
      case 'alert': return '⚠️';
      case 'flood_alert': return '🌊';
      case 'site_status': return '📍';
      case 'reading': return '📊';
      default: return '📊';
    }
  };

  const getTypeLabel = () => {
    switch (type) {
      case 'outbreak': return 'Disease Outbreak';
      case 'water_quality': return 'Water Quality';
      case 'prevention': return 'Prevention';
      case 'alert': return 'Alert';
      case 'flood_alert': return 'Flood Alert';
      case 'site_status': return 'Site Status';
      case 'reading': return 'Water Reading';
      default: return 'Report';
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View style={[styles.card, isAlert ? styles.alertCard : styles.campaignCard]}>
        <View style={styles.cardHeader}>
          <View style={[styles.iconContainer, { backgroundColor: getPriorityColor() }]}>
            <Text style={styles.icon}>
              {getTypeIcon()}
            </Text>
          </View>
          
          <View style={styles.headerContent}>
            <View style={styles.titleRow}>
              <Text style={styles.title} numberOfLines={2}>{title}</Text>
              <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() }]}>
                <Text style={styles.priorityText}>
                  {severity.toUpperCase()}
                </Text>
              </View>
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.location}>📍 {location}</Text>
              <Text style={styles.date}>{formatDate(date)}</Text>
            </View>
            <Text style={styles.typeLabel}>{getTypeLabel()}</Text>
          </View>
        </View>
        
        <Text style={styles.description} numberOfLines={3}>{description}</Text>
        
        {/* Water Level Information */}
        {waterLevel && (
          <View style={styles.waterLevelInfo}>
            <Text style={styles.waterLevelText}>
              Current Level: <Text style={styles.waterLevelValue}>{waterLevel}m</Text>
            </Text>
            {dangerLevel && (
              <Text style={styles.dangerLevelText}>
                Danger Level: <Text style={styles.dangerLevelValue}>{dangerLevel}m</Text>
              </Text>
            )}
          </View>
        )}
        
        {/* Field Personnel Information */}
        {fieldPersonnel && (
          <View style={styles.personnelInfo}>
            <Text style={styles.personnelText}>
              📋 Recorded by: <Text style={styles.personnelName}>{fieldPersonnel}</Text>
            </Text>
          </View>
        )}
        
        {/* Last Reading Information */}
        {lastReading && (
          <View style={styles.lastReadingInfo}>
            <Text style={styles.lastReadingText}>
              🕒 Last Reading: <Text style={styles.lastReadingValue}>{lastReading}</Text>
            </Text>
          </View>
        )}
        
        <View style={styles.cardFooter}>
          <Text style={styles.actionText}>
            {type === 'flood_alert' ? 'View Details →' : 
             type === 'site_status' ? 'Check Site →' : 
             type === 'reading' ? 'View Reading →' : 
             isAlert ? 'Review Alert →' : 'Learn More →'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = () => StyleSheet.create({
  card: {
    ...createNeumorphicCard({ size: 'large', borderRadius: 20 }),
    marginHorizontal: 16,
    marginVertical: 12,
    padding: 24,
  },
  alertCard: {
    borderWidth: 2,
    borderColor: Colors.alertRed + '40',
    shadowColor: Colors.alertRed + '30',
  },
  campaignCard: {
    borderWidth: 1,
    borderColor: Colors.validationGreen + '40',
    shadowColor: Colors.validationGreen + '20',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  iconContainer: {
    ...createNeumorphicIconContainer(52),
    marginRight: 18,
  },
  icon: {
    fontSize: 26,
  },
  headerContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    ...NeumorphicTextStyles.subheading,
    flex: 1,
    marginRight: 12,
    lineHeight: 24,
    color: Colors.textPrimary,
  },
  priorityBadge: {
    ...createNeumorphicCard({ size: 'small', borderRadius: 14 }),
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.white,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  date: {
    ...NeumorphicTextStyles.bodySecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  description: {
    ...NeumorphicTextStyles.body,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: 20,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 16,
    marginTop: 4,
  },
  actionText: {
    ...NeumorphicTextStyles.body,
    fontSize: 15,
    color: Colors.aquaTechBlue,
    fontWeight: '600',
    textAlign: 'center',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  location: {
    ...NeumorphicTextStyles.caption,
    fontSize: 13,
    fontWeight: '500',
    flex: 1,
    color: Colors.textSecondary,
  },
  typeLabel: {
    fontSize: 12,
    color: Colors.deepSecurityBlue,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  waterLevelInfo: {
    ...createNeumorphicCard({ size: 'small', depressed: true, borderRadius: 12 }),
    padding: 16,
    marginBottom: 16,
  },
  waterLevelText: {
    ...NeumorphicTextStyles.body,
    fontSize: 14,
    marginBottom: 6,
    color: Colors.textSecondary,
  },
  waterLevelValue: {
    fontWeight: '700',
    color: Colors.aquaTechBlue,
  },
  dangerLevelText: {
    ...NeumorphicTextStyles.body,
    fontSize: 14,
    color: Colors.textSecondary,
  },
  dangerLevelValue: {
    fontWeight: '700',
    color: Colors.alertRed,
  },
  personnelInfo: {
    ...createNeumorphicCard({ size: 'small', depressed: true, borderRadius: 10 }),
    padding: 12,
    marginBottom: 12,
  },
  personnelText: {
    ...NeumorphicTextStyles.bodySecondary,
  },
  personnelName: {
    fontWeight: '600',
    color: Colors.deepSecurityBlue,
  },
  lastReadingInfo: {
    ...createNeumorphicCard({ size: 'small', depressed: true, borderRadius: 10 }),
    padding: 12,
    marginBottom: 12,
  },
  lastReadingText: {
    ...NeumorphicTextStyles.bodySecondary,
  },
  lastReadingValue: {
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});

export default Card;
